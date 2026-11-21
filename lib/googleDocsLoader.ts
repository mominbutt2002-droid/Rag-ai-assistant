import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export interface LoadedRagChunk {
  id: string;
  source: 'price_list.docx' | 'faq.docx' | 'schedule.xlsx';
  title: string;
  text: string;
  hash: string;
}

// Short cache TTL (5 seconds) so edits in Google Docs / Excel are picked up almost immediately
const REMOTE_CACHE_TTL_MS = Number(process.env.RAG_CACHE_TTL_MS ?? 5000);

interface CachedDocResult {
  fetchedAt: number;
  chunks: LoadedRagChunk[];
  origin: 'google-remote' | 'local-file';
}

const docCache = new Map<string, CachedDocResult>();
let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

function md5(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

/**
 * Extract Google Doc / Sheet / Drive File ID from a full URL or return the ID directly.
 */
export function extractGoogleId(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Optional: Get Google OAuth2 Access Token via Service Account JWT (for private Google Drive files)
 * Uses built-in Node.js crypto (zero external dependencies).
 */
export async function getServiceAccountAccessToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  if (!email || !rawKey) return null;

  const now = Math.floor(Date.now() / 1000);
  if (cachedOAuthToken && cachedOAuthToken.expiresAt > now + 60) {
    return cachedOAuthToken.token;
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  const signature = signer.sign(privateKey, 'base64url');
  const jwt = `${header}.${payload}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
    cache: 'no-store',
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text().catch(() => '');
    throw new Error(`Google Service Account auth failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData = await tokenRes.json();
  cachedOAuthToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in || 3500),
  };

  return cachedOAuthToken.token;
}

/**
 * Fetch binary buffer from Google Docs/Sheets/Drive (supports both Public Link and Service Account).
 */
export async function fetchGoogleBinary(params: {
  urlOrId: string;
  kind: 'docx' | 'xlsx';
}): Promise<Buffer> {
  const { urlOrId, kind } = params;
  const fileId = extractGoogleId(urlOrId);
  const accessToken = await getServiceAccountAccessToken();

  // Case 1: Private access via Google Drive API + Service Account
  if (fileId && accessToken) {
    const mimeType =
      kind === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Try exporting native Google Doc/Sheet first
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(
      mimeType
    )}`;
    const exportRes = await fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store',
    });

    if (exportRes.ok) {
      return Buffer.from(await exportRes.arrayBuffer());
    }

    // Otherwise download uploaded binary (.docx / .xlsx) directly from Drive
    const mediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const mediaRes = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store',
    });

    if (!mediaRes.ok) {
      throw new Error(`Google Drive API download failed (${mediaRes.status})`);
    }
    return Buffer.from(await mediaRes.arrayBuffer());
  }

  // Case 2: Public "Anyone with the link can view" export URL
  let targetUrl = urlOrId.trim();
  if (fileId) {
    if (targetUrl.includes('docs.google.com/document') || (!targetUrl.startsWith('http') && kind === 'docx')) {
      targetUrl = `https://docs.google.com/document/d/${fileId}/export?format=docx`;
    } else if (
      targetUrl.includes('docs.google.com/spreadsheets') ||
      (!targetUrl.startsWith('http') && kind === 'xlsx')
    ) {
      targetUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
    } else if (targetUrl.includes('drive.google.com')) {
      targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  const res = await fetch(targetUrl, { cache: 'no-store', redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Failed to fetch Google document (${res.status}) from ${targetUrl}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(
      `Received HTML instead of ${kind.toUpperCase()}. Ensure the Google document is shared as "Anyone with the link" or configure Service Account credentials.`
    );
  }

  return Buffer.from(await res.arrayBuffer());
}

/**
 * Parse .docx buffer into semantic RAG chunks using mammoth
 */
async function parseDocxBuffer(
  buffer: Buffer,
  source: 'price_list.docx' | 'faq.docx'
): Promise<LoadedRagChunk[]> {
  const result = await mammoth.extractRawText({ buffer });
  const rawText = result.value || '';

  // Split into meaningful blocks of ~350-1200 chars by double newlines or numbered sections
  const paragraphs = rawText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);

  const chunks: LoadedRagChunk[] = [];
  let currentBuffer = '';
  let currentTitle = source === 'price_list.docx' ? 'Прайс-лист курсов' : 'Часто задаваемые вопросы (FAQ)';
  let chunkIndex = 0;

  const flush = () => {
    const trimmed = currentBuffer.trim();
    if (trimmed.length > 20) {
      chunks.push({
        id: `${source}#${chunkIndex++}`,
        source,
        title: currentTitle,
        text: trimmed,
        hash: md5(trimmed),
      });
    }
    currentBuffer = '';
  };

  for (const para of paragraphs) {
    const isHeading =
      para.length < 110 &&
      (/^\d+\./.test(para) ||
        para.includes('Направление:') ||
        para.includes('Условия') ||
        para.endsWith('?'));

    if (isHeading && currentBuffer.length > 200) {
      flush();
      currentTitle = para.slice(0, 80);
    } else if (currentBuffer.length + para.length > 1100) {
      flush();
      currentTitle = para.split('\n')[0].slice(0, 80);
    }

    currentBuffer += (currentBuffer ? '\n\n' : '') + para;
  }
  flush();

  return chunks;
}

/**
 * Parse .xlsx Excel buffer into structured RAG chunks (grouped by Teacher & Contacts)
 */
function parseXlsxBuffer(buffer: Buffer): LoadedRagChunk[] {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const chunks: LoadedRagChunk[] = [];
  let chunkIndex = 0;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });
    if (rows.length <= 1) continue;

    const headers = rows[0].map((h) => String(h).trim());
    const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

    // Group rows by first column (e.g., Teacher name) if it repeats, otherwise group in blocks of 12 rows
    const grouped = new Map<string, string[]>();

    for (const row of dataRows) {
      const firstCol = String(row[0] || '').trim() || sheetName;
      const formattedRow = headers
        .map((h, idx) => (h ? `${h}: ${String(row[idx] ?? '').trim()}` : String(row[idx] ?? '').trim()))
        .filter((s) => s.length > 0)
        .join(' | ');

      if (!grouped.has(firstCol)) {
        grouped.set(firstCol, []);
      }
      grouped.get(firstCol)!.push(`• ${formattedRow}`);
    }

    const isTeacherSheet =
      headers[0]?.toLowerCase().includes('преподавател') ||
      sheetName.toLowerCase().includes('расписан');

    // Combine small single-row entries (like Contacts) into one clean chunk,
    // while keeping EVERY teacher as an individual chunk + a full teacher summary chunk.
    let smallGroupBuffer: string[] = [];
    const flushSmall = () => {
      if (smallGroupBuffer.length === 0) return;
      const text = `[Таблица: ${sheetName}]\n${smallGroupBuffer.join('\n')}`;
      chunks.push({
        id: `schedule.xlsx#${chunkIndex++}`,
        source: 'schedule.xlsx',
        title: sheetName,
        text,
        hash: md5(text),
      });
      smallGroupBuffer = [];
    };

    const teacherSummaryLines: string[] = [];

    for (const [groupKey, lines] of Array.from(grouped.entries())) {
      if (isTeacherSheet || lines.length >= 2) {
        flushSmall();
        const text = `[Таблица: ${sheetName} | ${groupKey}]\n${lines.join('\n')}`;
        chunks.push({
          id: `schedule.xlsx#${chunkIndex++}`,
          source: 'schedule.xlsx',
          title: `${sheetName}: ${groupKey}`,
          text,
          hash: md5(text),
        });
        if (isTeacherSheet) {
          teacherSummaryLines.push(`• ${groupKey}: ${lines[0].replace(/^•\s*/, '')}`);
        }
      } else {
        smallGroupBuffer.push(...lines);
      }
    }
    flushSmall();

    if (isTeacherSheet && teacherSummaryLines.length > 0) {
      const summaryText = `[Сводный список всех преподавателей из таблицы «${sheetName}»]\nВсего преподавателей: ${teacherSummaryLines.length}\n${teacherSummaryLines.join('\n')}`;
      chunks.push({
        id: `schedule.xlsx#summary-${chunkIndex++}`,
        source: 'schedule.xlsx',
        title: `Все преподаватели (${teacherSummaryLines.length})`,
        text: summaryText,
        hash: md5(summaryText),
      });
    }
  }

  return chunks;
}

/**
 * Load a single RAG document (remote Google Doc/Sheet if configured, else local .docx/.xlsx)
 * Automatically checks for updates according to REMOTE_CACHE_TTL_MS or local file mtime.
 */
async function loadDocument(params: {
  source: 'price_list.docx' | 'faq.docx' | 'schedule.xlsx';
  kind: 'docx' | 'xlsx';
  remoteUrlOrId?: string;
  forceRefresh?: boolean;
}): Promise<{ chunks: LoadedRagChunk[]; origin: 'google-remote' | 'local-file' }> {
  const { source, kind, remoteUrlOrId, forceRefresh = false } = params;
  const now = Date.now();
  const cached = docCache.get(source);

  // 1. Try remote Google Docs / Google Sheets / Drive
  if (remoteUrlOrId && remoteUrlOrId.trim()) {
    if (!forceRefresh && cached && cached.origin === 'google-remote' && now - cached.fetchedAt < REMOTE_CACHE_TTL_MS) {
      return { chunks: cached.chunks, origin: 'google-remote' };
    }

    try {
      const buffer = await fetchGoogleBinary({ urlOrId: remoteUrlOrId, kind });
      const chunks =
        kind === 'docx'
          ? await parseDocxBuffer(buffer, source as 'price_list.docx' | 'faq.docx')
          : parseXlsxBuffer(buffer);

      docCache.set(source, { fetchedAt: now, chunks, origin: 'google-remote' });
      return { chunks, origin: 'google-remote' };
    } catch (err) {
      console.warn(`[Google Docs/Sheets Loader] Failed remote fetch for ${source}, falling back to local file:`, err);
    }
  }

  // 2. Local .docx / .xlsx fallback in data/rag/
  const localPath = path.join(process.cwd(), 'data', 'rag', source);
  const stats = fs.statSync(localPath);
  const localMtime = stats.mtimeMs;

  if (!forceRefresh && cached && cached.origin === 'local-file' && cached.fetchedAt >= localMtime) {
    return { chunks: cached.chunks, origin: 'local-file' };
  }

  const localBuffer = fs.readFileSync(localPath);
  const chunks =
    kind === 'docx'
      ? await parseDocxBuffer(localBuffer, source as 'price_list.docx' | 'faq.docx')
      : parseXlsxBuffer(localBuffer);

  docCache.set(source, { fetchedAt: localMtime, chunks, origin: 'local-file' });
  return { chunks, origin: 'local-file' };
}

/**
 * Load all 3 RAG documents (Price List .docx, FAQ .docx, Teachers Schedule .xlsx)
 * Supports instant refresh whenever Google Docs or Excel files are updated.
 */
export async function loadAllLiveRagDocuments(forceRefresh = false): Promise<{
  chunks: LoadedRagChunk[];
  origins: Record<string, 'google-remote' | 'local-file'>;
}> {
  const [priceRes, faqRes, scheduleRes] = await Promise.all([
    loadDocument({
      source: 'price_list.docx',
      kind: 'docx',
      remoteUrlOrId: process.env.GOOGLE_PRICE_DOC_URL || process.env.GOOGLE_PRICE_DOC_ID,
      forceRefresh,
    }),
    loadDocument({
      source: 'faq.docx',
      kind: 'docx',
      remoteUrlOrId: process.env.GOOGLE_FAQ_DOC_URL || process.env.GOOGLE_FAQ_DOC_ID,
      forceRefresh,
    }),
    loadDocument({
      source: 'schedule.xlsx',
      kind: 'xlsx',
      remoteUrlOrId: process.env.GOOGLE_SCHEDULE_XLSX_URL || process.env.GOOGLE_SCHEDULE_SHEET_ID,
      forceRefresh,
    }),
  ]);

  return {
    chunks: [...priceRes.chunks, ...faqRes.chunks, ...scheduleRes.chunks],
    origins: {
      'price_list.docx': priceRes.origin,
      'faq.docx': faqRes.origin,
      'schedule.xlsx': scheduleRes.origin,
    },
  };
}

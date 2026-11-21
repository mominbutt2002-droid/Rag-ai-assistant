/**
 * Google AI Studio Vector RAG Engine (Zero External Vector DB Dependencies)
 * Loads live Google Docs (.docx) and Excel (.xlsx) via googleDocsLoader.ts.
 * Supports Gemini Function Calling for finding free slots and booking students into Google Sheets 'Записи'.
 * Embedding Model: gemini-embedding-001
 * Chat Model: gemini-3.5-flash-lite
 */

import { Language } from '@/types';
import { loadAllLiveRagDocuments, LoadedRagChunk } from './googleDocsLoader';
import {
  createStudentBooking,
  findFreeSlots,
  getDayOfWeekRu,
} from './googleBookings';

export interface VectorRagChunk extends LoadedRagChunk {
  vector?: number[];
}

export interface RetrievedVectorChunk extends VectorRagChunk {
  similarity: number;
  similarityPercent: number;
}

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash-lite';

const chunkVectorByHash = new Map<string, number[]>();
const queryVectorCache = new Map<string, number[]>();

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getEmbedding(
  text: string,
  taskType: 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT' | 'SEMANTIC_SIMILARITY',
  apiKey: string,
  cacheKeyOverride?: string
): Promise<number[]> {
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined.');

  if (taskType === 'RETRIEVAL_QUERY') {
    const qKey = `${EMBEDDING_MODEL}:${text}`;
    const cached = queryVectorCache.get(qKey);
    if (cached) return cached;
  } else if (cacheKeyOverride) {
    const cached = chunkVectorByHash.get(cacheKeyOverride);
    if (cached) return cached;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI Studio Embedding Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const vector = data?.embedding?.values;
  if (!vector || !Array.isArray(vector)) {
    throw new Error('Invalid embedding vector structure received from Google AI Studio.');
  }

  if (taskType === 'RETRIEVAL_QUERY') {
    queryVectorCache.set(`${EMBEDDING_MODEL}:${text}`, vector);
  } else if (cacheKeyOverride) {
    chunkVectorByHash.set(cacheKeyOverride, vector);
  }

  return vector;
}

export async function indexKnowledgeChunks(
  chunks: VectorRagChunk[],
  apiKey: string
): Promise<VectorRagChunk[]> {
  for (const chunk of chunks) {
    const existing = chunkVectorByHash.get(`${EMBEDDING_MODEL}:${chunk.hash}`);
    if (existing) {
      chunk.vector = existing;
    }
  }

  const missing = chunks.filter((c) => !c.vector);
  if (missing.length === 0) return chunks;

  const BATCH_SIZE = 10;
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (chunk) => {
        try {
          chunk.vector = await getEmbedding(
            chunk.text,
            'RETRIEVAL_DOCUMENT',
            apiKey,
            `${EMBEDDING_MODEL}:${chunk.hash}`
          );
        } catch (err) {
          console.warn(
            `[Google RAG] Failed to embed chunk ${chunk.id}:`,
            err instanceof Error ? err.message : err
          );
        }
      })
    );
  }

  return chunks;
}

export async function retrieveVectorChunks(
  userQuery: string,
  chunks: VectorRagChunk[],
  apiKey: string,
  topK = 10
): Promise<RetrievedVectorChunk[]> {
  const queryVector = await getEmbedding(userQuery, 'RETRIEVAL_QUERY', apiKey);

  const scored: RetrievedVectorChunk[] = chunks
    .filter((c) => c.vector && Array.isArray(c.vector))
    .map((chunk) => {
      const similarity = cosineSimilarity(queryVector, chunk.vector!);
      return {
        ...chunk,
        similarity,
        similarityPercent: Math.round(similarity * 100),
      };
    });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

const BOOKING_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'check_free_slots',
        description:
          'Проверяет свободные окна ("свободные окна") и оставшиеся места в группах (вместимость группы — до 12 человек) для записи студентов на конкретную дату (YYYY-MM-DD). Сверяет рабочее расписание преподавателей с уже занятыми записями в таблице Записи.',
        parameters: {
          type: 'OBJECT',
          properties: {
            date: {
              type: 'STRING',
              description: 'Дата в формате YYYY-MM-DD (например, 2026-11-23)',
            },
            teacherName: {
              type: 'STRING',
              description:
                'Имя или фамилия преподавателя/сотрудника для фильтрации (необязательно)',
            },
          },
          required: ['date'],
        },
      },
      {
        name: 'book_student_lesson',
        description:
          'Записывает студента в Google Таблицу "Записи" на конкретную дату, время и к преподавателю. Поддерживает групповое обучение (до 12 человек в одном окне) и индивидуальное (1 на 1). Вызывай ТОЛЬКО когда известны: дата (YYYY-MM-DD), время (HH:MM), преподаватель, курс, имя студента и телефон.',
        parameters: {
          type: 'OBJECT',
          properties: {
            date: {
              type: 'STRING',
              description: 'Дата занятия в формате YYYY-MM-DD',
            },
            time: {
              type: 'STRING',
              description: 'Время начала (формат HH:MM, например 14:00 или 12:30)',
            },
            teacher: {
              type: 'STRING',
              description: 'Имя преподавателя из расписания',
            },
            course: {
              type: 'STRING',
              description: 'Название курса или направления',
            },
            studentName: {
              type: 'STRING',
              description: 'Имя и фамилия студента',
            },
            phone: {
              type: 'STRING',
              description: 'Контактный телефон или Telegram студента',
            },
            format: {
              type: 'STRING',
              description: 'Формат обучения: Офлайн или Онлайн',
            },
            studyType: {
              type: 'STRING',
              description: 'Тип обучения: "Групповое" (до 12 человек, по умолчанию) или "Индивидуальное" (1 на 1)',
            },
            comment: {
              type: 'STRING',
              description: 'Дополнительный комментарий (опционально)',
            },
          },
          required: ['date', 'time', 'teacher', 'course', 'studentName', 'phone'],
        },
      },
    ],
  },
];

async function executeToolCall(name: string, args: Record<string, any>) {
  if (name === 'check_free_slots') {
    const date = String(args?.date || '').trim();
    const teacherName = args?.teacherName ? String(args.teacherName).trim() : undefined;
    return await findFreeSlots({ date, teacherName });
  }

  if (name === 'book_student_lesson') {
    return await createStudentBooking({
      date: String(args?.date || ''),
      time: String(args?.time || ''),
      teacher: String(args?.teacher || ''),
      course: String(args?.course || 'Пробный урок'),
      studentName: String(args?.studentName || ''),
      phone: String(args?.phone || ''),
      format: args?.format ? String(args.format) : 'Офлайн',
      studyType: args?.studyType ? String(args.studyType) : 'Групповое',
      comment: args?.comment ? String(args.comment) : 'Запись через ИИ-ассистента',
    });
  }

  return { error: `Unknown tool: ${name}` };
}

/**
 * Complete End-to-End Live Vector RAG + Function Calling Call
 */
export async function askGeminiWithVectorRAG(params: {
  userMessage: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  language?: Language;
  apiKey: string;
  forceRefresh?: boolean;
}) {
  const { userMessage, history = [], language = 'ru', apiKey, forceRefresh = false } = params;

  const { chunks, origins } = await loadAllLiveRagDocuments(forceRefresh);
  const vectorChunks: VectorRagChunk[] = chunks.map((c) => ({ ...c }));

  await indexKnowledgeChunks(vectorChunks, apiKey);

  const retrievedChunks = await retrieveVectorChunks(userMessage, vectorChunks, apiKey, 10);
  if (retrievedChunks.length === 0) {
    throw new Error('No vector chunks could be retrieved.');
  }

  const contextText = retrievedChunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.source} (${origins[c.source]}) — ${c.title} (Relevance: ${c.similarityPercent}%)]\n${c.text}`
    )
    .join('\n\n---\n\n');

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const todayDayName = getDayOfWeekRu(todayIso);

  const langLabel = language === 'ru' ? 'Русский' : language === 'uz' ? "O'zbekcha" : 'English';

  const systemInstruction = `Ты — официальный интеллектуальный ИИ-ассистент учебного центра «EduAI Academy».
Сегодняшняя дата: ${todayIso} (${todayDayName}).
Отвечай вежливо, точно, структурированно и строго на языке пользователя (${langLabel}).
Используй ТОЛЬКО свежие факты из базы знаний RAG (Google Docs .docx и Excel .xlsx) и результаты инструментов check_free_slots / book_student_lesson.

ПРАВИЛА ЗАПИСИ И ПОИСКА СВОБОДНЫХ ОКОН (ГРУППЫ ДО 12 ЧЕЛОВЕК):
1. Групповое обучение вмещает до 12 студентов в одном временном окне. Также доступна индивидуальная запись (1 на 1, только на полностью пустое окно без других учеников).
2. Если пользователь спрашивает про свободные окна, места в группе или хочет записаться на конкретный день — обязательно вызови check_free_slots(date, teacherName) и укажи количество оставшихся мест (например: "14:00 — свободно 10 из 12 мест").
3. Если пользователь просит записать его (и указал имя, телефон, дату, время, преподавателя или курс) — вызови book_student_lesson. По умолчанию используется studyType="Групповое", если пользователь явно не попросил индивидуальное занятие. Если каких-то обязательных данных не хватает — сначала уточни их и покажи свободные окна.
4. Если группа уже полная (GROUP_FULL, 12/12), окно занято индивидуально (SLOT_TAKEN), в окне уже есть группа при запросе индивидуального урока (SLOT_HAS_GROUP_BOOKINGS) или преподаватель не работает (OUTSIDE_WORKING_HOURS), сообщи об этом и перечисли доступные свободные окна.

--- RELEVANT KNOWLEDGE CONTEXT (LIVE DOCS/XLSX + GOOGLE VECTOR EMBEDDINGS) ---
${contextText}
-----------------------------------------------------------------------------`;

  const formattedHistory = history
    .slice(-6)
    .filter((h) => h.text && h.text.trim().length > 0)
    .map((h) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

  const contents: any[] = [
    ...formattedHistory,
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${apiKey}`;

  let finalAnswer = '';
  const executedActions: Array<{ tool: string; result: any }> = [];

  for (let step = 0; step < 4; step++) {
    const genResponse = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        tools: BOOKING_TOOLS,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!genResponse.ok) {
      const errText = await genResponse.text();
      throw new Error(`Gemini Generation Error (${genResponse.status}): ${errText}`);
    }

    const genData = await genResponse.json();
    const candidateContent = genData?.candidates?.[0]?.content;
    const parts = candidateContent?.parts || [];

    const functionCalls = parts.filter((p: any) => p.functionCall);
    if (functionCalls.length > 0) {
      // Append model turn containing functionCall
      contents.push(candidateContent);

      // Execute each tool call and send functionResponse back
      const responseParts: any[] = [];
      for (const part of functionCalls) {
        const fc = part.functionCall;
        const toolResult = await executeToolCall(fc.name, fc.args || {});
        executedActions.push({ tool: fc.name, result: toolResult });
        responseParts.push({
          functionResponse: {
            name: fc.name,
            response: { result: toolResult },
          },
        });
      }

      contents.push({
        role: 'user',
        parts: responseParts,
      });
      continue;
    }

    const textPart = parts.find((p: any) => typeof p.text === 'string');
    if (textPart?.text) {
      finalAnswer = textPart.text;
      break;
    }
  }

  if (!finalAnswer) {
    throw new Error('No response generated by Gemini.');
  }

  return {
    answer: finalAnswer,
    retrievedChunks: retrievedChunks.map((c) => ({
      id: c.id,
      source: c.source,
      title: c.title,
      similarityPercent: c.similarityPercent,
    })),
    ragSources: Array.from(new Set(retrievedChunks.map((c) => c.source))),
    origins,
    executedActions,
    model: CHAT_MODEL,
    embeddingModel: EMBEDDING_MODEL,
  };
}

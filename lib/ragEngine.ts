import { loadAllLiveRagDocuments, LoadedRagChunk } from './googleDocsLoader';

export type RagChunk = LoadedRagChunk;

// Multilingual keyword expansion for better retrieval across RU, EN, UZ
const SYNONYM_GROUPS: string[][] = [
  ['цена', 'стоимость', 'прайс', 'сколько', 'стоит', 'сумм', 'narx', 'qancha', 'pul', 'price', 'cost', 'tuition', 'fee'],
  ['рассрочк', 'кредит', 'частями', 'uzum', 'anorbank', 'paymart', 'rassrochka', 'muddatli', 'installment'],
  ['оплат', 'payme', 'click', 'карт', 'договор', 'tolov', 'payment', 'pay'],
  ['скидк', 'грант', 'акци', 'chegirma', 'grant', 'discount', 'scholarship'],
  ['пропуск', 'отмен', 'перенос', 'заболел', 'замороз', 'qoldirish', 'bekor', 'muzlatish', 'cancel', 'reschedule', 'freeze', 'miss'],
  ['гарант', 'качеств', 'kafolat', 'guarantee', 'quality'],
  ['взять', 'подготов', 'ноутбук', 'компьютер', 'собой', 'nima kerak', 'tayyorgarlik', 'bring', 'prepare', 'laptop'],
  ['запис', 'бронир', 'пробн', 'yozilish', 'sinov', 'book', 'enroll', 'trial'],
  ['график', 'расписан', 'часы', 'время', 'дни', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'jadval', 'vaqt', 'schedule', 'hours'],
  ['шерзод', 'елена', 'джеймс', 'азиза', 'преподавател', 'ментор', 'учител', 'ustoz', 'teacher', 'mentor'],
  ['адрес', 'телефон', 'контакт', 'телеграм', 'инстаграм', 'метро', 'бадамзар', 'manzil', 'aloqa', 'address', 'phone', 'telegram', 'instagram'],
  ['python', 'rag', 'gemini', 'ии', 'интеллект', 'ml', 'data', 'web', 'react', 'frontend', 'c++', 'алгоритм'],
  ['математ', 'sat', 'олимпиад', 'алгебр', 'math', 'olympiad'],
  ['англ', 'ielts', 'english', 'ingliz'],
  ['директор', 'завуч', 'администр', 'rahbariyat', 'direktor', 'director', 'admin'],
];

function expandQueryTokens(query: string): string[] {
  const normalized = query.toLowerCase();
  const baseTokens = normalized
    .replace(/[^a-zа-яёўқғҳ0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const expanded = new Set<string>(baseTokens);

  for (const group of SYNONYM_GROUPS) {
    if (group.some((kw) => normalized.includes(kw))) {
      for (const kw of group) {
        expanded.add(kw);
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Retrieves the top-K most relevant RAG chunks from live Google Docs (.docx) & Excel (.xlsx).
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 5,
  forceRefresh = false
): Promise<{ chunks: RagChunk[]; sources: string[]; origins: Record<string, string> }> {
  const { chunks, origins } = await loadAllLiveRagDocuments(forceRefresh);
  const queryTokens = expandQueryTokens(query);

  const scored = chunks.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      if (haystack.includes(token)) {
        if (chunk.title.toLowerCase().includes(token)) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored
    .filter((item) => item.score > 0)
    .slice(0, topK)
    .map((item) => item.chunk);

  const finalChunks =
    topChunks.length > 0
      ? topChunks
      : [
          ...chunks.filter((c) => c.source === 'price_list.docx').slice(0, 2),
          ...chunks.filter((c) => c.source === 'faq.docx').slice(0, 2),
          ...chunks.filter((c) => c.source === 'schedule.xlsx').slice(0, 2),
        ];

  const sources = Array.from(new Set(finalChunks.map((c) => c.source)));

  return { chunks: finalChunks, sources, origins };
}

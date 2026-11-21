import { NextRequest, NextResponse } from 'next/server';
import { getSmartFallbackResponse } from '@/lib/knowledgeBase';
import { retrieveRelevantChunks } from '@/lib/ragEngine';
import { askGeminiWithVectorRAG } from '@/lib/googleRagEngine';
import { Language } from '@/types';

const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash-lite';
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], language = 'ru', apiKey: clientKey, forceRefresh = false } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lang = (language === 'en' || language === 'uz' ? language : 'ru') as Language;
    const apiKey = clientKey?.trim() || process.env.GEMINI_API_KEY?.trim();

    // 1. Live Google Docs (.docx) + Excel (.xlsx) -> Google Vector Embeddings (gemini-embedding-001) -> gemini-3.5-flash-lite
    if (apiKey) {
      try {
        const vectorResult = await askGeminiWithVectorRAG({
          userMessage: message,
          history,
          language: lang,
          apiKey,
          forceRefresh: Boolean(forceRefresh),
        });

        return NextResponse.json({
          reply: vectorResult.answer,
          isFallback: false,
          source: 'google-vector-rag',
          model: vectorResult.model,
          embeddingModel: vectorResult.embeddingModel,
          ragSources: vectorResult.ragSources,
          retrievedChunks: vectorResult.retrievedChunks,
          origins: vectorResult.origins,
          executedActions: vectorResult.executedActions,
        });
      } catch (vectorError) {
        console.warn(
          '[Google Vector RAG] Falling back to local live-doc RAG engine:',
          vectorError instanceof Error ? vectorError.message : vectorError
        );
      }
    }

    // 2. Fallback to live .docx/.xlsx keyword RAG engine when no API key is provided or API fails
    const { chunks, sources, origins } = await retrieveRelevantChunks(
      message,
      4,
      Boolean(forceRefresh)
    );

    const hasRemoteDocs = Object.values(origins).some((o) => o === 'google-remote');
    let reply = getSmartFallbackResponse(message, lang);

    // If live Google Docs/Sheets are connected and we are in fallback mode (no Gemini key),
    // append the freshest retrieved fragment from the live document so edits are visible immediately.
    if (hasRemoteDocs && chunks.length > 0) {
      const liveSnippet = chunks
        .slice(0, 2)
        .map((c) => `📄 **${c.source} (${c.title}):**\n${c.text}`)
        .join('\n\n');
      reply = `${liveSnippet}\n\n---\n💡 *Для интеллектуального ответа добавьте GEMINI_API_KEY (модель ${GEMINI_MODEL}).*`;
    }

    return NextResponse.json({
      reply,
      isFallback: true,
      source: 'eduai-rag-engine',
      model: GEMINI_MODEL,
      embeddingModel: EMBEDDING_MODEL,
      ragSources: sources,
      origins,
      retrievedChunks: chunks.map((c) => ({
        id: c.id,
        source: c.source,
        title: c.title,
      })),
    });
  } catch (error) {
    console.error('API Chat Route Error:', error);
    return NextResponse.json(
      {
        reply:
          'Извините, произошла временная ошибка обработки запроса. Пожалуйста, повторите вопрос или свяжитесь с нами по телефону +998 (71) 200-55-44.',
        isFallback: true,
      },
      { status: 500 }
    );
  }
}

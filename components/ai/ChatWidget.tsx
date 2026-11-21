"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ApiKeyModal } from './ApiKeyModal';
import { ChatMessage } from '@/types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Key, 
  Settings, 
  RefreshCw, 
  ChevronDown, 
  HelpCircle, 
  User, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message & check saved API key
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('eduai-gemini-key');
      setHasCustomKey(!!savedKey);
    }

    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t.aiAssistant.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language, t.aiAssistant.welcome]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('eduai-gemini-key') : null;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages
            .filter((m) => m.id !== 'welcome' && m.id !== 'welcome-reset')
            .slice(-6)
            .map((m) => ({ sender: m.sender, text: m.text })),
          language,
          apiKey: customKey || undefined,
        }),
      });

      const data = await res.json();
      const assistantText = data?.reply || 'Извините, не удалось получить ответ. Попробуйте еще раз.';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragSources: Array.isArray(data?.ragSources) ? data.ragSources : undefined,
        retrievedChunks: Array.isArray(data?.retrievedChunks) ? data.retrievedChunks : undefined,
        embeddingModel: data?.embeddingModel,
        isFallback: data?.isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Произошла ошибка связи с сервером. Пожалуйста, проверьте подключение к сети.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: t.aiAssistant.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-ai-600 to-indigo-600 text-white shadow-xl shadow-ai-500/35 hover:shadow-ai-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open AI Assistant"
          >
            {/* Pulsing beacon glow */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>

            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="text-xs font-bold tracking-wide">
              {t.nav.aiChat}
            </span>
          </button>
        )}
      </div>

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slideUp">
          {/* Chat Window Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ai-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                  <span>{t.aiAssistant.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ai-500/30 text-ai-300 border border-ai-400/30">
                    gemini-3.5-flash-lite
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {t.aiAssistant.statusOnline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Gemini API Key modal button */}
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                  hasCustomKey ? 'text-amber-400 hover:text-amber-300' : ''
                }`}
                title={t.aiAssistant.apiKeySettings}
              >
                <Key className="w-4 h-4" />
              </button>

              {/* Reset chat button */}
              <button
                onClick={resetChat}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Очистить чат"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Close window */}
              <button
                onClick={onToggle}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Закрыть"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Engine status indicator bar */}
          <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-ai-500" />
              {hasCustomKey ? t.aiAssistant.hasKey : t.aiAssistant.noKey}
            </span>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Настроить ключ
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-ai-100 dark:bg-ai-950/80 text-ai-600 dark:text-ai-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-ai-200 dark:border-ai-800">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60 whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                  {(msg.retrievedChunks && msg.retrievedChunks.length > 0) ? (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap gap-1">
                      {msg.retrievedChunks.slice(0, 3).map((chunk) => (
                        <span
                          key={chunk.id}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-ai-50 dark:bg-ai-950/60 text-ai-700 dark:text-ai-300 border border-ai-200/70 dark:border-ai-800/70"
                          title={chunk.title}
                        >
                          {chunk.source}
                          {typeof chunk.similarityPercent === 'number' ? ` (${chunk.similarityPercent}%)` : ''}
                        </span>
                      ))}
                    </div>
                  ) : (
                    msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap gap-1">
                        {msg.ragSources.map((src) => (
                          <span
                            key={src}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-ai-50 dark:bg-ai-950/60 text-ai-700 dark:text-ai-300 border border-ai-200/70 dark:border-ai-800/70"
                          >
                            RAG: {src}
                          </span>
                        ))}
                      </div>
                    )
                  )}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-ai-100 dark:bg-ai-950/80 text-ai-600 dark:text-ai-400 flex items-center justify-center flex-shrink-0 border border-ai-200 dark:border-ai-800">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2.5 rounded-bl-none text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-ai-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-ai-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-ai-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">{t.aiAssistant.thinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
            {t.aiAssistant.promptChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-ai-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-ai-300 transition-all flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiAssistant.placeholder}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-ai-500 border border-transparent focus:border-ai-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-ai-600 to-indigo-600 text-white disabled:opacity-50 hover:from-ai-500 hover:to-indigo-500 transition-all shadow-md"
              aria-label={t.aiAssistant.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onKeyUpdated={(key) => setHasCustomKey(!!key)}
      />
    </>
  );
};

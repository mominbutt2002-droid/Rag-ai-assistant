"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Key, CheckCircle, AlertCircle, X, Shield, ExternalLink, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: (key: string | null) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const { t } = useLanguage();
  const [keyInput, setKeyInput] = useState('');
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduai-gemini-key');
      if (saved) {
        setCurrentKey(saved);
        setKeyInput(saved);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      handleRemove();
      return;
    }
    if (!trimmed.startsWith('AIzaSy') && trimmed.length < 20) {
      setStatusMessage({
        text: 'Ключ Gemini API обычно начинается с "AIzaSy" и содержит не менее 20 символов.',
        type: 'error',
      });
      return;
    }

    localStorage.setItem('eduai-gemini-key', trimmed);
    setCurrentKey(trimmed);
    onKeyUpdated(trimmed);
    setStatusMessage({
      text: t.aiAssistant.testKeySuccess,
      type: 'success',
    });

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    localStorage.removeItem('eduai-gemini-key');
    setCurrentKey(null);
    setKeyInput('');
    onKeyUpdated(null);
    setStatusMessage({
      text: 'Ключ удален. Включен встроенный RAG-движок.',
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-ai-100 dark:bg-ai-950/80 text-ai-600 dark:text-ai-400 flex items-center justify-center border border-ai-200 dark:border-ai-800">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              {t.aiAssistant.keyModalTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Google Gemini 3.5 Flash Lite (gemini-3.5-flash-lite)
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {t.aiAssistant.keyModalDesc}
        </p>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 mb-5">
          <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <span>
            Ключ сохраняется исключительно в <code>localStorage</code> вашего браузера и никогда не передается третьим лицам.
          </span>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setStatusMessage({ text: '', type: null });
            }}
            placeholder={t.aiAssistant.keyInputPlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ai-500"
          />
        </div>

        {/* Status message */}
        {statusMessage.type && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium mb-4 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-ai-600 to-indigo-600 hover:from-ai-500 hover:to-indigo-500 shadow-md transition-all"
          >
            {t.aiAssistant.saveKey}
          </button>

          {currentKey && (
            <button
              onClick={handleRemove}
              className="px-3.5 py-3 rounded-xl font-semibold text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5"
              title={t.aiAssistant.removeKey}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.aiAssistant.removeKey}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t.aiAssistant.close}
          </button>
        </div>

        {/* Link to AI Studio */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
          >
            <span>Получить бесплатный ключ в Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

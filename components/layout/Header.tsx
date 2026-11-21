"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/types';
import { 
  Sun, 
  Moon, 
  Globe, 
  Phone, 
  Clock, 
  Sparkles, 
  Menu, 
  X, 
  Bot, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';

interface HeaderProps {
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiChat }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.courses, href: '#courses' },
    { label: t.nav.teachers, href: '#teachers' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.students, href: '#students' },
    { label: t.nav.booking, href: '#booking' },
    { label: t.nav.contacts, href: '#contacts' },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top status bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              {t.topbar.schedule}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <a 
              href="tel:+998712005544" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {t.topbar.phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-600/30 to-ai-600/30 border border-brand-500/30 text-brand-300 text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-brand-400" />
              {t.topbar.badge}
            </span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['ru', 'en', 'uz'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    language === lang
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-yellow-400 transition-colors border border-slate-700"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md py-3'
            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4'
        } border-b border-slate-200/60 dark:border-slate-800/80`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Edu<span className="text-brand-600 dark:text-brand-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-ai-100 text-ai-700 dark:bg-ai-950 dark:text-ai-300 border border-ai-200 dark:border-ai-800">
                  Academy
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                AI • Math • English • Tech
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-ai-700 dark:text-ai-300 bg-ai-50 dark:bg-ai-950/60 hover:bg-ai-100 dark:hover:bg-ai-900/60 border border-ai-200 dark:border-ai-800 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-ai-600 dark:text-ai-400" />
              <span>{t.nav.aiChat}</span>
            </button>

            <a
              href="#booking"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.nav.enrollNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiChat();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-ai-700 dark:text-ai-300 bg-ai-50 dark:bg-ai-950/60 border border-ai-200 dark:border-ai-800"
              >
                <Bot className="w-4 h-4 text-ai-600 dark:text-ai-400" />
                <span>{t.nav.aiChat}</span>
              </button>

              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-ai-600"
              >
                <span>{t.nav.enrollNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

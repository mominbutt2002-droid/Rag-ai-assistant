"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Edu<span className="text-brand-400">AI</span> Academy
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {t.footer.desc}
            </p>
            <div className="text-xs text-slate-500">
              Ташкент, ул. Амира Темура, 108А
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              {t.footer.links}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-white transition-colors">{t.nav.courses}</a></li>
              <li><a href="#teachers" className="hover:text-white transition-colors">{t.nav.teachers}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a></li>
              <li><a href="#students" className="hover:text-white transition-colors">{t.nav.students}</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">{t.nav.booking}</a></li>
              <li><a href="#contacts" className="hover:text-white transition-colors">{t.nav.contacts}</a></li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              {t.footer.courses}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-brand-400 transition-colors">Python, RAG & AI Assistants</a></li>
              <li><a href="#courses" className="hover:text-brand-400 transition-colors">IELTS Intensive 7.5+</a></li>
              <li><a href="#courses" className="hover:text-brand-400 transition-colors">Олимпиадная математика</a></li>
              <li><a href="#courses" className="hover:text-brand-400 transition-colors">SAT Math 800 Prep</a></li>
              <li><a href="#courses" className="hover:text-brand-400 transition-colors">Full-Stack Web & AI UI</a></li>
            </ul>
          </div>

          {/* Legal and Back to top */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                {t.footer.legal}
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
                <li className="text-slate-500">Лицензия № 45981-EDU</li>
              </ul>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 flex items-center gap-2 self-start px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5 text-brand-400" />
              <span>Наверх</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EduAI Academy. {t.footer.rights}
          </div>
          <div className="flex items-center gap-1">
            Разработано с заботой о будущем образования
          </div>
        </div>
      </div>
    </footer>
  );
};

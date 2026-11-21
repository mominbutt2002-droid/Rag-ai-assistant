"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Send, 
  ExternalLink, 
  Navigation,
  Globe,
  Share2
} from 'lucide-react';

export const ContactsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contacts" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.contacts.tag}</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
            {t.contacts.title}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t.contacts.subtitle}
          </p>
        </div>

        {/* Contact Cards & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Address */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-200 dark:border-brand-800">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                  {t.contacts.addressTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.contacts.addressValue}
                </p>
              </div>
            </div>

            {/* Phones */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                  {t.contacts.phonesTitle}
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <a href="tel:+998712005544" className="block hover:text-brand-600 dark:hover:text-brand-400 font-medium">
                    +998 (71) 200-55-44
                  </a>
                  <a href="tel:+998908765432" className="block hover:text-brand-600 dark:hover:text-brand-400 font-medium">
                    +998 (90) 876-54-32
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-ai-50 dark:bg-ai-950 text-ai-600 dark:text-ai-400 flex items-center justify-center flex-shrink-0 border border-ai-200 dark:border-ai-800">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                  {t.contacts.hoursTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {t.contacts.hoursWeekdays}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {t.contacts.hoursSunday}
                </p>
              </div>
            </div>

            {/* Email & Socials */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-800">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                  {t.contacts.emailTitle}
                </h3>
                <a href="mailto:info@eduai-academy.uz" className="text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  {t.contacts.emailValue}
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Campus Map Mock with Directions */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
              {/* Styled Mock Map visual */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                alt="EduAI Campus Map"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105 dark:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Pin marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <div className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-brand-400">
                  <MapPin className="w-4 h-4 fill-current text-white" />
                  <span>EduAI Academy Campus</span>
                </div>
                <div className="w-2 h-2 bg-brand-600 rotate-45 -mt-1" />
              </div>

              {/* Bottom map info bar */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Кампус EduAI (Метро Бадамзар)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    ул. Амира Темура, 108А • Бесплатная парковка для студентов
                  </div>
                </div>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm transition-colors whitespace-nowrap"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.contacts.openRoute}</span>
                </a>
              </div>
            </div>

            {/* Social channels strip */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.contacts.socialTitle}:
              </span>
              <div className="flex items-center gap-2">
                {['Telegram', 'Instagram', 'YouTube', 'LinkedIn'].map((network) => (
                  <a
                    key={network}
                    href="#"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {network}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

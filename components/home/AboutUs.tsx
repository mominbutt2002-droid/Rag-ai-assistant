"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Building2, 
  Cpu, 
  Trophy, 
  Laptop, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  Compass 
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t.about.feature1Title,
      desc: t.about.feature1Desc,
      icon: Cpu,
      color: 'from-blue-500 to-brand-600',
    },
    {
      title: t.about.feature2Title,
      desc: t.about.feature2Desc,
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: t.about.feature3Title,
      desc: t.about.feature3Desc,
      icon: Laptop,
      color: 'from-ai-500 to-indigo-600',
    },
    {
      title: t.about.feature4Title,
      desc: t.about.feature4Desc,
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{t.about.tag}</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-snug mb-6">
              {t.about.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
              {t.about.description1}
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
              {t.about.description2}
            </p>

            {/* Accreditations checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Государственная лицензия</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Compass className="w-4 h-4 text-brand-500" />
                <span>Международный партнер Cambridge</span>
              </div>
            </div>
          </div>

          {/* Right Feature Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

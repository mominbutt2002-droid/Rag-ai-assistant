"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { studentsData } from '@/data/students';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Award, 
  Trophy, 
  Star, 
  Users, 
  CheckCircle2, 
  Quote, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface HeroProps {
  onOpenAiChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAiChat }) => {
  const { language, t } = useLanguage();
  const [activeStudentIdx, setActiveStudentIdx] = useState(0);

  const activeStudent = studentsData[activeStudentIdx] || studentsData[0];

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28 bg-gradient-to-b from-brand-50/50 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-500/10 via-ai-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-400/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ai-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.hero.tag}</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            <span className="bg-gradient-to-r from-brand-600 via-ai-600 to-indigo-600 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
            <br />
            {t.hero.titleRest}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-9">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <a
              href="#booking"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.hero.btnEnroll}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-ai-600 dark:text-ai-400" />
              <span>{t.hero.btnAiTour}</span>
            </button>

            <a
              href="#booking"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-slate-900 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.hero.btnAdmin}</span>
            </a>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="text-xl sm:text-2xl font-extrabold text-brand-600 dark:text-brand-400">1,500+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t.hero.stats.graduates}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="text-xl sm:text-2xl font-extrabold text-ai-600 dark:text-ai-400">98%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t.hero.stats.admitted}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">45+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t.hero.stats.olympiad}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-500">4.9 / 5</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t.hero.stats.rating}</div>
            </div>
          </div>
        </div>

        {/* BEST STUDENTS HONOR ROLL SHOWCASE (Requirement: Блок фотографии лучших учеников) */}
        <div id="students" className="mt-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.hero.honorRollTitle}</span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {t.hero.honorRollSubtitle}
              </h2>
            </div>

            {/* Quick avatar selector */}
            <div className="flex items-center gap-2">
              {studentsData.map((student, idx) => (
                <button
                  key={student.id}
                  onClick={() => setActiveStudentIdx(idx)}
                  className={`relative p-1 rounded-full transition-all ${
                    activeStudentIdx === idx
                      ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={student.name[language]}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={student.image}
                    alt={student.name[language]}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  {activeStudentIdx === idx && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-brand-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Student Card & Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Main Featured Student Spotlight */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeStudent.image}
                      alt={activeStudent.name[language]}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border-2 border-brand-500/20"
                    />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {activeStudent.name[language]}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400">
                        {activeStudent.course[language]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeStudent.universityOrJob[language]}
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto text-left sm:text-right">
                    <span className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm sm:text-base shadow-sm">
                      {activeStudent.score}
                    </span>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center sm:justify-end gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {activeStudent.badge[language]}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {activeStudent.result[language]}
                  </p>
                </div>

                <div className="relative pl-6 italic text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  <Quote className="w-4 h-4 text-brand-500 absolute left-0 top-0 opacity-60" />
                  {activeStudent.quote[language]}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Проверенный результат выпускника
                </span>
                <a
                  href="#booking"
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  Повторить результат <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Side Grid with other students */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {studentsData.map((student, idx) => (
                <div
                  key={student.id}
                  onClick={() => setActiveStudentIdx(idx)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    activeStudentIdx === idx
                      ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-300 dark:border-brand-800 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700'
                  } flex items-center gap-4`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={student.image}
                    alt={student.name[language]}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {student.name[language]}
                      </h4>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                        {student.score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {student.badge[language]}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {student.universityOrJob[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

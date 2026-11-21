"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { teachersData } from '@/data/teachers';
import { 
  Users, 
  Award, 
  Clock, 
  Star, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Calendar,
  MessageSquare
} from 'lucide-react';

export const TeachersSection: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="teachers" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai-100 dark:bg-ai-950/80 border border-ai-200 dark:border-ai-800 text-ai-700 dark:text-ai-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-ai-600 dark:text-ai-400" />
            <span>{t.teachers.tag}</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
            {t.teachers.title}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t.teachers.subtitle}
          </p>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachersData.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={teacher.image}
                    alt={teacher.name[language]}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                        {teacher.name[language]}
                      </h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current text-amber-500" />
                        {teacher.rating}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-1">
                      {teacher.role[language]}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 text-ai-500" />
                      <span>{teacher.subject[language]}</span>
                    </div>
                  </div>
                </div>

                {/* Experience Tag */}
                <div className="mb-4 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <Award className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>
                    <strong>{t.teachers.experience}</strong> {teacher.experience[language]}
                  </span>
                </div>

                {/* Working hours & Consultation Schedule (Prompt requirement) */}
                <div className="mb-5 p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 dark:text-brand-300 mb-1">
                    <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>{t.teachers.workingHours}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pl-5">
                    {teacher.workingHours[language]}
                  </p>
                </div>

                {/* Key Achievements list (Prompt requirement) */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t.teachers.achievements}
                  </h4>
                  <ul className="space-y-2">
                    {teacher.achievements[language].map((ach, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer with students mentored count & action */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">{teacher.studentsCount}+</strong> {t.teachers.studentsTaught}
                </span>

                <a
                  href="#booking"
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.teachers.bookConsultation}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

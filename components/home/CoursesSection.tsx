"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { coursesData } from '@/data/courses';
import { CourseCategory } from '@/types';
import { 
  Calculator, 
  Languages, 
  Bot, 
  Code2, 
  Clock, 
  Calendar, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Check, 
  Flame 
} from 'lucide-react';

interface CoursesSectionProps {
  onSelectCourseForBooking: (courseId: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourseForBooking }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');

  const categories = [
    { id: 'all' as CourseCategory, label: t.courses.filterAll, icon: Layers },
    { id: 'math' as CourseCategory, label: t.courses.filterMath, icon: Calculator },
    { id: 'english' as CourseCategory, label: t.courses.filterEnglish, icon: Languages },
    { id: 'cs' as CourseCategory, label: t.courses.filterCs, icon: Bot },
  ];

  const filteredCourses = activeCategory === 'all'
    ? coursesData
    : coursesData.filter((c) => c.category === activeCategory);

  return (
    <section id="courses" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.courses.tag}</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
            {t.courses.title}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t.courses.subtitle}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-brand-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            return (
              <div
                key={course.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Course Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.image}
                      alt={course.title[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md backdrop-blur-sm">
                        {course.badge[language]}
                      </span>

                      {course.popular && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {t.courses.popularTag}
                        </span>
                      )}
                    </div>

                    {/* Category tag bottom */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-brand-600 text-white shadow">
                        {course.category === 'math'
                          ? t.courses.filterMath
                          : course.category === 'english'
                          ? t.courses.filterEnglish
                          : t.courses.filterCs}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {course.title[language]}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
                      {course.description[language]}
                    </p>

                    {/* Schedule and Level meta tags */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-500" />
                        <span>{course.duration[language]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-ai-500" />
                        <span>{course.lessonsPerWeek} {t.courses.lessonsWeek}</span>
                      </div>
                    </div>

                    {/* Key Curriculum topics */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                        {t.courses.curriculum}
                      </h4>
                      <ul className="space-y-1.5">
                        {course.topics[language].slice(0, 3).map((topic, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Enrollment */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">Стоимость:</div>
                      <div className="text-base sm:text-lg font-extrabold text-brand-600 dark:text-brand-400">
                        {course.price[language]}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectCourseForBooking(course.id);
                        const el = document.getElementById('booking');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-500 shadow-sm transition-all"
                    >
                      <span>{t.courses.bookCourse}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

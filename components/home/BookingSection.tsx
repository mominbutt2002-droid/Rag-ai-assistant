"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { coursesData } from '@/data/courses';
import { LessonBookingFormData, AdminBookingFormData } from '@/types';
import {
  CalendarCheck,
  Clock,
  Phone,
  User,
  BookOpen,
  Building,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Users,
} from 'lucide-react';

interface BookingSectionProps {
  initialCourseId?: string;
}

interface LiveTeacherOption {
  name: string;
  role: string;
}

interface SlotDetail {
  time: string;
  bookedCount: number;
  maxCapacity: number;
  spotsLeft: number;
  isPrivateLocked: boolean;
  isAvailableForGroup: boolean;
  isAvailableForPrivate: boolean;
}

interface LiveScheduleInfo {
  teacher: string;
  dayOfWeek: string;
  workingHours: string;
  allSlots: string[];
  freeSlots: string[];
  bookedSlots: string[];
  slotDetails?: SlotDetail[];
  groupCapacity?: number;
}

function getTodayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ initialCourseId }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lesson' | 'admin'>('lesson');

  // Live Google Sheets teachers & slots
  const [teachers, setTeachers] = useState<LiveTeacherOption[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayIso);
  const [scheduleInfo, setScheduleInfo] = useState<LiveScheduleInfo | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [studyType, setStudyType] = useState<'Групповое' | 'Индивидуальное'>('Групповое');

  // Lesson Form State
  const [lessonForm, setLessonForm] = useState<LessonBookingFormData>({
    studentName: '',
    phone: '',
    courseId: initialCourseId || coursesData[0].id,
    format: 'offline',
    preferredTime: '',
    notes: '',
  });

  // Admin Form State
  const [adminForm, setAdminForm] = useState<AdminBookingFormData>({
    fullName: '',
    phone: '',
    targetRole: 'director',
    reason: 'general',
    preferredDate: getTodayIso(),
    preferredTimeSlot: '11:00',
    comments: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedDetails, setSubmittedDetails] = useState<{
    type: 'lesson' | 'admin';
    summary: string;
  } | null>(null);

  // Update courseId if passed from CoursesSection
  useEffect(() => {
    if (initialCourseId) {
      setLessonForm((prev) => ({ ...prev, courseId: initialCourseId }));
    }
  }, [initialCourseId]);

  // Fetch teachers from live Google Sheet schedule.xlsx
  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.teachers) && data.teachers.length > 0) {
          setTeachers(data.teachers);
          setSelectedTeacher((prev) => prev || data.teachers[0].name);
        }
      })
      .catch((err) => console.warn('Failed to load live teachers:', err));
  }, []);

  // Fetch free slots when teacher or date changes
  const fetchSlots = useCallback(async (dateVal: string, teacherVal: string) => {
    if (!dateVal || !teacherVal) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/bookings?date=${encodeURIComponent(dateVal)}&teacher=${encodeURIComponent(teacherVal)}`
      );
      const data = await res.json();
      const info: LiveScheduleInfo | null = data?.schedules?.[0] || null;
      setScheduleInfo(info);
    } catch (err) {
      console.warn('Failed to load free slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTeacher) {
      fetchSlots(selectedDate, selectedTeacher);
    }
  }, [selectedDate, selectedTeacher, fetchSlots]);

  // Keep preferredTime valid whenever scheduleInfo or studyType changes
  useEffect(() => {
    if (!scheduleInfo) return;
    const details = scheduleInfo.slotDetails || [];
    const available = details
      .filter((s) => (studyType === 'Групповое' ? s.isAvailableForGroup : s.isAvailableForPrivate))
      .map((s) => s.time);

    setLessonForm((prev) => ({
      ...prev,
      preferredTime: available.includes(prev.preferredTime) ? prev.preferredTime : available[0] || '',
    }));
  }, [scheduleInfo, studyType]);

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!lessonForm.studentName || !lessonForm.phone) {
      setSubmitError('Пожалуйста, заполните обязательные поля: имя и номер телефона');
      return;
    }
    if (!selectedDate || !selectedTeacher || !lessonForm.preferredTime) {
      setSubmitError('Пожалуйста, выберите преподавателя, дату и свободное окно времени');
      return;
    }

    const courseObj = coursesData.find((c) => c.id === lessonForm.courseId);
    const courseName = courseObj ? courseObj.title[language] : lessonForm.courseId;

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: lessonForm.preferredTime,
          teacher: selectedTeacher,
          course: courseName,
          studentName: lessonForm.studentName,
          phone: lessonForm.phone,
          format: lessonForm.format === 'online' ? 'Онлайн' : 'Офлайн',
          studyType,
          comment: lessonForm.notes || '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Не удалось забронировать выбранное окно');
        await fetchSlots(selectedDate, selectedTeacher);
        return;
      }

      setSubmittedDetails({
        type: 'lesson',
        summary: `${lessonForm.studentName} • ${studyType} • ${selectedTeacher} • ${selectedDate} в ${lessonForm.preferredTime}`,
      });
      await fetchSlots(selectedDate, selectedTeacher);
    } catch {
      setSubmitError('Ошибка сети при сохранении записи. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!adminForm.fullName || !adminForm.phone || !adminForm.preferredDate) {
      setSubmitError('Пожалуйста, заполните имя, телефон и выберите желаемую дату визита');
      return;
    }

    const roleLabel =
      adminForm.targetRole === 'director'
        ? 'Директор центра'
        : adminForm.targetRole === 'academic_head'
        ? 'Завуч / Академический руководитель'
        : 'Приемная комиссия';

    const startTime = adminForm.preferredTimeSlot.split(' ')[0].trim();

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: adminForm.preferredDate,
          time: startTime,
          teacher: roleLabel,
          course: `Встреча с администрацией (${adminForm.reason})`,
          studentName: adminForm.fullName,
          phone: adminForm.phone,
          format: 'Офлайн',
          studyType: 'Индивидуальное',
          comment: adminForm.comments || '',
          skipScheduleCheck: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Выбранное время уже занято. Пожалуйста, выберите другое время.');
        return;
      }

      setSubmittedDetails({
        type: 'admin',
        summary: `${adminForm.fullName} • ${roleLabel} • ${adminForm.preferredDate} в ${startTime}`,
      });
    } catch {
      setSubmitError('Ошибка сети при сохранении записи.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeFeedbackModal = () => {
    setSubmittedDetails(null);
    setLessonForm((prev) => ({
      ...prev,
      studentName: '',
      phone: '',
      notes: '',
    }));
    setAdminForm((prev) => ({
      ...prev,
      fullName: '',
      phone: '',
      comments: '',
    }));
  };

  return (
    <section
      id="booking"
      className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <CalendarCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.booking.tag}</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
            {t.booking.title}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base">{t.booking.subtitle}</p>

          {/* Dual Tabs Selector */}
          <div className="flex items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto mt-8 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setActiveTab('lesson');
                setSubmitError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'lesson'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.booking.tabLesson}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setSubmitError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-ai-600 dark:text-ai-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{t.booking.tabAdmin}</span>
            </button>
          </div>
        </div>

        {/* Error banner */}
        {submitError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Tab 1: Lesson Booking Form */}
        {activeTab === 'lesson' && (
          <form
            onSubmit={handleLessonSubmit}
            className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.lessonName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={lessonForm.studentName}
                    onChange={(e) => setLessonForm({ ...lessonForm, studentName: e.target.value })}
                    placeholder={t.booking.lessonNamePlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.phone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={lessonForm.phone}
                    onChange={(e) => setLessonForm({ ...lessonForm, phone: e.target.value })}
                    placeholder={t.booking.phonePlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Select Course */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.selectCourse}
                </label>
                <select
                  value={lessonForm.courseId}
                  onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {coursesData.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title[language]} ({course.price[language]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Format */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.formatLabel}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, format: 'offline' })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      lessonForm.format === 'offline'
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {t.booking.formatOffline}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, format: 'online' })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      lessonForm.format === 'online'
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {t.booking.formatOnline}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Teacher & Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Преподаватель / Наставник <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {teachers.map((tr) => (
                      <option key={tr.name} value={tr.name}>
                        {tr.name} — {tr.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Дата занятия <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={getTodayIso()}
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Study Type: Group (up to 12) vs Individual */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Тип обучения
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStudyType('Групповое')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    studyType === 'Групповое'
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Групповое (до 12 человек)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudyType('Индивидуальное')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    studyType === 'Индивидуальное'
                      ? 'bg-ai-600 text-white border-ai-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Индивидуальное (1 на 1)</span>
                </button>
              </div>
            </div>

            {/* Live Free Slots Picker */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span>Свободные окна ({scheduleInfo?.dayOfWeek || '...'})</span>
                </label>
                {scheduleInfo && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Часы работы: <strong>{scheduleInfo.workingHours}</strong>
                  </span>
                )}
              </div>

              {loadingSlots ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                  <span>Загружаем свободные окна из Google Таблицы «Записи»...</span>
                </div>
              ) : scheduleInfo && scheduleInfo.allSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {scheduleInfo.allSlots.map((slot) => {
                    const detail = scheduleInfo.slotDetails?.find((d) => d.time === slot);
                    const isFree = detail
                      ? studyType === 'Групповое'
                        ? detail.isAvailableForGroup
                        : detail.isAvailableForPrivate
                      : scheduleInfo.freeSlots.includes(slot);
                    const isSelected = lessonForm.preferredTime === slot;

                    let badgeLabel = '';
                    if (detail) {
                      if (detail.isPrivateLocked) {
                        badgeLabel = '(индивидуально занято)';
                      } else if (studyType === 'Групповое') {
                        badgeLabel =
                          detail.spotsLeft > 0
                            ? `(${detail.spotsLeft}/${detail.maxCapacity} мест)`
                            : '(группа 12/12)';
                      } else {
                        badgeLabel =
                          detail.bookedCount === 0
                            ? '(свободно)'
                            : `(группа ${detail.bookedCount}/12)`;
                      }
                    } else if (!isFree) {
                      badgeLabel = '(занято)';
                    }

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!isFree}
                        onClick={() => setLessonForm({ ...lessonForm, preferredTime: slot })}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          !isFree
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:border-brand-500'
                        }`}
                        title={isFree ? `Свободно: ${badgeLabel}` : `Недоступно: ${badgeLabel}`}
                      >
                        {slot} <span className="font-normal opacity-90">{badgeLabel}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 py-1">
                  На выбранный день ({scheduleInfo?.dayOfWeek}) у преподавателя выходной или нет доступных окон. Выберите другую дату или другого преподавателя.
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t.booking.notes}
              </label>
              <textarea
                rows={3}
                value={lessonForm.notes}
                onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                placeholder={t.booking.notesPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !lessonForm.preferredTime}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 disabled:opacity-50 shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{t.booking.submitLesson}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Administration Meeting Form */}
        {activeTab === 'admin' && (
          <form
            onSubmit={handleAdminSubmit}
            className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.adminFullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={adminForm.fullName}
                    onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                    placeholder="Камилов Бахтиёр"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.adminPhone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    placeholder="+998 90 987 65 43"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t.booking.adminRole}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'director', label: t.booking.roleDirector },
                  { id: 'academic_head', label: t.booking.roleAcademicHead },
                  { id: 'admissions', label: t.booking.roleAdmissions },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setAdminForm({ ...adminForm, targetRole: role.id as any })}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                      adminForm.targetRole === role.id
                        ? 'bg-ai-50 dark:bg-ai-950/60 border-ai-500 text-ai-800 dark:text-ai-300 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.dateLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={getTodayIso()}
                  required
                  value={adminForm.preferredDate}
                  onChange={(e) => setAdminForm({ ...adminForm, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.timeSlotLabel}
                </label>
                <select
                  value={adminForm.preferredTimeSlot}
                  onChange={(e) => setAdminForm({ ...adminForm, preferredTimeSlot: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
                >
                  <option value="10:00">10:00 – 11:30</option>
                  <option value="11:30">11:30 – 13:00</option>
                  <option value="14:00">14:00 – 15:30</option>
                  <option value="16:00">16:00 – 17:30</option>
                  <option value="18:00">18:00 – 19:30</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t.booking.reasonLabel}
              </label>
              <select
                value={adminForm.reason}
                onChange={(e) => setAdminForm({ ...adminForm, reason: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
              >
                <option value="general">{t.booking.reasonGeneral}</option>
                <option value="curriculum">{t.booking.reasonCurriculum}</option>
                <option value="scholarship">{t.booking.reasonScholarship}</option>
                <option value="feedback">{t.booking.reasonFeedback}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t.booking.comments}
              </label>
              <textarea
                rows={3}
                value={adminForm.comments}
                onChange={(e) => setAdminForm({ ...adminForm, comments: e.target.value })}
                placeholder={t.booking.commentsPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-ai-600 to-indigo-600 hover:from-ai-500 hover:to-indigo-500 disabled:opacity-50 shadow-lg shadow-ai-500/25 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{t.booking.submitAdmin}</span>
            </button>
          </form>
        )}

        {/* Confirmation Modal */}
        {submittedDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center">
              <button
                onClick={closeFeedbackModal}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2">
                {t.booking.successTitle}
              </h3>

              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 rounded-xl py-2 px-3 mb-3">
                {submittedDetails.summary}
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {submittedDetails.type === 'lesson'
                  ? t.booking.successLessonDesc
                  : t.booking.successAdminDesc}
              </p>

              <button
                onClick={closeFeedbackModal}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 transition-colors"
              >
                {t.booking.closeBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

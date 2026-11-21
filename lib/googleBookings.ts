import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import {
  extractGoogleId,
  fetchGoogleBinary,
  getServiceAccountAccessToken,
} from './googleDocsLoader';

export const GROUP_CAPACITY = 12;

export type StudyType = 'Групповое' | 'Индивидуальное';

export interface SlotDetail {
  time: string;
  bookedCount: number;
  maxCapacity: number;
  spotsLeft: number;
  isPrivateLocked: boolean;
  isAvailableForGroup: boolean;
  isAvailableForPrivate: boolean;
}

export interface TeacherScheduleSlotInfo {
  teacher: string;
  role: string;
  dayOfWeek: string;
  workingHours: string;
  groupInfo: string;
  allSlots: string[];
  freeSlots: string[];
  bookedSlots: string[];
  slotDetails: SlotDetail[];
  groupCapacity: number;
}

export interface BookingRecord {
  date: string;
  time: string;
  teacher: string;
  course: string;
  studentName: string;
  phone: string;
  format: string;
  studyType: StudyType;
  status: string;
  comment: string;
}

const DEFAULT_BOOKINGS_SHEET_ID = '1FhRInTFgSShqebPAGgc0g97c-jQOGzQe4lhCNLhydBc';

const BOOKING_HEADERS = [
  'Дата',
  'Время',
  'Преподаватель',
  'Курс / Направление',
  'Имя студента',
  'Телефон / Telegram',
  'Формат',
  'Тип обучения',
  'Статус',
  'Комментарий',
];

const DAYS_RU = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export function getDayOfWeekRu(dateStr: string): string {
  const m = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    const d = new Date(dateStr);
    return DAYS_RU[d.getDay()] || 'Понедельник';
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return DAYS_RU[d.getDay()];
}

export function normalizeTime(timeStr: string): string {
  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return timeStr.trim();
  return `${m[1].padStart(2, '0')}:${m[2]}`;
}

export function normalizeStudyType(input?: string): StudyType {
  const lower = (input || '').trim().toLowerCase();
  if (lower.includes('индив') || lower.includes('indiv') || lower.includes('1 на 1') || lower.includes('private')) {
    return 'Индивидуальное';
  }
  return 'Групповое';
}

function parseMinutes(hhmm: string): number | null {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function generateSlotsFromRange(workingHours: string): string[] {
  const lower = workingHours.toLowerCase();
  if (!workingHours || lower.includes('выходной') || workingHours.trim() === '-') {
    return [];
  }

  const rangeMatch = workingHours.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);
  if (!rangeMatch) return [];

  const startMins = parseMinutes(rangeMatch[1]);
  const endMins = parseMinutes(rangeMatch[2]);
  if (startMins === null || endMins === null || endMins <= startMins) return [];

  const slots: string[] = [];
  for (let cur = startMins; cur + 60 <= endMins; cur += 60) {
    slots.push(formatMinutes(cur));
  }
  return slots;
}

interface RawTeacherRow {
  teacher: string;
  role: string;
  day: string;
  hours: string;
  groupInfo: string;
}

export async function loadTeacherSchedules(): Promise<RawTeacherRow[]> {
  let buffer: Buffer;
  const remoteSchedule =
    process.env.GOOGLE_SCHEDULE_XLSX_URL || process.env.GOOGLE_SCHEDULE_SHEET_ID;

  if (remoteSchedule?.trim()) {
    try {
      buffer = await fetchGoogleBinary({ urlOrId: remoteSchedule, kind: 'xlsx' });
    } catch (err) {
      console.warn('[Bookings] Remote schedule fetch failed, using local file:', err);
      buffer = fs.readFileSync(path.join(process.cwd(), 'data', 'rag', 'schedule.xlsx'));
    }
  } else {
    buffer = fs.readFileSync(path.join(process.cwd(), 'data', 'rag', 'schedule.xlsx'));
  }

  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheetName =
    wb.SheetNames.find((n) => n.toLowerCase().includes('расписан')) || wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[sheetName], {
    header: 1,
    defval: '',
  });

  const result: RawTeacherRow[] = [];
  for (const row of rows.slice(1)) {
    const teacher = String(row[0] ?? '').trim();
    const role = String(row[1] ?? '').trim();
    const day = String(row[2] ?? '').trim();
    const hours = String(row[3] ?? '').trim();
    const groupInfo = String(row[4] ?? '').trim();
    if (!teacher || !day) continue;
    result.push({ teacher, role, day, hours, groupInfo });
  }
  return result;
}

export async function getAvailableTeachers(): Promise<Array<{ name: string; role: string }>> {
  const rows = await loadTeacherSchedules();
  const map = new Map<string, string>();
  for (const r of rows) {
    if (!map.has(r.teacher)) {
      map.set(r.teacher, r.role);
    }
  }
  return Array.from(map.entries()).map(([name, role]) => ({ name, role }));
}

function getBookingsSheetId(): string {
  const configured =
    process.env.GOOGLE_BOOKINGS_SHEET_URL || process.env.GOOGLE_BOOKINGS_SHEET_ID;
  return extractGoogleId(configured) || DEFAULT_BOOKINGS_SHEET_ID;
}

async function getFirstSheetTitle(sheetId: string, accessToken: string): Promise<string> {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (metaRes.ok) {
    const meta = await metaRes.json();
    const title = meta?.sheets?.[0]?.properties?.title;
    if (title) return title;
  }
  return 'Лист1';
}

export async function getExistingBookings(): Promise<BookingRecord[]> {
  const sheetId = getBookingsSheetId();
  const accessToken = await getServiceAccountAccessToken();

  let rows: string[][] = [];

  if (accessToken) {
    const sheetTitle = await getFirstSheetTitle(sheetId, accessToken);
    const valRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
        `${sheetTitle}!A1:Z`
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        cache: 'no-store',
      }
    );

    if (valRes.ok) {
      const data = await valRes.json();
      rows = Array.isArray(data?.values) ? data.values : [];
    } else {
      console.warn('[Sheets API GET] Fallback to Drive export:', valRes.status);
    }
  }

  if (rows.length === 0) {
    try {
      const buffer = await fetchGoogleBinary({ urlOrId: sheetId, kind: 'xlsx' });
      const wb = XLSX.read(buffer, { type: 'buffer' });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1, defval: '' });
    } catch {
      return [];
    }
  }

  if (rows.length <= 1) return [];

  const headers = rows[0].map((h) => String(h || '').toLowerCase());
  const hasStudyTypeCol = headers.some((h) => h.includes('тип'));

  const records: BookingRecord[] = [];
  for (const row of rows.slice(1)) {
    const date = String(row[0] ?? '').trim();
    const time = normalizeTime(String(row[1] ?? '').trim());
    const teacher = String(row[2] ?? '').trim();
    if (!date && !teacher && !row[4]) continue;

    if (hasStudyTypeCol) {
      records.push({
        date,
        time,
        teacher,
        course: String(row[3] ?? '').trim(),
        studentName: String(row[4] ?? '').trim(),
        phone: String(row[5] ?? '').trim(),
        format: String(row[6] ?? '').trim(),
        studyType: normalizeStudyType(String(row[7] ?? '')),
        status: String(row[8] ?? '').trim(),
        comment: String(row[9] ?? '').trim(),
      });
    } else {
      // Legacy 9-column fallback
      records.push({
        date,
        time,
        teacher,
        course: String(row[3] ?? '').trim(),
        studentName: String(row[4] ?? '').trim(),
        phone: String(row[5] ?? '').trim(),
        format: String(row[6] ?? '').trim(),
        studyType: 'Групповое',
        status: String(row[7] ?? '').trim(),
        comment: String(row[8] ?? '').trim(),
      });
    }
  }
  return records;
}

/**
 * Finds free time windows ("свободные окна") with group capacity tracking (up to 12 students per slot).
 */
export async function findFreeSlots(params: {
  date: string;
  teacherName?: string;
}): Promise<{
  date: string;
  dayOfWeek: string;
  groupCapacity: number;
  schedules: TeacherScheduleSlotInfo[];
}> {
  const { date, teacherName } = params;
  const dayOfWeek = getDayOfWeekRu(date);
  const [scheduleRows, existingBookings] = await Promise.all([
    loadTeacherSchedules(),
    getExistingBookings(),
  ]);

  const byTeacher = new Map<string, RawTeacherRow[]>();
  for (const r of scheduleRows) {
    if (!byTeacher.has(r.teacher)) byTeacher.set(r.teacher, []);
    byTeacher.get(r.teacher)!.push(r);
  }

  const filterNeedle = teacherName?.trim().toLowerCase();
  const schedules: TeacherScheduleSlotInfo[] = [];

  for (const [teacher, rows] of Array.from(byTeacher.entries())) {
    if (filterNeedle && !teacher.toLowerCase().includes(filterNeedle)) {
      continue;
    }

    const dayRow = rows.find((r) => r.day.toLowerCase() === dayOfWeek.toLowerCase());
    const role = rows[0]?.role || '';
    const workingHours = dayRow ? dayRow.hours : 'Выходной';
    const groupInfo = dayRow ? dayRow.groupInfo : '-';
    const allSlots = generateSlotsFromRange(workingHours);

    const activeForTeacherOnDate = existingBookings.filter(
      (b) =>
        b.date === date &&
        b.teacher.toLowerCase() === teacher.toLowerCase() &&
        !b.status.toLowerCase().includes('отмен')
    );

    const slotDetails: SlotDetail[] = allSlots.map((slot) => {
      const slotMins = parseMinutes(slot)!;
      const overlapping = activeForTeacherOnDate.filter((b) => {
        const bMins = parseMinutes(b.time);
        return bMins !== null && Math.abs(bMins - slotMins) < 60;
      });

      const isPrivateLocked = overlapping.some((b) => b.studyType === 'Индивидуальное');
      const bookedCount = overlapping.length;
      const maxCapacity = isPrivateLocked ? 1 : GROUP_CAPACITY;
      const spotsLeft = isPrivateLocked ? 0 : Math.max(0, GROUP_CAPACITY - bookedCount);

      return {
        time: slot,
        bookedCount,
        maxCapacity,
        spotsLeft,
        isPrivateLocked,
        isAvailableForGroup: !isPrivateLocked && spotsLeft > 0,
        isAvailableForPrivate: bookedCount === 0,
      };
    });

    const freeSlots = slotDetails
      .filter((s) => s.isAvailableForGroup)
      .map((s) => s.time);

    const bookedSlots = slotDetails
      .filter((s) => !s.isAvailableForGroup)
      .map((s) => s.time);

    schedules.push({
      teacher,
      role,
      dayOfWeek,
      workingHours,
      groupInfo,
      allSlots,
      freeSlots,
      bookedSlots,
      slotDetails,
      groupCapacity: GROUP_CAPACITY,
    });
  }

  return { date, dayOfWeek, groupCapacity: GROUP_CAPACITY, schedules };
}

async function appendBookingToGoogleSheet(record: BookingRecord): Promise<void> {
  const sheetId = getBookingsSheetId();
  const accessToken = await getServiceAccountAccessToken();
  if (!accessToken) {
    throw new Error('Google Service Account credentials are not configured.');
  }

  const sheetTitle = await getFirstSheetTitle(sheetId, accessToken);

  // Ensure row 1 headers exist without overwriting any existing data
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      `${sheetTitle}!A1:J1`
    )}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    const hasHeaders = Array.isArray(checkData?.values) && checkData.values.length > 0;
    if (!hasHeaders) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
          `${sheetTitle}!A1:J1`
        )}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [BOOKING_HEADERS] }),
          cache: 'no-store',
        }
      );
    }
  }

  const rowValues = [
    record.date,
    record.time,
    record.teacher,
    record.course,
    record.studentName,
    record.phone,
    record.format,
    record.studyType,
    record.status,
    record.comment,
  ];

  // Append strictly at the end using INSERT_ROWS so existing rows are NEVER deleted or overwritten
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      `${sheetTitle}!A:J`
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
      cache: 'no-store',
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text().catch(() => '');
    throw new Error(`Failed to append row via Google Sheets API (${appendRes.status}): ${errText}`);
  }
}

/**
 * Books a student into 'Записи' supporting Group Learning (up to 12 students per slot) and Individual (1-on-1).
 */
export async function createStudentBooking(params: {
  date: string;
  time: string;
  teacher: string;
  course: string;
  studentName: string;
  phone: string;
  format?: string;
  studyType?: string;
  comment?: string;
  skipScheduleCheck?: boolean;
}): Promise<{
  success: boolean;
  error?:
    | 'SLOT_TAKEN'
    | 'GROUP_FULL'
    | 'SLOT_HAS_GROUP_BOOKINGS'
    | 'OUTSIDE_WORKING_HOURS'
    | 'TEACHER_NOT_FOUND';
  message: string;
  booking?: BookingRecord;
  bookedCount?: number;
  maxCapacity?: number;
  spotsLeft?: number;
  freeSlots?: string[];
  slotDetails?: SlotDetail[];
  workingHours?: string;
  dayOfWeek?: string;
}> {
  const date = params.date.trim();
  const time = normalizeTime(params.time);
  const studentName = params.studentName.trim();
  const phone = params.phone.trim();
  const course = params.course.trim();
  const format = (params.format || 'Офлайн').trim();
  const studyType = normalizeStudyType(params.studyType);
  const comment = (params.comment || '').trim();

  const slotCheck = await findFreeSlots({ date, teacherName: params.teacher });
  let canonicalTeacher = params.teacher.trim();

  let resultingBookedCount = 1;
  let resultingMaxCapacity = studyType === 'Групповое' ? GROUP_CAPACITY : 1;

  if (!params.skipScheduleCheck) {
    if (slotCheck.schedules.length === 0) {
      const allTeachers = await getAvailableTeachers();
      return {
        success: false,
        error: 'TEACHER_NOT_FOUND',
        message: `Преподаватель «${params.teacher}» не найден в расписании. Доступные преподаватели: ${allTeachers
          .map((t) => t.name)
          .join(', ')}.`,
      };
    }

    const teacherInfo = slotCheck.schedules[0];
    canonicalTeacher = teacherInfo.teacher;

    const reqMins = parseMinutes(time);
    const rangeMatch = teacherInfo.workingHours.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);
    const startMins = rangeMatch ? parseMinutes(rangeMatch[1]) : null;
    const endMins = rangeMatch ? parseMinutes(rangeMatch[2]) : null;

    const withinHours =
      reqMins !== null &&
      startMins !== null &&
      endMins !== null &&
      reqMins >= startMins &&
      reqMins + 60 <= endMins;

    if (!withinHours) {
      return {
        success: false,
        error: 'OUTSIDE_WORKING_HOURS',
        message: `${canonicalTeacher} в ${teacherInfo.dayOfWeek} (${date}) работает: ${teacherInfo.workingHours}. Свободные окна: ${
          teacherInfo.freeSlots.length > 0 ? teacherInfo.freeSlots.join(', ') : 'нет свободных окон'
        }.`,
        workingHours: teacherInfo.workingHours,
        dayOfWeek: teacherInfo.dayOfWeek,
        freeSlots: teacherInfo.freeSlots,
        slotDetails: teacherInfo.slotDetails,
      };
    }

    // Find matching slot detail (exact or overlapping within 60 min)
    const matchingSlot = teacherInfo.slotDetails.find((s) => {
      const sMins = parseMinutes(s.time);
      return sMins !== null && reqMins !== null && Math.abs(sMins - reqMins) < 60;
    });

    if (matchingSlot) {
      if (matchingSlot.isPrivateLocked) {
        return {
          success: false,
          error: 'SLOT_TAKEN',
          message: `Окно ${time} на ${date} у преподавателя ${canonicalTeacher} занято индивидуальным занятием. Свободные окна: ${
            teacherInfo.freeSlots.length > 0 ? teacherInfo.freeSlots.join(', ') : 'нет свободных окон'
          }.`,
          freeSlots: teacherInfo.freeSlots,
          slotDetails: teacherInfo.slotDetails,
          workingHours: teacherInfo.workingHours,
          dayOfWeek: teacherInfo.dayOfWeek,
        };
      }

      if (studyType === 'Групповое' && matchingSlot.bookedCount >= GROUP_CAPACITY) {
        return {
          success: false,
          error: 'GROUP_FULL',
          message: `Группа на ${time} (${date}, ${canonicalTeacher}) уже полностью укомплектована (${GROUP_CAPACITY}/${GROUP_CAPACITY} мест). Свободные окна: ${
            teacherInfo.freeSlots.length > 0 ? teacherInfo.freeSlots.join(', ') : 'нет свободных окон'
          }.`,
          freeSlots: teacherInfo.freeSlots,
          slotDetails: teacherInfo.slotDetails,
          workingHours: teacherInfo.workingHours,
          dayOfWeek: teacherInfo.dayOfWeek,
        };
      }

      if (studyType === 'Индивидуальное' && matchingSlot.bookedCount > 0) {
        const emptyPrivateSlots = teacherInfo.slotDetails
          .filter((s) => s.isAvailableForPrivate)
          .map((s) => s.time);
        return {
          success: false,
          error: 'SLOT_HAS_GROUP_BOOKINGS',
          message: `В ${time} (${date}, ${canonicalTeacher}) уже записана группа (${matchingSlot.bookedCount}/${GROUP_CAPACITY} чел.). Для индивидуального занятия выберите полностью свободное окно: ${
            emptyPrivateSlots.length > 0 ? emptyPrivateSlots.join(', ') : 'нет полностью пустых окон'
          }.`,
          freeSlots: emptyPrivateSlots,
          slotDetails: teacherInfo.slotDetails,
          workingHours: teacherInfo.workingHours,
          dayOfWeek: teacherInfo.dayOfWeek,
        };
      }

      resultingBookedCount = matchingSlot.bookedCount + 1;
      resultingMaxCapacity = studyType === 'Групповое' ? GROUP_CAPACITY : 1;
    }
  } else {
    // Admin/reception meeting (1-on-1 by default unless specified)
    const existing = await getExistingBookings();
    const conflictCount = existing.filter(
      (b) =>
        b.date === date &&
        b.time === time &&
        b.teacher.toLowerCase() === canonicalTeacher.toLowerCase() &&
        !b.status.toLowerCase().includes('отмен')
    ).length;
    if (studyType === 'Индивидуальное' && conflictCount > 0) {
      return {
        success: false,
        error: 'SLOT_TAKEN',
        message: `Время ${time} на ${date} (${canonicalTeacher}) уже занято. Пожалуйста, выберите другое время.`,
      };
    }
    resultingBookedCount = conflictCount + 1;
  }

  const newBooking: BookingRecord = {
    date,
    time,
    teacher: canonicalTeacher,
    course,
    studentName,
    phone,
    format,
    studyType,
    status: 'Записан',
    comment,
  };

  await appendBookingToGoogleSheet(newBooking);

  const updatedSlots = await findFreeSlots({ date, teacherName: canonicalTeacher });
  const updatedSchedule = updatedSlots.schedules[0];
  const spotsLeft = Math.max(0, resultingMaxCapacity - resultingBookedCount);

  return {
    success: true,
    message:
      studyType === 'Групповое'
        ? `Студент ${studentName} записан в группу к ${canonicalTeacher} на ${date} в ${time} (${resultingBookedCount}/${GROUP_CAPACITY} мест занято, осталось ${spotsLeft} мест).`
        : `Студент ${studentName} записан на индивидуальное занятие к ${canonicalTeacher} на ${date} в ${time}.`,
    booking: newBooking,
    bookedCount: resultingBookedCount,
    maxCapacity: resultingMaxCapacity,
    spotsLeft,
    freeSlots: updatedSchedule?.freeSlots || [],
    slotDetails: updatedSchedule?.slotDetails || [],
  };
}

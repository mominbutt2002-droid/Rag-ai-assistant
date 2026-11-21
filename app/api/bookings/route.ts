import { NextRequest, NextResponse } from 'next/server';
import {
  createStudentBooking,
  findFreeSlots,
  getAvailableTeachers,
  getExistingBookings,
} from '@/lib/googleBookings';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const teacher = searchParams.get('teacher') || undefined;

    const [teachers, bookings] = await Promise.all([
      getAvailableTeachers(),
      getExistingBookings(),
    ]);

    if (date) {
      const slotInfo = await findFreeSlots({ date, teacherName: teacher });
      return NextResponse.json({
        date: slotInfo.date,
        dayOfWeek: slotInfo.dayOfWeek,
        schedules: slotInfo.schedules,
        teachers,
        bookings,
      });
    }

    return NextResponse.json({
      teachers,
      bookings,
    });
  } catch (error) {
    console.error('[API /bookings GET] Error:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить расписание и свободные окна' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      date,
      time,
      teacher,
      course,
      studentName,
      phone,
      format,
      studyType,
      comment,
      skipScheduleCheck = false,
    } = body;

    if (!date || !time || !teacher || !studentName || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пожалуйста, заполните дату, время, преподавателя, имя и телефон.',
        },
        { status: 400 }
      );
    }

    const result = await createStudentBooking({
      date,
      time,
      teacher,
      course: course || 'Консультация / Урок',
      studentName,
      phone,
      format: format || 'Офлайн',
      studyType: studyType || 'Групповое',
      comment: comment || '',
      skipScheduleCheck: Boolean(skipScheduleCheck),
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /bookings POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при сохранении записи в Google Таблицу.',
      },
      { status: 500 }
    );
  }
}

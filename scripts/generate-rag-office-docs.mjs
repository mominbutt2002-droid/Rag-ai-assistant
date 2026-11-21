import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

const ragDir = path.join(process.cwd(), 'data', 'rag');

/**
 * Convert markdown text into a clean formatted .docx file
 */
async function markdownToDocx(mdPath, docxPath) {
  const raw = fs.readFileSync(mdPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const children = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') {
      children.push(new Paragraph({ text: '' }));
      continue;
    }

    if (trimmed.startsWith('# ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^#\s+/, ''),
          heading: HeadingLevel.HEADING_1,
        })
      );
    } else if (trimmed.startsWith('## ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^##\s+/, ''),
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (trimmed.startsWith('### ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^###\s+/, ''),
          heading: HeadingLevel.HEADING_3,
        })
      );
    } else {
      // Preserve clean readable text (strip markdown bold/italic markers for clean Word doc)
      const cleanLine = trimmed.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      children.push(
        new Paragraph({
          children: [new TextRun(cleanLine)],
        })
      );
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log(`Generated: ${docxPath}`);
}

/**
 * Generate structured Excel workbook for Teachers Schedule & Campus Contacts
 */
function generateScheduleExcel(xlsxPath) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Расписание преподавателей
  const teachersRows = [
    ['Преподаватель', 'Должность / Специализация', 'День недели', 'Время работы', 'Формат / Группы'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Понедельник', '14:00 – 20:30', 'Очные группы Python & RAG'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Вторник', 'Выходной / Методический день', '-'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Среда', '14:00 – 20:30', 'Очные группы + код-ревью'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Четверг', 'Выходной / Методический день', '-'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Пятница', '14:00 – 20:30', 'Практика разработки ботов'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Суббота', '10:00 – 16:00', 'Консультации, хакатоны, проекты'],
    ['Шерзод Мирзаев', 'Ведущий ментор по ИИ (Python, RAG, Gemini API)', 'Воскресенье', 'Выходной', '-'],

    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Понедельник', 'Выходной', '-'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Вторник', '10:00 – 18:00', 'SAT Math и разбор задач'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Среда', 'Выходной', '-'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Четверг', '10:00 – 18:00', 'SAT Math Intensive + Desmos'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Пятница', 'Выходной', '-'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Суббота', '09:30 – 15:30', 'Олимпиадная математика (7–9 кл.)'],
    ['Елена Воронова', 'Старший преподаватель математики (к.ф.-м.н., SAT Math, Олимпиады)', 'Воскресенье', '09:30 – 15:30', 'Олимпиадная математика (10–11 кл.)'],

    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Понедельник', '11:00 – 19:30', 'IELTS: Listening & Reading'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Вторник', '11:00 – 19:30', 'IELTS: Academic Writing Task 1 & 2'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Среда', 'Выходной', '-'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Четверг', '11:00 – 19:30', 'English for IT: тех. собеседования'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Пятница', '11:00 – 19:30', 'Speaking Intensive с носителями'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Суббота', '12:00 – 17:00', 'Еженедельный Mock Exam'],
    ['Джеймс Картер (James Carter)', 'IELTS Lead Trainer (Cambridge CELTA/DELTA, Band 9.0)', 'Воскресенье', 'Выходной', '-'],

    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Понедельник', 'Выходной', '-'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Вторник', 'Выходной', '-'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Среда', '10:00 – 19:00', 'Frontend: React 19, Next.js, AI UI'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Четверг', 'Выходной', '-'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Пятница', '10:00 – 19:00', 'Backend: Node.js, PostgreSQL, API'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Суббота', 'Выходной', '-'],
    ['Азиза Каримова', 'Full-Stack Developer & UI/UX (React 19, TypeScript, Node.js)', 'Воскресенье', '11:00 – 17:00', 'Менторинг и защита портфолио'],
  ];

  const wsTeachers = XLSX.utils.aoa_to_sheet(teachersRows);
  wsTeachers['!cols'] = [{ wch: 28 }, { wch: 52 }, { wch: 16 }, { wch: 26 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(wb, wsTeachers, 'Расписание преподавателей');

  // Sheet 2: График центра и контакты
  const contactsRows = [
    ['Параметр', 'Значение'],
    ['График работы кампуса (Пн–Сб)', '08:30 – 21:00 (без перерыва на обед)'],
    ['График работы кампуса (Вс)', '09:00 – 18:00'],
    ['Прием директора центра', 'Вторник и Четверг: 16:00 – 18:30 (по записи)'],
    ['Прием завуча (академический директор)', 'Вторник – Суббота: 14:00 – 17:00'],
    ['Адрес кампуса', 'г. Ташкент, Юнусабадский р-н, пр. Амира Темура, 108А (метро Бадамзар, БЦ EduHub, 3 этаж)'],
    ['Телефон единого колл-центра', '+998 (71) 200-55-44'],
    ['Телефон отдела записи', '+998 (90) 876-54-32'],
    ['Telegram администратора', '@eduai_academy_admin (https://t.me/eduai_academy_admin)'],
    ['Telegram канал', '@eduai_academy_uz'],
    ['Instagram', '@eduai.academy'],
    ['Email', 'info@eduai-academy.uz'],
  ];

  const wsContacts = XLSX.utils.aoa_to_sheet(contactsRows);
  wsContacts['!cols'] = [{ wch: 38 }, { wch: 75 }];
  XLSX.utils.book_append_sheet(wb, wsContacts, 'Контакты и график');

  XLSX.writeFile(wb, xlsxPath);
  console.log(`Generated: ${xlsxPath}`);
}

async function main() {
  await markdownToDocx(path.join(ragDir, 'price_list.md'), path.join(ragDir, 'price_list.docx'));
  await markdownToDocx(path.join(ragDir, 'faq.md'), path.join(ragDir, 'faq.docx'));
  generateScheduleExcel(path.join(ragDir, 'schedule.xlsx'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

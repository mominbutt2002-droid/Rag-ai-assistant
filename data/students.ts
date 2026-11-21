import { Student } from '@/types';

export const studentsData: Student[] = [
  {
    id: 'student-1',
    name: {
      ru: 'Жавохир Рустамов',
      en: 'Javokhir Rustamov',
      uz: 'Javohir Rustamov',
    },
    course: {
      ru: 'Python & AI Assistant Engineering',
      en: 'Python & AI Assistant Engineering',
      uz: 'Python & AI Assistant Engineering',
    },
    score: 'AI Engineer Offer',
    badge: {
      ru: 'Грант $120,000 & Job Offer',
      en: '$120,000 Grant & Job Offer',
      uz: '$120,000 Grant & Ish taklifi',
    },
    result: {
      ru: 'Разработал RAG-ассистента для автоматизации юридических запросов и получил оффер в международную компанию в 19 лет.',
      en: 'Engineered a legal AI assistant utilizing RAG and secured a remote Junior AI engineer offer at 19.',
      uz: 'Yuridik soha uchun RAG-assistent yaratdi va 19 yoshida xalqaro IT kompaniyadan ish taklifini qo\'lga kiritdi.',
    },
    quote: {
      ru: '«Менторы EduAI дали не просто код, а понимание архитектуры современных нейросетей. Этот курс полностью изменил мою карьеру!»',
      en: '"EduAI mentors provided architectural mastery rather than rote coding. It completely accelerated my engineering career!"',
      uz: '"EduAI ustozlari faqat kod emas, balki zamonaviy neyrotarmoqlar arxitekturasini tushunishni o\'rgatishdi. Bu butun hayotimni o\'zgartirdi!"',
    },
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    universityOrJob: {
      ru: 'AI Labs (Remote) & Inha University Tashkent',
      en: 'AI Labs (Remote) & Inha University Tashkent',
      uz: 'AI Labs (Remote) & Toshkent shahridagi Inha universiteti',
    }
  },
  {
    id: 'student-2',
    name: {
      ru: 'Мадина Салимова',
      en: 'Madina Salimova',
      uz: 'Madina Salimova',
    },
    course: {
      ru: 'IELTS Intensive 7.5+ & Academic English',
      en: 'IELTS Intensive 7.5+ & Academic English',
      uz: 'IELTS Intensive 7.5+ & Academic English',
    },
    score: 'IELTS Band 8.5',
    badge: {
      ru: '100% Грант в University of Bristol (UK)',
      en: '100% Scholarship at Bristol (UK)',
      uz: 'Bristol Universitetida 100% Grant (Buyuk Britaniya)',
    },
    result: {
      ru: 'Listening: 9.0, Reading: 9.0, Writing: 8.0, Speaking: 8.0. Поступила на бакалавриат в Великобританию с полной стипендией.',
      en: 'Listening: 9.0, Reading: 9.0, Writing: 8.0, Speaking: 8.0. Admitted to top UK university on a full ride.',
      uz: 'Listening: 9.0, Reading: 9.0, Writing: 8.0, Speaking: 8.0. Buyuk Britaniya nufuzli oliygohiga to\'liq grant asosida qabul qilindi.',
    },
    quote: {
      ru: '«За 3 месяца интенсивных тренировок с Джеймсом и ИИ-симулятором я преодолела планку 8.0 без стресса!»',
      en: '"Three months of targeted drills with James and the AI speech feedback engine took me straight to an 8.5 with zero exam fear!"',
      uz: '"Jeyms va AI nutq trenajyori bilan 3 oylik intensiv tayyorgarlik meni hech qanday qiyinchiliksiz 8.5 ballga olib chiqdi!"',
    },
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    universityOrJob: {
      ru: 'University of Bristol (Computer Science)',
      en: 'University of Bristol (Computer Science)',
      uz: 'Bristol Universiteti (Computer Science)',
    }
  },
  {
    id: 'student-3',
    name: {
      ru: 'Сардор Алимов',
      en: 'Sardor Alimov',
      uz: 'Sardor Alimov',
    },
    course: {
      ru: 'Олимпиадная математика & SAT Math',
      en: 'Olympiad Math & SAT Math',
      uz: 'Olimpiada matematikasi & SAT Math',
    },
    score: 'SAT 1550 (Math 800)',
    badge: {
      ru: 'Золотая медаль Жаутыковской олимпиады',
      en: 'Gold Medal at Zhautykov Olympiad',
      uz: 'Jautikov olimpiadasi oltin medali',
    },
    result: {
      ru: 'Идеальный результат по математике 800 из 800. Золотая медаль на Международной олимпиаде и приглашение в KAIST.',
      en: 'Flawless 800 / 800 SAT Math score. Gold medal in International Olympiad and presidential scholarship at KAIST.',
      uz: 'Matematikadan maksimal 800/800 ball. Xalqaro olimpiada oltin medali va KAIST universitetiga prezident granti.',
    },
    quote: {
      ru: '«Методика разбора задач Елены Вороновой уникальна. Ты перестаешь заучивать формулы и начинаешь видеть структуру решений.»',
      en: '"Elena Voronova\'s analytical methodology is unmatched. You stop memorizing theorems and start seeing deep mathematical elegance."',
      uz: '"Yelena Voronovaning tahlil uslubi aqlbovar qilmas. Formulalarni yodlamasdan, har qanday yechimning go\'zalligini ko\'rishni o\'rganasiz."',
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    universityOrJob: {
      ru: 'KAIST (Южная Корея, Полный грант)',
      en: 'KAIST (South Korea, Full Fellowship)',
      uz: 'KAIST (Janubiy Koreya, To\'liq grant)',
    }
  },
  {
    id: 'student-4',
    name: {
      ru: 'Диёра Ходжаева',
      en: 'Diyora Khodjaeva',
      uz: 'Diyora Xo\'jayeva',
    },
    course: {
      ru: 'Full-Stack Web & AI UI Integration',
      en: 'Full-Stack Web & AI UI Integration',
      uz: 'Full-Stack Web & AI UI Integration',
    },
    score: 'Frontend Developer',
    badge: {
      ru: 'Победительница хакатона Technovation',
      en: 'Technovation Hackathon Champion',
      uz: 'Technovation xakaton g\'olibi',
    },
    result: {
      ru: 'Создала интерактивную веб-платформу для изучения языков с ИИ и заняла 1-е место на республиканском соревновании стартапов.',
      en: 'Built an interactive language learning SaaS with AI integration and won 1st prize at national innovation challenge.',
      uz: 'AI asosidagi interaktiv til o\'rganish veb-platformasini yaratib, respublika startap tanlovida 1-o\'rinni egalladi.',
    },
    quote: {
      ru: '«На курсе Азизы я собрала продакшн-проект, который сразу пошел в резюме. Через неделю после выпуска получила первый контракт!»',
      en: '"Under Aziza\'s mentorship, I shipped a production web app that instantly bolstered my portfolio and signed my first contract right away!"',
      uz: '"Azizaning darslarida rezyumeimga qo\'sha oladigan haqiqiy loyiha yaratdim va kursni bitirgach darhol ilk shartnomamga ega bo\'ldim!"',
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    universityOrJob: {
      ru: 'FinTech Startup & New Uzbekistan University',
      en: 'FinTech Startup & New Uzbekistan University',
      uz: 'FinTech Startap & Yangi O\'zbekiston Universiteti',
    }
  }
];

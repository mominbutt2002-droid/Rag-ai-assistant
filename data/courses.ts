import { Course } from '@/types';

export const coursesData: Course[] = [
  // --- MATHEMATICS ---
  {
    id: 'math-olympiad',
    category: 'math',
    popular: true,
    title: {
      ru: 'Олимпиадная математика и логика',
      en: 'Olympiad Mathematics & Logic',
      uz: 'Olimpiada matematikasi va mantiq',
    },
    badge: {
      ru: 'Топ олимпиады',
      en: 'Olympiad Track',
      uz: 'Olimpiada yo\'nalishi',
    },
    description: {
      ru: 'Углубленная теория чисел, комбинаторика, эвристические методы и нестандартные задачи для побед на республиканских и международных олимпиадах.',
      en: 'Advanced number theory, combinatorics, and non-standard problem-solving strategies for winning national and international competitions.',
      uz: 'Respublika va xalqaro olimpiadalarda g\'alaba qozonish uchun sonlar nazariyasi, kombinatorika va noodatiy masalalar yechish uslublari.',
    },
    duration: {
      ru: '9 месяцев',
      en: '9 months',
      uz: '9 oy',
    },
    level: {
      ru: 'Продвинутый (7-11 классы)',
      en: 'Advanced (Grades 7-11)',
      uz: 'Ilg\'or (7-11 sinflar)',
    },
    lessonsPerWeek: 3,
    price: {
      ru: '950 000 сум / мес',
      en: '950,000 UZS / mo',
      uz: '950 000 so\'m / oy',
    },
    topics: {
      ru: [
        'Эвристика и теория графов',
        'Модульная арифметика и диофантовы уравнения',
        'Геометрия повышенной сложности',
        'Разбор задач IMO, Kangaroo и олимпиад СНГ'
      ],
      en: [
        'Heuristics and Graph Theory',
        'Modular arithmetic and Diophantine equations',
        'Advanced Euclidean geometry',
        'Analysis of IMO, Kangaroo, and regional contests'
      ],
      uz: [
        'Evristika va graflar nazariyasi',
        'Modulli arifmetika va diofant tenglamalari',
        'Yuqori murakkablikdagi geometriya',
        'IMO, Kenguru va xalqaro masalalar tahlili'
      ]
    },
    icon: 'Calculator',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'math-sat',
    category: 'math',
    title: {
      ru: 'SAT Math & Высшая математика',
      en: 'SAT Math & Higher Mathematics',
      uz: 'SAT Math va Oliy matematika',
    },
    badge: {
      ru: 'Поступление в вузы',
      en: 'University Prep',
      uz: 'OTMga tayyorgarlik',
    },
    description: {
      ru: 'Целенаправленная подготовка к идеальному результату 750-800 баллов в секции SAT Math, алгебра, математический анализ и линейная алгебра для первокурсников.',
      en: 'Targeted coaching to score 750-800 on SAT Math, plus university-level calculus, algebra, and linear algebra fundamentals.',
      uz: 'SAT Math bo\'limidan 750-800 ball olishga qaratilgan intensiv tayyorgarlik, algebra va oliy matematika asoslari.',
    },
    duration: {
      ru: '6 месяцев',
      en: '6 months',
      uz: '6 oy',
    },
    level: {
      ru: 'Средний / Выше среднего',
      en: 'Intermediate / Upper',
      uz: 'O\'rta / Yuqori',
    },
    lessonsPerWeek: 3,
    price: {
      ru: '890 000 сум / мес',
      en: '890,000 UZS / mo',
      uz: '890 000 so\'m / oy',
    },
    topics: {
      ru: [
        'Heart of Algebra & Passport to Advanced Math',
        'Анализ данных, статистика и тригонометрия',
        'Работа с графическим калькулятором Desmos',
        'Еженедельные полные пробные тесты с разбором'
      ],
      en: [
        'Heart of Algebra & Passport to Advanced Math',
        'Data analysis, statistics, and trigonometry',
        'Desmos digital graphing calculator mastery',
        'Weekly full-length mock exams with breakdown'
      ],
      uz: [
        'Algebra asoslari va ilg\'or matematika',
        'Ma\'lumotlar tahlili, statistika va trigonometriya',
        'Desmos raqamli kalkulyatorida professional ishlash',
        'Haftalik to\'liq sinov testlari va xatolar ustida ishlash'
      ]
    },
    icon: 'Sigma',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80'
  },

  // --- ENGLISH ---
  {
    id: 'english-ielts',
    category: 'english',
    popular: true,
    title: {
      ru: 'IELTS Intensive 7.5+ & Academic English',
      en: 'IELTS Intensive 7.5+ & Academic English',
      uz: 'IELTS Intensive 7.5+ va Akademik ingliz tili',
    },
    badge: {
      ru: 'Гарантия 7.0+',
      en: '7.0+ Guarantee',
      uz: '7.0+ Kafolati',
    },
    description: {
      ru: 'Интенсивный практикум по всем 4 навыкам (Listening, Reading, Writing Task 1/2, Speaking) с регулярными mock-экзаменами от сертифицированных экзаменаторов.',
      en: 'Rigorous coaching covering all 4 modules (Listening, Reading, Writing Task 1/2, Speaking) featuring full mock tests evaluated by certified examiners.',
      uz: 'Barcha 4 ko\'nikma (Listening, Reading, Writing, Speaking) bo\'yicha intensiv amaliyot va xalqaro imtihonchilar tomonidan muntazam mock-testlar.',
    },
    duration: {
      ru: '4 месяца',
      en: '4 months',
      uz: '4 oy',
    },
    level: {
      ru: 'B1+ до C1',
      en: 'B1+ to C1',
      uz: 'B1+ dan C1 gacha',
    },
    lessonsPerWeek: 3,
    price: {
      ru: '850 000 сум / мес',
      en: '850,000 UZS / mo',
      uz: '850 000 so\'m / oy',
    },
    topics: {
      ru: [
        'Academic Writing Task 1 & 2: шаблоны, лексика Band 8+',
        'Speaking Club с носителями языка и ИИ-тренажером',
        'Скорочтение и разбор сложных научных текстов',
        'Анализ и устранение индивидуальных ошибок'
      ],
      en: [
        'Academic Writing Task 1 & 2: high-scoring templates & Band 8+ lexicon',
        'Speaking club with native speakers and AI speech coach',
        'Speed reading strategies for intricate academic articles',
        'Individual error analysis and personal coaching'
      ],
      uz: [
        'Academic Writing Task 1 & 2: shablonlar va Band 8+ so\'z boyligi',
        'Ona tili sohiblari va AI talaffuz murabbiyi bilan Speaking klub',
        'Murakkab ilmiy matnlarni tez o\'qish va tushunish texnikalari',
        'Shaxsiy xatolar tahlili va individual tavsiyalar'
      ]
    },
    icon: 'Languages',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'english-tech',
    category: 'english',
    title: {
      ru: 'English for IT & AI Engineers',
      en: 'English for IT & AI Engineers',
      uz: 'IT va AI muhandislari uchun ingliz tili',
    },
    badge: {
      ru: 'Для разработчиков',
      en: 'For Tech Talent',
      uz: 'Dasturchilar uchun',
    },
    description: {
      ru: 'Специализированный курс английского для прохождения технических собеседований в зарубежные компании, написания документации и питчинга стартапов.',
      en: 'Specialized language program focused on passing technical interviews at international companies, reading documentation, and pitching projects.',
      uz: 'Xorijiy kompaniyalarga texnik intervyudan o\'tish, dasturiy hujjatlarni o\'qish va loyihalarni taqdim etish uchun maxsus ingliz tili.',
    },
    duration: {
      ru: '3 месяца',
      en: '3 months',
      uz: '3 oy',
    },
    level: {
      ru: 'Intermediate (B1)',
      en: 'Intermediate (B1)',
      uz: 'O\'rta (B1)',
    },
    lessonsPerWeek: 2,
    price: {
      ru: '790 000 сум / мес',
      en: '790,000 UZS / mo',
      uz: '790 000 so\'m / oy',
    },
    topics: {
      ru: [
        'Симуляция англоязычных технических собеседований',
        'Ведение переписки в GitHub, Slack, Jira',
        'Презентация архитектуры ПО и демонстрация демо',
        'Промпт-инжиниринг на чистом академическом английском'
      ],
      en: [
        'Live simulation of tech interviews with engineers',
        'Professional communications in GitHub, Slack, Jira',
        'Software architecture presentations and product demos',
        'Prompt engineering in nuanced English'
      ],
      uz: [
        'Ingliz tilidagi texnik intervyu simulyatsiyasi',
        'GitHub, Slack, Jira da professional yozishmalar',
        'Dasturiy arxitektura taqdimoti va loyiha demosi',
        'Aniq va sifatli ingliz tilida prompt yozish san\'ati'
      ]
    },
    icon: 'MessageSquareCode',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },

  // --- COMPUTER SCIENCE & AI ---
  {
    id: 'cs-ai-assistant',
    category: 'cs',
    popular: true,
    title: {
      ru: 'Python, RAG & Разработка ИИ-Ассистентов',
      en: 'Python, RAG & AI Assistant Engineering',
      uz: 'Python, RAG va AI Assistentlar yaratish',
    },
    badge: {
      ru: 'Флагманский курс 2026',
      en: 'Flagship 2026',
      uz: 'Flagman kurs 2026',
    },
    description: {
      ru: 'От основ Python и ООП до интеграции LLM (Google Gemini, OpenAI), построения RAG-систем с векторными базами данных и создания автономных ботов.',
      en: 'From Python essentials and OOP to advanced LLM integration (Google Gemini, OpenAI), vector database RAG architectures, and autonomous AI agents.',
      uz: 'Python va OOP asoslaridan boshlab LLM modellarini (Google Gemini, OpenAI) integratsiya qilish, vektorli ma\'lumotlar bazasida RAG tizimlari va avtonom botlar yaratish.',
    },
    duration: {
      ru: '6 месяцев',
      en: '6 months',
      uz: '6 oy',
    },
    level: {
      ru: 'С нуля до Junior / Middle',
      en: 'From Zero to Junior/Middle',
      uz: 'Noldan Junior/Middle gacha',
    },
    lessonsPerWeek: 3,
    price: {
      ru: '1 200 000 сум / мес',
      en: '1,200,000 UZS / mo',
      uz: '1 200 000 so\'m / oy',
    },
    topics: {
      ru: [
        'Python Core: алгоритмы, ООП, асинхронность (asyncio)',
        'Интеграция Google Gemini API, Function Calling & Structured Outputs',
        'Векторные базы данных ChromaDB / FAISS и RAG поиск',
        'Деплой готовых ИИ-ассистентов в Telegram и веб'
      ],
      en: [
        'Python Core: algorithms, OOP, asynchronous programming',
        'Google Gemini API integration, Function Calling & Structured Outputs',
        'ChromaDB / FAISS vector stores & enterprise RAG pipelines',
        'Production deployment of AI bots to Web and Telegram'
      ],
      uz: [
        'Python Core: algoritmlar, OOP, asinxron dasturlash',
        'Google Gemini API, Function Calling va tuzilmaviy javoblar',
        'ChromaDB / FAISS vektorli bazalar va RAG qidiruv tizimi',
        'Tayyor AI assistentlarni veb va Telegramga joylashtirish'
      ]
    },
    icon: 'Bot',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cs-web-fullstack',
    category: 'cs',
    title: {
      ru: 'Full-Stack Web: React, Node & AI UI',
      en: 'Full-Stack Web: React, Node & AI UI',
      uz: 'Full-Stack Web: React, Node va AI interfeyslar',
    },
    badge: {
      ru: 'Трудоустройство',
      en: 'Career Ready',
      uz: 'Karyeraga tayyor',
    },
    description: {
      ru: 'Создание современных веб-приложений с нуля: TypeScript, React, Tailwind CSS, Node.js бэкенд и интеграция генеративного UI и стриминга ответов ИИ.',
      en: 'Building full-stack web applications: TypeScript, React, Tailwind CSS, Node.js backend, and streaming generative AI user interfaces.',
      uz: 'Zamonaviy veb-ilovalarni noldan yaratish: TypeScript, React, Tailwind CSS, Node.js bekendi hamda generativ AI interfeyslarini ulash.',
    },
    duration: {
      ru: '7 месяцев',
      en: '7 months',
      uz: '7 oy',
    },
    level: {
      ru: 'Для начинающих и продолжающих',
      en: 'Beginner to Intermediate',
      uz: 'Boshlovchilar va davom ettiruvchilar uchun',
    },
    lessonsPerWeek: 3,
    price: {
      ru: '1 050 000 сум / мес',
      en: '1,050,000 UZS / mo',
      uz: '1 050 000 so\'m / oy',
    },
    topics: {
      ru: [
        'HTML5, Tailwind CSS и адаптивный UI дизайн',
        'React 19, Хуки, State Management и роутинг',
        'Node.js REST API, PostgreSQL и авторизация JWT',
        'Интеграция ИИ виджетов и чат-интерфейсов'
      ],
      en: [
        'HTML5, Tailwind CSS, and responsive UI design',
        'React 19, Hooks, State Management, and client routing',
        'Node.js REST API, PostgreSQL, and JWT auth',
        'Integration of interactive AI widgets and streaming chat'
      ],
      uz: [
        'HTML5, Tailwind CSS va moslashuvchan UI dizayn',
        'React 19, Huklar, State Management va marshrutlash',
        'Node.js REST API, PostgreSQL va JWT xavfsiz autentifikatsiya',
        'Interaktiv AI vidjetlari va oqimli chatlarni ulash'
      ]
    },
    icon: 'Code2',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  }
];

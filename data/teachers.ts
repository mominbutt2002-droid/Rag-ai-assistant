import { Teacher } from '@/types';

export const teachersData: Teacher[] = [
  {
    id: 'teacher-sherzod',
    name: {
      ru: 'Шерзод Мирзаев',
      en: 'Sherzod Mirzaev',
      uz: 'Sherzod Mirzayev',
    },
    role: {
      ru: 'Ведущий ментор по ИИ & Lead Software Architect',
      en: 'Lead AI Mentor & Software Architect',
      uz: 'Bosh AI mentori va Dasturiy arxitektor',
    },
    subject: {
      ru: 'Python, LLM, RAG & ИИ-Ассистенты',
      en: 'Python, LLMs, RAG & AI Assistants',
      uz: 'Python, LLM, RAG va AI Assistentlar',
    },
    experience: {
      ru: '8 лет в разработке (Ex-EPAM, AI Startup Founder)',
      en: '8 years in Tech (Ex-EPAM, AI Startup Founder)',
      uz: '8 yillik IT tajriba (Ex-EPAM, AI startap asoschisi)',
    },
    workingHours: {
      ru: 'Пн, Ср, Пт: 14:00 – 20:30 | Сб: 10:00 – 16:00',
      en: 'Mon, Wed, Fri: 14:00 – 20:30 | Sat: 10:00 – 16:00',
      uz: 'Dush, Chor, Juma: 14:00 – 20:30 | Shan: 10:00 – 16:00',
    },
    achievements: {
      ru: [
        'Автор 3 корпоративных RAG-систем для телеком-сектора',
        'Спикер Google Developer Group (GDG) Tashkent',
        'Подготовил более 280 Junior/Middle инженеров',
        'Призер Central Asia AI Hackathon 2024'
      ],
      en: [
        'Architected 3 enterprise RAG solutions for telecom industry',
        'Frequent keynote speaker at Google Developer Group (GDG)',
        'Mentored 280+ junior and middle software engineers',
        'Award winner at Central Asia AI Hackathon 2024'
      ],
      uz: [
        'Telekom sohasi uchun 3 ta korporativ RAG tizimi muallifi',
        'Google Developer Group (GDG) Toshkent spikeri',
        '280 dan ortiq Junior/Middle muhandislarni tayyorlagan',
        'Central Asia AI Hackathon 2024 sovrindori'
      ]
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    rating: 4.98,
    studentsCount: 340,
  },
  {
    id: 'teacher-elena',
    name: {
      ru: 'Елена Воронова',
      en: 'Elena Voronova',
      uz: 'Yelena Voronova',
    },
    role: {
      ru: 'Старший преподаватель олимпиадной математики',
      en: 'Senior Olympiad Mathematics Coach',
      uz: 'Olimpiada matematikasi bo\'yicha katta ustoz',
    },
    subject: {
      ru: 'Олимпиадная математика & SAT Math',
      en: 'Olympiad Math & SAT Math',
      uz: 'Olimpiada matematikasi va SAT Math',
    },
    experience: {
      ru: '12 лет педагогического стажа, к.ф.-м.н.',
      en: '12 years teaching experience, Ph.D. in Math',
      uz: '12 yillik pedagogik tajriba, fizika-matematika fanlari nomzodi',
    },
    workingHours: {
      ru: 'Вт, Чт: 10:00 – 18:00 | Сб, Вс: 09:30 – 15:30',
      en: 'Tue, Thu: 10:00 – 18:00 | Sat, Sun: 09:30 – 15:30',
      uz: 'Sesh, Pay: 10:00 – 18:00 | Shan, Yak: 09:30 – 15:30',
    },
    achievements: {
      ru: [
        'Подготовила 14 призеров Республиканских олимпиад',
        'Средний балл выпускников по SAT Math — 765 из 800',
        'Автор методического пособия «Нестандартная геометрия»',
        'Почетная грамота Министерства высшего образования'
      ],
      en: [
        'Trained 14 national Olympiad medalists',
        'Average student SAT Math score: 765 / 800',
        'Author of best-selling handbook "Non-standard Geometry"',
        'Recognized with National Educator Excellence Award'
      ],
      uz: [
        '14 nafar Respublika olimpiadasi sovrindorlarini yetishtirgan',
        'O\'quvchilarining SAT Math bo\'yicha o\'rtacha bali — 765/800',
        '«Noodatiy geometriya» uslubiy qo\'llanmasi muallifi',
        'Oliy ta\'lim vazirligi faxriy yorlig\'i sohibasi'
      ]
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    rating: 4.96,
    studentsCount: 420,
  },
  {
    id: 'teacher-james',
    name: {
      ru: 'Джеймс Картер',
      en: 'James Carter',
      uz: 'Jeyms Karter',
    },
    role: {
      ru: 'IELTS Lead Trainer & Cambridge Certified (CELTA/DELTA)',
      en: 'IELTS Lead Trainer & Cambridge CELTA/DELTA Coach',
      uz: 'IELTS yetakchi murabbiyi & Cambridge CELTA/DELTA',
    },
    subject: {
      ru: 'IELTS 7.5+, Academic English & Tech Communications',
      en: 'IELTS 7.5+, Academic English & Tech Communications',
      uz: 'IELTS 7.5+, Akademik ingliz tili va Tech Communications',
    },
    experience: {
      ru: '9 лет в сфере международного преподавания (UK/Uzbekistan)',
      en: '9 years international teaching (UK/Uzbekistan)',
      uz: '9 yillik xalqaro ta\'lim tajribasi (Buyuk Britaniya / O\'zbekiston)',
    },
    workingHours: {
      ru: 'Пн, Вт, Чт, Пт: 11:00 – 19:30 | Сб: 12:00 – 17:00',
      en: 'Mon, Tue, Thu, Fri: 11:00 – 19:30 | Sat: 12:00 – 17:00',
      uz: 'Dush, Sesh, Pay, Juma: 11:00 – 19:30 | Shan: 12:00 – 17:00',
    },
    achievements: {
      ru: [
        'Личный результат IELTS Academic — Band 9.0',
        'Свыше 70 учеников сдали экзамен на 8.0 и 8.5',
        'Официальный консультант по академическому эссе',
        'Специалист по преодолению языкового барьера за 6 недель'
      ],
      en: [
        'Personal IELTS Academic score: Band 9.0',
        'Over 70 students achieved overall scores of 8.0 and 8.5',
        'Advisor for top-tier university application essays',
        'Pioneered rapid fluency immersion methods for engineers'
      ],
      uz: [
        'Shaxsiy IELTS Academic natijasi — Band 9.0',
        '70 dan ortiq shogirdlari 8.0 va 8.5 ball to\'plagan',
        'Nufuzli universitetlar uchun motivatsion insholar bo\'yicha ekspert',
        'Muhandislar uchun 6 haftalik nutqni ravonlashtirish uslubchisi'
      ]
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    rating: 4.99,
    studentsCount: 510,
  },
  {
    id: 'teacher-aziza',
    name: {
      ru: 'Азиза Каримова',
      en: 'Aziza Karimova',
      uz: 'Aziza Karimova',
    },
    role: {
      ru: 'Full-Stack Developer & UI/UX инженер',
      en: 'Full-Stack Developer & UI/UX Engineer',
      uz: 'Full-Stack dasturchi & UI/UX muhandisi',
    },
    subject: {
      ru: 'Frontend (React/TypeScript) & Интеграция веб-ИИ',
      en: 'Frontend (React/TypeScript) & AI Web Integrations',
      uz: 'Frontend (React/TypeScript) va veb-AI integratsiyasi',
    },
    experience: {
      ru: '6 лет в продуктовой разработке (FinTech & EdTech)',
      en: '6 years product engineering (FinTech & EdTech)',
      uz: '6 yillik mahsulot ishlab chiqish tajribasi (FinTech & EdTech)',
    },
    workingHours: {
      ru: 'Ср, Пт: 10:00 – 19:00 | Вс: 11:00 – 17:00',
      en: 'Wed, Fri: 10:00 – 19:00 | Sun: 11:00 – 17:00',
      uz: 'Chor, Juma: 10:00 – 19:00 | Yak: 11:00 – 17:00',
    },
    achievements: {
      ru: [
        'Разработчик дизайн-систем для 5+ коммерческих платформ',
        'Ментор программы «Women in Tech Central Asia»',
        '100% выпускников защищают полноценный дипломный Full-stack проект'
      ],
      en: [
        'Built enterprise design systems for 5+ digital platforms',
        'Mentor for "Women in Tech Central Asia" initiative',
        '100% of students launch a full-stack portfolio app'
      ],
      uz: [
        '5 dan ortiq yirik raqamli platformalar dizayn tizimi yaratuvchisi',
        '«Women in Tech Central Asia» loyihasi mentori',
        'O\'quvchilarining 100 foizi to\'laqonli Full-stack portfolio loyihasini himoya qiladi'
      ]
    },
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    studentsCount: 220,
  }
];

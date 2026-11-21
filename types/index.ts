export type Language = 'ru' | 'en' | 'uz';

export type CourseCategory = 'all' | 'math' | 'english' | 'cs';

export interface Course {
  id: string;
  category: 'math' | 'english' | 'cs';
  title: Record<Language, string>;
  description: Record<Language, string>;
  badge: Record<Language, string>;
  duration: Record<Language, string>;
  level: Record<Language, string>;
  lessonsPerWeek: number;
  price: Record<Language, string>;
  topics: Record<Language, string[]>;
  icon: string;
  image: string;
  popular?: boolean;
}

export interface Teacher {
  id: string;
  name: Record<Language, string>;
  role: Record<Language, string>;
  subject: Record<Language, string>;
  experience: Record<Language, string>;
  workingHours: Record<Language, string>;
  achievements: Record<Language, string[]>;
  image: string;
  rating: number;
  studentsCount: number;
}

export interface Student {
  id: string;
  name: Record<Language, string>;
  course: Record<Language, string>;
  score: string;
  result: Record<Language, string>;
  quote: Record<Language, string>;
  image: string;
  badge: Record<Language, string>;
  universityOrJob: Record<Language, string>;
}

export interface LessonBookingFormData {
  studentName: string;
  phone: string;
  courseId: string;
  format: 'offline' | 'online';
  preferredTime: string;
  notes?: string;
}

export interface AdminBookingFormData {
  fullName: string;
  phone: string;
  targetRole: 'director' | 'academic_head' | 'admissions';
  reason: 'general' | 'curriculum' | 'scholarship' | 'feedback';
  preferredDate: string;
  preferredTimeSlot: string;
  comments?: string;
}

export interface RetrievedChunkInfo {
  id: string;
  source: string;
  title: string;
  similarityPercent?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  ragSources?: string[];
  retrievedChunks?: RetrievedChunkInfo[];
  embeddingModel?: string;
  isFallback?: boolean;
}

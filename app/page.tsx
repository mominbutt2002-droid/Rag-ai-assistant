"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { CoursesSection } from '@/components/home/CoursesSection';
import { TeachersSection } from '@/components/home/TeachersSection';
import { AboutUs } from '@/components/home/AboutUs';
import { BookingSection } from '@/components/home/BookingSection';
import { ContactsSection } from '@/components/home/ContactsSection';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/ai/ChatWidget';

export default function HomePage() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState<string | undefined>(undefined);

  const toggleAiChat = () => {
    setAiChatOpen((prev) => !prev);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseForBooking(courseId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sticky Header with Navigation, Language & Theme Switchers */}
      <Header onOpenAiChat={() => setAiChatOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Block + Best Students Honor Roll */}
        <Hero onOpenAiChat={() => setAiChatOpen(true)} />

        {/* 2. Courses Section: Math, English, Computer Science & AI */}
        <CoursesSection onSelectCourseForBooking={handleSelectCourse} />

        {/* 3. Teachers Section: Schedule, Office Hours & Key Achievements */}
        <TeachersSection />

        {/* 4. About Us & Academy Philosophy */}
        <AboutUs />

        {/* 5. Online Booking: Trial Lesson & Administration Meeting */}
        <BookingSection initialCourseId={selectedCourseForBooking} />

        {/* 6. Contacts, Operating Hours & Campus Map */}
        <ContactsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Gemini AI Assistant Widget */}
      <ChatWidget isOpen={aiChatOpen} onToggle={toggleAiChat} />
    </div>
  );
}

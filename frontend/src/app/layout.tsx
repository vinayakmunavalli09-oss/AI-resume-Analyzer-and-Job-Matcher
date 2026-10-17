import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CareerPath AI — AI Resume Analyzer & Fresher Job Matcher',
  description: 'AI-powered career guidance, transparent resume analysis, and entry-level job matching for students, fresh graduates, and MBA freshers in India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface text-ink antialiased">
        <AppProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

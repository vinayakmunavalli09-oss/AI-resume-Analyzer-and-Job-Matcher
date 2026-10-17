import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

export default function PageWrapper({
  children,
  className,
  maxWidth = '7xl',
}: PageWrapperProps) {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <main className={cn('min-h-[calc(100vh-4rem-12rem)] py-8 px-4 sm:px-6 lg:px-8 mx-auto w-full', maxWidthClass, className)}>
      {children}
    </main>
  );
}

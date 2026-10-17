import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-[3px]',
  }[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-gray-200 border-t-brand-500 animate-spin',
        sizeClass,
        className
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size="xl" />
      <p className="text-sm text-ink-muted">Loading…</p>
    </div>
  );
}

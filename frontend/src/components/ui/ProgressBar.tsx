import { cn, getScoreBgColor } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  colorByScore?: boolean;
  color?: string; // override color class
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  className,
  size = 'md',
  colorByScore = true,
  color,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const barColor = color ?? (colorByScore ? getScoreBgColor(clamped) : 'bg-brand-500');

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-ink-light">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-ink tabular-nums">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-gray-100 overflow-hidden',
          heightClass
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

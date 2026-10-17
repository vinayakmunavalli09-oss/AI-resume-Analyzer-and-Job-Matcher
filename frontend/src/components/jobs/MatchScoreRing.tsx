import React from 'react';
import { cn } from '@/lib/utils';

interface MatchScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreRing({
  score,
  size = 'md',
  showLabel = true,
  className,
}: MatchScoreRingProps) {
  const rounded = Math.round(Math.min(100, Math.max(0, score)));

  const sizeMap = {
    sm: { diameter: 44, strokeWidth: 4, textSize: 'text-xs font-bold' },
    md: { diameter: 64, strokeWidth: 5, textSize: 'text-sm font-bold' },
    lg: { diameter: 96, strokeWidth: 7, textSize: 'text-xl font-extrabold' },
  }[size];

  const radius = (sizeMap.diameter - sizeMap.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#16a34a'; // green
    if (s >= 65) return '#3b5bdb'; // brand blue
    if (s >= 50) return '#d97706'; // amber
    return '#dc2626'; // red
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Strong Match';
    if (s >= 65) return 'Good Match';
    if (s >= 50) return 'Moderate Match';
    return 'Low Match';
  };

  const color = getColor(rounded);

  return (
    <div className={cn('inline-flex flex-col items-center justify-center gap-1', className)}>
      <div className="relative inline-flex items-center justify-center" style={{ width: sizeMap.diameter, height: sizeMap.diameter }}>
        <svg
          width={sizeMap.diameter}
          height={sizeMap.diameter}
          className="-rotate-90 transform"
        >
          <circle
            cx={sizeMap.diameter / 2}
            cy={sizeMap.diameter / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={sizeMap.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={sizeMap.diameter / 2}
            cy={sizeMap.diameter / 2}
            r={radius}
            stroke={color}
            strokeWidth={sizeMap.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(sizeMap.textSize, 'text-ink leading-none')}>
            {rounded}%
          </span>
        </div>
      </div>
      {showLabel && size !== 'sm' && (
        <span className="text-[11px] font-medium text-ink-muted leading-tight text-center">
          {getLabel(rounded)}
        </span>
      )}
    </div>
  );
}

export default MatchScoreRing;

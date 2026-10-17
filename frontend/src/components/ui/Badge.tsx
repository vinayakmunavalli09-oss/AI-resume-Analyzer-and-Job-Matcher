import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium text-xs px-2.5 py-0.5 border',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-ink-light border-gray-200',
        brand: 'bg-brand-50 text-brand-700 border-brand-100',
        accent: 'bg-accent-50 text-accent-700 border-accent-100',
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
        demo: 'bg-amber-100 text-amber-800 border-amber-300',
        matched: 'bg-green-50 text-green-700 border-green-200',
        missing: 'bg-red-50 text-red-700 border-red-200',
        preferred: 'bg-gray-50 text-gray-600 border-gray-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        outline: 'bg-transparent text-ink-light border-surface-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
);
Badge.displayName = 'Badge';

// Convenience: Demo Data badge
export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge variant="demo" className={cn('gap-1', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
      Demo Data
    </Badge>
  );
}

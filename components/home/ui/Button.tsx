import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const buttonVariants: Record<string, string> = {
  primary: 'bg-hp-primary text-white shadow-hp-glow hover:-translate-y-0.5 hover:bg-hp-primary-bright',
  secondary: 'bg-hp-card text-hp-foreground border border-hp-border shadow-hp-soft hover:-translate-y-0.5 hover:border-hp-primary/30',
  outline: 'border border-hp-border bg-white text-hp-foreground hover:border-hp-primary hover:text-hp-primary',
  ghost: 'bg-transparent text-hp-muted hover:bg-hp-surface hover:text-hp-foreground',
};

const buttonSizes: Record<string, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
  icon: 'h-12 w-12',
};

export function HpButton({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary/40 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  );
}

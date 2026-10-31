import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'sage' | 'cream' | 'lime' | 'green' | 'amber' | 'red' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cream',
  size = 'md',
  className = '',
  icon
}) => {
  const variantStyles = {
    forest: 'bg-beauty-forest text-beauty-ivory border-beauty-forest',
    sage: 'bg-[#EFF3EB] text-[#243C32] border-[#D4DBCF]',
    cream: 'bg-beauty-cream text-beauty-charcoal border-beauty-muted-border',
    lime: 'bg-[#EFF8C7] text-[#2A3F10] border-[#D2E880]',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-white text-beauty-charcoal border-beauty-muted-border shadow-2xs',
  };

  const sizeStyles = {
    sm: 'text-2xs px-2.5 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

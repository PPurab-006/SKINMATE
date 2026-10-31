import React from 'react';
import { Product } from '../../types/product';
import { buildGoogleProductSearchUrl } from '../../utils/googleSearch';
import { Search, ExternalLink } from 'lucide-react';

interface GoogleShoppingButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'compact' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export const GoogleShoppingButton: React.FC<GoogleShoppingButtonProps> = ({
  product,
  variant = 'primary',
  size = 'md',
  className = '',
  label = 'Find this product on Google',
  showIcon = true
}) => {
  const searchUrl = buildGoogleProductSearchUrl(product);

  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-full select-none cursor-pointer group shadow-2xs';

  const sizeStyles = size === 'sm'
    ? 'px-3.5 py-1.5 text-xs gap-1.5'
    : 'px-4 py-2 text-xs sm:text-sm gap-2';

  const variantStyles = variant === 'primary'
    ? 'bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover hover:shadow-beauty-sm'
    : variant === 'secondary'
    ? 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream hover:border-beauty-forest/40'
    : variant === 'ghost'
    ? 'bg-transparent text-beauty-forest hover:bg-beauty-cream/60 border border-beauty-muted-border/80'
    : 'bg-beauty-cream/80 text-beauty-forest hover:bg-beauty-cream text-xs font-medium border border-beauty-muted-border';

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      title={`Search for "${product.brand} ${product.name} ${product.variant || ''} ${product.size || ''}" on Google`}
    >
      {showIcon && (
        <span className="flex items-center gap-1 shrink-0">
          {/* Subtle Google 'G' icon or search lens */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </span>
      )}
      <span className="truncate">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
};

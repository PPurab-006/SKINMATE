import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1A2520]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} rounded-3xl border border-beauty-muted-border bg-[#FDFCF9] shadow-beauty-modal z-10 overflow-hidden flex flex-col max-h-[90vh] my-auto`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="px-6 py-5 border-b border-beauty-muted-border bg-beauty-cream/50 flex items-center justify-between">
            <div>
              {title && (
                <h3 className="font-serif font-semibold text-xl text-beauty-charcoal-heading">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-beauty-muted mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-beauty-muted hover:text-beauty-charcoal hover:bg-beauty-cream transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto bg-[#FDFCF9]">
          {children}
        </div>
      </div>
    </div>
  );
};

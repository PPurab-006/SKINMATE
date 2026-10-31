import React from 'react';
import { AppTab } from '../../types/common';

interface FooterProps {
  onTabChange: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full border-t border-beauty-muted-border bg-beauty-cream/60 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-beauty-forest text-beauty-ivory flex items-center justify-center font-serif font-bold text-sm">
                S
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-beauty-charcoal-heading">
                SkinMate
              </span>
            </div>

            <p className="text-sm text-beauty-charcoal-body leading-relaxed max-w-md font-light">
              Your personal destination to understand your skin, embrace your natural hair texture, explore creative beauty looks, and build a daily care routine you love.
            </p>

            <blockquote className="border-l-2 border-beauty-forest pl-3 py-0.5 text-xs italic text-beauty-muted font-serif">
              "Your beauty. Your way."
            </blockquote>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-sm uppercase tracking-wider text-beauty-charcoal mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-beauty-muted">
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-beauty-forest transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('skin-hair')} className="hover:text-beauty-forest transition-colors">
                  My Skin &amp; Hair
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('for-you')} className="hover:text-beauty-forest transition-colors">
                  For You Recommendations
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('shop')} className="hover:text-beauty-forest transition-colors">
                  Discover &amp; Shop
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('routine')} className="hover:text-beauty-forest transition-colors">
                  My Routine Builder
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('studio')} className="hover:text-beauty-forest transition-colors">
                  Beauty Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Reassuring Care & Privacy Note */}
          <div>
            <h4 className="font-serif font-semibold text-sm uppercase tracking-wider text-beauty-charcoal mb-4">
              Care &amp; Privacy
            </h4>
            <p className="text-xs text-beauty-muted leading-relaxed space-y-2">
              <span>All care guidance is purely cosmetic and educational. Visual analyses are processed with privacy-first standards, keeping your photographs secure.</span>
            </p>
            <div className="pt-3">
              <button
                onClick={() => onTabChange('profile')}
                className="text-xs font-semibold text-beauty-forest hover:underline"
              >
                Privacy &amp; Data Settings →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-8 border-t border-beauty-muted-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-beauty-muted">
          <div>
            © 2026 SkinMate Beauty &amp; Personal Care. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Formulated for thoughtful routines</span>
            <span>•</span>
            <span>India &amp; International Catalog</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { AppTab } from '../../types/common';

interface FooterProps {
  onTabChange: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-editorial-surface/90 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-editorial-lime/10 border border-editorial-lime/30 flex items-center justify-center text-editorial-lime">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">SKINMATE</span>
            </div>

            <p className="text-sm font-light text-editorial-text-secondary leading-relaxed max-w-md">
              SkinMate unites computer vision diagnostic intelligence, biochemical ingredient compatibility, and virtual trial studios into one cohesive personal care ecosystem.
            </p>

            <blockquote className="border-l-2 border-editorial-lime pl-3 py-0.5 text-xs italic text-editorial-text-muted">
              "Understand your appearance. Experiment with possibilities. Build your personal care routine."
            </blockquote>
          </div>

          {/* Core Modules Navigation */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-editorial-text-muted mb-4">
              Intelligence Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-editorial-text-secondary">
              <li>
                <button onClick={() => onTabChange('skin-lab')} className="hover:text-editorial-lime transition-colors">
                  Skin Lab Diagnostics
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('hair-lab')} className="hover:text-editorial-lime transition-colors">
                  Hair Lab & Porosity
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('style-studio')} className="hover:text-editorial-lime transition-colors">
                  Style Studio & VTO
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('routine-builder')} className="hover:text-editorial-lime transition-colors">
                  My Care Routine Builder
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('marketplace')} className="hover:text-editorial-lime transition-colors">
                  Vetted Product Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical & Architectural Standards */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-editorial-text-muted mb-4">
              Standards & Integrity
            </h4>
            <div className="space-y-3 text-2xs text-editorial-text-secondary leading-relaxed">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-editorial-lime shrink-0 mt-0.5" />
                <span>
                  <strong>Cosmetic Intelligence:</strong> Visual evaluations are algorithmic cosmetic assessments, not dermatological diagnoses.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="w-3.5 h-3.5 text-editorial-lime shrink-0 mt-0.5" />
                <span>
                  <strong>Deterministic Chemistry:</strong> The routine engine uses strict pairwise pharmacological rules rather than hallucinated claims.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-editorial-text-muted">
          <div className="font-mono">
            © 2026 SKINMATE TECHNOLOGIES • ALL RIGHTS RESERVED
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Powered by <span className="text-white font-medium">YouCam AI</span> &amp; <span className="text-editorial-lime font-medium">SkinMate Core</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400">All Systems Nominal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

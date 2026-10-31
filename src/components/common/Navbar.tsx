import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  Key, 
  ShoppingBag, 
  User, 
  SlidersHorizontal,
  Compass,
  Palette,
  Home,
  ShieldCheck,
  Cpu,
  Bookmark
} from 'lucide-react';
import { AppTab } from '../../types/common';
import { UserAppearanceProfile } from '../../types/profile';
import { youCamClient } from '../../services/youcam/client';
import { Modal } from './Modal';
import { Badge } from './Badge';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  profile: UserAppearanceProfile;
  isMockMode: boolean;
  onToggleMockMode: (enabled: boolean) => void;
  savedRoutinesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  profile,
  isMockMode,
  onToggleMockMode,
  savedRoutinesCount = 0
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(youCamClient.getConfig().apiKey || '');
  const [units] = useState(youCamClient.getConfig().remainingUnits);

  const navLinks: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'skin-hair', label: 'My Skin & Hair', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'for-you', label: 'For You', icon: <Compass className="w-4 h-4" /> },
    { id: 'shop', label: 'Discover & Shop', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'lists', label: 'My Lists', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'routine', label: 'My Routine', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'studio', label: 'Beauty Studio', icon: <Palette className="w-4 h-4" /> },
  ];

  const handleSaveApiKey = () => {
    youCamClient.setApiKey(apiKeyInput);
    if (apiKeyInput.trim()) {
      onToggleMockMode(false);
    }
    setIsApiModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-beauty-muted-border bg-[#F8F6F0]/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-beauty-forest text-beauty-ivory flex items-center justify-center font-serif text-lg font-bold shadow-2xs group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors">
                SkinMate
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-beauty-muted -mt-0.5">
                Personal Beauty &amp; Care
              </span>
            </div>
          </button>

          {/* Primary Consumer Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-2xs'
                      : 'text-beauty-charcoal hover:text-beauty-forest hover:bg-beauty-cream'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Subtle, non-dominating) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick API & Simulation Status Icon */}
            <button
              onClick={() => setIsApiModalOpen(true)}
              title="Camera & AI Service Configuration"
              className="p-2.5 rounded-full text-beauty-muted hover:text-beauty-forest hover:bg-beauty-cream transition-colors border border-beauty-muted-border"
            >
              <Cpu className="w-4 h-4" />
            </button>

            {/* Guest Config & Preferences Button (Zero Account / PCPartPicker Style) */}
            <button
              onClick={() => onTabChange('profile')}
              title="Guest Care Preferences & Sensitivities (Stored in browser)"
              className={`flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full border transition-all ${
                activeTab === 'profile'
                  ? 'border-beauty-forest bg-beauty-forest text-beauty-ivory'
                  : 'border-beauty-muted-border bg-white text-beauty-charcoal hover:border-beauty-forest hover:bg-beauty-cream'
              }`}
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-beauty-lime' : 'text-beauty-forest'}`} />
              <span className="text-xs font-semibold">Preferences</span>
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                activeTab === 'profile'
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-beauty-cream border-beauty-muted-border text-beauty-forest'
              }`}>
                Guest
              </span>
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => onTabChange('profile')}
              title="Guest Preferences & Sensitivities"
              className={`p-2 rounded-full border ${
                activeTab === 'profile'
                  ? 'border-beauty-forest bg-beauty-forest text-beauty-ivory'
                  : 'border-beauty-muted-border bg-white text-beauty-charcoal'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full border border-beauty-muted-border bg-white text-beauty-charcoal"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-beauty-muted-border bg-[#F8F6F0] px-4 py-4 space-y-1 shadow-lg">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-beauty-forest text-beauty-ivory font-semibold'
                    : 'text-beauty-charcoal hover:bg-beauty-cream'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={() => {
                onTabChange('profile');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'profile'
                  ? 'bg-beauty-forest text-beauty-ivory font-semibold'
                  : 'text-beauty-charcoal hover:bg-beauty-cream'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Preferences &amp; Sensitivities</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-beauty-cream text-beauty-forest border border-beauty-muted-border">
                Guest Mode
              </span>
            </button>

            <div className="pt-3 border-t border-beauty-muted-border flex items-center justify-between px-2">
              <span className="text-xs text-beauty-muted">AI Camera Units:</span>
              <button
                onClick={() => {
                  setIsApiModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-beauty-forest underline"
              >
                {units} Units Available
              </button>
            </div>
          </div>
        )}
      </header>

      {/* API Configuration Modal */}
      <Modal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        title="Beauty Intelligence Settings"
        subtitle="Configure image analysis adapters and camera API credentials"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-2xl border border-beauty-muted-border bg-beauty-cream/50 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-beauty-forest" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-beauty-charcoal">
                {isMockMode ? 'Sandbox Demonstration Mode' : 'Live YouCam API Connected'}
              </h4>
            </div>
            <p className="text-xs text-beauty-muted leading-relaxed">
              {isMockMode 
                ? 'High-fidelity demonstration adapters are active so you can freely explore hair, makeup, and skin experiences without consuming API units.' 
                : 'Direct server-to-server calls to Perfect Corp YouCam endpoints are enabled.'}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-beauty-muted-border bg-white">
            <div>
              <div className="text-xs font-semibold text-beauty-charcoal">Sandbox Mode</div>
              <div className="text-2xs text-beauty-muted">Conserve your 1,000 bonus YouCam units during testing</div>
            </div>
            <input
              type="checkbox"
              checked={isMockMode}
              onChange={(e) => onToggleMockMode(e.target.checked)}
              className="w-4 h-4 accent-beauty-forest cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-beauty-charcoal">
              Optional YouCam Bearer Token / API Key
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Leave empty for zero-cost Sandbox Mode"
              className="w-full px-3.5 py-2.5 rounded-xl border border-beauty-muted-border bg-white text-xs text-beauty-charcoal focus:border-beauty-forest focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-beauty-muted-border">
            <button
              onClick={() => setIsApiModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-beauty-muted hover:text-beauty-charcoal"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveApiKey}
              className="px-5 py-2 text-xs font-semibold rounded-full bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover shadow-sm"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

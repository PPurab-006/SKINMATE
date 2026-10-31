import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Scissors, 
  Palette, 
  SlidersHorizontal, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Key, 
  ShieldCheck, 
  Cpu 
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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  profile,
  isMockMode,
  onToggleMockMode
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(youCamClient.getConfig().apiKey || '');
  const [units] = useState(youCamClient.getConfig().remainingUnits);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'skin-lab', label: 'Skin Lab', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'hair-lab', label: 'Hair Lab', icon: <Scissors className="w-4 h-4" /> },
    { id: 'style-studio', label: 'Style Studio', icon: <Palette className="w-4 h-4" /> },
    { id: 'routine-builder', label: 'My Care', icon: <SlidersHorizontal className="w-4 h-4" />, badge: 'Builder' },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
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
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-editorial-bg/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-editorial-lime/10 border border-editorial-lime/30 flex items-center justify-center text-editorial-lime shadow-subtle-glow group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-display font-bold text-lg tracking-tight text-white group-hover:text-editorial-lime transition-colors">
                  <span>SKINMATE</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-editorial-lime/20 text-editorial-lime rounded font-bold">
                    AI
                  </span>
                </div>
                <span className="text-2xs font-mono tracking-widest text-editorial-text-muted uppercase">
                  Personal Care Intelligence
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/[0.06] font-semibold'
                        : 'text-editorial-text-secondary hover:text-editorial-text-primary hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className={isActive ? 'text-editorial-lime' : 'text-editorial-text-muted'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-editorial-lime/15 text-editorial-lime uppercase font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-3.5 h-0.5 bg-editorial-lime rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* API Mode & Credit Status Pill */}
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.1] bg-editorial-surface/80 hover:border-editorial-lime/40 transition-all text-xs"
              title="Click to configure YouCam S2S API credentials and switch modes"
            >
              <span className={`w-2 h-2 rounded-full ${isMockMode ? 'bg-amber-400' : 'bg-editorial-lime animate-pulse'}`} />
              <span className="font-mono text-2xs uppercase tracking-wider text-editorial-text-secondary">
                {isMockMode ? 'Sandbox Mode' : 'YouCam Live API'}
              </span>
              <span className="text-2xs font-mono text-editorial-lime font-bold pl-1 border-l border-white/10">
                {units} Units
              </span>
            </button>

            {/* User Quick Profile Chip */}
            <button
              onClick={() => onTabChange('profile')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-editorial-card border border-white/[0.08] hover:border-editorial-lime/40 transition-colors"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover border border-white/10"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {profile.name.split(' ')[0]}
                </div>
                <div className="text-2xs text-editorial-text-muted leading-tight font-mono">
                  {profile.skin.type} • {profile.skin.fitzpatrick}
                </div>
              </div>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="p-2 rounded-lg bg-editorial-card border border-white/10 text-editorial-text-secondary"
            >
              <Cpu className="w-4 h-4 text-editorial-lime" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-editorial-card border border-white/10 text-editorial-text-secondary hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-editorial-surface/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                  activeTab === item.id
                    ? 'bg-editorial-lime/10 text-editorial-lime font-semibold'
                    : 'text-editorial-text-secondary hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-editorial-lime/20 text-editorial-lime">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-editorial-text-secondary">YouCam Credits:</span>
              <span className="font-mono text-xs text-editorial-lime font-bold">{units} Bonus Units</span>
            </div>
          </div>
        )}
      </header>

      {/* YouCam API Credentials & Mode Settings Modal */}
      <Modal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        title="YouCam S2S API & Intelligence Configuration"
        subtitle="Manage credentials, unit consumption, and simulation environments"
      >
        <div className="space-y-5">
          {/* Active status banner */}
          <div className="p-4 rounded-xl border border-white/10 bg-editorial-bg flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isMockMode ? 'bg-amber-500/10 text-amber-400' : 'bg-editorial-lime/10 text-editorial-lime'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {isMockMode ? 'Sandbox Simulation Environment Active' : 'Live YouCam Production Pipeline Active'}
              </div>
              <p className="text-xs text-editorial-text-secondary mt-1 leading-relaxed">
                {isMockMode
                  ? 'All 28+ diagnostics (Skin, Hair, Makeup, Beard, Proportions) run against high-fidelity neural mock adapters. 0 API credits are consumed.'
                  : 'Requests are securely routed to https://yce-api-01.makeupar.com/s2s/v2.0 using your Bearer key. Each diagnostic decrements 1 unit.'}
              </p>
            </div>
          </div>

          {/* Unit Quota Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-white/[0.08] bg-editorial-card">
              <div className="text-2xs uppercase tracking-wider text-editorial-text-muted">Available Bonus Quota</div>
              <div className="text-xl font-bold font-mono text-editorial-lime mt-1">{units} Units</div>
              <div className="text-2xs text-editorial-text-secondary mt-0.5">Perfect Corp Developer Tier</div>
            </div>
            <div className="p-3.5 rounded-xl border border-white/[0.08] bg-editorial-card">
              <div className="text-2xs uppercase tracking-wider text-editorial-text-muted">Protocol Architecture</div>
              <div className="text-sm font-mono text-white mt-1">S2S V2.0 REST</div>
              <div className="text-2xs text-editorial-text-secondary mt-0.5">Asynchronous Task Polling</div>
            </div>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-editorial-card flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Sandbox Mock Mode</div>
              <div className="text-xs text-editorial-text-secondary">Conserve bonus units during product evaluation</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMockMode}
                onChange={(e) => onToggleMockMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-editorial-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-editorial-lime peer-checked:after:bg-black" />
            </label>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-editorial-text-secondary flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-editorial-lime" />
              <span>YouCam S2S API Key (Bearer Token)</span>
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="eyJhbGciOi... or leave empty for Sandbox Mode"
              className="w-full px-3.5 py-2.5 rounded-xl bg-editorial-bg border border-white/12 text-sm text-white placeholder-editorial-text-muted font-mono focus:border-editorial-lime focus:outline-none"
            />
            <p className="text-2xs text-editorial-text-muted">
              Credentials remain client/server scoped and are never transmitted to unauthorized 3rd parties.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-editorial-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow transition-all"
            >
              Save & Apply Settings
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

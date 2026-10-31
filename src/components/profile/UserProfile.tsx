import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  Trash2, 
  Lock, 
  Save, 
  Coins, 
  Heart, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { UserAppearanceProfile } from '../../types/profile';
import { StorageService } from '../../services/storage';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface UserProfileProps {
  profile: UserAppearanceProfile;
  onUpdateProfile: (updated: UserAppearanceProfile) => void;
  onClearAllData: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdateProfile,
  onClearAllData
}) => {
  const [formData, setFormData] = useState<UserAppearanceProfile>(profile);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const handleSavePreferences = () => {
    StorageService.saveUserProfile(formData);
    onUpdateProfile(formData);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">Appearance Registry</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">Biometric Privacy Compliant</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            My Appearance Profile
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Diagnostic parameters, formulation sensitivities, and data confidentiality controls.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Preferences</span>
        </button>
      </div>

      {isSaveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile and privacy preferences updated successfully!</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Card & Diagnostic Summary */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={formData.avatarUrl}
                alt={formData.name}
                className="w-full h-full rounded-full object-cover border-2 border-editorial-lime/60 shadow-lime-glow"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-editorial-surface" />
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {formData.name}
              </h2>
              <div className="text-2xs text-editorial-text-secondary mt-0.5 font-mono">
                {formData.age} yrs • {formData.genderIdentity}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-editorial-card border border-white/[0.04]">
                <div className="text-2xs text-editorial-text-muted">Skin Type</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5">{formData.skin.type}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-editorial-card border border-white/[0.04]">
                <div className="text-2xs text-editorial-text-muted">Fitzpatrick</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5">Type {formData.skin.fitzpatrick}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-editorial-card border border-white/[0.04]">
                <div className="text-2xs text-editorial-text-muted">Undertone</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5">{formData.skin.colorTone.undertone}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-editorial-card border border-white/[0.04]">
                <div className="text-2xs text-editorial-text-muted">Hair Pattern</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5">{formData.hair.pattern}</div>
              </div>
            </div>
          </div>

          {/* Known Allergies / Sensitivities */}
          <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface space-y-3">
            <h3 className="font-display font-bold text-sm text-white">
              Clinical Ingredient Sensitivities
            </h3>
            <div className="space-y-2">
              {formData.skin.allergies.map((allergy, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-2xs text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{allergy}</span>
                </div>
              ))}
            </div>
            <p className="text-2xs text-editorial-text-muted">
              Products with flagged ingredients will trigger exclusion warnings in the Routine Builder.
            </p>
          </div>
        </div>

        {/* Right Column: Preferences & Privacy Controls */}
        <div className="md:col-span-7 space-y-6">
          {/* Formulation Preferences */}
          <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Care &amp; Formulation Preferences
            </h3>

            <div className="space-y-3">
              {/* Fragrance free toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div>
                  <div className="text-xs font-semibold text-white">Fragrance-Free Formulations Only</div>
                  <div className="text-2xs text-editorial-text-secondary">Exclude synthetic perfuming agents and essential oils</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.fragranceFreeOnly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, fragranceFreeOnly: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-editorial-lime cursor-pointer"
                />
              </div>

              {/* Cruelty free toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div>
                  <div className="text-xs font-semibold text-white">Cruelty-Free Certified Only</div>
                  <div className="text-2xs text-editorial-text-secondary">PETA / Leaping Bunny certified non-animal tested</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.crueltyFreeOnly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, crueltyFreeOnly: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-editorial-lime cursor-pointer"
                />
              </div>

              {/* Budget Tier */}
              <div className="p-3.5 rounded-xl bg-editorial-card border border-white/[0.06] space-y-2">
                <div className="text-xs font-semibold text-white">Default Care Budget Tier</div>
                <select
                  value={formData.preferences.budgetTier}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, budgetTier: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 rounded-lg bg-editorial-bg border border-white/10 text-xs text-white focus:border-editorial-lime focus:outline-none cursor-pointer"
                >
                  <option value="Budget Conscious (Under ₹2,000)">Budget Conscious (Under ₹2,000)</option>
                  <option value="Balanced Quality (₹2,000 - ₹5,000)">Balanced Quality (₹2,000 - ₹5,000)</option>
                  <option value="Luxury Clinical (₹5,000+)">Luxury Clinical (₹5,000+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Knowledge Storage Controls */}
          <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Privacy &amp; Data Deletion
                </h3>
                <p className="text-xs text-editorial-text-secondary mt-0.5">
                  Granular control over image storage and diagnostic history
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-editorial-lime" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div>
                  <div className="text-xs font-semibold text-white">Store Diagnostic Images Locally</div>
                  <div className="text-2xs text-editorial-text-secondary">Images stay confined to device browser cache</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.storeImagesLocally}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, storeImagesLocally: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-editorial-lime cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div>
                  <div className="text-xs font-semibold text-white">Allow Diagnostic Telemetry</div>
                  <div className="text-2xs text-editorial-text-secondary">Anonymized model precision benchmark logging</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.allowDiagnosticTelemetry}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, allowDiagnosticTelemetry: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-editorial-lime cursor-pointer"
                />
              </div>
            </div>

            {/* Permanent Data Deletion Danger Zone */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-400">Purge Stored Biometric Data</div>
                <div className="text-2xs text-editorial-text-muted">Permanently deletes all saved looks, routines, and photos</div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Data Deletion */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Permanent Biometric Data Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-xs text-editorial-text-secondary leading-relaxed">
            All cached baseline facial photos, hair scans, custom routine configurations, and Style Studio looks will be immediately expunged from local storage and session memory.
          </p>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-editorial-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                StorageService.clearAllData();
                onClearAllData();
                setIsDeleteModalOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-md"
            >
              Confirm Purge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

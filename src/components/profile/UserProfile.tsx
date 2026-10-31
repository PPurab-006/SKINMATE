import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  Trash2, 
  Save, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Plus,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { UserAppearanceProfile } from '../../types/profile';
import { StorageService } from '../../services/storage';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface UserProfileProps {
  profile: UserAppearanceProfile;
  onUpdateProfile: (updated: UserAppearanceProfile) => void;
  onClearAllData: () => void;
  onStartConsultation?: (type: 'skin' | 'hair') => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdateProfile,
  onClearAllData,
  onStartConsultation
}) => {
  const [formData, setFormData] = useState<UserAppearanceProfile>(profile);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [newAllergyInput, setNewAllergyInput] = useState('');

  const handleSavePreferences = () => {
    StorageService.saveUserProfile(formData);
    onUpdateProfile(formData);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 2500);
  };

  const allergiesList = formData.skin?.allergies || [];

  const handleAddAllergy = () => {
    if (!newAllergyInput.trim()) return;
    const trimmed = newAllergyInput.trim();
    if (!allergiesList.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skin: prev.skin ? {
          ...prev.skin,
          allergies: [...(prev.skin.allergies || []), trimmed]
        } : {
          type: 'Normal',
          fitzpatrick: 'III',
          colorTone: {
            dominantHex: '#E5B99A',
            undertone: 'Neutral',
            contrast: 'Medium',
            melaninIndex: 30,
            seasonPalette: 'Soft Warm'
          },
          primaryConcerns: [],
          allergies: [trimmed]
        }
      }));
    }
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (allergy: string) => {
    if (!formData.skin) return;
    setFormData(prev => ({
      ...prev,
      skin: prev.skin ? {
        ...prev.skin,
        allergies: prev.skin.allergies.filter(a => a !== allergy)
      } : undefined
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-beauty-muted-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-forest">
              Guest Care Configurator &amp; Sensitivities
            </span>
            <span className="text-beauty-muted text-xs">•</span>
            <span className="text-2xs font-medium text-beauty-muted">
              Persistent Local Storage
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-beauty-charcoal font-normal tracking-tight">
            Guest Preferences &amp; Sensitivities
          </h1>
          <p className="text-sm text-beauty-muted mt-2 max-w-xl">
            Configure your ingredient sensitivities, formulation standards, budget limits, and inspect your browser-side local storage without registering an account.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-6 py-3 rounded-full font-medium text-xs bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest/90 shadow-beauty-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>

      {isSaveSuccess && (
        <div className="p-4 rounded-2xl bg-beauty-cream border border-beauty-sage/40 text-xs text-beauty-forest flex items-center gap-2.5 shadow-beauty-sm">
          <CheckCircle2 className="w-4 h-4 text-beauty-forest shrink-0" />
          <span className="font-medium">Guest preferences and formulation filters saved to local storage!</span>
        </div>
      )}

      {/* PCPartPicker-Inspired Workflow & Privacy Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-beauty-cream/90 border border-beauty-muted-border shadow-beauty-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-beauty-forest text-2xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-beauty-forest" />
              <span>Guest-First Personal Care Configurator</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-beauty-charcoal-heading">
              Zero Accounts • Local Browser Storage • Privacy-First
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-2xs font-mono font-semibold bg-white border border-beauty-muted-border text-beauty-forest self-start sm:self-auto shrink-0 shadow-2xs">
            PCPartPicker for Personal Care
          </span>
        </div>

        <p className="text-xs sm:text-sm text-beauty-charcoal-body font-light leading-relaxed max-w-3xl">
          SkinMate operates without user accounts, passwords, or cloud user profiles.
          Your photographs stay strictly temporary in browser memory, and your routine configurations, custom lists,
          comparisons, and ingredient sensitivities persist directly in your device&apos;s <code className="font-mono text-2xs px-1.5 py-0.5 rounded bg-white border border-beauty-muted-border text-beauty-forest">localStorage</code>.
        </p>

        {/* The 6-Stage Core Experience Roadmap */}
        <div className="pt-3 border-t border-beauty-muted-border/80">
          <span className="text-3xs uppercase tracking-widest font-semibold text-beauty-muted block mb-2">
            The Primary Product Experience:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-2xs font-semibold">
            <span className="px-3 py-1.5 rounded-full bg-white border border-beauty-muted-border text-beauty-charcoal">
              1. UPLOAD
            </span>
            <ArrowRight className="w-3 h-3 text-beauty-muted" />
            <span className="px-3 py-1.5 rounded-full bg-white border border-beauty-muted-border text-beauty-charcoal">
              2. ANALYSE
            </span>
            <ArrowRight className="w-3 h-3 text-beauty-muted" />
            <span className="px-3 py-1.5 rounded-full bg-white border border-beauty-muted-border text-beauty-charcoal">
              3. DISCOVER
            </span>
            <ArrowRight className="w-3 h-3 text-beauty-muted" />
            <span className="px-3 py-1.5 rounded-full bg-white border border-beauty-forest text-beauty-forest">
              4. CONFIGURE
            </span>
            <ArrowRight className="w-3 h-3 text-beauty-muted" />
            <span className="px-3 py-1.5 rounded-full bg-white border border-beauty-muted-border text-beauty-charcoal">
              5. COMPARE
            </span>
            <ArrowRight className="w-3 h-3 text-beauty-muted" />
            <span className="px-3 py-1.5 rounded-full bg-beauty-forest text-beauty-ivory shadow-2xs">
              6. SHOP
            </span>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guest Configuration Card (Zero Fake Portraits) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl border border-beauty-muted-border bg-white text-center space-y-5 shadow-beauty-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-beauty-cream border border-beauty-muted-border flex items-center justify-center text-beauty-forest shadow-2xs">
              <SlidersHorizontal className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guest Mode Active</span>
              </div>
              <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading mt-2">
                {formData.name || 'Guest Care Explorer'}
              </h3>
              <p className="text-2xs text-beauty-muted font-light mt-0.5">
                Client-Side Profile Stored in Browser LocalStorage
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <div>
                <label className="text-2xs uppercase tracking-wider text-beauty-muted font-medium block mb-1">
                  Configuration Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-beauty-muted-border bg-beauty-cream/40 text-xs font-medium text-beauty-charcoal focus:border-beauty-forest focus:outline-none"
                  placeholder="e.g. My Morning Vanity / Sensitive Skin"
                />
              </div>
            </div>

            {/* Consultation Status Summary */}
            <div className="pt-4 border-t border-beauty-muted-border text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                  Consultation Status
                </span>
                {formData.isSampleProfile && (
                  <Badge variant="cream" size="sm">
                    Sample Guide
                  </Badge>
                )}
              </div>

              {formData.hasCompletedSkinConsultation && formData.skin ? (
                <div className="p-3 rounded-xl bg-beauty-cream/60 border border-beauty-muted-border space-y-1 text-xs">
                  <div className="font-medium text-beauty-charcoal">Skin Profile Active</div>
                  <div className="text-beauty-muted text-[11px]">
                    {formData.skin.type} Skin • {formData.skin.colorTone.undertone} undertone • Fitzpatrick {formData.skin.fitzpatrick}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-beauty-cream/30 border border-beauty-muted-border space-y-2">
                  <div className="text-xs text-beauty-muted">
                    No skin consultation completed yet. Discover your skin profile to unlock tailored routine advice.
                  </div>
                  {onStartConsultation && (
                    <button
                      onClick={() => onStartConsultation('skin')}
                      className="text-xs font-medium text-beauty-forest hover:underline flex items-center gap-1"
                    >
                      <span>Start Skin Consultation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {formData.hasCompletedHairConsultation && formData.hair ? (
                <div className="p-3 rounded-xl bg-beauty-cream/60 border border-beauty-muted-border space-y-1 text-xs">
                  <div className="font-medium text-beauty-charcoal">Hair Profile Active</div>
                  <div className="text-beauty-muted text-[11px]">
                    {formData.hair.pattern} Pattern • {formData.hair.porosity} porosity
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-beauty-cream/30 border border-beauty-muted-border space-y-2">
                  <div className="text-xs text-beauty-muted">
                    No hair consultation completed yet. Explore curl patterns, strand porosity, and scalp nourishment.
                  </div>
                  {onStartConsultation && (
                    <button
                      onClick={() => onStartConsultation('hair')}
                      className="text-xs font-medium text-beauty-forest hover:underline flex items-center gap-1"
                    >
                      <span>Start Hair Consultation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ingredient Sensitivities */}
          <div className="p-6 rounded-3xl border border-beauty-muted-border bg-white space-y-4 shadow-beauty-sm">
            <div>
              <h3 className="font-serif text-base text-beauty-charcoal font-medium">
                Ingredient Sensitivities
              </h3>
              <p className="text-xs text-beauty-muted mt-0.5">
                Formulas containing these ingredients will be flagged in your routine.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {allergiesList.map((allergy, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-beauty-cream border border-beauty-muted-border text-beauty-charcoal flex items-center gap-1.5"
                >
                  <span>{allergy}</span>
                  <button
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="text-beauty-muted hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergyInput}
                onChange={(e) => setNewAllergyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); } }}
                placeholder="Add sensitivity (e.g. Essential Oils, Fragrance)..."
                className="flex-1 px-3 py-2 rounded-xl border border-beauty-muted-border bg-beauty-cream/40 text-xs text-beauty-charcoal focus:border-beauty-forest focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3.5 py-2 rounded-xl bg-beauty-forest text-beauty-ivory text-xs font-medium hover:bg-beauty-forest/90 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Formulation Preferences & Privacy */}
        <div className="md:col-span-7 space-y-6">
          {/* Formulation Preferences */}
          <div className="p-6 sm:p-7 rounded-3xl border border-beauty-muted-border bg-white space-y-5 shadow-beauty-sm">
            <div>
              <h3 className="font-serif text-lg text-beauty-charcoal font-medium">
                Care &amp; Formulation Preferences
              </h3>
              <p className="text-xs text-beauty-muted mt-0.5">
                Tailor your product discovery according to your ethical standards and budget.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Fragrance free toggle */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-beauty-cream/40 border border-beauty-muted-border cursor-pointer hover:border-beauty-sage transition-all">
                <div>
                  <div className="text-xs font-semibold text-beauty-charcoal">
                    Fragrance-Free Formulations
                  </div>
                  <div className="text-xs text-beauty-muted mt-0.5">
                    Prioritize products formulated without synthetic parfum or essential oils
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.fragranceFreeOnly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, fragranceFreeOnly: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-beauty-forest rounded cursor-pointer"
                />
              </label>

              {/* Cruelty free toggle */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-beauty-cream/40 border border-beauty-muted-border cursor-pointer hover:border-beauty-sage transition-all">
                <div>
                  <div className="text-xs font-semibold text-beauty-charcoal">
                    Cruelty-Free Certified
                  </div>
                  <div className="text-xs text-beauty-muted mt-0.5">
                    Filter for Leaping Bunny or PETA-certified ethical formulations
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.crueltyFreeOnly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, crueltyFreeOnly: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-beauty-forest rounded cursor-pointer"
                />
              </label>

              {/* Budget Tier */}
              <div className="p-4 rounded-2xl bg-beauty-cream/40 border border-beauty-muted-border space-y-2">
                <div className="text-xs font-semibold text-beauty-charcoal">
                  Default Routine Budget Tier
                </div>
                <select
                  value={formData.preferences.budgetTier}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, budgetTier: e.target.value as any }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal focus:border-beauty-forest focus:outline-none cursor-pointer"
                >
                  <option value="Under ₹2,000">Budget Conscious (Under ₹2,000)</option>
                  <option value="₹2,000 - ₹5,000">Balanced Quality (₹2,000 - ₹5,000)</option>
                  <option value="₹5,000+">Luxury Clinical (₹5,000+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Knowledge Storage Controls */}
          <div className="p-6 sm:p-7 rounded-3xl border border-beauty-muted-border bg-white space-y-5 shadow-beauty-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-beauty-charcoal font-medium">
                  Privacy &amp; Local Storage
                </h3>
                <p className="text-xs text-beauty-muted mt-0.5">
                  Your beauty data stays private and confined to your device
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-beauty-forest" />
            </div>

            <div className="p-4 rounded-2xl bg-beauty-cream/30 border border-beauty-muted-border text-xs text-beauty-charcoal/80 leading-relaxed">
              SkinMate uses on-device and direct session processing. Your facial photos are never retained on persistent cloud servers or used for model training without explicit consent.
            </div>

            {/* Permanent Data Deletion */}
            <div className="pt-4 border-t border-beauty-muted-border flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-rose-700">Clear Local Browser Data</div>
                <div className="text-2xs text-beauty-muted">Deletes saved looks, routine configurations, and consultation history</div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Data Deletion */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Reset Local Browser Data"
        subtitle="This action clears your local preferences and saved routines"
      >
        <div className="space-y-4">
          <p className="text-xs text-beauty-charcoal/80 leading-relaxed">
            All stored photos, customized routine sequence, saved Style Studio looks, and consultation findings will be removed from your browser cache.
          </p>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-beauty-muted-border">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-beauty-muted hover:text-beauty-charcoal"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                StorageService.clearAllData();
                onClearAllData();
                setIsDeleteModalOpen(false);
              }}
              className="px-5 py-2 text-xs font-medium rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

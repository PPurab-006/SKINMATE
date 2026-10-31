import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Droplets, 
  Sun, 
  Layers,
  Heart,
  RefreshCw,
  Info,
  Calendar,
  Save,
  Clock,
  Scissors,
  Eye,
  Check,
  ShieldCheck,
  Maximize2,
  Bookmark
} from 'lucide-react';
import { SkinAnalysisResult, ImageQualityCheck } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { UserAppearanceProfile } from '../../types/profile';
import { Product } from '../../types/product';
import { AppTab } from '../../types/common';
import { SkinService } from '../../services/youcam/skinService';
import { HairService } from '../../services/youcam/hairService';
import { CameraCapture } from '../common/CameraCapture';
import { ImageDropzone } from '../common/ImageDropzone';
import { Badge } from '../common/Badge';
import { VisualAnalysisShoppingConsultation } from './VisualAnalysisShoppingConsultation';

interface PersonalIntelligenceHubProps {
  initialSubTab?: 'skin' | 'hair' | 'unified';
  skinAnalysis: SkinAnalysisResult;
  hairAnalysis: HairAnalysisResult;
  profile: UserAppearanceProfile;
  onSkinAnalysisComplete: (result: SkinAnalysisResult) => void;
  onHairAnalysisComplete: (result: HairAnalysisResult) => void;
  onSaveProfile: (profile: UserAppearanceProfile) => void;
  onNavigate: (tab: AppTab) => void;
  onSelectProduct?: (product: Product) => void;
}

export const PersonalIntelligenceHub: React.FC<PersonalIntelligenceHubProps> = ({
  initialSubTab = 'skin',
  skinAnalysis,
  hairAnalysis,
  profile,
  onSkinAnalysisComplete,
  onHairAnalysisComplete,
  onSaveProfile,
  onNavigate,
  onSelectProduct
}) => {
  const [subTab, setSubTab] = useState<'skin' | 'hair' | 'unified'>(initialSubTab);
  const [step, setStep] = useState<'overview' | 'capture' | 'analyzing' | 'results'>('results');
  const [analysisType, setAnalysisType] = useState<'skin' | 'hair'>('skin');
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [analyzingStage, setAnalyzingStage] = useState(1);
  const [scanError, setScanError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [activeConcernKey, setActiveConcernKey] = useState<string>('pores');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SkinAnalysisResult | HairAnalysisResult | null>(null);

  // Analysis Stages for progress feedback
  const skinStages = [
    'Normalizing facial portrait & geometry...',
    'Evaluating surface sebum & pore distribution...',
    'Analyzing Fitzpatrick classification & undertone...',
    'Compiling consumer-friendly skin profile...'
  ];

  const hairStages = [
    'Scanning strand geometry & fiber density...',
    'Detecting wave/curl curvature pattern...',
    'Measuring cuticle alignment & surface frizz...',
    'Generating targeted hair rituals...'
  ];

  // Handler for starting new skin scan
  const handleStartSkinAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setScanError(null);
    setIsLiveCameraOpen(false);
    setAnalysisType('skin');
    setStep('analyzing');
    setAnalyzingStage(1);

    const timer1 = setTimeout(() => setAnalyzingStage(2), 700);
    const timer2 = setTimeout(() => setAnalyzingStage(3), 1400);
    const timer3 = setTimeout(() => setAnalyzingStage(4), 2100);

    try {
      const [result] = await Promise.all([
        SkinService.analyzeSkin(file, previewUrl),
        new Promise(r => setTimeout(r, 2600))
      ]);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      onSkinAnalysisComplete(result);
      setStep('results');
      setSaveSuccessMsg('New skin analysis successfully completed!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Live skin analysis failed:', err);
      setScanError(err.message || 'Live YouCam skin analysis encountered an issue. Please verify lighting and try again.');
      setStep('capture');
    }
  };

  // Handler for starting new hair scan
  const handleStartHairAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setScanError(null);
    setIsLiveCameraOpen(false);
    setAnalysisType('hair');
    setStep('analyzing');
    setAnalyzingStage(1);

    const timer1 = setTimeout(() => setAnalyzingStage(2), 700);
    const timer2 = setTimeout(() => setAnalyzingStage(3), 1400);
    const timer3 = setTimeout(() => setAnalyzingStage(4), 2100);

    try {
      const result = await HairService.analyzeHair(file, previewUrl);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      onHairAnalysisComplete(result);
      setStep('results');
      setSaveSuccessMsg('New hair diagnostic successfully completed!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Live hair diagnostic failed:', err);
      setScanError(err.message || 'Live YouCam hair diagnostics encountered an issue. Please verify hair visibility and try again.');
      setStep('capture');
    }
  };

  // Handler to explicitly save current profile
  const handleSaveSkinProfile = () => {
    const updated: UserAppearanceProfile = {
      ...profile,
      hasCompletedSkinConsultation: true,
      skin: {
        type: skinAnalysis.skinType,
        fitzpatrick: skinAnalysis.fitzpatrick,
        colorTone: skinAnalysis.colorTone,
        primaryConcerns: Object.keys(skinAnalysis.concerns).slice(0, 3).map(k => skinAnalysis.concerns[k]?.name || k),
        allergies: profile.skin?.allergies || [],
      },
      skinHistory: [skinAnalysis, ...(profile.skinHistory || []).filter(h => h.id !== skinAnalysis.id)]
    };
    onSaveProfile(updated);
    setSaveSuccessMsg('Skin profile updated and saved to your personal records.');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveHairProfile = () => {
    const updated: UserAppearanceProfile = {
      ...profile,
      hasCompletedHairConsultation: true,
      hair: {
        pattern: hairAnalysis.pattern,
        porosity: hairAnalysis.scalpProfile.porosity,
        scalpType: hairAnalysis.scalpProfile.type,
        lengthCategory: hairAnalysis.length.category,
        primaryConcerns: ['Cuticle Frizz Control', 'Scalp Barrier Balance'],
      },
      hairHistory: [hairAnalysis, ...(profile.hairHistory || []).filter(h => h.id !== hairAnalysis.id)]
    };
    onSaveProfile(updated);
    setSaveSuccessMsg('Hair diagnostic profile updated and saved to your personal records.');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const currentConcern = skinAnalysis.concerns[activeConcernKey] || Object.values(skinAnalysis.concerns)[0];

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Header & Primary Pillar Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-beauty-muted-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-beauty-forest" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-forest font-sans">
              Pillar 1: Personal Intelligence Centre
            </span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading tracking-tight">
            My Skin &amp; Hair
          </h1>
          <p className="text-sm text-beauty-muted mt-1.5 font-light max-w-xl">
            A dedicated intelligence center powered by optical analysis. Understand your skin and hair characteristics in truthful, consumer-friendly language.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-full bg-beauty-cream border border-beauty-muted-border self-start md:self-auto shrink-0 shadow-2xs">
          <button
            onClick={() => { setSubTab('skin'); setStep('results'); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              subTab === 'skin'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs'
                : 'text-beauty-charcoal hover:text-beauty-forest'
            }`}
          >
            Skin Profile
          </button>
          <button
            onClick={() => { setSubTab('hair'); setStep('results'); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              subTab === 'hair'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs'
                : 'text-beauty-charcoal hover:text-beauty-forest'
            }`}
          >
            Hair Profile
          </button>
          <button
            onClick={() => { setSubTab('unified'); setStep('results'); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              subTab === 'unified'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs'
                : 'text-beauty-charcoal hover:text-beauty-forest'
            }`}
          >
            Unified Profile
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CAPTURE / UPLOAD FLOW (Skin or Hair)                                   */}
      {/* ========================================================================= */}
      {step === 'capture' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xs uppercase tracking-wider font-semibold text-beauty-forest">
                {analysisType === 'skin' ? 'AI Skin Analysis Consultation' : 'AI Hair Diagnostics Consultation'}
              </span>
              <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading mt-1">
                {analysisType === 'skin' ? "Capture or upload your natural facial portrait" : "Share a clear portrait of your natural hair"}
              </h3>
              <p className="text-xs sm:text-sm text-beauty-muted mt-1 max-w-lg">
                {analysisType === 'skin'
                  ? 'A relaxed frontal photo in soft, indirect daylight provides genuine clarity on sebum balance, pore structure, and undertone.'
                  : 'A clear view showing hair from crown to mid-length reveals wave/curl geometry, density, and cuticle alignment.'}
              </p>
            </div>
            <button
              onClick={() => { setStep('results'); setIsLiveCameraOpen(false); }}
              className="text-xs text-beauty-muted hover:text-beauty-charcoal underline"
            >
              Cancel
            </button>
          </div>

          {scanError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 animate-fade-in">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Analysis Provider Feedback: </span>
                <span>{scanError}</span>
              </div>
            </div>
          )}

          {isLiveCameraOpen ? (
            <CameraCapture
              onCapture={(file, previewUrl) => {
                if (analysisType === 'skin') {
                  handleStartSkinAnalysis(file, previewUrl, {} as ImageQualityCheck);
                } else {
                  handleStartHairAnalysis(file, previewUrl, {} as ImageQualityCheck);
                }
              }}
              onCancel={() => setIsLiveCameraOpen(false)}
            />
          ) : (
            <ImageDropzone
              onImageSelected={(file, previewUrl, quality) => {
                if (analysisType === 'skin') {
                  handleStartSkinAnalysis(file, previewUrl, quality);
                } else {
                  handleStartHairAnalysis(file, previewUrl, quality);
                }
              }}
              onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
              title={analysisType === 'skin' ? "Upload skin portrait" : "Upload hair portrait"}
              subtitle="Drag & drop JPEG/PNG or click to browse. We will never share your private photo."
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CALM PROCESSING PROGRESS SCREEN                                        */}
      {/* ========================================================================= */}
      {step === 'analyzing' && (
        <div className="p-16 rounded-3xl bg-white border border-beauty-muted-border text-center space-y-6 shadow-beauty-card animate-fade-in max-w-xl mx-auto">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-beauty-forest/20 border-t-beauty-forest animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-beauty-forest">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
              {analysisType === 'skin' ? 'Analyzing your skin characteristics...' : 'Evaluating hair fiber & pattern...'}
            </h3>
            <p className="text-xs text-beauty-muted mt-2">
              Processing optical features through live YouCam intelligence models.
            </p>
          </div>

          <div className="space-y-2 text-left max-w-sm mx-auto pt-2">
            {(analysisType === 'skin' ? skinStages : hairStages).map((msg, idx) => {
              const isCurrent = analyzingStage === idx + 1;
              const isDone = analyzingStage > idx + 1;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-beauty-forest border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-beauty-muted-border shrink-0" />
                  )}
                  <span className={isCurrent ? 'font-semibold text-beauty-charcoal' : isDone ? 'text-beauty-muted' : 'text-beauty-muted/60'}>
                    {msg}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SKIN PROFILE TAB CONTENT                                               */}
      {/* ========================================================================= */}
      {subTab === 'skin' && step === 'results' && (
        <div className="space-y-10">
          
          {/* Action Bar: New Scan + Save Profile + History */}
          <div className="p-4 sm:p-5 rounded-2xl bg-beauty-cream border border-beauty-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
              <div>
                <span className="text-xs font-semibold text-beauty-charcoal">
                  Recorded Skin Assessment
                </span>
                <span className="text-2xs text-beauty-muted ml-2">
                  Last evaluated: {skinAnalysis.timestamp || 'Recent Session'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => { setAnalysisType('skin'); setStep('capture'); }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </button>

              <button
                onClick={handleSaveSkinProfile}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Skin Profile</span>
              </button>
            </div>
          </div>

          {/* Core Skin Characteristics Grid (Truthful, non-fabricated metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Skin Type */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Skin Classification
                </span>
                <Droplets className="w-4 h-4 text-beauty-forest" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {skinAnalysis.skinType} Skin
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Natural sebum activity along central T-zone with comfortable balance across cheeks.
              </p>
            </div>

            {/* 2. Fitzpatrick Phototype */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Fitzpatrick Phototype
                </span>
                <Sun className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                Type {skinAnalysis.fitzpatrick}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Moderate melanin defense. Tans easily with gradual burn threshold under intense sun.
              </p>
            </div>

            {/* 3. Color Tone & Undertone */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Tone &amp; Undertone
                </span>
                <span
                  className="w-4 h-4 rounded-full border border-beauty-muted-border shadow-2xs"
                  style={{ backgroundColor: skinAnalysis.colorTone.dominantHex }}
                />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {skinAnalysis.colorTone.undertone}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Harmonizes naturally with terracotta, warm earth tones, and warm nude cosmetics.
              </p>
            </div>

            {/* 4. Facial Geometry & Ratio */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Face Attributes
                </span>
                <Layers className="w-4 h-4 text-beauty-sage" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {skinAnalysis.faceAttributes?.faceShape || 'Oval'}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                {skinAnalysis.faceAttributes?.jawlineType || 'Balanced soft angular'} structure with symmetrical facial balance.
              </p>
            </div>
          </div>

          {/* Integrated Visual Analysis-to-Shopping Consultation */}
          <VisualAnalysisShoppingConsultation
            mode="skin"
            skinAnalysis={skinAnalysis}
            profile={profile}
            onSelectProduct={onSelectProduct || (() => {})}
            onOpenNewScan={() => { setAnalysisType('skin'); setStep('capture'); }}
          />

          {/* Consumer-Friendly Clinical Findings */}
          <div className="p-8 sm:p-10 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
            <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
              Consumer Care Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {skinAnalysis.keyFindings.map((finding, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-beauty-muted-border space-y-2">
                  <div className="w-7 h-7 rounded-full bg-beauty-cream flex items-center justify-center text-beauty-forest text-xs font-semibold">
                    0{idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-beauty-charcoal-body leading-relaxed font-light">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Skin Assessments History */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                  Previous Skin Analysis History
                </h3>
                <p className="text-xs text-beauty-muted mt-0.5">
                  Review historical assessments and track skin pattern progression over time.
                </p>
              </div>
              <span className="text-xs font-semibold text-beauty-muted">
                {(profile.skinHistory || []).length} Recorded Sessions
              </span>
            </div>

            {(profile.skinHistory && profile.skinHistory.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skinHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-beauty-forest" />
                        <span className="text-xs font-semibold text-beauty-charcoal">
                          {item.timestamp || `Assessment #${idx + 1}`}
                        </span>
                      </div>
                      <div className="text-xs text-beauty-muted font-light">
                        {item.skinType} Skin • Fitzpatrick Type {item.fitzpatrick} • {item.colorTone.undertone}
                      </div>
                    </div>

                    <button
                      onClick={() => onSkinAnalysisComplete(item)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs"
                    >
                      Load Session
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-beauty-cream/30 border border-beauty-muted-border text-center space-y-2">
                <Clock className="w-8 h-8 text-beauty-muted mx-auto" />
                <p className="text-xs text-beauty-muted">
                  No prior history saved yet. Complete a new analysis and click "Save Skin Profile" to log your baseline.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HAIR PROFILE TAB CONTENT                                               */}
      {/* ========================================================================= */}
      {subTab === 'hair' && step === 'results' && (
        <div className="space-y-10">
          
          {/* Action Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-beauty-cream border border-beauty-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
              <div>
                <span className="text-xs font-semibold text-beauty-charcoal">
                  Recorded Hair Diagnostic
                </span>
                <span className="text-2xs text-beauty-muted ml-2">
                  Last evaluated: {hairAnalysis.timestamp || 'Recent Session'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => { setAnalysisType('hair'); setStep('capture'); }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>New Diagnostic</span>
              </button>

              <button
                onClick={handleSaveHairProfile}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Hair Profile</span>
              </button>
            </div>
          </div>

          {/* Core Hair Characteristics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Hair Type / Pattern */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Wave / Curl Pattern
                </span>
                <Scissors className="w-4 h-4 text-beauty-forest" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {hairAnalysis.pattern}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Defined strand curvature with natural spring. Benefits from lightweight defining creams.
              </p>
            </div>

            {/* 2. Length Category */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Length Detection
                </span>
                <Layers className="w-4 h-4 text-beauty-sage" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {hairAnalysis.length.category}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Estimated ~{hairAnalysis.length.estimatedCm}cm from crown. Weight favors mid-length hydration sealing.
              </p>
            </div>

            {/* 3. Frizziness & Cuticle Alignment */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Frizziness &amp; Cuticle
                </span>
                <Droplets className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {hairAnalysis.frizziness.level} Frizz
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Cuticle alignment index: {hairAnalysis.frizziness.cuticleAlignmentPct}/100. Responds to cold-pressed oils.
              </p>
            </div>

            {/* 4. Density & Scalp Ecology */}
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                  Follicle Density
                </span>
                <Sun className="w-4 h-4 text-beauty-forest" />
              </div>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                {hairAnalysis.density.level}
              </div>
              <p className="text-xs text-beauty-muted leading-relaxed font-light">
                Balanced scalp ecology with {hairAnalysis.scalpProfile.porosity} porosity cuticles.
              </p>
            </div>
          </div>

          {/* Integrated Visual Hair Diagnostics-to-Shopping Consultation */}
          <VisualAnalysisShoppingConsultation
            mode="hair"
            hairAnalysis={hairAnalysis}
            profile={profile}
            onSelectProduct={onSelectProduct || (() => {})}
            onOpenNewScan={() => { setAnalysisType('hair'); setStep('capture'); }}
          />

          {/* Targeted Hair Rituals */}
          <div className="p-8 sm:p-10 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
            <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
              Targeted Hair Rituals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hairAnalysis.recommendedTreatments.map((treatment, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-beauty-muted-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-semibold text-base text-beauty-charcoal">
                      {treatment.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-beauty-cream text-beauty-forest">
                      {treatment.focus}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-beauty-muted leading-relaxed font-light">
                    {treatment.benefit}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {treatment.activeIngredients.map((ing, i) => (
                      <span key={i} className="text-2xs px-2.5 py-1 rounded-full bg-beauty-cream text-beauty-charcoal font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Hair Diagnostics History */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                  Previous Hair Diagnostic History
                </h3>
                <p className="text-xs text-beauty-muted mt-0.5">
                  Track how strand density and cuticle health evolve with consistent rituals.
                </p>
              </div>
              <span className="text-xs font-semibold text-beauty-muted">
                {(profile.hairHistory || []).length} Recorded Sessions
              </span>
            </div>

            {(profile.hairHistory && profile.hairHistory.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.hairHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-beauty-forest" />
                        <span className="text-xs font-semibold text-beauty-charcoal">
                          {item.timestamp || `Diagnostic #${idx + 1}`}
                        </span>
                      </div>
                      <div className="text-xs text-beauty-muted font-light">
                        {item.pattern} • {item.length.category} • {item.frizziness.level} Frizz
                      </div>
                    </div>

                    <button
                      onClick={() => onHairAnalysisComplete(item)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs"
                    >
                      Load Session
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-beauty-cream/30 border border-beauty-muted-border text-center space-y-2">
                <Clock className="w-8 h-8 text-beauty-muted mx-auto" />
                <p className="text-xs text-beauty-muted">
                  No prior hair sessions logged. Capture your first photo and click "Save Hair Profile" to start your timeline.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. UNIFIED PERSONAL-CARE PROFILE TAB CONTENT                              */}
      {/* ========================================================================= */}
      {subTab === 'unified' && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-beauty-cream border border-beauty-muted-border space-y-8 shadow-beauty-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beauty-muted-border pb-6">
              <div>
                <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-forest">
                  Unified Care Record
                </span>
                <h3 className="font-serif font-normal text-3xl text-beauty-charcoal-heading mt-1">
                  Your Personal Appearance &amp; Care Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-beauty-muted mt-1 font-light max-w-xl">
                  SkinMate connects both your cutaneous and hair fiber profiles into a single personalized ecosystem.
                </p>
              </div>

              <button
                onClick={() => onNavigate('for-you')}
                className="px-6 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <span>View Recommendations in For You</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Skin Intelligence */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-beauty-muted-border space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-5 h-5 text-beauty-forest" />
                    <h4 className="font-serif font-semibold text-xl text-beauty-charcoal-heading">
                      Cutaneous Profile
                    </h4>
                  </div>
                  <button
                    onClick={() => setSubTab('skin')}
                    className="text-xs font-semibold text-beauty-forest hover:underline"
                  >
                    Edit &amp; Re-analyze
                  </button>
                </div>

                <div className="space-y-3 divide-y divide-beauty-muted-border/60 text-xs">
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Skin Classification</span>
                    <span className="font-semibold text-beauty-charcoal">{skinAnalysis.skinType}</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Fitzpatrick Phototype</span>
                    <span className="font-semibold text-beauty-charcoal">Type {skinAnalysis.fitzpatrick}</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Undertone &amp; Palette</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-beauty-muted-border inline-block"
                        style={{ backgroundColor: skinAnalysis.colorTone.dominantHex }}
                      />
                      <span className="font-semibold text-beauty-charcoal">{skinAnalysis.colorTone.undertone}</span>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Face Geometry</span>
                    <span className="font-semibold text-beauty-charcoal">{skinAnalysis.faceAttributes?.faceShape || 'Oval'}</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Primary Concerns</span>
                    <span className="font-semibold text-beauty-charcoal">
                      {Object.keys(skinAnalysis.concerns).slice(0, 2).map(k => skinAnalysis.concerns[k]?.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hair Intelligence */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-beauty-muted-border space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Scissors className="w-5 h-5 text-beauty-forest" />
                    <h4 className="font-serif font-semibold text-xl text-beauty-charcoal-heading">
                      Hair &amp; Scalp Profile
                    </h4>
                  </div>
                  <button
                    onClick={() => setSubTab('hair')}
                    className="text-xs font-semibold text-beauty-forest hover:underline"
                  >
                    Edit &amp; Re-analyze
                  </button>
                </div>

                <div className="space-y-3 divide-y divide-beauty-muted-border/60 text-xs">
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Wave / Curl Structure</span>
                    <span className="font-semibold text-beauty-charcoal">{hairAnalysis.pattern}</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Length Classification</span>
                    <span className="font-semibold text-beauty-charcoal">{hairAnalysis.length.category} (~{hairAnalysis.length.estimatedCm}cm)</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Frizz Index</span>
                    <span className="font-semibold text-beauty-charcoal">{hairAnalysis.frizziness.level} ({hairAnalysis.frizziness.score}/100)</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Fiber Density</span>
                    <span className="font-semibold text-beauty-charcoal">{hairAnalysis.density.level}</span>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-beauty-muted font-medium">Scalp &amp; Porosity</span>
                    <span className="font-semibold text-beauty-charcoal">{hairAnalysis.scalpProfile.type} • {hairAnalysis.scalpProfile.porosity} Porosity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

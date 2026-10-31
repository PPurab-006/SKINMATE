import React, { useState } from 'react';
import { 
  Sparkles, 
  Scissors, 
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
  Info
} from 'lucide-react';
import { SkinAnalysisResult, ImageQualityCheck } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { Product } from '../../types/product';
import { AppTab, DiscoverViewMode } from '../../types/common';
import { SkinService } from '../../services/youcam/skinService';
import { HairService } from '../../services/youcam/hairService';
import { SplitSlider } from '../common/SplitSlider';
import { CameraCapture } from '../common/CameraCapture';
import { ImageDropzone } from '../common/ImageDropzone';
import { SkinConcernsVisualizer } from '../skin/SkinConcernsVisualizer';
import { Badge } from '../common/Badge';
import { ProductImage } from '../common/ProductImage';

interface DiscoverViewProps {
  initialMode?: DiscoverViewMode;
  skinAnalysis: SkinAnalysisResult;
  hairAnalysis: HairAnalysisResult;
  onSkinAnalysisComplete: (result: SkinAnalysisResult) => void;
  onHairAnalysisComplete: (result: HairAnalysisResult) => void;
  onNavigate: (tab: AppTab) => void;
  onSelectProduct: (product: Product) => void;
  recommendedProducts: Product[];
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  initialMode = 'overview',
  skinAnalysis,
  hairAnalysis,
  onSkinAnalysisComplete,
  onHairAnalysisComplete,
  onNavigate,
  onSelectProduct,
  recommendedProducts
}) => {
  const [activeMode, setActiveMode] = useState<DiscoverViewMode>(initialMode);
  const [step, setStep] = useState<'intro' | 'capture' | 'analyzing' | 'results'>('results');
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeConcernKey, setActiveConcernKey] = useState<string>('pores');
  const [simulationWeek, setSimulationWeek] = useState<4 | 8 | 12>(8);
  const [isSampleDemo, setIsSampleDemo] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);

  // Handlers for starting new skin scan
  const handleStartSkinAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setScanError(null);
    setIsLiveCameraOpen(false);
    setStep('analyzing');
    setIsAnalyzing(true);

    try {
      const result = await SkinService.analyzeSkin(file, previewUrl);
      onSkinAnalysisComplete(result);
      setIsSampleDemo(false);
      setStep('results');
    } catch (err: any) {
      console.error('Live skin consultation failed:', err);
      setScanError(err.message || 'Live YouCam skin analysis encountered an issue. Please verify lighting and try again.');
      setStep('capture');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handlers for starting new hair scan
  const handleStartHairAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setScanError(null);
    setIsLiveCameraOpen(false);
    setStep('analyzing');
    setIsAnalyzing(true);

    try {
      const result = await HairService.analyzeHair(file, previewUrl);
      onHairAnalysisComplete(result);
      setIsSampleDemo(false);
      setStep('results');
    } catch (err: any) {
      console.error('Live hair consultation failed:', err);
      setScanError(err.message || 'Live YouCam hair diagnostics encountered an issue. Please verify hair visibility and try again.');
      setStep('capture');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulationImageMap = {
    4: skinAnalysis.simulationPreviews?.weeks4 || skinAnalysis.imageUrl,
    8: skinAnalysis.simulationPreviews?.weeks8 || skinAnalysis.imageUrl,
    12: skinAnalysis.simulationPreviews?.weeks12 || skinAnalysis.imageUrl,
  };

  const currentConcern = skinAnalysis.concerns[activeConcernKey] || Object.values(skinAnalysis.concerns)[0];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beauty-muted-border pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-beauty-forest font-sans">
            Personal Care Intelligence
          </span>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading mt-1">
            Discover your care
          </h1>
          <p className="text-xs sm:text-sm text-beauty-muted mt-1 font-light">
            Guided consultations designed to help you understand your skin and hair in understandable language.
          </p>
        </div>

        {/* Consultation Selector Pill */}
        <div className="flex items-center p-1.5 rounded-full bg-beauty-cream border border-beauty-muted-border self-start sm:self-auto">
          <button
            onClick={() => { setActiveMode('skin-consultation'); setStep('results'); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeMode === 'skin-consultation'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs'
                : 'text-beauty-charcoal hover:text-beauty-forest'
            }`}
          >
            Skin Consultation
          </button>
          <button
            onClick={() => { setActiveMode('hair-consultation'); setStep('results'); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeMode === 'hair-consultation'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs'
                : 'text-beauty-charcoal hover:text-beauty-forest'
            }`}
          >
            Hair Consultation
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SKIN CONSULTATION EXPERIENCE                          */}
      {/* ======================================================== */}
      {activeMode === 'skin-consultation' && (
        <div className="space-y-10">
          
          {/* Status Banner: Sample Demo vs Actual User Data */}
          <div className="p-4 rounded-2xl bg-beauty-cream/80 border border-beauty-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
              <div className="text-xs text-beauty-charcoal">
                <span className="font-semibold">
                  {isSampleDemo ? 'Sample Demonstration Profile' : 'Your Personal Skin Consultation'}
                </span>
                <span className="text-beauty-muted ml-2">
                  {isSampleDemo ? 'Showing typical combination olive skin patterns' : 'Captured via camera'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep('capture')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Your Own Consultation</span>
            </button>
          </div>

          {/* Guided Capture Step (When user clicks take photo) */}
          {step === 'capture' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                    Let's understand your skin.
                  </h3>
                  <p className="text-xs sm:text-sm text-beauty-muted mt-1 max-w-md">
                    Take a quick photo to explore your skin profile and discover a care routine that suits you.
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
                    <span className="font-semibold">Live YouCam Provider Feedback: </span>
                    <span>{scanError}</span>
                  </div>
                </div>
              )}

              {isLiveCameraOpen ? (
                <CameraCapture
                  onCapture={(file, previewUrl) => handleStartSkinAnalysis(file, previewUrl, {} as ImageQualityCheck)}
                  onCancel={() => setIsLiveCameraOpen(false)}
                />
              ) : (
                <ImageDropzone
                  onImageSelected={handleStartSkinAnalysis}
                  onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
                  title="Share your natural photo"
                  subtitle="A relaxed frontal portrait in soft daylight provides the most natural insight."
                />
              )}
            </div>
          )}

          {/* Calming Processing Transition */}
          {step === 'analyzing' && (
            <div className="p-16 rounded-3xl bg-white border border-beauty-muted-border text-center space-y-4 shadow-beauty-card">
              <div className="w-16 h-16 rounded-full border-4 border-beauty-forest border-t-transparent animate-spin mx-auto text-beauty-forest" />
              <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                Understanding your skin profile...
              </h3>
              <p className="text-xs sm:text-sm text-beauty-muted max-w-md mx-auto font-light">
                Looking at natural hydration patterns, surface oil balance, and gentle care priorities.
              </p>
            </div>
          )}

          {/* Step 5 & 6: Results & Human-Understandable Guidance */}
          {step === 'results' && (
            <div className="space-y-10">
              
              {/* Profile Summary Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Skin Classification
                  </span>
                  <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                    {skinAnalysis.skinType} Skin
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Natural oil activity along the forehead and nose, with comfortable balance across cheeks.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Tone &amp; Undertone
                  </span>
                  <div className="flex items-center gap-2.5 font-serif text-2xl font-normal text-beauty-charcoal-heading">
                    <span
                      className="w-5 h-5 rounded-full border border-beauty-muted-border shrink-0"
                      style={{ backgroundColor: skinAnalysis.colorTone.dominantHex }}
                    />
                    <span>{skinAnalysis.colorTone.undertone} Tone</span>
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Fitzpatrick Type {skinAnalysis.fitzpatrick} palette. Harmonizes with terracotta and earth tones.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Daily Care Focus
                  </span>
                  <div className="font-serif text-xl font-normal text-beauty-forest">
                    Barrier &amp; Sebum Balance
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Gentle niacinamide daytime buffering paired with evening ceramide nourishment.
                  </p>
                </div>
              </div>

              {/* Understandable Findings & Key Observations */}
              <div className="p-8 sm:p-10 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
                <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                  What your skin loves
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skinAnalysis.keyFindings.map((finding, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-beauty-muted-border space-y-2">
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

              {/* Interactive Visual Progression Simulation (Draggable Slider) */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                      Visualizing your routine's progress
                    </h3>
                    <p className="text-xs sm:text-sm text-beauty-muted mt-1 font-light">
                      See how consistent daily hydration and UV protection support natural skin radiance over time.
                    </p>
                  </div>

                  {/* Week selector */}
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-beauty-cream border border-beauty-muted-border self-start sm:self-auto">
                    <button
                      onClick={() => setSimulationWeek(4)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        simulationWeek === 4 ? 'bg-beauty-forest text-beauty-ivory' : 'text-beauty-charcoal'
                      }`}
                    >
                      4 Weeks
                    </button>
                    <button
                      onClick={() => setSimulationWeek(8)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        simulationWeek === 8 ? 'bg-beauty-forest text-beauty-ivory' : 'text-beauty-charcoal'
                      }`}
                    >
                      8 Weeks
                    </button>
                    <button
                      onClick={() => setSimulationWeek(12)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        simulationWeek === 12 ? 'bg-beauty-forest text-beauty-ivory' : 'text-beauty-charcoal'
                      }`}
                    >
                      12 Weeks
                    </button>
                  </div>
                </div>

                <div className="max-w-xl mx-auto">
                  <SplitSlider
                    beforeImage={skinAnalysis.imageUrl}
                    afterImage={simulationImageMap[simulationWeek]}
                    beforeLabel="Baseline"
                    afterLabel={`${simulationWeek} Weeks Consistent Care`}
                    aspectRatio="aspect-[3/4]"
                  />
                </div>
              </div>

              {/* Matching Care Recommendations */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                      Tailored care matches
                    </h3>
                    <p className="text-xs sm:text-sm text-beauty-muted mt-0.5 font-light">
                      Vetted products that harmonize with your skin profile.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('routine')}
                    className="text-xs font-semibold text-beauty-forest hover:underline flex items-center gap-1"
                  >
                    <span>View in My Routine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProducts.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="p-4 rounded-3xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card flex items-center gap-4 cursor-pointer group"
                    >
                      <ProductImage
                        product={prod}
                        className="w-16 h-16 rounded-2xl shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-2xs font-semibold uppercase text-beauty-muted">
                          {prod.brand}
                        </span>
                        <h4 className="font-medium text-xs text-beauty-charcoal line-clamp-1 group-hover:text-beauty-forest transition-colors">
                          {prod.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-beauty-charcoal mt-1">
                          {prod.price !== null ? `₹${prod.price.toLocaleString('en-IN')}` : 'Price on Google'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HAIR CONSULTATION EXPERIENCE                          */}
      {/* ======================================================== */}
      {activeMode === 'hair-consultation' && (
        <div className="space-y-10">
          
          <div className="p-4 rounded-2xl bg-beauty-cream/80 border border-beauty-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
              <div className="text-xs text-beauty-charcoal">
                <span className="font-semibold">
                  {isSampleDemo ? 'Sample Demonstration Profile' : 'Your Personal Hair Consultation'}
                </span>
                <span className="text-beauty-muted ml-2">
                  {isSampleDemo ? 'Showing natural 2B wave pattern and medium porosity' : 'Captured via camera'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep('capture')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Hair Photo</span>
            </button>
          </div>

          {step === 'capture' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                    Let's explore your hair.
                  </h3>
                  <p className="text-xs sm:text-sm text-beauty-muted mt-1 max-w-md">
                    Upload or take a photo showing your natural hair length and wave definition.
                  </p>
                </div>
                <button
                  onClick={() => setStep('results')}
                  className="text-xs text-beauty-muted hover:text-beauty-charcoal underline"
                >
                  Cancel
                </button>
              </div>

              {scanError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 animate-fade-in">
                  <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Live YouCam Provider Feedback: </span>
                    <span>{scanError}</span>
                  </div>
                </div>
              )}

              <ImageDropzone
                onImageSelected={handleStartHairAnalysis}
                onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
                title="Share hair portrait"
                subtitle="A clear view from crown to mid-length shows natural wave and texture best."
              />
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-10">
              {/* Hair Profile Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Wave &amp; Curl Pattern
                  </span>
                  <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                    {hairAnalysis.pattern}
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Natural S-wave definition with healthy volume. Loves lightweight defining creams.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Cuticle Porosity
                  </span>
                  <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                    {hairAnalysis.scalpProfile.porosity} Porosity
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Cuticles absorb moisture easily. Seal with cold-pressed oils to prevent humidity frizz.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                    Scalp Ecology
                  </span>
                  <div className="font-serif text-2xl font-normal text-beauty-charcoal-heading">
                    {hairAnalysis.scalpProfile.type}
                  </div>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Balanced follicle sebum output. Ideal for sulfate-free gentle cleansers.
                  </p>
                </div>
              </div>

              {/* Hair Care Treatments */}
              <div className="p-8 sm:p-10 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-6">
                <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                  Targeted hair rituals
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
                          <span key={i} className="text-2xs px-2.5 py-1 rounded-full bg-beauty-cream text-beauty-charcoal">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

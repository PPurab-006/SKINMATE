import React, { useState } from 'react';
import { 
  Scissors, 
  Camera, 
  Upload, 
  Sparkles, 
  Droplets, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Wind
} from 'lucide-react';
import { HairAnalysisResult } from '../../types/hair';
import { HairService } from '../../services/youcam/hairService';
import { ImageDropzone } from '../common/ImageDropzone';
import { CameraCapture } from '../common/CameraCapture';
import { Badge } from '../common/Badge';
import { AppTab } from '../../types/common';
import { Product } from '../../types/product';
import { ImageQualityCheck } from '../../types/skin';

interface HairLabProps {
  currentAnalysis: HairAnalysisResult;
  onAnalysisComplete: (result: HairAnalysisResult) => void;
  onNavigate: (tab: AppTab) => void;
  onSelectProduct: (product: Product) => void;
}

export const HairLab: React.FC<HairLabProps> = ({
  currentAnalysis,
  onAnalysisComplete,
  onNavigate,
}) => {
  const [isScanningMode, setIsScanningMode] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setIsScanningMode(false);
    setIsLiveCameraOpen(false);
    setIsAnalyzing(true);

    try {
      const result = await HairService.analyzeHair(file, previewUrl);
      onAnalysisComplete(result);
    } catch (err) {
      console.error('Hair analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">Follicle &amp; Fiber Vision</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">YouCam Hair Intelligence</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            Hair &amp; Scalp Intelligence Lab
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Automated wave pattern classification, cuticle porosity mapping, and strand density profiling.
          </p>
        </div>

        <button
          onClick={() => setIsScanningMode(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Camera className="w-4 h-4 stroke-[2.2]" />
          <span>New Hair Scan</span>
        </button>
      </div>

      {/* Upload / Camera Mode */}
      {isScanningMode && (
        <div className="p-6 sm:p-8 rounded-3xl border border-editorial-lime/30 bg-editorial-surface shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Capture or Upload Hair Image</h3>
              <p className="text-xs text-editorial-text-secondary">Include clear root-to-end hair strands with visible curl pattern</p>
            </div>
            <button
              onClick={() => { setIsScanningMode(false); setIsLiveCameraOpen(false); }}
              className="px-3 py-1 text-xs text-editorial-text-secondary hover:text-white rounded-lg bg-white/[0.04]"
            >
              Cancel
            </button>
          </div>

          {isLiveCameraOpen ? (
            <CameraCapture
              onCapture={(file, previewUrl) => handleStartAnalysis(file, previewUrl, {} as ImageQualityCheck)}
              onCancel={() => setIsLiveCameraOpen(false)}
            />
          ) : (
            <ImageDropzone
              onImageSelected={handleStartAnalysis}
              onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
              title="Upload Hair Portrait"
              subtitle="Clear crown and length view for pattern and cuticle alignment detection"
            />
          )}
        </div>
      )}

      {/* Analyzing Loader */}
      {isAnalyzing && (
        <div className="p-12 rounded-3xl border border-editorial-lime/40 bg-editorial-surface text-center flex flex-col items-center justify-center space-y-4 shadow-lime-glow animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-editorial-lime border-t-transparent animate-spin flex items-center justify-center text-editorial-lime" />
          <h3 className="font-display font-bold text-lg text-white">Segmenting Hair Strands &amp; Texture</h3>
          <p className="text-xs text-editorial-text-secondary max-w-sm">
            Analyzing curl curvature radius, cuticle scale refraction, and follicle population count...
          </p>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hair Pattern */}
        <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-2">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted font-mono">Hair Pattern Type</span>
          <div className="text-2xl font-display font-bold text-white">
            {currentAnalysis.pattern}
          </div>
          <span className="text-2xs text-editorial-lime font-mono">
            S-Wave Undulation
          </span>
        </div>

        {/* Estimated Length */}
        <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-2">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted font-mono">Length Analysis</span>
          <div className="text-2xl font-mono font-bold text-white">
            ~{currentAnalysis.length.estimatedCm} <span className="text-sm font-normal text-editorial-text-muted">cm</span>
          </div>
          <span className="text-2xs text-editorial-text-secondary">
            {currentAnalysis.length.category} Range
          </span>
        </div>

        {/* Frizziness & Cuticle */}
        <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-2">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted font-mono">Cuticle Alignment</span>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {currentAnalysis.frizziness.cuticleAlignmentPct}%
          </div>
          <span className="text-2xs text-amber-400 font-mono">
            {currentAnalysis.frizziness.level} Frizz Susceptibility
          </span>
        </div>

        {/* Follicle Density */}
        <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-2">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted font-mono">Follicle Density</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {currentAnalysis.density.follicleDensityScore}
            <span className="text-xs font-normal text-editorial-text-muted"> /cm²</span>
          </div>
          <span className="text-2xs text-emerald-400 font-mono">
            {currentAnalysis.density.level}
          </span>
        </div>
      </div>

      {/* Main Body: Image Preview & Diagnostic Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hair Portrait with Diagnostic Overlays */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl">
            <img
              src={currentAnalysis.imageUrl}
              alt="Hair Portrait Diagnostic"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Pattern Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="lime" size="md">
                {currentAnalysis.pattern}
              </Badge>
            </div>

            {/* Bottom Strand Info */}
            <div className="absolute bottom-4 inset-x-4">
              <div className="p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-semibold">Cuticle Porosity: {currentAnalysis.scalpProfile.porosity}</div>
                  <div className="text-2xs text-editorial-text-muted font-mono">Moisture Retention: {currentAnalysis.scalpProfile.moistureRetention}%</div>
                </div>
                <Droplets className="w-5 h-5 text-sky-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scalp Profile, Porosity Guide & Clinical Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Diagnostic Observations */}
          <div className="p-6 rounded-2xl border border-white/10 bg-editorial-surface space-y-3">
            <h3 className="font-display font-bold text-base text-white">
              AI Follicle &amp; Cuticle Findings
            </h3>
            <ul className="space-y-2.5">
              {currentAnalysis.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-editorial-text-secondary leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-editorial-lime shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Porosity & Scalp Breakdown */}
          <div className="p-6 rounded-2xl border border-white/10 bg-editorial-surface space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Porosity &amp; Moisture Dynamics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-editorial-card border border-white/[0.06] space-y-1.5">
                <span className="text-2xs font-mono uppercase text-editorial-text-muted">Porosity Classification</span>
                <div className="text-sm font-bold text-white">Medium (Balanced) Porosity</div>
                <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                  Cuticle scales open evenly for moisture absorption. Requires lightweight hydrophobic oil sealing to prevent ambient moisture fuzz.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-editorial-card border border-white/[0.06] space-y-1.5">
                <span className="text-2xs font-mono uppercase text-editorial-text-muted">Scalp Ecology</span>
                <div className="text-sm font-bold text-white">{currentAnalysis.scalpProfile.type} Sebum Balance</div>
                <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                  Healthy lipid secretion without hyper-keratinized follicular buildup. Safe for sulfate-free surfactants.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Treatments */}
          <div className="p-6 rounded-2xl border border-white/10 bg-editorial-surface space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Targeted Active Care Protocols
            </h3>

            <div className="space-y-3">
              {currentAnalysis.recommendedTreatments.map((treatment, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-editorial-card border border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">
                      {treatment.title}
                    </h4>
                    <span className="text-2xs font-mono px-2 py-0.5 rounded bg-editorial-lime/10 text-editorial-lime font-bold">
                      {treatment.focus}
                    </span>
                  </div>

                  <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                    {treatment.benefit}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {treatment.activeIngredients.map((ing, k) => (
                      <span key={k} className="text-2xs px-2 py-0.5 rounded bg-white/[0.04] text-editorial-text-primary border border-white/[0.06]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('routine-builder')}
              className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white/[0.06] hover:bg-editorial-lime hover:text-black border border-white/10 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Add Recommended Haircare Steps to My Care Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

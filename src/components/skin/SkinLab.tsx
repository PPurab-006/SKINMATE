import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Clock, 
  Calendar,
  Eye,
  Sliders,
  ArrowRight,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { SkinAnalysisResult, SkinConcernMetric, ImageQualityCheck } from '../../types/skin';
import { SkinService } from '../../services/youcam/skinService';
import { SplitSlider } from '../common/SplitSlider';
import { CameraCapture } from '../common/CameraCapture';
import { ImageDropzone } from '../common/ImageDropzone';
import { SkinConcernsVisualizer } from './SkinConcernsVisualizer';
import { Badge } from '../common/Badge';
import { Product } from '../../types/product';
import { AppTab } from '../../types/common';

interface SkinLabProps {
  currentAnalysis: SkinAnalysisResult;
  onAnalysisComplete: (result: SkinAnalysisResult) => void;
  onNavigate: (tab: AppTab) => void;
  onSelectProduct: (product: Product) => void;
}

export const SkinLab: React.FC<SkinLabProps> = ({
  currentAnalysis,
  onAnalysisComplete,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'concerns' | 'simulation' | 'tones' | 'history'>('concerns');
  const [selectedConcernKey, setSelectedConcernKey] = useState<string>('pores');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isScanningMode, setIsScanningMode] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simulationWeek, setSimulationWeek] = useState<4 | 8 | 12>(8);

  const activeConcern: SkinConcernMetric = currentAnalysis.concerns[selectedConcernKey] || Object.values(currentAnalysis.concerns)[0];

  const handleStartAnalysis = async (file: File, previewUrl: string, _quality: ImageQualityCheck) => {
    setIsScanningMode(false);
    setIsLiveCameraOpen(false);
    setIsAnalyzing(true);

    try {
      const result = await SkinService.analyzeSkin(file, previewUrl);
      onAnalysisComplete(result);
    } catch (err) {
      console.error('Skin analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulationImageMap = {
    4: currentAnalysis.simulationPreviews?.weeks4 || currentAnalysis.imageUrl,
    8: currentAnalysis.simulationPreviews?.weeks8 || currentAnalysis.imageUrl,
    12: currentAnalysis.simulationPreviews?.weeks12 || currentAnalysis.imageUrl,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">Computer Vision Suite</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">YouCam S2S Pipeline</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            Skin Intelligence Lab
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Multispectral evaluation of 8 dermal dimensions, barrier integrity, and pigmentation indices.
          </p>
        </div>

        <button
          onClick={() => setIsScanningMode(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Camera className="w-4 h-4 stroke-[2.2]" />
          <span>New Dermal Scan</span>
        </button>
      </div>

      {/* Upload / Camera Scan Modal View */}
      {isScanningMode && (
        <div className="p-6 sm:p-8 rounded-3xl border border-editorial-lime/30 bg-editorial-surface/95 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Capture or Upload Diagnostic Selfie</h3>
              <p className="text-xs text-editorial-text-secondary">Direct illumination with minimal shadow gradient produces optimal results</p>
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
            />
          )}
        </div>
      )}

      {/* Analyzing Scanning Loader State */}
      {isAnalyzing && (
        <div className="p-12 rounded-3xl border border-editorial-lime/40 bg-editorial-surface text-center flex flex-col items-center justify-center space-y-4 shadow-lime-glow animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-editorial-lime border-t-transparent animate-spin flex items-center justify-center text-editorial-lime" />
          <h3 className="font-display font-bold text-lg text-white">Processing Facial Bio-Markers</h3>
          <p className="text-xs text-editorial-text-secondary max-w-sm">
            Calculating cellular sebum density, micro-vascular redness distribution, and stratum corneum texture matrices...
          </p>
        </div>
      )}

      {/* Primary Metrics Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Overall Score */}
        <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-col justify-between">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted">Health Index</span>
          <div className="text-3xl font-bold font-mono text-editorial-lime my-1">
            {currentAnalysis.overallScore}
            <span className="text-sm font-normal text-editorial-text-muted">/100</span>
          </div>
          <span className="text-2xs text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> Robust Barrier
          </span>
        </div>

        {/* Biological Skin Age */}
        <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-col justify-between">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted">Biological Age</span>
          <div className="text-3xl font-bold font-mono text-white my-1">
            {currentAnalysis.skinAge}
            <span className="text-sm font-normal text-emerald-400 pl-1">yrs</span>
          </div>
          <span className="text-2xs text-emerald-400 font-mono">
            2 yrs younger than chron.
          </span>
        </div>

        {/* Skin Type */}
        <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-col justify-between">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted">Dermal Classification</span>
          <div className="text-lg font-bold font-display text-white my-1">
            {currentAnalysis.skinType}
          </div>
          <span className="text-2xs text-editorial-text-secondary">
            Oily T-Zone • Dry Cheeks
          </span>
        </div>

        {/* Fitzpatrick Type */}
        <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-col justify-between">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted">Phototype Scale</span>
          <div className="text-lg font-bold font-mono text-white my-1">
            Type {currentAnalysis.fitzpatrick}
          </div>
          <span className="text-2xs text-editorial-text-secondary">
            Olive / High UV Resilience
          </span>
        </div>

        {/* Tone & Season */}
        <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-col justify-between col-span-2 lg:col-span-1">
          <span className="text-2xs uppercase tracking-wider text-editorial-text-muted">Color Palette</span>
          <div className="flex items-center gap-2 my-1">
            <span
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: currentAnalysis.colorTone.dominantHex }}
            />
            <span className="text-sm font-semibold text-white font-mono">
              {currentAnalysis.colorTone.undertone}
            </span>
          </div>
          <span className="text-2xs text-editorial-text-secondary truncate">
            {currentAnalysis.colorTone.seasonPalette}
          </span>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('concerns')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'concerns'
              ? 'bg-editorial-lime/10 text-editorial-lime border border-editorial-lime/30'
              : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          Concerns Deep Dive &amp; Heatmaps
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'simulation'
              ? 'bg-editorial-lime/10 text-editorial-lime border border-editorial-lime/30'
              : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          Before &amp; After Simulation
        </button>
        <button
          onClick={() => setActiveTab('tones')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'tones'
              ? 'bg-editorial-lime/10 text-editorial-lime border border-editorial-lime/30'
              : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          Facial Color Tone Analysis
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-editorial-lime/10 text-editorial-lime border border-editorial-lime/30'
              : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          Analysis History
        </button>
      </div>

      {/* TAB 1: CONCERNS DEEP DIVE */}
      {activeTab === 'concerns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Face Canvas with Markers */}
          <div className="lg:col-span-5 space-y-3">
            <SkinConcernsVisualizer
              imageUrl={currentAnalysis.imageUrl}
              activeConcern={activeConcern}
              showHeatmap={showHeatmap}
            />

            <div className="flex items-center justify-between p-3 rounded-xl bg-editorial-surface border border-white/[0.08] text-2xs">
              <span className="text-editorial-text-secondary">Overlay Markers:</span>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1 rounded-md font-mono uppercase tracking-wider font-semibold ${
                  showHeatmap ? 'bg-editorial-lime text-black' : 'bg-editorial-card text-white'
                }`}
              >
                {showHeatmap ? 'Heatmap Enabled' : 'Heatmap Hidden'}
              </button>
            </div>
          </div>

          {/* Right Column: Diagnostic Controls & Concern Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Concern Selector Pills Grid */}
            <div>
              <div className="text-2xs uppercase tracking-wider text-editorial-text-muted mb-2 font-mono">
                Select Skin Dimension
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(currentAnalysis.concerns).map(([key, concern]) => {
                  const isSelected = selectedConcernKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedConcernKey(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-editorial-lime bg-editorial-lime/10 shadow-subtle-glow'
                          : 'border-white/[0.08] bg-editorial-surface hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xs uppercase tracking-wider text-editorial-text-muted truncate">
                        {concern.name.split(' ')[0]}
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className={`font-mono text-base font-bold ${isSelected ? 'text-editorial-lime' : 'text-white'}`}>
                          {concern.score}
                        </span>
                        <span className={`text-[10px] font-mono capitalize ${
                          concern.severity === 'low' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {concern.severity}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Concern Detail Box */}
            <div className="p-6 rounded-2xl border border-white/10 bg-editorial-surface space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {activeConcern.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-editorial-lime font-bold">
                      Score {activeConcern.score}/100
                    </span>
                    <span className="text-editorial-text-muted">•</span>
                    <span className="text-xs text-editorial-text-secondary capitalize">
                      {activeConcern.severity} Severity Index
                    </span>
                  </div>
                </div>

                <Badge
                  variant={activeConcern.severity === 'low' ? 'green' : 'amber'}
                  size="md"
                >
                  {activeConcern.severity}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-editorial-text-secondary leading-relaxed">
                {activeConcern.description}
              </p>

              {/* Affected Anatomical Regions */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-2xs uppercase tracking-wider text-editorial-text-muted font-mono mb-2">
                  Primary Anatomical Zones
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeConcern.affectedRegions.map((region, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-2xs rounded-lg bg-editorial-card border border-white/[0.08] text-white/90"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Targeted Clinical Focus */}
            <div className="p-6 rounded-2xl border border-white/10 bg-editorial-surface space-y-3">
              <h4 className="font-display font-semibold text-sm text-white">
                Personalized Care Strategy
              </h4>
              <ul className="space-y-2">
                {currentAnalysis.recommendedFocus.map((focus, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-editorial-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-editorial-lime shrink-0 mt-0.5" />
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('routine-builder')}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white/[0.06] hover:bg-editorial-lime hover:text-black border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <span>Build Regimen Around These Concerns in My Care</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEFORE & AFTER SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Skin Progression Simulation
              </h3>
              <p className="text-xs text-editorial-text-secondary mt-0.5">
                Predictive simulation of cellular barrier hydration and texture smoothing under a compliant routine
              </p>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-editorial-card border border-white/10">
              <button
                onClick={() => setSimulationWeek(4)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  simulationWeek === 4 ? 'bg-editorial-lime text-black font-bold' : 'text-editorial-text-secondary'
                }`}
              >
                4 Weeks
              </button>
              <button
                onClick={() => setSimulationWeek(8)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  simulationWeek === 8 ? 'bg-editorial-lime text-black font-bold' : 'text-editorial-text-secondary'
                }`}
              >
                8 Weeks
              </button>
              <button
                onClick={() => setSimulationWeek(12)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  simulationWeek === 12 ? 'bg-editorial-lime text-black font-bold' : 'text-editorial-text-secondary'
                }`}
              >
                12 Weeks
              </button>
            </div>
          </div>

          {/* Interactive Split Slider */}
          <div className="max-w-2xl mx-auto">
            <SplitSlider
              beforeImage={currentAnalysis.imageUrl}
              afterImage={simulationImageMap[simulationWeek]}
              beforeLabel="Day 0 Baseline"
              afterLabel={`Simulated Week ${simulationWeek}`}
              aspectRatio="aspect-[3/4]"
            />
          </div>

          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-editorial-card/60 border border-white/[0.06] text-xs text-editorial-text-secondary text-center leading-relaxed">
            Projected metrics at {simulationWeek} weeks: +18% hydration retention, -24% sebum oxidation in central T-zone, and uniform stratum corneum light reflection.
          </div>
        </div>
      )}

      {/* TAB 3: FACIAL COLOR TONES */}
      {activeTab === 'tones' && (
        <div className="p-8 rounded-3xl border border-white/10 bg-editorial-surface space-y-6">
          <div className="max-w-xl">
            <h3 className="font-display font-bold text-xl text-white">Facial Chromophore &amp; Tone Analyzer</h3>
            <p className="text-xs text-editorial-text-secondary mt-1">
              Spectral breakdown of melanin density, hemoglobin redness distribution, and seasonal color harmonies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-editorial-card border border-white/[0.06] space-y-3">
              <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">Undertone Metric</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white/20 shadow-md"
                  style={{ backgroundColor: currentAnalysis.colorTone.dominantHex }}
                />
                <div>
                  <div className="font-bold text-white text-base">{currentAnalysis.colorTone.undertone}</div>
                  <div className="text-2xs font-mono text-editorial-text-muted">{currentAnalysis.colorTone.dominantHex}</div>
                </div>
              </div>
              <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                Balanced yellow and green carotene undertones common in Mediterranean and South Asian Fitzpatrick IV skin.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-editorial-card border border-white/[0.06] space-y-3">
              <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">Melanin Index</span>
              <div className="text-3xl font-bold font-mono text-white">
                {currentAnalysis.colorTone.melaninIndex}
                <span className="text-xs font-normal text-editorial-text-muted"> /100</span>
              </div>
              <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                Moderate-to-high eumelanin offers high natural resistance against sunburn, but increases tendency for post-inflammatory hyperpigmentation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-editorial-card border border-white/[0.06] space-y-3">
              <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">Palette Harmony</span>
              <div className="text-base font-bold text-white font-display">
                {currentAnalysis.colorTone.seasonPalette}
              </div>
              <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                Optimal cosmetic accents: Terracotta, spiced cinnamon, warm espresso, olive khakis, and champagne gold.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="p-8 rounded-3xl border border-white/10 bg-editorial-surface space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Diagnostic Timeline</h3>
              <p className="text-xs text-editorial-text-secondary">Historical dermal evaluations and progress logs</p>
            </div>
            <span className="text-xs font-mono text-editorial-lime">1 Evaluation Recorded</span>
          </div>

          <div className="p-4 rounded-2xl bg-editorial-card border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentAnalysis.imageUrl}
                alt="Baseline Evaluation"
                className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
              <div>
                <div className="font-semibold text-sm text-white">Comprehensive Dermal Baseline Scan</div>
                <div className="text-2xs text-editorial-text-muted mt-0.5">{currentAnalysis.timestamp} • ID: {currentAnalysis.id}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-lg font-bold text-editorial-lime">
                {currentAnalysis.overallScore}/100
              </div>
              <div className="text-2xs text-emerald-400">Baseline Established</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

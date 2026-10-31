import React, { useState } from 'react';
import { 
  Palette, 
  Scissors, 
  Sparkles, 
  Smile, 
  Layers, 
  Camera, 
  Save, 
  Share2, 
  RotateCcw, 
  Sliders, 
  Check, 
  Eye, 
  Heart,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { StudioTab } from '../../types/common';
import { SavedLook } from '../../types/style';
import { 
  HAIRSTYLE_PRESETS, 
  HAIR_COLOR_PRESETS, 
  BEARD_PRESETS, 
  MAKEUP_LOOK_PRESETS, 
  NAIL_PRESETS, 
  FACE_SIMULATION_PRESETS 
} from '../../data/mockPresets';
import { SplitSlider } from '../common/SplitSlider';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { BeautyService } from '../../services/youcam/beautyService';
import { BeardService } from '../../services/youcam/beardService';
import { YouCamMockAdapter } from '../../services/youcam/mockAdapter';

interface StyleStudioProps {
  baseImageUrl: string;
  onSaveLook: (look: SavedLook) => void;
}

export const StyleStudio: React.FC<StyleStudioProps> = ({
  baseImageUrl,
  onSaveLook,
}) => {
  const [activeStudio, setActiveStudio] = useState<StudioTab>('hair');
  
  // Selected options state
  const [selectedHairstyle, setSelectedHairstyle] = useState(HAIRSTYLE_PRESETS[0].id);
  const [selectedHairColor, setSelectedHairColor] = useState(HAIR_COLOR_PRESETS[0].id);
  const [selectedBeard, setSelectedBeard] = useState(BEARD_PRESETS[0].id);
  const [selectedMakeup, setSelectedMakeup] = useState(MAKEUP_LOOK_PRESETS[0].id);
  const [selectedNail, setSelectedNail] = useState(NAIL_PRESETS[0].id);
  const [selectedFaceSim, setSelectedFaceSim] = useState(FACE_SIMULATION_PRESETS[0].id);

  // Sliders
  const [intensity, setIntensity] = useState(75);
  const [isComparing, setIsComparing] = useState(true);
  const [isProcessingEffect, setIsProcessingEffect] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lookTitleInput, setLookTitleInput] = useState('');
  const [toastSaved, setToastSaved] = useState(false);

  // Preview generated URL state
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(
    HAIRSTYLE_PRESETS[0].previewOverlayUrl || baseImageUrl
  );

  const handleHairstyleChange = async (styleId: string) => {
    setSelectedHairstyle(styleId);
    setIsProcessingEffect(true);
    const preset = HAIRSTYLE_PRESETS.find(h => h.id === styleId);
    if (preset?.previewOverlayUrl) {
      setPreviewImageUrl(preset.previewOverlayUrl);
    } else {
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'hair', styleId);
      setPreviewImageUrl(res.styledImageUrl);
    }
    setIsProcessingEffect(false);
  };

  const handleBeardChange = async (beardId: string) => {
    setSelectedBeard(beardId);
    setIsProcessingEffect(true);
    const url = await BeardService.applyBeardStyle(baseImageUrl, beardId);
    setPreviewImageUrl(url);
    setIsProcessingEffect(false);
  };

  const handleMakeupChange = async (makeupId: string) => {
    setSelectedMakeup(makeupId);
    setIsProcessingEffect(true);
    const url = await BeautyService.applyMakeupVTO(baseImageUrl, makeupId);
    setPreviewImageUrl(url);
    setIsProcessingEffect(false);
  };

  const handleNailChange = async (nailId: string) => {
    setSelectedNail(nailId);
    setIsProcessingEffect(true);
    const url = await BeautyService.applyNailVTO(baseImageUrl, nailId);
    setPreviewImageUrl(url);
    setIsProcessingEffect(false);
  };

  const handleSaveCurrentLook = () => {
    const currentTitle = lookTitleInput.trim() || `My ${activeStudio.toUpperCase()} Creation`;
    const newLook: SavedLook = {
      id: `look-${Date.now()}`,
      title: currentTitle,
      date: 'Just now',
      baseImageUrl,
      styledImageUrl: previewImageUrl,
      studioCategory: activeStudio,
      appliedOptions: [
        { name: 'Studio', details: activeStudio.toUpperCase() },
        { name: 'Intensity', details: `${intensity}%` },
      ],
      favorite: true,
    };

    onSaveLook(newLook);
    setIsSaveModalOpen(false);
    setToastSaved(true);
    setTimeout(() => setToastSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">Virtual Try-On &amp; Simulation</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">YouCam Beauty Engine</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            Style Studio
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Photorealistic experimentation with hairstyles, beard sculpting, editorial makeup, nails, and facial harmony.
          </p>
        </div>

        {/* Studio Tabs Pill Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-editorial-surface border border-white/10 overflow-x-auto">
          <button
            onClick={() => { setActiveStudio('hair'); setPreviewImageUrl(HAIRSTYLE_PRESETS[0].previewOverlayUrl || baseImageUrl); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeStudio === 'hair' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Hair Studio</span>
          </button>
          <button
            onClick={() => { setActiveStudio('beard'); setPreviewImageUrl(BEARD_PRESETS[0].thumbnailUrl); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeStudio === 'beard' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beard Studio</span>
          </button>
          <button
            onClick={() => { setActiveStudio('makeup'); setPreviewImageUrl(MAKEUP_LOOK_PRESETS[0].thumbnailUrl); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeStudio === 'makeup' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Makeup Studio</span>
          </button>
          <button
            onClick={() => { setActiveStudio('nails'); setPreviewImageUrl(NAIL_PRESETS[0].thumbnailUrl); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeStudio === 'nails' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Nail Studio</span>
          </button>
          <button
            onClick={() => { setActiveStudio('face'); setPreviewImageUrl(baseImageUrl); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeStudio === 'face' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Face Studio</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Canvas Left + Control Tray Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Canvas & Split Slider View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            {isComparing ? (
              <SplitSlider
                beforeImage={baseImageUrl}
                afterImage={previewImageUrl}
                beforeLabel="Original Baseline"
                afterLabel={`Preview: ${activeStudio.toUpperCase()}`}
                aspectRatio="aspect-[3/4]"
              />
            ) : (
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl">
                <img
                  src={previewImageUrl}
                  alt="Stylized Result"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Processing Overlay Indicator */}
            {isProcessingEffect && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
                <div className="px-4 py-2 rounded-xl bg-editorial-surface border border-editorial-lime/40 text-xs font-semibold text-editorial-lime flex items-center gap-2 shadow-lime-glow animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-editorial-lime border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Realistic Neural Filter...</span>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Bottom Toolbar */}
          <div className="p-4 rounded-2xl bg-editorial-surface border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isComparing ? 'bg-editorial-lime text-black' : 'bg-editorial-card text-white hover:bg-white/[0.06]'
                }`}
              >
                {isComparing ? 'Split Slider Active' : 'Single View'}
              </button>

              {/* Intensity Slider */}
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <span className="text-2xs font-mono uppercase text-editorial-text-muted">Intensity:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-24 accent-editorial-lime"
                />
                <span className="text-2xs font-mono text-editorial-lime font-bold">{intensity}%</span>
              </div>
            </div>

            {/* Action Buttons: Save & Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Look</span>
              </button>
            </div>
          </div>

          {toastSaved && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Look successfully saved to your profile gallery!</span>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Studio Controls for Active Tab */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. HAIR STUDIO CONTROLS */}
          {activeStudio === 'hair' && (
            <div className="space-y-6">
              {/* Hairstyle Selection */}
              <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">Hairstyle Virtual Try-On</h3>
                  <span className="text-2xs font-mono text-editorial-lime">5 Curated Cuts</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {HAIRSTYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleHairstyleChange(style.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-3 group ${
                        selectedHairstyle === style.id
                          ? 'border-editorial-lime bg-editorial-lime/10 shadow-subtle-glow'
                          : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                      }`}
                    >
                      <img
                        src={style.thumbnailUrl}
                        alt={style.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:border-editorial-lime"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate group-hover:text-editorial-lime">
                          {style.name}
                        </div>
                        <div className="text-2xs text-editorial-text-muted capitalize">
                          {style.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color Selection */}
              <div className="p-5 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">Hair Color &amp; Balayage Dye</h3>
                  <span className="text-2xs font-mono text-editorial-text-muted">Hex Pigment Engine</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {HAIR_COLOR_PRESETS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedHairColor(color.id)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        selectedHairColor === color.id
                          ? 'border-editorial-lime bg-editorial-lime/10'
                          : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full mx-auto mb-1 border border-white/20 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-2xs font-medium text-white truncate">
                        {color.name.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. BEARD STUDIO CONTROLS */}
          {activeStudio === 'beard' && (
            <div className="p-6 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Beard Style Generator</h3>
                  <p className="text-xs text-editorial-text-secondary mt-0.5">Facial hair density and jawline contouring</p>
                </div>
                <Badge variant="lime" size="sm">Grooming</Badge>
              </div>

              <div className="space-y-3">
                {BEARD_PRESETS.map((beard) => (
                  <button
                    key={beard.id}
                    onClick={() => handleBeardChange(beard.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between group ${
                      selectedBeard === beard.id
                        ? 'border-editorial-lime bg-editorial-lime/10'
                        : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={beard.thumbnailUrl}
                        alt={beard.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-editorial-lime">
                          {beard.name}
                        </div>
                        <div className="text-2xs text-editorial-text-secondary line-clamp-1">
                          {beard.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-editorial-text-muted">
                      {beard.density}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. MAKEUP STUDIO CONTROLS */}
          {activeStudio === 'makeup' && (
            <div className="p-6 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Complete Look Transfer &amp; VTO</h3>
                  <p className="text-xs text-editorial-text-secondary mt-0.5">Full editorial cosmetic palettes</p>
                </div>
                <Badge variant="lime" size="sm">Editorial</Badge>
              </div>

              <div className="space-y-3">
                {MAKEUP_LOOK_PRESETS.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => handleMakeupChange(look.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all space-y-2 group ${
                      selectedMakeup === look.id
                        ? 'border-editorial-lime bg-editorial-lime/10'
                        : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-white group-hover:text-editorial-lime">
                        {look.name}
                      </div>
                      <span className="text-2xs font-mono uppercase text-editorial-text-muted">
                        {look.collection}
                      </span>
                    </div>

                    <p className="text-2xs text-editorial-text-secondary">
                      {look.description}
                    </p>

                    {/* Palette Swatches */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-editorial-text-muted">Lip:</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: look.palette.lip.hex }}
                      />
                      <span className="text-[10px] text-editorial-text-muted pl-2">Blush:</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: look.palette.blush.hex }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. NAIL STUDIO CONTROLS */}
          {activeStudio === 'nails' && (
            <div className="p-6 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Nail Virtual Try-On</h3>
                  <p className="text-xs text-editorial-text-secondary mt-0.5">High gloss, glazed chrome, and velvet lacquers</p>
                </div>
                <Badge variant="lime" size="sm">Manicure</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {NAIL_PRESETS.map((nail) => (
                  <button
                    key={nail.id}
                    onClick={() => handleNailChange(nail.id)}
                    className={`p-3 rounded-xl text-left border transition-all group ${
                      selectedNail === nail.id
                        ? 'border-editorial-lime bg-editorial-lime/10'
                        : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-lg mb-2 border border-white/20 shadow-sm"
                      style={{ backgroundColor: nail.hex }}
                    />
                    <div className="text-xs font-semibold text-white group-hover:text-editorial-lime truncate">
                      {nail.name}
                    </div>
                    <div className="text-2xs text-editorial-text-muted">
                      {nail.shape} • {nail.finish}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. FACE STUDIO CONTROLS */}
          {activeStudio === 'face' && (
            <div className="p-6 rounded-2xl bg-editorial-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Facial Attributes &amp; Simulation</h3>
                  <p className="text-xs text-editorial-text-secondary mt-0.5">Golden ratio mapping, teeth whitening, subtle lift</p>
                </div>
                <Badge variant="lime" size="sm">Geometry</Badge>
              </div>

              <div className="space-y-3">
                {FACE_SIMULATION_PRESETS.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => setSelectedFaceSim(sim.id)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                      selectedFaceSim === sim.id
                        ? 'border-editorial-lime bg-editorial-lime/10'
                        : 'border-white/[0.08] bg-editorial-card hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{sim.name}</span>
                      <span className="text-2xs font-mono uppercase text-editorial-lime">
                        {sim.category}
                      </span>
                    </div>
                    <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                      {sim.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Look Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Look to Profile"
        subtitle="Preserve this styled creation in your personal beauty portfolio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-editorial-text-secondary mb-1">
              Look Name / Title
            </label>
            <input
              type="text"
              value={lookTitleInput}
              onChange={(e) => setLookTitleInput(e.target.value)}
              placeholder={`e.g. Editorial French Bob & Bronze Glow`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-editorial-bg border border-white/12 text-sm text-white placeholder-editorial-text-muted focus:border-editorial-lime focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06] flex items-center gap-3">
            <img
              src={previewImageUrl}
              alt="Thumbnail preview"
              className="w-14 h-14 rounded-lg object-cover border border-white/10"
            />
            <div className="text-xs text-editorial-text-secondary">
              Applied module: <span className="text-white font-semibold uppercase">{activeStudio}</span> at {intensity}% intensity.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-editorial-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCurrentLook}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow font-bold"
            >
              Confirm &amp; Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

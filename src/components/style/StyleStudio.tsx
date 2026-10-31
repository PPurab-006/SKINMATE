import React, { useState } from 'react';
import { 
  Scissors, 
  Palette, 
  Sparkles, 
  Smile, 
  Save, 
  Check, 
  Camera, 
  Upload, 
  Eye, 
  RotateCcw,
  AlertCircle
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
import { Modal } from '../common/Modal';
import { BeautyService } from '../../services/youcam/beautyService';
import { BeardService } from '../../services/youcam/beardService';
import { AppearanceService } from '../../services/youcam/appearanceService';
import { youCamClient } from '../../services/youcam/client';
import { CameraCapture } from '../common/CameraCapture';
import { ImageDropzone } from '../common/ImageDropzone';
import { ImageQualityCheck } from '../../types/skin';

interface StyleStudioProps {
  baseImageUrl?: string;
  hasUserUploadedPhoto?: boolean;
  onSaveLook: (look: SavedLook) => void;
}

export const StyleStudio: React.FC<StyleStudioProps> = ({
  baseImageUrl: initialBaseImage = '',
  hasUserUploadedPhoto = false,
  onSaveLook,
}) => {
  const [activeStudio, setActiveStudio] = useState<StudioTab>('hair');
  const [currentBaseImage, setCurrentBaseImage] = useState<string>(initialBaseImage);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(initialBaseImage);
  const [hasUserPhoto, setHasUserPhoto] = useState<boolean>(hasUserUploadedPhoto);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isPhotoSwitcherOpen, setIsPhotoSwitcherOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);

  // Selected preset options
  const [selectedHairstyle, setSelectedHairstyle] = useState(HAIRSTYLE_PRESETS[0].id);
  const [selectedHairColor, setSelectedHairColor] = useState(HAIR_COLOR_PRESETS[0].id);
  const [selectedBeard, setSelectedBeard] = useState(BEARD_PRESETS[0].id);
  const [selectedMakeup, setSelectedMakeup] = useState(MAKEUP_LOOK_PRESETS[0].id);
  const [selectedNail, setSelectedNail] = useState(NAIL_PRESETS[0].id);
  const [selectedFacePreset, setSelectedFacePreset] = useState(FACE_SIMULATION_PRESETS[0].id);

  // Controls & Status
  const [intensity, setIntensity] = useState(75);
  const [isComparing, setIsComparing] = useState(true);
  const [isProcessingEffect, setIsProcessingEffect] = useState(false);
  const [currentApplyingEffect, setCurrentApplyingEffect] = useState<string | null>(null);
  const [studioError, setStudioError] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lookTitleInput, setLookTitleInput] = useState('');
  const [toastSaved, setToastSaved] = useState(false);

  /**
   * Ensures a genuine YouCam file_id is available before invoking any VTO endpoint
   */
  const ensureFileId = async (): Promise<string> => {
    if (uploadedFileId && !uploadedFileId.startsWith('mock-file')) {
      return uploadedFileId;
    }
    if (!currentBaseImage) {
      throw new Error('Please upload or snap a portrait photo first to apply YouCam AI styling.');
    }
    const res = await fetch(currentBaseImage);
    const blob = await res.blob();
    const uploadRes = await youCamClient.uploadFile(blob);
    setUploadedFileId(uploadRes.file_id);
    return uploadRes.file_id;
  };

  /**
   * Handle user portrait selection or camera capture
   */
  const handleCustomPhotoSelected = async (file: File, previewUrl: string, _q?: ImageQualityCheck) => {
    setCurrentBaseImage(previewUrl);
    setPreviewImageUrl(previewUrl);
    setHasUserPhoto(true);
    setIsPhotoSwitcherOpen(false);
    setIsLiveCameraOpen(false);
    setStudioError(null);
    setIsUploadingPhoto(true);

    try {
      const uploadRes = await youCamClient.uploadFile(file);
      setUploadedFileId(uploadRes.file_id);
    } catch (e: any) {
      console.error('Failed to register portrait with YouCam:', e);
      setStudioError('Portrait loaded locally, but YouCam S2S registration encountered an error. Live try-on will retry on effect selection.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  /**
   * Optional quick start with sample demonstration portrait
   */
  const handleUseSamplePortrait = async () => {
    const demoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    setCurrentBaseImage(demoUrl);
    setPreviewImageUrl(demoUrl);
    setHasUserPhoto(true);
    setStudioError(null);
    setIsUploadingPhoto(true);
    try {
      const res = await fetch(demoUrl);
      const blob = await res.blob();
      const uploadRes = await youCamClient.uploadFile(blob);
      setUploadedFileId(uploadRes.file_id);
    } catch (e: any) {
      console.warn('Sample portrait upload note:', e);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  /**
   * Applies Hairstyle via YouCam hair-transfer
   */
  const handleHairstyleChange = async (styleId: string) => {
    setSelectedHairstyle(styleId);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload or capture your portrait first to try hairstyles.');
      return;
    }

    const preset = HAIRSTYLE_PRESETS.find(h => h.id === styleId);
    setCurrentApplyingEffect(preset?.name || 'Hairstyle');
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      const vto = await youCamClient.applyVto({
        fileId,
        category: 'hair',
        serviceSlug: 'hair-transfer',
        effectId: styleId,
        parameters: {
          ref_file_url: preset?.thumbnailUrl
        },
        imageUrl: currentBaseImage
      });

      if (vto.styled_image_url) {
        setPreviewImageUrl(vto.styled_image_url);
      }
    } catch (err: any) {
      console.error('Hairstyle application failed:', err);
      setStudioError(err?.message || 'YouCam could not apply this hairstyle to your portrait. Ensure hair and face are clearly visible.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  /**
   * Applies Hair Color via YouCam hair-color
   */
  const handleHairColorChange = async (color: typeof HAIR_COLOR_PRESETS[0]) => {
    setSelectedHairColor(color.id);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload or capture your portrait first to try hair colors.');
      return;
    }

    setCurrentApplyingEffect(`Hair Color (${color.name.split(' ')[0]})`);
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      const vto = await youCamClient.applyVto({
        fileId,
        category: 'hair',
        serviceSlug: 'hair-color',
        effectId: color.id,
        parameters: {
          color_hex: color.hex
        },
        imageUrl: currentBaseImage
      });

      if (vto.styled_image_url) {
        setPreviewImageUrl(vto.styled_image_url);
      }
    } catch (err: any) {
      console.error('Hair color application failed:', err);
      setStudioError(err?.message || 'YouCam could not apply hair color. Ensure hair strands are visible and not covered.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  /**
   * Applies Beard Style via YouCam beard-style
   */
  const handleBeardChange = async (beardId: string) => {
    setSelectedBeard(beardId);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload or capture your portrait first to try beard grooming.');
      return;
    }

    const preset = BEARD_PRESETS.find(b => b.id === beardId);
    setCurrentApplyingEffect(preset?.name || 'Beard Style');
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      const cleanStyle = beardId.replace('beard-', '');
      const url = await BeardService.applyBeardStyle(currentBaseImage, cleanStyle, fileId);
      if (url) {
        setPreviewImageUrl(url);
      }
    } catch (err: any) {
      console.error('Beard style application failed:', err);
      setStudioError(err?.message || 'YouCam could not apply beard style. Ensure lower face and jawline are unobstructed.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  /**
   * Applies Makeup Look via YouCam look-vto
   */
  const handleMakeupChange = async (makeupId: string) => {
    setSelectedMakeup(makeupId);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload or capture your portrait first to try makeup looks.');
      return;
    }

    const preset = MAKEUP_LOOK_PRESETS.find(m => m.id === makeupId);
    setCurrentApplyingEffect(preset?.name || 'Makeup Look');
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      const url = await BeautyService.applyMakeupVTO(currentBaseImage, makeupId, fileId);
      if (url) {
        setPreviewImageUrl(url);
      }
    } catch (err: any) {
      console.error('Makeup look application failed:', err);
      setStudioError(err?.message || 'YouCam could not apply makeup look. Ensure front-facing portrait with even lighting.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  /**
   * Applies Nail Lacquer via YouCam nail-vto
   */
  const handleNailChange = async (nailId: string) => {
    setSelectedNail(nailId);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload a photo showing your hands or nails to preview nail lacquers.');
      return;
    }

    const preset = NAIL_PRESETS.find(n => n.id === nailId);
    setCurrentApplyingEffect(preset?.name || 'Nail Finish');
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      const url = await BeautyService.applyNailVTO(currentBaseImage, preset?.hex || '#8B1E3F', fileId, preset?.finish || 'Glossy');
      if (url) {
        setPreviewImageUrl(url);
      }
    } catch (err: any) {
      console.error('Nail style application failed:', err);
      setStudioError(err?.message || 'YouCam could not detect fingernails in the portrait. Please upload a photo with hands visible.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  /**
   * Applies Facial Symmetry, Smile, Teeth Whitening, or Lift
   */
  const handleFaceEffectChange = async (sim: typeof FACE_SIMULATION_PRESETS[0]) => {
    setSelectedFacePreset(sim.id);
    if (!hasUserPhoto) {
      setIsPhotoSwitcherOpen(true);
      setStudioError('Please upload or capture your portrait first to preview facial enhancements.');
      return;
    }

    setCurrentApplyingEffect(sim.name);
    setIsProcessingEffect(true);
    setStudioError(null);

    try {
      const fileId = await ensureFileId();
      let res;
      if (sim.category === 'teeth') {
        res = await AppearanceService.applyTeethWhitening(currentBaseImage, intensity, fileId);
      } else if (sim.category === 'smile') {
        res = await AppearanceService.applySmile(currentBaseImage, intensity, fileId);
      } else if (sim.category === 'lift') {
        res = await AppearanceService.applyFaceLift(currentBaseImage, intensity, fileId);
      } else {
        res = await AppearanceService.applyFaceReshape(currentBaseImage, undefined, fileId);
      }
      if (res.styledImageUrl) {
        setPreviewImageUrl(res.styledImageUrl);
      }
    } catch (err: any) {
      console.error('Facial effect application failed:', err);
      setStudioError(err?.message || 'YouCam could not apply facial enhancement. Ensure head is upright and facing camera.');
    } finally {
      setIsProcessingEffect(false);
      setCurrentApplyingEffect(null);
    }
  };

  const handleSaveCurrentLook = () => {
    const currentTitle = lookTitleInput.trim() || `My ${activeStudio.toUpperCase()} Creation`;
    const newLook: SavedLook = {
      id: `look-${Date.now()}`,
      title: currentTitle,
      date: 'Saved today',
      baseImageUrl: currentBaseImage,
      styledImageUrl: previewImageUrl,
      studioCategory: activeStudio,
      appliedOptions: [
        { name: 'Style Type', details: activeStudio.toUpperCase() },
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
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-beauty-muted-border pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-beauty-forest font-sans">
            Visual Inspiration &amp; Live Try-On
          </span>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading mt-1">
            Beauty Studio
          </h1>
          <p className="text-xs sm:text-sm text-beauty-muted mt-1 font-light">
            An immersive creative space to explore hairstyles, beard grooming, makeup looks, and smile harmony.
          </p>
        </div>

        {/* Change Photo Trigger */}
        <button
          onClick={() => { setIsLiveCameraOpen(false); setIsPhotoSwitcherOpen(true); }}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-cream transition-all shadow-2xs flex items-center gap-2 self-start md:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>{hasUserPhoto ? 'Change Studio Portrait' : 'Upload Portrait'}</span>
        </button>
      </div>

      {/* Studio Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveStudio('hair')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeStudio === 'hair'
              ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-sm'
              : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Hairstyles &amp; Color</span>
        </button>

        <button
          onClick={() => setActiveStudio('makeup')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeStudio === 'makeup'
              ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-sm'
              : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Makeup Looks</span>
        </button>

        <button
          onClick={() => setActiveStudio('beard')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeStudio === 'beard'
              ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-sm'
              : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Beard Grooming</span>
        </button>

        <button
          onClick={() => setActiveStudio('nails')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeStudio === 'nails'
              ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-sm'
              : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Nail Sets</span>
        </button>

        <button
          onClick={() => setActiveStudio('face')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeStudio === 'face'
              ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-sm'
              : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Smile &amp; Harmony</span>
        </button>
      </div>

      {/* Main Studio Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real AI Notice / Error Banner */}
          {studioError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3 animate-fade-in shadow-2xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">YouCam AI Note:</span> {studioError}
                </div>
              </div>
              <button 
                onClick={() => setStudioError(null)}
                className="text-amber-700 hover:text-amber-900 text-sm font-bold px-1.5 leading-none"
                aria-label="Dismiss note"
              >
                ×
              </button>
            </div>
          )}

          <div className="relative">
            {!hasUserPhoto ? (
              /* No portrait uploaded yet -> Clear upload / capture landing state */
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-beauty-muted-border bg-white flex flex-col items-center justify-center p-8 text-center space-y-6 shadow-beauty-card">
                <div className="w-20 h-20 rounded-full bg-beauty-cream flex items-center justify-center text-beauty-forest shadow-xs">
                  <Camera className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="font-serif text-2xl font-semibold text-beauty-charcoal-heading">
                    Upload Portrait to Begin
                  </h3>
                  <p className="text-xs text-beauty-muted leading-relaxed font-light">
                    Upload a clear, front-facing photo or use your camera to try on hairstyles, hair colors, beard grooming, makeup looks, and smile enhancements powered by YouCam AI.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                  <button
                    onClick={() => { setIsLiveCameraOpen(false); setIsPhotoSwitcherOpen(true); }}
                    className="w-full px-5 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Portrait</span>
                  </button>
                  <button
                    onClick={() => { setIsLiveCameraOpen(true); setIsPhotoSwitcherOpen(true); }}
                    className="w-full px-5 py-3 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-forest hover:bg-beauty-cream transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Use Live Camera</span>
                  </button>
                </div>
                <button
                  onClick={handleUseSamplePortrait}
                  className="text-2xs text-beauty-muted underline hover:text-beauty-forest transition-colors pt-2"
                >
                  Or test with a sample demonstration portrait
                </button>
              </div>
            ) : isComparing ? (
              <SplitSlider
                beforeImage={currentBaseImage}
                afterImage={previewImageUrl}
                beforeLabel="Original"
                afterLabel="Preview"
                aspectRatio="aspect-[3/4]"
              />
            ) : (
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-beauty-muted-border bg-beauty-cream shadow-beauty-card">
                <img
                  src={previewImageUrl}
                  alt="Stylized Result"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Uploading indicator */}
            {isUploadingPhoto && (
              <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">
                <div className="px-5 py-2.5 rounded-full bg-beauty-forest text-beauty-ivory text-xs font-semibold flex items-center gap-2.5 shadow-md">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading portrait to YouCam AI...</span>
                </div>
              </div>
            )}

            {/* Live AI Processing Overlay */}
            {isProcessingEffect && (
              <div className="absolute inset-0 rounded-2xl bg-white/75 backdrop-blur-xs flex items-center justify-center z-20">
                <div className="px-5 py-2.5 rounded-full bg-beauty-forest text-beauty-ivory text-xs font-semibold flex items-center gap-2.5 shadow-md">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Applying {currentApplyingEffect || 'look'} with YouCam AI...</span>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Bottom Toolbar */}
          {hasUserPhoto && (
            <div className="p-4 rounded-2xl bg-white border border-beauty-muted-border flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsComparing(!isComparing)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    isComparing ? 'bg-beauty-forest text-beauty-ivory shadow-xs' : 'bg-beauty-cream text-beauty-charcoal'
                  }`}
                >
                  {isComparing ? 'Split Slider Active' : 'Single Preview'}
                </button>

                <button
                  onClick={() => { setPreviewImageUrl(currentBaseImage); setStudioError(null); }}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full text-beauty-muted hover:text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream transition-all flex items-center gap-1.5"
                  title="Reset preview back to your original photo"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Preview</span>
                </button>

                <div className="flex items-center gap-2 pl-3 border-l border-beauty-muted-border">
                  <span className="text-2xs font-mono uppercase text-beauty-muted">Effect:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-2xs font-mono text-beauty-forest font-bold">{intensity}%</span>
                </div>
              </div>

              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Look</span>
              </button>
            </div>
          )}

          {toastSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Look saved to your personal lookbook collection!</span>
            </div>
          )}
        </div>

        {/* Right Column: Visual Presets Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Hairstyles & Color */}
          {activeStudio === 'hair' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                    Hairstyles
                  </h3>
                  <p className="text-xs text-beauty-muted font-light mt-0.5">
                    Select a cut to preview on your portrait with YouCam AI
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {HAIRSTYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleHairstyleChange(style.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 group ${
                        selectedHairstyle === style.id
                          ? 'border-beauty-forest bg-beauty-cream/50 shadow-2xs'
                          : 'border-beauty-muted-border bg-white hover:border-beauty-forest'
                      }`}
                    >
                      <img
                        src={style.thumbnailUrl}
                        alt={style.name}
                        className="w-12 h-12 rounded-xl object-cover border border-beauty-muted-border group-hover:border-beauty-forest shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-beauty-charcoal truncate group-hover:text-beauty-forest">
                          {style.name}
                        </div>
                        <div className="text-2xs text-beauty-muted capitalize">
                          {style.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color Shades */}
              <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                    Hair Color &amp; Balayage
                  </h3>
                  <p className="text-xs text-beauty-muted font-light mt-0.5">
                    Warm and cool shade harmonies applied to your hair
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {HAIR_COLOR_PRESETS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleHairColorChange(color)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        selectedHairColor === color.id
                          ? 'border-beauty-forest bg-beauty-cream shadow-2xs'
                          : 'border-beauty-muted-border bg-white hover:border-beauty-forest'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-1.5 border border-black/10 shadow-2xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-2xs font-medium text-beauty-charcoal truncate">
                        {color.name.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Makeup Looks */}
          {activeStudio === 'makeup' && (
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
              <div>
                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                  Curated Makeup Palettes
                </h3>
                <p className="text-xs text-beauty-muted font-light mt-0.5">
                  Coordinated lipstick, blush, and eyeliner aesthetics
                </p>
              </div>

              <div className="space-y-3">
                {MAKEUP_LOOK_PRESETS.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => handleMakeupChange(look.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all space-y-2 group ${
                      selectedMakeup === look.id
                        ? 'border-beauty-forest bg-beauty-cream/50'
                        : 'border-beauty-muted-border bg-white hover:border-beauty-forest'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-base text-beauty-charcoal group-hover:text-beauty-forest">
                        {look.name}
                      </span>
                      <span className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
                        {look.collection}
                      </span>
                    </div>
                    <p className="text-xs text-beauty-muted font-light">
                      {look.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Beard Styles */}
          {activeStudio === 'beard' && (
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
              <div>
                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                  Beard &amp; Facial Hair
                </h3>
                <p className="text-xs text-beauty-muted font-light mt-0.5">
                  Explore density contours and clean lines
                </p>
              </div>

              <div className="space-y-3">
                {BEARD_PRESETS.map((beard) => (
                  <button
                    key={beard.id}
                    onClick={() => handleBeardChange(beard.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                      selectedBeard === beard.id
                        ? 'border-beauty-forest bg-beauty-cream/50'
                        : 'border-beauty-muted-border bg-white hover:border-beauty-forest'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={beard.thumbnailUrl}
                        alt={beard.name}
                        className="w-12 h-12 rounded-xl object-cover border border-beauty-muted-border shrink-0"
                      />
                      <div>
                        <div className="text-xs font-semibold text-beauty-charcoal group-hover:text-beauty-forest">
                          {beard.name}
                        </div>
                        <div className="text-2xs text-beauty-muted line-clamp-1 mt-0.5">
                          {beard.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-2xs uppercase tracking-wider font-semibold text-beauty-muted">
                      {beard.density}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Nail Sets */}
          {activeStudio === 'nails' && (
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
              <div>
                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                  Nail Shapes &amp; Lacquers
                </h3>
                <p className="text-xs text-beauty-muted font-light mt-0.5">
                  Glazed, chrome, and velvet gel effects
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {NAIL_PRESETS.map((nail) => (
                  <button
                    key={nail.id}
                    onClick={() => handleNailChange(nail.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      selectedNail === nail.id
                        ? 'border-beauty-forest bg-beauty-cream/50'
                        : 'border-beauty-muted-border bg-white hover:border-beauty-forest'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-xl mb-2.5 border border-black/10 shadow-2xs"
                      style={{ backgroundColor: nail.hex }}
                    />
                    <div className="text-xs font-semibold text-beauty-charcoal truncate">
                      {nail.name}
                    </div>
                    <div className="text-2xs text-beauty-muted capitalize mt-0.5">
                      {nail.finish} Finish
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Facial Symmetry & Expression */}
          {activeStudio === 'face' && (
            <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border space-y-4 shadow-beauty-card">
              <div>
                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                  Smile &amp; Harmony
                </h3>
                <p className="text-xs text-beauty-muted font-light mt-0.5">
                  AI smile brightening, enamel whitening, and contour lifts
                </p>
              </div>

              <div className="space-y-3">
                {FACE_SIMULATION_PRESETS.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => handleFaceEffectChange(sim)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all space-y-1.5 ${
                      selectedFacePreset === sim.id
                        ? 'border-beauty-forest bg-beauty-cream/50 shadow-beauty-sm'
                        : 'border-beauty-muted-border bg-beauty-cream/20 hover:border-beauty-forest'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-sm text-beauty-charcoal">{sim.name}</span>
                      <span className="text-2xs uppercase text-beauty-forest font-semibold">{sim.category}</span>
                    </div>
                    <p className="text-xs text-beauty-muted font-light leading-relaxed">
                      {sim.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Switcher Modal */}
      <Modal
        isOpen={isPhotoSwitcherOpen}
        onClose={() => setIsPhotoSwitcherOpen(false)}
        title="Choose Studio Portrait"
        subtitle="Use a clear, front-facing photo to preview hairstyles and beauty looks"
      >
        {isLiveCameraOpen ? (
          <CameraCapture
            onCapture={handleCustomPhotoSelected}
            onCancel={() => setIsLiveCameraOpen(false)}
          />
        ) : (
          <ImageDropzone
            onImageSelected={handleCustomPhotoSelected}
            onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
            title="Upload portrait photo"
            subtitle="Front-facing with even light produces the most realistic styling preview."
          />
        )}
      </Modal>

      {/* Save Look Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save to My Looks"
        subtitle="Keep this lookbook creation in your beauty profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-beauty-charcoal mb-1">
              Look Name
            </label>
            <input
              type="text"
              value={lookTitleInput}
              onChange={(e) => setLookTitleInput(e.target.value)}
              placeholder="e.g. French Bob & Golden Glow"
              className="w-full px-4 py-2.5 rounded-xl border border-beauty-muted-border bg-white text-xs text-beauty-charcoal focus:border-beauty-forest focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-beauty-muted-border">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-beauty-muted hover:text-beauty-charcoal"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCurrentLook}
              className="px-5 py-2 text-xs font-semibold rounded-full bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover shadow-sm"
            >
              Save to Lookbook
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

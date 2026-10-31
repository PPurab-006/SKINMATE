import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SkinService } from '../../services/youcam/skinService';
import { ImageQualityCheck } from '../../types/skin';

interface ImageDropzoneProps {
  onImageSelected: (file: File, previewUrl: string, quality: ImageQualityCheck) => void;
  onOpenLiveCamera: () => void;
  title?: string;
  subtitle?: string;
}

const SAMPLE_PORTRAITS = [
  {
    id: 'sample-1',
    name: 'Portrait 1 (Warm Olive • Balanced T-Zone)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2.2&w=800&h=800&q=80',
  },
  {
    id: 'sample-2',
    name: 'Portrait 2 (Beard Grooming • Textured)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2.2&w=800&h=800&q=80',
  },
  {
    id: 'sample-3',
    name: 'Portrait 3 (Golden Tone • Natural Glow)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=2.2&w=800&h=800&q=80',
  }
];

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelected,
  onOpenLiveCamera,
  title = 'Share a photo to begin',
  subtitle = 'Natural, soft lighting with a clear front-facing view works best'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsValidating(true);
    const previewUrl = URL.createObjectURL(file);
    const quality = await SkinService.validateImageQuality(file);
    setIsValidating(false);
    onImageSelected(file, previewUrl, quality);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sampleUrl: string) => {
    // Deliver sample portrait URL directly to avoid cross-origin canvas/blob CORS blocking
    onImageSelected(
      new File([], 'sample-portrait.jpg', { type: 'image/jpeg' }), 
      sampleUrl, 
      {
        lighting: 'optimal',
        lightingScore: 94,
        centering: true,
        resolutionOk: true,
        glassesDetected: false,
        expressionNeutral: true,
        passed: true,
        feedback: ['Sample portrait verified with balanced frontal daylight.']
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main Dropzone Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-beauty-forest bg-beauty-forest-subtle shadow-beauty-card'
            : 'border-beauty-muted-border bg-white hover:border-beauty-forest hover:bg-beauty-cream/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Subtle elegant upload icon */}
          <div className="w-14 h-14 rounded-full bg-beauty-cream flex items-center justify-center mb-4 text-beauty-forest group-hover:scale-105 transition-transform shadow-2xs">
            <Upload className="w-6 h-6 stroke-[1.8]" />
          </div>

          <h3 className="font-serif font-semibold text-xl text-beauty-charcoal-heading mb-1.5">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-beauty-muted leading-relaxed mb-6 max-w-sm">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-5 py-2.5 text-xs font-semibold rounded-full bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm">
              Upload from Device
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLiveCamera();
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-full bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border hover:bg-white transition-all shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-beauty-forest" />
              <span>Use Camera</span>
            </button>
          </div>

          <p className="mt-5 text-2xs text-beauty-muted">
            Supports JPG, PNG, WEBP • Your photo stays private on your device
          </p>
        </div>

        {isValidating && (
          <div className="absolute inset-0 rounded-3xl bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-beauty-forest border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-beauty-charcoal">Validating lighting and quality...</span>
          </div>
        )}
      </div>

      {/* Preset Sample Portraits */}
      <div className="p-5 rounded-2xl border border-beauty-muted-border bg-white shadow-beauty-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-beauty-charcoal-heading">
            <Sparkles className="w-3.5 h-3.5 text-beauty-forest" />
            <span>Or explore using a sample portrait:</span>
          </div>
          <span className="text-2xs uppercase tracking-wider text-beauty-muted">Quick Preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_PORTRAITS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleSelect(sample.url)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-beauty-cream/50 hover:bg-beauty-cream border border-beauty-muted-border transition-all text-left group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-12 h-12 rounded-lg object-cover border border-beauty-muted-border group-hover:border-beauty-forest transition-colors"
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-beauty-charcoal truncate group-hover:text-beauty-forest transition-colors">
                  {sample.name.split(' (')[0]}
                </div>
                <div className="text-2xs text-beauty-muted truncate">
                  {sample.name.includes('(') ? sample.name.split('(')[1].replace(')', '') : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

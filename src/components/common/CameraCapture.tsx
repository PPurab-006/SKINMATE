import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterActive, setIsShutterActive] = useState(false);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setCameraError(null);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        console.error('Webcam initialization failed:', err);
        setCameraError('Camera access unavailable. Please check browser permissions or upload a portrait from your device.');
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;

    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 1000;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `portrait-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      
      onCapture(file, previewUrl);
    }, 'image/jpeg', 0.95);
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-beauty-muted-border bg-white shadow-beauty-card flex flex-col">
      {/* Top Header Controls */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-beauty-muted-border text-xs text-beauty-charcoal font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Camera Viewfinder</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCameraFacing}
            title="Switch Camera"
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-beauty-charcoal border border-beauty-muted-border shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            title="Close Camera"
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-beauty-charcoal border border-beauty-muted-border shadow-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewfinder Canvas */}
      <div className="relative w-full aspect-[3/4] bg-neutral-900 flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="px-6 py-8 text-center max-w-sm bg-white rounded-2xl mx-4">
            <AlertCircle className="w-10 h-10 text-beauty-forest mx-auto mb-3" />
            <h4 className="font-serif font-semibold text-beauty-charcoal mb-2">Camera Unavailable</h4>
            <p className="text-xs text-beauty-muted mb-4">{cameraError}</p>
            <button
              onClick={onCancel}
              className="px-5 py-2 text-xs font-semibold bg-beauty-forest text-beauty-ivory rounded-full hover:bg-beauty-forest-hover shadow-sm"
            >
              Upload Photo Instead
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Facial Framing Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[66%] h-[68%] rounded-[50%/60%] border-2 border-dashed border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] relative">
                <div className="absolute bottom-4 inset-x-0 text-center">
                  <span className="text-[11px] font-medium text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                    Center face within guide
                  </span>
                </div>
              </div>
            </div>

            {isShutterActive && (
              <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />
            )}
          </>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="p-5 bg-beauty-cream/60 border-t border-beauty-muted-border flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 text-2xs text-beauty-muted font-medium">
          <span className="flex items-center gap-1 text-beauty-forest">
            <CheckCircle2 className="w-3.5 h-3.5" /> Soft, Even Lighting
          </span>
          <span className="flex items-center gap-1 text-beauty-forest">
            <CheckCircle2 className="w-3.5 h-3.5" /> Face Centered
          </span>
        </div>

        {!cameraError && (
          <button
            onClick={handleTakeSnapshot}
            className="group relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-all shadow-md active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-beauty-forest flex items-center justify-center text-beauty-ivory shadow-sm">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

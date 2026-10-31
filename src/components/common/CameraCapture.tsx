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
        setCameraError('Camera access denied or device unavailable. Please ensure webcam permissions are enabled or upload an image.');
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

    // Flip horizontal if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      
      // Stop tracks
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
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-editorial-surface shadow-2xl flex flex-col">
      {/* Top Header Controls */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white/90">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Studio Viewfinder</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCameraFacing}
            title="Switch Camera"
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            title="Close Camera"
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewfinder Canvas */}
      <div className="relative w-full aspect-[3/4] bg-neutral-950 flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="px-6 py-8 text-center max-w-sm">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Camera Unavailable</h4>
            <p className="text-xs text-editorial-text-secondary mb-4">{cameraError}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold bg-editorial-card border border-white/15 rounded-lg text-white hover:border-editorial-lime"
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
              {/* Outer dimmed mask */}
              <div className="w-[68%] h-[68%] rounded-[50%/60%] border-2 border-dashed border-editorial-lime/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative">
                {/* Center eye line marker */}
                <div className="absolute top-[42%] inset-x-8 h-px bg-white/20" />
                <div className="absolute bottom-4 inset-x-0 text-center">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-editorial-lime bg-black/70 px-2 py-0.5 rounded-full">
                    Position Face in Oval
                  </span>
                </div>
              </div>
            </div>

            {/* Shutter flash animation */}
            {isShutterActive && (
              <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />
            )}
          </>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="p-5 bg-editorial-surface border-t border-white/10 flex flex-col items-center gap-3">
        {/* Quality Guidelines Indicator */}
        <div className="flex items-center gap-4 text-2xs text-editorial-text-secondary">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Even Lighting
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Face Centered
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Neutral Expression
          </span>
        </div>

        {/* Shutter Trigger Button */}
        {!cameraError && (
          <button
            onClick={handleTakeSnapshot}
            className="group relative w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center hover:border-editorial-lime transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-editorial-lime flex items-center justify-center text-black shadow-lg shadow-editorial-lime/30 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

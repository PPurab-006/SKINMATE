import React from 'react';
import { SkinConcernMetric } from '../../types/skin';

interface SkinConcernsVisualizerProps {
  imageUrl: string;
  activeConcern: SkinConcernMetric;
  showHeatmap: boolean;
}

export const SkinConcernsVisualizer: React.FC<SkinConcernsVisualizerProps> = ({
  imageUrl,
  activeConcern,
  showHeatmap
}) => {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl select-none">
      {/* Base Selfie Image */}
      <img
        src={imageUrl}
        alt="Facial Diagnostic Base"
        className="h-full w-full object-cover"
      />

      {/* Heatmap & Focal Markers Overlay */}
      {showHeatmap && activeConcern.heatmapCoordinates && (
        <div className="absolute inset-0 pointer-events-none transition-all duration-300">
          {activeConcern.heatmapCoordinates.map((coord, index) => {
            const size = coord.radius * 2;
            return (
              <div
                key={index}
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse transition-all duration-500"
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  width: `${size * 2}px`,
                  height: `${size * 2}px`,
                  background: `radial-gradient(circle, rgba(212, 248, 60, ${coord.intensity * 0.7}) 0%, rgba(212, 248, 60, 0) 70%)`,
                  border: '1px solid rgba(212, 248, 60, 0.4)',
                  boxShadow: '0 0 15px rgba(212, 248, 60, 0.3)'
                }}
              >
                {/* Center marker dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-editorial-lime ring-4 ring-black/40 shadow-sm" />
              </div>
            );
          })}
        </div>
      )}

      {/* Floating active concern pill */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-editorial-lime" />
          <span className="font-semibold text-white">{activeConcern.name}</span>
          <span className="text-2xs font-mono text-editorial-lime font-bold">
            {activeConcern.score}%
          </span>
        </div>
      </div>

      {/* Severity pill on bottom right */}
      <div className="absolute bottom-4 right-4 z-10">
        <span className={`px-2.5 py-1 text-2xs font-mono uppercase tracking-wider rounded-md font-bold backdrop-blur-md border ${
          activeConcern.severity === 'low'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : activeConcern.severity === 'moderate'
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        }`}>
          {activeConcern.severity} concern
        </span>
      </div>
    </div>
  );
};

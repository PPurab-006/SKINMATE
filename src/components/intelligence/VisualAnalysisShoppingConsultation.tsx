import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { SkinAnalysisResult, SkinConcernMetric } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { UserAppearanceProfile } from '../../types/profile';
import { Product } from '../../types/product';
import { RecommendationEngine, RecommendationMatch } from '../../services/recommendationEngine';
import { 
  Eye, 
  Layers, 
  ExternalLink, 
  Bookmark, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Droplets, 
  Sun, 
  ChevronRight, 
  SlidersHorizontal,
  Info,
  CheckCircle2,
  RefreshCw,
  Scissors,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { AddToListModal } from '../lists/AddToListModal';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';

interface VisualAnalysisShoppingConsultationProps {
  mode: 'skin' | 'hair';
  skinAnalysis?: SkinAnalysisResult;
  hairAnalysis?: HairAnalysisResult;
  profile: UserAppearanceProfile;
  onSelectProduct: (product: Product) => void;
  onOpenNewScan?: () => void;
}

export const VisualAnalysisShoppingConsultation: React.FC<VisualAnalysisShoppingConsultationProps> = ({
  mode,
  skinAnalysis,
  hairAnalysis,
  profile,
  onSelectProduct,
  onOpenNewScan
}) => {
  // Selected finding state
  const [selectedFindingKey, setSelectedFindingKey] = useState<string>('all');
  const [viewOverlayMode, setViewOverlayMode] = useState<'overlay' | 'original'>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating'>('match');
  
  // List saving modal state
  const [savingProduct, setSavingProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Active image
  const baseImageUrl = mode === 'skin' 
    ? (skinAnalysis?.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=1.2&w=600&h=600&q=80')
    : (hairAnalysis?.imageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=1.2&w=600&h=600&q=80');

  // Skin findings array
  const skinConcernsList = useMemo(() => {
    if (!skinAnalysis?.concerns) return [];
    return Object.entries(skinAnalysis.concerns).map(([key, item]) => ({
      key,
      ...item
    }));
  }, [skinAnalysis]);

  // Hair findings array
  const hairFindingsList = useMemo(() => {
    if (!hairAnalysis) return [];
    return [
      {
        key: 'pattern',
        name: `${hairAnalysis.pattern} Curl Pattern`,
        score: 88,
        severity: 'low' as const,
        description: `Natural ${hairAnalysis.pattern} structural geometry with responsive wave clusters.`,
        affectedRegions: ['Crown', 'Mid-Lengths']
      },
      {
        key: 'frizz',
        name: 'Cuticle Frizz & Alignment',
        score: hairAnalysis.frizziness.score,
        severity: (hairAnalysis.frizziness.level.toLowerCase() === 'high' ? 'high' : hairAnalysis.frizziness.level.toLowerCase() === 'low' ? 'low' : 'moderate') as 'low' | 'moderate' | 'high',
        description: `Surface cuticle analysis shows ${hairAnalysis.frizziness.level.toLowerCase()} frizz susceptibility with ${hairAnalysis.frizziness.cuticleAlignmentPct}% alignment requiring lipid film protection.`,
        affectedRegions: ['Outer Canopy', 'Temples']
      },
      {
        key: 'density',
        name: `${hairAnalysis.density.level} Density`,
        score: hairAnalysis.density.score || 82,
        severity: 'low' as const,
        description: `Follicular fiber distribution measured at ${hairAnalysis.density.level.toLowerCase()} volumetric concentration.`,
        affectedRegions: ['Scalp Vertex', 'Crown']
      },
      {
        key: 'scalp',
        name: `${hairAnalysis.scalpProfile.type} Scalp Balance`,
        score: 78,
        severity: 'moderate' as const,
        description: `Sebaceous equilibrium on scalp indicates ${hairAnalysis.scalpProfile.type.toLowerCase()} micro-environment with ${hairAnalysis.scalpProfile.porosity} porosity.`,
        affectedRegions: ['Scalp Surface']
      }
    ];
  }, [hairAnalysis]);

  const activeFindings = mode === 'skin' ? skinConcernsList : hairFindingsList;

  // Find active selected finding object
  const activeFindingObj = useMemo(() => {
    if (selectedFindingKey === 'all') return null;
    return activeFindings.find(f => f.key === selectedFindingKey) || null;
  }, [activeFindings, selectedFindingKey]);

  // Image Canvas Geometry state & container refs for exact pixel alignment
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
    isReady: boolean;
  }>({ width: 0, height: 0, left: 0, top: 0, isReady: false });

  // Recalculates exact rendered image box inside container (accounting for contain aspect ratio)
  const updateGeometry = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const img = imageRef.current;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    if (!natW || !natH || !container.width || !container.height) return;

    // Use contain scaling logic so the portrait is never cropped or distorted
    const scale = Math.min(container.width / natW, container.height / natH);
    const renderedWidth = natW * scale;
    const renderedHeight = natH * scale;
    const left = (container.width - renderedWidth) / 2;
    const top = (container.height - renderedHeight) / 2;

    setGeometry({
      width: renderedWidth,
      height: renderedHeight,
      left,
      top,
      isReady: true
    });
  }, []);

  useEffect(() => {
    updateGeometry();
    const handleResize = () => updateGeometry();
    window.addEventListener('resize', handleResize);
    
    // Also attach ResizeObserver to container
    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateGeometry());
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [updateGeometry, baseImageUrl]);

  // Check if active finding has an authentic YouCam mask URL
  const activeMaskUrl = useMemo(() => {
    if (mode !== 'skin' || !activeFindingObj) return null;
    const skinConcern = activeFindingObj as unknown as SkinConcernMetric;
    if (skinConcern.maskUrls && skinConcern.maskUrls.length > 0) {
      return skinConcern.maskUrls[0];
    }
    return null;
  }, [mode, activeFindingObj]);

  // Extract authentic coordinates for active finding (or all findings if 'all' selected)
  const activeCoordinates = useMemo(() => {
    if (mode !== 'skin') return [];
    if (selectedFindingKey === 'all') {
      const allCoords: Array<{ x: number; y: number; radius: number; intensity: number; concernKey: string; name: string }> = [];
      skinConcernsList.forEach(c => {
        if (c.heatmapCoordinates && c.heatmapCoordinates.length > 0) {
          c.heatmapCoordinates.forEach(coord => {
            allCoords.push({
              ...coord,
              concernKey: c.key,
              name: c.name
            });
          });
        }
      });
      return allCoords;
    } else {
      const concern = activeFindingObj as unknown as SkinConcernMetric;
      if (concern?.heatmapCoordinates && concern.heatmapCoordinates.length > 0) {
        return concern.heatmapCoordinates.map(coord => ({
          ...coord,
          concernKey: concern.id,
          name: concern.name
        }));
      }
      return [];
    }
  }, [mode, selectedFindingKey, skinConcernsList, activeFindingObj]);

  // True if provider returned either authentic mask image or authentic coordinate spatial data
  const hasSpatialData = useMemo(() => {
    if (mode !== 'skin') return false;
    if (activeMaskUrl) return true;
    if (activeCoordinates.length > 0) return true;
    return false;
  }, [mode, activeMaskUrl, activeCoordinates]);

  // Compute matched products via RecommendationEngine
  const matchedRecommendations: RecommendationMatch[] = useMemo(() => {
    if (mode === 'skin') {
      return RecommendationEngine.getRecommendationsForFinding(
        selectedFindingKey,
        skinAnalysis,
        profile
      );
    } else {
      return RecommendationEngine.getRecommendationsForHairFinding(
        selectedFindingKey,
        hairAnalysis,
        profile
      );
    }
  }, [mode, selectedFindingKey, skinAnalysis, hairAnalysis, profile]);

  // Filter recommendations by category tab
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return matchedRecommendations;
    return matchedRecommendations.filter(m => {
      const cat = m.product.category.toLowerCase();
      if (categoryFilter === 'cleanser') return cat.includes('cleanse') || cat.includes('wash') || cat.includes('shampoo');
      if (categoryFilter === 'treatment') return cat.includes('serum') || cat.includes('exfol') || cat.includes('treatment') || cat.includes('mask');
      if (categoryFilter === 'moisturizer') return cat.includes('moist') || cat.includes('cream') || cat.includes('oil') || cat.includes('cond');
      if (categoryFilter === 'sunscreen') return cat.includes('sun') || cat.includes('spf');
      return true;
    });
  }, [matchedRecommendations, categoryFilter]);

  // Sort filtered recommendations
  const sortedAndFilteredProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'match') {
      return list.sort((a, b) => b.matchScore - a.matchScore);
    }
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => (a.product.price ?? 999999) - (b.product.price ?? 999999));
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => (b.product.price ?? -1) - (a.product.price ?? -1));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.product.rating || 0) - (a.product.rating || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const handleSavedSuccess = (listName: string) => {
    setAddedToast(`Saved to "${listName}"!`);
    setTimeout(() => setAddedToast(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {addedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{addedToast}</span>
          </div>
          <button
            onClick={() => setAddedToast(null)}
            className="text-2xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Consultation Control Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-beauty-cream border border-beauty-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
            <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-forest">
              {mode === 'skin' ? 'AI Skin Consultation & Prescription Shopping' : 'AI Hair Diagnostics & Prescriptive Care'}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
            {mode === 'skin' ? 'Visual Analysis-to-Shopping Experience' : 'Hair Fiber Analysis & Regimen Discovery'}
          </h3>
          <p className="text-xs text-beauty-muted font-light mt-0.5">
            Click on any detected condition below to inspect observed optical behavior and instantly discover exact matching formulations.
          </p>
        </div>

        {onOpenNewScan && (
          <button
            onClick={onOpenNewScan}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-beauty-forest border border-beauty-muted-border hover:bg-beauty-forest hover:text-white transition-all shadow-2xs flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Portrait Scan</span>
          </button>
        )}
      </div>

      {/* Finding Selector Pills Ribbon */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-beauty-muted-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-beauty-forest" />
          <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest">
            Diagnostic Focus:
          </span>
          <span className="text-xs text-beauty-muted font-light hidden sm:inline">
            Select a condition to inspect biometrics and matching formulations:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFindingKey('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedFindingKey === 'all'
                ? 'bg-beauty-forest text-beauty-ivory shadow-2xs font-semibold'
                : 'bg-beauty-cream border border-beauty-muted-border text-beauty-charcoal hover:bg-white'
            }`}
          >
            All Observations ({activeFindings.length})
          </button>

          {activeFindings.map((finding) => {
            const isSelected = selectedFindingKey === finding.key;
            return (
              <button
                key={finding.key}
                onClick={() => setSelectedFindingKey(finding.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-beauty-forest text-beauty-ivory shadow-2xs font-semibold'
                    : 'bg-beauty-cream border border-beauty-muted-border text-beauty-charcoal hover:bg-white'
                }`}
              >
                <span>{finding.name}</span>
                <span className={`text-2xs px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-beauty-muted'
                }`}>
                  {finding.score}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIFORM TWO-COLUMN WORKSPACE (Identical Height, Symmetrical Twin Panels)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[750px]">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: Visual Analysis & Annotated Portrait (5 cols)             */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 h-full flex flex-col rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card overflow-hidden">
          
          {/* Symmetrical Left Header: Mode Controls (Matches Right Header Height) */}
          <div className="shrink-0 px-5 py-4 border-b border-beauty-muted-border bg-white flex items-center justify-between min-h-[82px]">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-beauty-forest" />
                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                  Diagnostic Portrait
                </h3>
              </div>
              <p className="text-xs text-beauty-muted font-light mt-0.5">
                Calibrated optical mapping with authentic segmentation.
              </p>
            </div>

            {/* View Controls: Original vs Analysis Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-beauty-cream border border-beauty-muted-border shrink-0">
              <button
                type="button"
                onClick={() => setViewOverlayMode('original')}
                className={`px-3 py-1 rounded-full text-2xs font-medium transition-all ${
                  viewOverlayMode === 'original'
                    ? 'bg-white text-beauty-charcoal shadow-2xs font-semibold'
                    : 'text-beauty-muted hover:text-beauty-charcoal'
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setViewOverlayMode('overlay')}
                className={`px-3 py-1 rounded-full text-2xs font-medium transition-all ${
                  viewOverlayMode === 'overlay'
                    ? 'bg-beauty-forest text-beauty-ivory shadow-2xs font-semibold'
                    : 'text-beauty-muted hover:text-beauty-charcoal'
                }`}
              >
                {hasSpatialData ? 'AI Overlay' : 'Finding Focus'}
              </button>
            </div>
          </div>

          {/* Center Image Canvas Container with Exact Geometry Alignment */}
          <div className="flex-1 min-h-0 relative p-4 bg-beauty-cream/20 flex flex-col items-center justify-center overflow-hidden">
            <div 
              ref={containerRef}
              className="relative h-full w-full max-w-[340px] rounded-2xl overflow-hidden bg-beauty-charcoal/5 border border-beauty-muted-border flex items-center justify-center shadow-2xs select-none"
            >
              {/* 1. Base Uploaded Photograph (Contain scaled to prevent any facial distortion or clipping) */}
              <img
                ref={imageRef}
                src={baseImageUrl}
                alt="Analyzed portrait"
                onLoad={updateGeometry}
                className="max-w-full max-h-full object-contain select-none transition-opacity duration-300"
              />

              {/* Exact Geometry Overlay Container: Mathematically locked to visible portrait pixels */}
              {geometry.isReady && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${geometry.left}px`,
                    top: `${geometry.top}px`,
                    width: `${geometry.width}px`,
                    height: `${geometry.height}px`,
                    pointerEvents: 'none'
                  }}
                  className="overflow-hidden"
                >
                  {/* 2. Authentic YouCam Mask Overlay when provided & enabled */}
                  {viewOverlayMode === 'overlay' && activeMaskUrl && (
                    <img
                      src={activeMaskUrl}
                      alt="YouCam condition mask overlay"
                      style={{ opacity: overlayOpacity }}
                      className="w-full h-full object-contain pointer-events-none mix-blend-multiply transition-opacity duration-300"
                    />
                  )}

                  {/* 3. Heatmap / Region Coordinates SVG Overlay */}
                  {viewOverlayMode === 'overlay' && activeCoordinates.length > 0 && (
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="w-full h-full absolute inset-0 pointer-events-none"
                    >
                      <defs>
                        <radialGradient id="focalPulseGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#2D3A2F" stopOpacity={0.8 * overlayOpacity} />
                          <stop offset="50%" stopColor="#3E8914" stopOpacity={0.4 * overlayOpacity} />
                          <stop offset="100%" stopColor="#3E8914" stopOpacity={0} />
                        </radialGradient>
                        <radialGradient id="highlightPulseGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#D97706" stopOpacity={0.85 * overlayOpacity} />
                          <stop offset="60%" stopColor="#F59E0B" stopOpacity={0.35 * overlayOpacity} />
                          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                        </radialGradient>
                      </defs>

                      {activeCoordinates.map((coord, idx) => {
                        const isCurrent = selectedFindingKey === coord.concernKey || selectedFindingKey === 'all';
                        const gradId = selectedFindingKey === coord.concernKey ? 'url(#highlightPulseGrad)' : 'url(#focalPulseGrad)';
                        const strokeColor = selectedFindingKey === coord.concernKey ? '#D97706' : '#2D3A2F';

                        return (
                          <g 
                            key={`${coord.concernKey}-${idx}`} 
                            className="cursor-pointer pointer-events-auto group/hotspot transition-transform"
                            onClick={() => setSelectedFindingKey(coord.concernKey)}
                          >
                            {/* Radial Biophotonic Glow */}
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={coord.radius * 0.75}
                              fill={gradId}
                              className="transition-all duration-300 group-hover/hotspot:scale-110"
                            />

                            {/* Target Ring */}
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={coord.radius * 0.45}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="0.75"
                              strokeDasharray="2,2"
                              opacity={0.8}
                            />

                            {/* Center Target Dot */}
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r="1.75"
                              fill={strokeColor}
                              className="animate-pulse"
                            />

                            {/* Tooltip on Hover */}
                            <g className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-200">
                              <rect
                                x={Math.max(2, Math.min(68, coord.x - 15))}
                                y={Math.max(2, coord.y - 8)}
                                width="30"
                                height="6"
                                rx="2"
                                fill="#2D3A2F"
                                opacity="0.92"
                              />
                              <text
                                x={Math.max(17, Math.min(83, coord.x))}
                                y={Math.max(6, coord.y - 4)}
                                textAnchor="middle"
                                fill="#F8F6F0"
                                fontSize="2.8"
                                fontWeight="bold"
                                className="select-none pointer-events-none"
                              >
                                {coord.name.slice(0, 16)}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              )}

              {/* Status Badge in Top-Left */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-2xs font-medium flex items-center gap-1.5 shadow-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasSpatialData ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{activeFindingObj ? activeFindingObj.name : 'Full Biometric Scan'}</span>
                </span>
                {viewOverlayMode === 'overlay' && (
                  <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-beauty-charcoal text-[10px] font-medium border border-beauty-muted-border shadow-2xs">
                    {activeMaskUrl 
                      ? 'Authentic YouCam Mask' 
                      : activeCoordinates.length > 0 
                      ? 'Calibrated Optical Coordinates' 
                      : 'Numerical Biometrics (No Mask)'}
                  </span>
                )}
              </div>

              {/* Mode Watermark in Bottom-Right */}
              <div className="absolute bottom-3 right-3 pointer-events-none z-10">
                <span className="px-2.5 py-1 rounded-md bg-white/85 backdrop-blur-md text-beauty-charcoal text-[10px] font-medium border border-beauty-muted-border shadow-2xs">
                  {viewOverlayMode === 'original' ? 'Raw Portrait' : 'AI Optical Detection'}
                </span>
              </div>
            </div>

            {/* Opacity Control Slider (When spatial overlay active) */}
            {viewOverlayMode === 'overlay' && (activeMaskUrl || activeCoordinates.length > 0) && (
              <div className="w-full max-w-[340px] pt-2 flex items-center justify-between gap-3 text-2xs text-beauty-muted">
                <span>Overlay Intensity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="flex-1 accent-beauty-forest h-1.5 bg-beauty-muted-border/60 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-medium text-beauty-charcoal w-8 text-right">{Math.round(overlayOpacity * 100)}%</span>
              </div>
            )}
          </div>

          {/* Symmetrical Left Footer: Condition Detail Card */}
          <div className="shrink-0 p-5 bg-white border-t border-beauty-muted-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-2xs uppercase tracking-wider font-semibold text-beauty-forest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Detected Condition Profile</span>
              </span>
              <Badge
                variant={
                  activeFindingObj?.severity === 'high' ? 'red' :
                  activeFindingObj?.severity === 'moderate' ? 'amber' : 'green'
                }
                size="sm"
              >
                {(activeFindingObj?.severity || 'OPTIMAL').toUpperCase()} PRIORITY
              </Badge>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                {activeFindingObj ? activeFindingObj.name : 'Full Facial Equilibrium'}
              </h4>
              <p className="text-xs text-beauty-charcoal-body font-light leading-relaxed mt-0.5 line-clamp-2">
                {activeFindingObj
                  ? activeFindingObj.description
                  : 'Comprehensive biometric optical inspection evaluating barrier integrity, sebum balance, and cellular reflectance.'}
              </p>
            </div>

            {/* Observed Regions list */}
            {activeFindingObj?.affectedRegions && activeFindingObj.affectedRegions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-2xs">
                <span className="text-beauty-muted font-medium">Observed Zones:</span>
                {activeFindingObj.affectedRegions.map((region, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-beauty-cream border border-beauty-muted-border text-beauty-charcoal font-medium"
                  >
                    {region}
                  </span>
                ))}
              </div>
            )}

            {/* Authentic coordinates note */}
            <div className="pt-2 border-t border-beauty-muted-border/60 flex items-center gap-2 text-[11px] text-beauty-muted font-light">
              <Info className="w-3.5 h-3.5 text-beauty-forest shrink-0" />
              <span className="truncate">
                {activeMaskUrl 
                  ? 'Actual YouCam visual segmentation mask displayed directly on portrait.'
                  : activeCoordinates.length > 0
                  ? 'Focal region coordinates calibrated to portrait geometry. Interactive hotspots active.'
                  : 'Numerical biometric inspection. No spatial coordinates returned by provider for this scan.'}
              </span>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: Independently Scrollable Product Panel (7 cols)           */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 h-[60vh] min-h-[480px] lg:h-full flex flex-col rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card overflow-hidden">
          
          {/* Symmetrical Right Header: Title, Counts, Sorting & Category Filters */}
          <div className="shrink-0 p-5 border-b border-beauty-muted-border bg-white z-10 space-y-3 min-h-[82px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-semibold text-lg sm:text-xl text-beauty-charcoal-heading">
                    Targeted Recommendations
                  </h3>
                  <Badge variant="forest" size="sm">
                    {sortedAndFilteredProducts.length} Verified
                  </Badge>
                </div>
                <p className="text-xs text-beauty-muted font-light mt-0.5">
                  {selectedFindingKey === 'all'
                    ? 'Foundational formulations aligned with your overall appearance diagnostics.'
                    : `Formulations specifically selected for ${activeFindingObj?.name || 'this condition'}.`}
                </p>
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="text-2xs text-beauty-muted font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-beauty-forest" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-beauty-cream border border-beauty-muted-border rounded-xl px-2.5 py-1.5 text-beauty-charcoal font-medium focus:outline-none focus:border-beauty-forest transition-colors cursor-pointer"
                  aria-label="Sort product recommendations"
                >
                  <option value="match">Highest Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-beauty-muted-border/60">
              {[
                { id: 'all', label: 'All Steps' },
                { id: 'cleanser', label: mode === 'skin' ? 'Cleanse' : 'Wash & Clarify' },
                { id: 'treatment', label: mode === 'skin' ? 'Treat & Serums' : 'Bond & Masks' },
                { id: 'moisturizer', label: mode === 'skin' ? 'Moisturize & Barrier' : 'Condition & Oils' },
                ...(mode === 'skin' ? [{ id: 'sunscreen', label: 'Protect (SPF)' }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    categoryFilter === tab.id
                      ? 'bg-beauty-cream text-beauty-charcoal font-semibold border border-beauty-muted-border'
                      : 'text-beauty-muted hover:text-beauty-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inner Independently Scrollable Product List (Only this container scrolls) */}
          <div 
            id="recommendations-scroll-panel"
            className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 recommendation-scroll-container"
          >
            {sortedAndFilteredProducts.length === 0 ? (
              <div className="p-10 rounded-2xl bg-beauty-cream border border-dashed border-beauty-muted-border text-center space-y-2">
                <p className="text-xs text-beauty-muted">
                  No products in this specific category match this finding.
                </p>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="text-xs font-semibold text-beauty-forest underline"
                >
                  View all matching products
                </button>
              </div>
            ) : (
              sortedAndFilteredProducts.map(({ product, matchScore, matchReasons }) => {
                const reasonText = matchReasons[0] || product.reasonForRecommendation || 'Formulated for your recorded skin profile.';
                const isPriceAvailable = product.price !== null && product.price !== undefined;
                const sourceBadge = product.verification?.dataSource || 'Open Beauty Facts';

                return (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-beauty-muted-border shadow-2xs hover:border-beauty-forest/40 transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 items-start group"
                  >
                    {/* Exact Product Photography or Neutral Unavailable Fallback */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="w-full sm:w-28 sm:h-28 aspect-square rounded-2xl overflow-hidden border border-beauty-muted-border bg-beauty-cream/30 shrink-0 cursor-pointer relative"
                    >
                      <ProductImage
                        product={product}
                        className="w-full h-full"
                        imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        showAttribution={false}
                      />
                      <span className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[9px] font-semibold">
                        {matchScore}% Match
                      </span>
                    </div>

                    {/* Product Details & Scientific Justification */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest">
                          {product.brand}
                        </span>
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border font-medium">
                          {product.category}
                        </span>
                        {product.verification?.verifiedIdentity && (
                          <span
                            className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1"
                            title={product.sourceAttribution || 'Verified cosmetics formulation'}
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified Listing</span>
                          </span>
                        )}
                        <span className="text-[10px] text-beauty-muted font-light">
                          via {sourceBadge}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectProduct(product)}
                        className="font-serif font-semibold text-base sm:text-lg text-beauty-charcoal-heading group-hover:text-beauty-forest cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {product.name}
                      </h4>

                      {/* Pricing, Exact Variant & Size */}
                      <div className="flex items-baseline gap-2 text-xs flex-wrap">
                        {isPriceAvailable ? (
                          <>
                            <span className="font-serif text-lg font-bold text-beauty-charcoal">
                              ₹{product.price!.toLocaleString('en-IN')}
                            </span>
                            <span className="text-2xs text-beauty-muted font-normal">
                              (Ref. Price)
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-beauty-muted italic">
                            Price on Google
                          </span>
                        )}
                        <span className="text-beauty-muted text-xs">
                          • {product.variant || product.exactVariant || product.size}
                        </span>
                        {product.size && (product.variant || product.exactVariant) && (
                          <span className="text-beauty-muted text-2xs">
                            ({product.size})
                          </span>
                        )}
                        {product.barcode && (
                          <span className="text-beauty-muted text-[10px]">
                            • Barcode: {product.barcode}
                          </span>
                        )}
                      </div>

                      {/* Human-Readable Explanation Callout */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-beauty-cream/70 border border-beauty-muted-border text-xs text-beauty-charcoal-body leading-relaxed font-light space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-beauty-forest text-2xs uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          <span>Why This Product Was Selected:</span>
                        </div>
                        <p className="line-clamp-2 sm:line-clamp-none">{reasonText}</p>
                      </div>

                      {/* Key Ingredients snippet */}
                      {product.keyActives && product.keyActives.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-2xs text-beauty-muted pt-0.5">
                          <span className="font-medium text-beauty-charcoal">Key Actives:</span>
                          <span>{product.keyActives.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS: GOOGLE REDIRECT & ADD TO LIST */}
                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-36 shrink-0 pt-2 sm:pt-0">
                      {/* PRIMARY ACTION: FIND ON GOOGLE (Universal Google Product Search redirect) */}
                      <GoogleShoppingButton
                        product={product}
                        variant="primary"
                        size="sm"
                        label="Find this product on Google"
                        className="w-full text-center"
                      />

                      {/* SECONDARY ACTION: ADD TO LIST */}
                      <button
                        type="button"
                        onClick={() => setSavingProduct(product)}
                        className="w-full px-3 py-1.5 rounded-full text-xs font-medium border border-beauty-muted-border bg-white hover:bg-beauty-cream text-beauty-charcoal transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-beauty-muted" />
                        <span>Add to List</span>
                      </button>

                      {/* Quick Details inspection link */}
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-2xs text-beauty-muted hover:text-beauty-charcoal underline pt-0.5"
                      >
                        Inspect formulation
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Add To List Modal */}
      <AddToListModal
        product={savingProduct}
        isOpen={savingProduct !== null}
        onClose={() => setSavingProduct(null)}
        onAddedToList={handleSavedSuccess}
      />
    </div>
  );
};

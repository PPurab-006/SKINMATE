import { 
  HairstyleOption, 
  HairColorOption, 
  BeardStyleOption, 
  MakeupLookOption, 
  NailStyleOption, 
  FaceSimulationOption 
} from '../types/style';

export const HAIRSTYLE_PRESETS: HairstyleOption[] = [
  {
    id: 'hair-french-bob',
    name: 'Sleek French Bob',
    category: 'short',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    previewOverlayUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    description: 'Chic jawline-grazing cut with blunt edges and subtle inner layering for effortless Parisian movement.',
    tags: ['Short', 'Sophisticated', 'Jawline Accent']
  },
  {
    id: 'hair-curtain-layers',
    name: 'Curtain Bangs & Waves',
    category: 'bangs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    previewOverlayUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    description: 'Face-framing soft curtain fringe tapering into buoyant cascading layers.',
    tags: ['Medium-Long', 'Volume', 'Softening']
  },
  {
    id: 'hair-beach-waves',
    name: 'Tousled Beach Waves',
    category: 'textured',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    previewOverlayUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Relaxed undulating texture with matte sea-salt separation and dimensional root lift.',
    tags: ['Textured', 'Casual Luxury', 'Full Body']
  },
  {
    id: 'hair-pixie-shag',
    name: 'Textured Modern Pixie',
    category: 'short',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    previewOverlayUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    description: 'Edgy crown texture with tapered nape and soft wispy sideburns highlighting cheekbones.',
    tags: ['Short', 'Bold', 'Sculptural']
  },
  {
    id: 'hair-glossy-long',
    name: 'Sleek Liquid Silk Long',
    category: 'long',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    previewOverlayUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    description: 'Glass-hair finish falling past shoulder blades with mirror-shine reflection.',
    tags: ['Long', 'Gloss', 'Minimal']
  }
];

export const HAIR_COLOR_PRESETS: HairColorOption[] = [
  {
    id: 'color-espresso',
    name: 'Rich Dark Espresso',
    hex: '#231916',
    finish: 'Gloss',
    undertone: 'Neutral'
  },
  {
    id: 'color-honey-balayage',
    name: 'Warm Honey Balayage',
    hex: '#B8860B',
    secondaryHex: '#5C3818',
    finish: 'Balayage',
    undertone: 'Warm'
  },
  {
    id: 'color-cinnamon-copper',
    name: 'Cinnamon Spiced Copper',
    hex: '#A04028',
    finish: 'Solid',
    undertone: 'Warm'
  },
  {
    id: 'color-rose-quartz',
    name: 'Smoked Rose Quartz',
    hex: '#C08081',
    finish: 'Gloss',
    undertone: 'Cool'
  },
  {
    id: 'color-champagne-blonde',
    name: 'Nordic Champagne Blonde',
    hex: '#E6D3A3',
    finish: 'Solid',
    undertone: 'Neutral'
  },
  {
    id: 'color-midnight-velvet',
    name: 'Midnight Velvet Noir',
    hex: '#111218',
    secondaryHex: '#1B263B',
    finish: 'Gloss',
    undertone: 'Cool'
  }
];

export const BEARD_PRESETS: BeardStyleOption[] = [
  {
    id: 'beard-stubble',
    name: '3-Day Designer Stubble',
    category: 'stubble',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80',
    density: 'light',
    description: 'Precision 2-3mm shadow sharpening the jawline angle without covering skin texture.'
  },
  {
    id: 'beard-boxed',
    name: 'Short Boxed Beard',
    category: 'boxed',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    density: 'medium',
    description: 'Crisp tapered cheek lines meeting clean horizontal neck contours for executive definition.'
  },
  {
    id: 'beard-balbo',
    name: 'Sculpted Balbo & Mustache',
    category: 'sculpted',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    density: 'medium',
    description: 'Disconnected sculpted mustache paired with an anchor chin strap and soul patch.'
  },
  {
    id: 'beard-full',
    name: 'Natural Nordic Full Beard',
    category: 'full',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    density: 'heavy',
    description: 'Full-bodied density groomed with natural side volume and substantial chin presence.'
  }
];

export const MAKEUP_LOOK_PRESETS: MakeupLookOption[] = [
  {
    id: 'look-editorial-bronze',
    name: 'Editorial Sunlit Bronze',
    collection: 'Editorial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    description: 'Warm terracotta cheeks, smoked copper shimmer on the lid, and velvet nude satin lips.',
    palette: {
      lip: { shade: 'Spiced Praline', hex: '#A85D48', finish: 'Satin' },
      blush: { shade: 'Terracotta Dune', hex: '#C27357' },
      eyeshadow: { name: 'Sunset Bronze Palette', hexes: ['#8C533E', '#D4AF37', '#5A2A18'] },
      eyeliner: { style: 'Smudged Kohl', color: '#2B1E1A' }
    }
  },
  {
    id: 'look-parisienne',
    name: 'Parisienne Crimson Red',
    collection: 'Minimalist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    description: 'Ultra-clean luminous skin, groomed feathered brows, and an iconic bold matte French red lip.',
    palette: {
      lip: { shade: 'Bordeaux Velvet', hex: '#9E1C2C', finish: 'Matte' },
      blush: { shade: 'Petal Flush', hex: '#E29598' },
      eyeshadow: { name: 'Nude Silk Wash', hexes: ['#DFD3C3', '#C7B198'] },
      eyeliner: { style: 'Micro-Cat Eye', color: '#1A1A1A' }
    }
  },
  {
    id: 'look-golden-hour',
    name: 'Golden Hour Glass Skin',
    collection: 'Sun-Kissed',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    description: 'Luminous champagne highlights, glossy glazed peach lips, and micro-dew cheek flushes.',
    palette: {
      lip: { shade: 'Peachy Glaze', hex: '#E08E79', finish: 'Gloss' },
      blush: { shade: 'Apricot Glow', hex: '#F1A38B' },
      eyeshadow: { name: 'Champagne Shimmer', hexes: ['#F7E7CE', '#E8C5A5'] },
      eyeliner: { style: 'Invisible Tightline', color: '#3E2723' }
    }
  },
  {
    id: 'look-cyberpunk',
    name: 'Tokyo Cyberpunk Chrome',
    collection: 'Avant-Garde',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    description: 'Dual-tone holographic graphic eye accents, cool berry stained lip, and high-impact cheek radiance.',
    palette: {
      lip: { shade: 'Blackberry Wash', hex: '#5E2B38', finish: 'Satin' },
      blush: { shade: 'Lilac Frost', hex: '#CBAACB' },
      eyeshadow: { name: 'Chroma Duo', hexes: ['#70D6FF', '#FF70A6'] },
      eyeliner: { style: 'Floating Graphic Wing', color: '#101014' }
    }
  }
];

export const NAIL_PRESETS: NailStyleOption[] = [
  {
    id: 'nail-chrome-glaze',
    name: 'Hailey Glazed Chrome Donut',
    shape: 'Almond',
    finish: 'Chrome',
    hex: '#F0ECE1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
    hasNailArt: false
  },
  {
    id: 'nail-bordeaux-velvet',
    name: 'Deep Bordeaux Velvet',
    shape: 'Oval',
    finish: 'Glossy',
    hex: '#5B0E1B',
    thumbnailUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
    hasNailArt: false
  },
  {
    id: 'nail-sage-minimal',
    name: 'Nordic Sage Matte',
    shape: 'Square',
    finish: 'Matte',
    hex: '#8A9A86',
    thumbnailUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
    hasNailArt: false
  },
  {
    id: 'nail-french-micro',
    name: 'Micro-French Chrome Line',
    shape: 'Almond',
    finish: 'Glaze',
    hex: '#F9E4D4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
    hasNailArt: true
  }
];

export const FACE_SIMULATION_PRESETS: FaceSimulationOption[] = [
  {
    id: 'sim-teeth-whitening',
    name: 'AI Enamel Whitening',
    category: 'teeth',
    description: 'Subtle shade elevation neutralizing yellow chromophores while preserving natural enamel translucency.',
    intensityRange: { min: 0, max: 100, default: 65 }
  },
  {
    id: 'sim-smile-enhancer',
    name: 'Natural Smile Harmonizer',
    category: 'smile',
    description: 'Micro-elevation of zygomaticus major muscle angles for an authentic radiant expression.',
    intensityRange: { min: 0, max: 100, default: 50 }
  },
  {
    id: 'sim-subtle-lift',
    name: 'Zygomatic Contour Lift',
    category: 'lift',
    description: 'Subtle structural support along cheek planes and jawline margin.',
    intensityRange: { min: 0, max: 100, default: 40 }
  },
  {
    id: 'sim-face-ratios',
    name: 'Facial Ratio Proportions',
    category: 'attributes',
    description: 'Golden ratio diagnostic mapping with symmetry feedback across 18 anatomical facial landmarks.',
    intensityRange: { min: 0, max: 100, default: 80 }
  }
];

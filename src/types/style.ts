export interface HairstyleOption {
  id: string;
  name: string;
  category: 'short' | 'medium' | 'long' | 'bangs' | 'textured';
  thumbnailUrl: string;
  previewOverlayUrl?: string;
  description: string;
  tags: string[];
}

export interface HairColorOption {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  finish: 'Solid' | 'Balayage' | 'Gloss' | 'Ombre';
  undertone: 'Warm' | 'Cool' | 'Neutral';
}

export interface BeardStyleOption {
  id: string;
  name: string;
  category: 'stubble' | 'boxed' | 'goatee' | 'sculpted' | 'full';
  thumbnailUrl: string;
  density: 'light' | 'medium' | 'heavy';
  description: string;
}

export interface MakeupLookOption {
  id: string;
  name: string;
  collection: 'Editorial' | 'Minimalist' | 'Evening Glam' | 'Sun-Kissed' | 'Avant-Garde';
  thumbnailUrl: string;
  description: string;
  palette: {
    lip: { shade: string; hex: string; finish: 'Matte' | 'Satin' | 'Gloss' };
    blush: { shade: string; hex: string };
    eyeshadow: { name: string; hexes: string[] };
    eyeliner: { style: string; color: string };
  };
}

export interface NailStyleOption {
  id: string;
  name: string;
  shape: 'Almond' | 'Square' | 'Coffin' | 'Stiletto' | 'Oval';
  finish: 'Chrome' | 'Glossy' | 'Matte' | 'Glaze' | 'Jelly';
  hex: string;
  thumbnailUrl: string;
  hasNailArt: boolean;
}

export interface FaceSimulationOption {
  id: string;
  name: string;
  category: 'attributes' | 'smile' | 'teeth' | 'lift' | 'reshape';
  description: string;
  intensityRange: { min: number; max: number; default: number };
}

export interface SavedLook {
  id: string;
  title: string;
  date: string;
  baseImageUrl: string;
  styledImageUrl: string;
  studioCategory: 'hair' | 'beard' | 'makeup' | 'nails' | 'face';
  appliedOptions: {
    name: string;
    details: string;
  }[];
  favorite: boolean;
}

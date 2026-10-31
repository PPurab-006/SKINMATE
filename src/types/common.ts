export type AppTab = 
  | 'home'
  | 'skin-hair'
  | 'for-you'
  | 'shop'
  | 'routine'
  | 'lists'
  | 'studio'
  | 'profile';

export type StudioTab = 
  | 'hair'
  | 'beard'
  | 'makeup'
  | 'nails'
  | 'face';

export type DiscoverViewMode =
  | 'overview'
  | 'skin-consultation'
  | 'hair-consultation';

export interface ImageUploadResult {
  file: File;
  previewUrl: string;
  source: 'upload' | 'camera';
  timestamp: string;
}

export type ApiMode = 'live' | 'mock';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

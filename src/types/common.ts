export type AppTab = 
  | 'dashboard'
  | 'skin-lab'
  | 'hair-lab'
  | 'style-studio'
  | 'routine-builder'
  | 'marketplace'
  | 'profile';

export type StudioTab = 
  | 'hair'
  | 'beard'
  | 'makeup'
  | 'nails'
  | 'face';

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

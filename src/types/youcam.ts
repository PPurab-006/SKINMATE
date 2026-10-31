export type YouCamServiceSlug = 
  | 'skin-analysis'
  | 'skin-simulation'
  | 'fitzpatrick-type'
  | 'facial-color-tones'
  | 'face-attributes'
  | 'face-lift'
  | 'face-reshape'
  | 'body-reshape'
  | 'breast-augmentation'
  | 'ai-smile'
  | 'ai-teeth-whitening'
  | 'ai-abs'
  | 'makeup-transfer'
  | 'nail-transfer'
  | 'makeup-vto'
  | 'look-vto'
  | 'nail-vto'
  | 'eye-color'
  | 'hair-color'
  | 'hair-style'
  | 'hair-extension'
  | 'hair-bangs'
  | 'hair-volume'
  | 'wavy-hair'
  | 'beard-style'
  | 'hair-type'
  | 'hair-length'
  | 'hair-frizziness'
  | 'hair-density';

export type TaskStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface YouCamFileUploadResponse {
  status: 'success' | 'error';
  file_id: string;
  file_url?: string;
  error_message?: string;
}

export interface YouCamTaskCreationRequest {
  serviceSlug: YouCamServiceSlug;
  file_id: string;
  options?: Record<string, unknown>;
}

export interface YouCamTaskCreationResponse {
  status: 'success' | 'error';
  task_id: string;
  estimated_wait_time_sec?: number;
  error_message?: string;
}

export interface YouCamTaskPollResponse<T = unknown> {
  status: TaskStatus;
  task_id: string;
  result?: T;
  progress_pct?: number;
  error_message?: string;
}

export interface YouCamConfig {
  baseUrl: string;
  apiKey: string;
  isMockMode: boolean;
  remainingUnits: number;
}

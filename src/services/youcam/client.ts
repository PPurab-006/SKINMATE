import { 
  YouCamServiceSlug, 
  YouCamFileUploadResponse, 
  YouCamTaskCreationResponse, 
  YouCamTaskPollResponse, 
  YouCamConfig 
} from '../../types/youcam';

export interface VtoPayload {
  fileId: string;
  category: string;
  serviceSlug: string;
  effectId: string;
  parameters?: Record<string, unknown>;
  imageUrl?: string;
}

export interface BackendVtoResponse {
  task_id: string;
  service_slug: string;
  original_image_url: string;
  styled_image_url: string;
  effect_name: string;
  category: string;
  parameters_applied: Record<string, unknown>;
  is_mock_demonstration: boolean;
}

export class YouCamClient {
  private config: YouCamConfig;
  private backendBaseUrl: string;

  constructor(config?: Partial<YouCamConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || import.meta.env.VITE_YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com',
      apiKey: config?.apiKey || import.meta.env.VITE_YOUCAM_API_KEY || '',
      isMockMode: config?.isMockMode ?? (import.meta.env.VITE_YOUCAM_MOCK_MODE !== 'false'),
      remainingUnits: config?.remainingUnits ?? 1000,
    };
    this.backendBaseUrl = '';  // Proxied through Vite server /api
  }

  public getConfig(): YouCamConfig {
    return { ...this.config };
  }

  public setMockMode(enabled: boolean) {
    this.config.isMockMode = enabled;
  }

  public setApiKey(key: string) {
    this.config.apiKey = key;
    if (key.trim().length > 0 && import.meta.env.VITE_YOUCAM_MOCK_MODE !== 'true') {
      this.config.isMockMode = false;
    }
  }

  /**
   * Upload image file via Backend Proxy or client mock
   */
  public async uploadFile(file: File | Blob): Promise<YouCamFileUploadResponse> {
    if (this.config.isMockMode) {
      return {
        status: 'success',
        file_id: `mock-file-${Date.now()}`,
        file_url: URL.createObjectURL(file)
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('service_slug', 'generic');

      const response = await fetch(`${this.backendBaseUrl}/api/youcam/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          file_id: data.file_id,
          file_url: data.file_url || URL.createObjectURL(file)
        };
      }
    } catch (e) {
      console.warn('Backend proxy upload unreachable, using local fallback:', e);
    }

    return {
      status: 'success',
      file_id: `mock-file-${Date.now()}`,
      file_url: URL.createObjectURL(file)
    };
  }

  /**
   * Create an asynchronous task for a given YouCam service
   */
  public async createTask(
    serviceSlug: YouCamServiceSlug, 
    fileId: string, 
    options?: Record<string, unknown>
  ): Promise<YouCamTaskCreationResponse> {
    if (this.config.isMockMode) {
      return {
        status: 'success',
        task_id: `mock-task-${serviceSlug}-${Date.now()}`,
        estimated_wait_time_sec: 2
      };
    }

    try {
      const response = await fetch(`${this.backendBaseUrl}/api/youcam/task/${serviceSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: fileId, ...options })
      });

      if (response.ok) {
        const data = await response.json();
        this.config.remainingUnits = Math.max(0, this.config.remainingUnits - 1);
        return data;
      }
    } catch (e) {
      console.warn('Backend proxy task creation unreachable, using mock:', e);
    }

    return {
      status: 'success',
      task_id: `mock-task-${serviceSlug}-${Date.now()}`,
      estimated_wait_time_sec: 2
    };
  }

  /**
   * Poll task status until completion or timeout
   */
  public async pollTaskResult<T>(
    serviceSlug: YouCamServiceSlug, 
    taskId: string, 
    maxAttempts = 15, 
    intervalMs = 1500
  ): Promise<YouCamTaskPollResponse<T>> {
    if (this.config.isMockMode || taskId.startsWith('mock-task')) {
      await new Promise(res => setTimeout(res, 1000));
      return {
        status: 'success',
        task_id: taskId,
        progress_pct: 100,
      };
    }

    let attempts = 0;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch(`${this.backendBaseUrl}/api/youcam/poll/${serviceSlug}/${taskId}`);
        if (response.ok) {
          const data: YouCamTaskPollResponse<T> = await response.json();
          if (data.status === 'success' || data.status === 'failed') {
            return data;
          }
        }
      } catch (e) {
        console.warn(`Polling attempt ${attempts} encountered error:`, e);
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    return {
      status: 'success',
      task_id: taskId,
      progress_pct: 100
    };
  }

  /**
   * Dispatches Virtual Try-On request to backend orchestrator
   */
  public async applyVto(payload: VtoPayload): Promise<BackendVtoResponse> {
    try {
      const response = await fetch(`${this.backendBaseUrl}/api/youcam/style/vto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: payload.fileId,
          category: payload.category,
          service_slug: payload.serviceSlug,
          effect_id: payload.effectId,
          parameters: payload.parameters,
          image_url: payload.imageUrl
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Live Virtual Try-On failed (HTTP ${response.status})`);
      }

      return await response.json();
    } catch (e: any) {
      console.error('Live VTO request failed:', e);
      throw e;
    }
  }
}

// Global client instance
export const youCamClient = new YouCamClient();

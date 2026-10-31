import { 
  YouCamServiceSlug, 
  YouCamFileUploadResponse, 
  YouCamTaskCreationResponse, 
  YouCamTaskPollResponse, 
  YouCamConfig 
} from '../../types/youcam';

export class YouCamClient {
  private config: YouCamConfig;

  constructor(config?: Partial<YouCamConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || import.meta.env.VITE_YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com',
      apiKey: config?.apiKey || import.meta.env.VITE_YOUCAM_API_KEY || '',
      isMockMode: config?.isMockMode ?? (import.meta.env.VITE_YOUCAM_MOCK_MODE !== 'false'),
      remainingUnits: config?.remainingUnits ?? 1000,
    };
  }

  public getConfig(): YouCamConfig {
    return { ...this.config };
  }

  public setMockMode(enabled: boolean) {
    this.config.isMockMode = enabled;
  }

  public setApiKey(key: string) {
    this.config.apiKey = key;
    if (key.trim().length > 0) {
      // If user provided a real key, they can switch to live mode
      this.config.isMockMode = false;
    }
  }

  /**
   * Upload image file to obtain a S2S file_id
   */
  public async uploadFile(file: File | Blob): Promise<YouCamFileUploadResponse> {
    if (this.config.isMockMode || !this.config.apiKey) {
      return {
        status: 'success',
        file_id: `mock-file-${Date.now()}`,
        file_url: URL.createObjectURL(file)
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.config.baseUrl}/s2s/v2.0/file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`YouCam File Upload Failed (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Create an asynchronous task for a given YouCam service
   */
  public async createTask(
    serviceSlug: YouCamServiceSlug, 
    fileId: string, 
    options?: Record<string, unknown>
  ): Promise<YouCamTaskCreationResponse> {
    if (this.config.isMockMode || !this.config.apiKey) {
      return {
        status: 'success',
        task_id: `mock-task-${serviceSlug}-${Date.now()}`,
        estimated_wait_time_sec: 2
      };
    }

    const response = await fetch(`${this.config.baseUrl}/s2s/v2.0/task/${serviceSlug}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`YouCam Task Creation Failed (${response.status}): ${errorText}`);
    }

    // Decrement unit tracking locally
    this.config.remainingUnits = Math.max(0, this.config.remainingUnits - 1);

    return response.json();
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
      // Return simulated delay and mock payload
      await new Promise(res => setTimeout(res, 1200));
      return {
        status: 'success',
        task_id: taskId,
        progress_pct: 100,
      };
    }

    let attempts = 0;
    while (attempts < maxAttempts) {
      attempts++;
      const response = await fetch(`${this.config.baseUrl}/s2s/v2.0/task/${serviceSlug}/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to poll task status (${response.status})`);
      }

      const data: YouCamTaskPollResponse<T> = await response.json();
      if (data.status === 'success' || data.status === 'failed') {
        return data;
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error(`YouCam Task ${taskId} timed out after ${maxAttempts} polling attempts`);
  }
}

// Global client instance
export const youCamClient = new YouCamClient();

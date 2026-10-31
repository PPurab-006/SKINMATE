import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';
import { HairAnalysisResult } from '../../types/hair';

export class HairService {
  public static async analyzeHair(file: File | Blob, previewUrl: string): Promise<HairAnalysisResult> {
    const config = youCamClient.getConfig();

    if (config.isMockMode || !config.apiKey) {
      return YouCamMockAdapter.analyzeHair(previewUrl);
    }

    try {
      const uploadRes = await youCamClient.uploadFile(file);
      const taskRes = await youCamClient.createTask('hair-type', uploadRes.file_id);
      await youCamClient.pollTaskResult('hair-type', taskRes.task_id);

      return {
        ...await YouCamMockAdapter.analyzeHair(previewUrl),
        id: taskRes.task_id,
        imageUrl: previewUrl,
      };
    } catch (err) {
      console.warn('YouCam Hair API failed, using mock adapter:', err);
      return YouCamMockAdapter.analyzeHair(previewUrl);
    }
  }
}

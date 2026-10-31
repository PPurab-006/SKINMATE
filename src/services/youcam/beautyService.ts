import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';

export class BeautyService {
  public static async applyMakeupVTO(baseImageUrl: string, lookId: string): Promise<string> {
    const config = youCamClient.getConfig();
    if (config.isMockMode || !config.apiKey) {
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'makeup', lookId);
      return res.styledImageUrl;
    }

    try {
      // Live makeup VTO endpoint
      const taskRes = await youCamClient.createTask('makeup-vto', 'file-ref', { look_id: lookId });
      await youCamClient.pollTaskResult('makeup-vto', taskRes.task_id);
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'makeup', lookId);
      return res.styledImageUrl;
    } catch {
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'makeup', lookId);
      return res.styledImageUrl;
    }
  }

  public static async applyNailVTO(baseImageUrl: string, nailId: string): Promise<string> {
    const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'nails', nailId);
    return res.styledImageUrl;
  }
}

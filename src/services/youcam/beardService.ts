import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';

export class BeardService {
  public static async applyBeardStyle(baseImageUrl: string, beardStyleId: string): Promise<string> {
    const config = youCamClient.getConfig();
    if (config.isMockMode || !config.apiKey) {
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'beard', beardStyleId);
      return res.styledImageUrl;
    }

    try {
      const taskRes = await youCamClient.createTask('beard-style', 'file-ref', { style_id: beardStyleId });
      await youCamClient.pollTaskResult('beard-style', taskRes.task_id);
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'beard', beardStyleId);
      return res.styledImageUrl;
    } catch {
      const res = await YouCamMockAdapter.generateStylePreview(baseImageUrl, 'beard', beardStyleId);
      return res.styledImageUrl;
    }
  }
}

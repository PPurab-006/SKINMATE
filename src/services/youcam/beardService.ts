import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';

export class BeardService {
  public static async applyBeardStyle(baseImageUrl: string, beardStyleId: string, fileId: string = 'portrait-base'): Promise<string> {
    const vto = await youCamClient.applyVto({
      fileId,
      category: 'beard',
      serviceSlug: 'beard-style',
      effectId: beardStyleId,
      imageUrl: baseImageUrl,
    });
    return vto.styled_image_url || baseImageUrl;
  }
}

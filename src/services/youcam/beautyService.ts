import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';

export class BeautyService {
  public static async applyMakeupVTO(baseImageUrl: string, lookId: string, fileId: string = 'portrait-base'): Promise<string> {
    const vto = await youCamClient.applyVto({
      fileId,
      category: 'makeup',
      serviceSlug: 'look-vto',
      effectId: lookId,
      imageUrl: baseImageUrl,
    });
    return vto.styled_image_url || baseImageUrl;
  }

  public static async applyNailVTO(baseImageUrl: string, nailId: string, fileId: string = 'portrait-base', finish: string = 'Glossy'): Promise<string> {
    const vto = await youCamClient.applyVto({
      fileId,
      category: 'nails',
      serviceSlug: 'nail-vto',
      effectId: nailId,
      parameters: { finish },
      imageUrl: baseImageUrl,
    });
    return vto.styled_image_url || baseImageUrl;
  }
}

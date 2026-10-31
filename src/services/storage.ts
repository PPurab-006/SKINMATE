import { UserAppearanceProfile } from '../types/profile';
import { Routine } from '../types/routine';
import { SavedLook } from '../types/style';
import { DEFAULT_USER_PROFILE } from '../data/mockAnalysis';

const STORAGE_KEYS = {
  PROFILE: 'skinmate_user_profile',
  ACTIVE_ROUTINES: 'skinmate_active_routines',
  SAVED_LOOKS: 'skinmate_saved_looks',
  API_CONFIG: 'skinmate_api_config',
};

export class StorageService {
  public static getUserProfile(): UserAppearanceProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load profile from storage:', e);
    }
    return DEFAULT_USER_PROFILE;
  }

  public static saveUserProfile(profile: UserAppearanceProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to storage:', e);
    }
  }

  public static getSavedLooks(): SavedLook[] {
    const profile = this.getUserProfile();
    return profile.savedLooks || [];
  }

  public static addSavedLook(look: SavedLook): void {
    const profile = this.getUserProfile();
    profile.savedLooks = [look, ...(profile.savedLooks || [])];
    this.saveUserProfile(profile);
  }

  public static getRoutines(): Routine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUTINES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load routines from storage:', e);
    }
    return [];
  }

  public static saveRoutines(routines: Routine[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUTINES, JSON.stringify(routines));
    } catch (e) {
      console.error('Failed to save routines to storage:', e);
    }
  }

  public static deleteSavedLook(lookId: string): void {
    const profile = this.getUserProfile();
    profile.savedLooks = (profile.savedLooks || []).filter(l => l.id !== lookId);
    this.saveUserProfile(profile);
  }

  public static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROUTINES);
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOOKS);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}

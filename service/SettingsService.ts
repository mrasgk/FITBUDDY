import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  // General settings
  notifications: boolean;
  locationServices: boolean;
  darkMode: boolean;
  publicProfile: boolean;
  activityReminders: boolean;
  
  // Privacy settings
  profileVisibility: boolean;
  activitySharing: boolean;
  locationSharing: boolean;
  friendRequests: boolean;
  onlineStatus: boolean;
  searchVisibility: boolean;
  dataCollection: boolean;
  thirdPartySharing: boolean;
  
  // Notification preferences
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  friendActivity: boolean;
  newActivities: boolean;
  activityUpdates: boolean;
  messages: boolean;
  groupInvites: boolean;
  achievements: boolean;
  promotions: boolean;
  newsletters: boolean;
  appUpdates: boolean;
  quietHours: boolean;
  vibration: boolean;
  
  // Other settings
  selectedLanguage: string;
  notificationSound: string;
  soundVolume: number;
  quietStart: string;
  quietEnd: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  // General settings
  notifications: true,
  locationServices: true,
  darkMode: false,
  publicProfile: false,
  activityReminders: true,
  
  // Privacy settings
  profileVisibility: true,
  activitySharing: true,
  locationSharing: false,
  friendRequests: true,
  onlineStatus: true,
  searchVisibility: true,
  dataCollection: false,
  thirdPartySharing: false,
  
  // Notification preferences
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  friendActivity: true,
  newActivities: true,
  activityUpdates: false,
  messages: true,
  groupInvites: true,
  achievements: true,
  promotions: false,
  newsletters: true,
  appUpdates: true,
  quietHours: true,
  vibration: true,
  
  // Other settings
  selectedLanguage: 'English (US)',
  notificationSound: 'Default',
  soundVolume: 0.7,
  quietStart: '22:00',
  quietEnd: '08:00',
};

class SettingsService {
  private static instance: SettingsService;
  private settings: SettingsState = { ...DEFAULT_SETTINGS };
  private readonly STORAGE_KEY = '@FitBuddy:Settings';

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  // Load settings from AsyncStorage
  public async loadSettings(): Promise<SettingsState> {
    try {
      const savedSettings = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with defaults to ensure all properties exist
        this.settings = { ...DEFAULT_SETTINGS, ...parsedSettings };
      } else {
        this.settings = { ...DEFAULT_SETTINGS };
      }
      return this.settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = { ...DEFAULT_SETTINGS };
      return this.settings;
    }
  }

  // Save settings to AsyncStorage
  public async saveSettings(newSettings: Partial<SettingsState>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Get current settings
  public getSettings(): SettingsState {
    return { ...this.settings };
  }

  // Get specific setting
  public getSetting<K extends keyof SettingsState>(key: K): SettingsState[K] {
    return this.settings[key];
  }

  // Update specific setting
  public async updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ): Promise<void> {
    try {
      this.settings[key] = value;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  }

  // Reset to default settings
  public async resetSettings(): Promise<void> {
    try {
      this.settings = { ...DEFAULT_SETTINGS };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Clear all settings (for logout/uninstall)
  public async clearSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      this.settings = { ...DEFAULT_SETTINGS };
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw error;
    }
  }

  // Export settings (for backup)
  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  // Import settings (from backup)
  public async importSettings(settingsJson: string): Promise<void> {
    try {
      const importedSettings = JSON.parse(settingsJson);
      // Validate and merge with defaults
      const validatedSettings = { ...DEFAULT_SETTINGS, ...importedSettings };
      this.settings = validatedSettings;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }

  // Check if dark mode is enabled
  public isDarkMode(): boolean {
    return this.settings.darkMode;
  }

  // Check if notifications are enabled
  public areNotificationsEnabled(): boolean {
    return this.settings.notifications && this.settings.pushNotifications;
  }

  // Check if location services are enabled
  public isLocationEnabled(): boolean {
    return this.settings.locationServices;
  }

  // Get notification preferences
  public getNotificationPreferences() {
    return {
      push: this.settings.pushNotifications,
      email: this.settings.emailNotifications,
      sms: this.settings.smsNotifications,
      activityReminders: this.settings.activityReminders,
      friendActivity: this.settings.friendActivity,
      messages: this.settings.messages,
      quietHours: this.settings.quietHours,
      quietStart: this.settings.quietStart,
      quietEnd: this.settings.quietEnd,
    };
  }

  // Get privacy preferences
  public getPrivacyPreferences() {
    return {
      publicProfile: this.settings.publicProfile,
      profileVisibility: this.settings.profileVisibility,
      activitySharing: this.settings.activitySharing,
      locationSharing: this.settings.locationSharing,
      friendRequests: this.settings.friendRequests,
      onlineStatus: this.settings.onlineStatus,
      searchVisibility: this.settings.searchVisibility,
      dataCollection: this.settings.dataCollection,
      thirdPartySharing: this.settings.thirdPartySharing,
    };
  }

  // Get app preferences
  public getAppPreferences() {
    return {
      darkMode: this.settings.darkMode,
      language: this.settings.selectedLanguage,
      locationServices: this.settings.locationServices,
      notificationSound: this.settings.notificationSound,
      soundVolume: this.settings.soundVolume,
      vibration: this.settings.vibration,
    };
  }
}

// Export singleton instance
export const settingsService = SettingsService.getInstance();
export default SettingsService;
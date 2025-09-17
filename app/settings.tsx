import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { settingsService, SettingsState } from '@/service';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  action?: () => void;
  color?: string;
}

export default function SettingsPage() {
  const { themeMode, updateTheme, refreshTheme, isLoading: themeLoading } = useTheme();
  const colors = Colors[themeMode];

  // Settings state
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await settingsService.loadSettings();
      setSettings(loadedSettings);
      // Refresh theme to sync with loaded settings
      await refreshTheme();
    } catch (error) {
      console.error('Error loading settings:', error);
      showNotification('error', 'Error', 'Failed to load settings. Using defaults.', []);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
    successTitle: string,
    successMessage: string
  ) => {
    if (!settings) return;
    
    try {
      await settingsService.updateSetting(key, value);
      setSettings(prev => prev ? { ...prev, [key]: value } : null);
      showNotification('success', successTitle, successMessage, []);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      showNotification('error', 'Update Failed', 'Failed to save setting. Please try again.', []);
    }
  };
  // Modal and notification state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  // Languages data
  const languages = [
    'English (US)',
    'English (UK)',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese (Simplified)',
    'Japanese',
    'Korean',
  ];

  // Return loading state if settings not loaded
  if (isLoading || themeLoading || !settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Loading settings...</Text>
      </View>
    );
  }

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'account-info',
          title: 'Account Information',
          description: 'Manage your personal details',
          icon: 'person.fill',
          type: 'navigation',
          action: () => router.push('/account-info' as any),
          color: PrimaryColor,
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          description: 'Control who can see your information',
          icon: 'lock.fill',
          type: 'navigation',
          action: () => router.push('/privacy-security' as any),
          color: '#059669',
        },
        {
          id: 'public-profile',
          title: 'Public Profile',
          description: 'Allow others to find you',
          icon: 'eye.fill',
          type: 'toggle',
          value: settings.publicProfile,
          action: () => {
            const newValue = !settings.publicProfile;
            updateSetting(
              'publicProfile',
              newValue,
              'Profile Visibility Updated',
              `Your profile is now ${newValue ? 'public' : 'private'}. ${newValue ? 'Others can find and connect with you.' : 'Your profile is hidden from search.'}`
            );
          },
          color: '#8b5cf6',
        },
      ] as SettingItem[],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: 'bell.fill',
          type: 'toggle',
          value: settings.notifications,
          action: () => {
            const newValue = !settings.notifications;
            updateSetting(
              'notifications',
              newValue,
              'Notification Settings Updated',
              `Push notifications ${newValue ? 'enabled' : 'disabled'}. ${newValue ? 'You\'ll receive activity updates.' : 'You won\'t receive push notifications.'}`
            );
          },
          color: AccentColor,
        },
        {
          id: 'activity-reminders',
          title: 'Activity Reminders',
          description: 'Get reminders about upcoming activities',
          icon: 'alarm.fill',
          type: 'toggle',
          value: settings.activityReminders,
          action: () => {
            const newValue = !settings.activityReminders;
            updateSetting(
              'activityReminders',
              newValue,
              'Activity Reminders Updated',
              `Activity reminders ${newValue ? 'enabled' : 'disabled'}. ${newValue ? 'You\'ll get reminders for upcoming activities.' : 'No more activity reminders.'}`
            );
          },
          color: '#f59e0b',
        },
        {
          id: 'notification-settings',
          title: 'Notification Preferences',
          description: 'Customize what notifications you receive',
          icon: 'gear',
          type: 'navigation',
          action: () => router.push('/notification-preferences' as any),
          color: '#6b7280',
        },
      ] as SettingItem[],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          description: 'Use dark theme for the app',
          icon: 'brightness.3',
          type: 'toggle',
          value: settings.darkMode,
          action: async () => {
            const newValue = !settings.darkMode;
            try {
              await settingsService.updateSetting('darkMode', newValue);
              setSettings(prev => prev ? { ...prev, darkMode: newValue } : null);
              await updateTheme(newValue);
              showNotification(
                'success',
                'Theme Updated',
                `Switched to ${newValue ? 'dark' : 'light'} mode successfully!`,
                []
              );
            } catch (error) {
              console.error('Error updating theme:', error);
              showNotification('error', 'Update Failed', 'Failed to update theme. Please try again.', []);
            }
          },
          color: '#374151',
        },
        {
          id: 'location',
          title: 'Location Services',
          description: 'Help find activities near you',
          icon: 'location.fill',
          type: 'toggle',
          value: settings.locationServices,
          action: () => {
            const newValue = !settings.locationServices;
            updateSetting(
              'locationServices',
              newValue,
              'Location Services Updated',
              `Location services ${newValue ? 'enabled' : 'disabled'}. ${newValue ? 'We can now suggest nearby activities.' : 'Location-based features are disabled.'}`
            );
          },
          color: '#10b981',
        },
        {
          id: 'language',
          title: 'Language',
          description: settings.selectedLanguage,
          icon: 'globe',
          type: 'navigation',
          action: () => setShowLanguageModal(true),
          color: '#3b82f6',
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          description: 'Get help or contact support',
          icon: 'questionmark.circle.fill',
          type: 'navigation',
          action: () => router.push('/help-support' as any),
          color: '#059669',
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Help us improve the app',
          icon: 'paperplane.fill',
          type: 'navigation',
          action: () => setShowFeedbackModal(true),
          color: PrimaryColor,
        },
        {
          id: 'about',
          title: 'About FitBuddy',
          description: 'Version 1.0.0',
          icon: 'info.circle.fill',
          type: 'navigation',
          action: () => showNotification('info', 'About FitBuddy', 'Version 1.0.0 - Connect with sports enthusiasts and discover new activities!', []),
          color: '#6b7280',
        },
      ] as SettingItem[],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'data-export',
          title: 'Export Data',
          description: 'Download your data',
          icon: 'square.and.arrow.up',
          type: 'action',
          action: () => showNotification(
            'info',
            'Data Export Requested',
            'Your data export will be emailed to you within 24 hours.',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'default'
              },
              {
                text: 'Confirm',
                onPress: () => showNotification('success', 'Export Started', 'Your data is being prepared for export.', []),
                style: 'primary'
              }
            ]
          ),
          color: '#f59e0b',
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          description: 'Permanently delete your account',
          icon: 'trash.fill',
          type: 'action',
          action: () => setShowDeleteAccountModal(true),
          color: '#ef4444',
        },
      ] as SettingItem[],
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    actions: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>
  ) => {
    setNotification({ visible: true, type, title, message, actions });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleLanguageSelect = (language: string) => {
    updateSetting(
      'selectedLanguage',
      language,
      'Language Updated',
      `Language changed to ${language}. Some changes may require app restart.`
    );
    setShowLanguageModal(false);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      setShowFeedbackModal(false);
      setFeedbackText('');
      showNotification(
        'success',
        'Feedback Sent',
        'Thank you for your feedback! We\'ll review it and get back to you soon.',
        []
      );
    } else {
      showNotification(
        'warning',
        'Empty Feedback',
        'Please write some feedback before submitting.',
        []
      );
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(false);
    showNotification(
      'error',
      'Account Deletion',
      'Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'default'
        },
        {
          text: 'Delete Forever',
          onPress: () => {
            showNotification('success', 'Account Deleted', 'Your account has been permanently deleted.', []);
            setTimeout(() => router.replace('/login'), 2000);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }
      ]}
      onPress={item.action}
      activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingContent}>
        <View style={[
          styles.settingIcon,
          { backgroundColor: (item.color || PrimaryColor) + '20' }
        ]}>
          <IconSymbol
            name={item.icon as any}
            size={20}
            color={item.color || PrimaryColor}
          />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[styles.settingDescription, { color: colors.icon }]}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{ false: colors.border, true: PrimaryColor + '50' }}
              thumbColor={item.value ? PrimaryColor : colors.icon}
            />
          ) : (
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.icon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={[styles.appIcon, { backgroundColor: PrimaryColor }]}>
            <IconSymbol name="figure.soccer" size={32} color="white" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>
            FitBuddy
          </Text>
          <Text style={[styles.appVersion, { color: colors.icon }]}>
            Version 1.0.0
          </Text>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={styles.modalCloseButton}
              >
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.languageItem,
                    {
                      backgroundColor: settings.selectedLanguage === language ? PrimaryColor + '20' : 'transparent',
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.languageText,
                    {
                      color: settings.selectedLanguage === language ? PrimaryColor : colors.text,
                      fontWeight: settings.selectedLanguage === language ? '600' : 'normal',
                    }
                  ]}>
                    {language}
                  </Text>
                  {settings.selectedLanguage === language && (
                    <IconSymbol name="checkmark" size={16} color={PrimaryColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.feedbackModal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Send Feedback</Text>
              <TouchableOpacity
                onPress={() => setShowFeedbackModal(false)}
                style={styles.modalCloseButton}
              >
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.feedbackDescription, { color: colors.icon }]}>
              Help us improve FitBuddy! Share your thoughts, suggestions, or report any issues.
            </Text>
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                }
              ]}
              placeholder="Type your feedback here..."
              placeholderTextColor={colors.icon}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={styles.feedbackActions}>
              <TouchableOpacity
                style={[styles.feedbackButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowFeedbackModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, styles.submitButton, { backgroundColor: PrimaryColor }]}
                onPress={handleFeedbackSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Send Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteAccountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ef4444" />
              <Text style={[styles.modalTitle, styles.deleteTitle, { color: colors.text }]}>Delete Account</Text>
              <Text style={[styles.deleteMessage, { color: colors.icon }]}>
                This action cannot be undone. All your data, activities, friends, and account information will be permanently deleted.
              </Text>
            </View>
            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={[styles.deleteButton, styles.cancelDeleteButton, { borderColor: colors.border }]}
                onPress={() => setShowDeleteAccountModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Keep Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, styles.confirmDeleteButton]}
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>Delete Forever</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Component */}
      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        actions={notification.actions || []}
        onHide={hideNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  settingItem: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingAction: {
    marginLeft: 12,
  },
  bottomPadding: {
    height: 100,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  // Language Modal
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  languageText: {
    fontSize: 16,
  },
  // Feedback Modal
  feedbackModal: {
    maxHeight: '70%',
  },
  feedbackDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 120,
    marginBottom: 20,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: PrimaryColor,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Delete Account Modal
  deleteTitle: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  deleteMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelDeleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmDeleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
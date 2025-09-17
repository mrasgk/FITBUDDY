import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
  color?: string;
  danger?: boolean;
  
}

export default function PrivacySecurityPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activitySharing, setActivitySharing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [friendRequests, setFriendRequests] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);

  // Modal state
  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    actions: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }> = []
  ) => {
    setNotification({ visible: true, type, title, message, actions });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleBack = () => {
    router.back();
  };

  const privacySections = [
    {
      title: 'Profile Privacy',
      items: [
        {
          id: 'profile-visibility',
          title: 'Public Profile',
          description: 'Allow others to find and view your profile',
          icon: 'person.circle.fill',
          type: 'toggle',
          value: profileVisibility,
          action: () => {
            setProfileVisibility(!profileVisibility);
            showNotification(
              'success',
              'Profile Visibility Updated',
              `Your profile is now ${!profileVisibility ? 'public' : 'private'}. ${!profileVisibility ? 'Others can find and view your profile.' : 'Your profile is hidden from public search.'}`,
              []
            );
          },
          color: PrimaryColor,
        },
        {
          id: 'activity-sharing',
          title: 'Activity Sharing',
          description: 'Share your activities with friends',
          icon: 'figure.run',
          type: 'toggle',
          value: activitySharing,
          action: () => {
            setActivitySharing(!activitySharing);
            showNotification(
              'success',
              'Activity Sharing Updated',
              `Activity sharing is now ${!activitySharing ? 'enabled' : 'disabled'}. ${!activitySharing ? 'Friends can see your activities.' : 'Your activities are private.'}`,
              []
            );
          },
          color: AccentColor,
        },
        {
          id: 'search-visibility',
          title: 'Search Visibility',
          description: 'Allow others to find you in search results',
          icon: 'magnifyingglass',
          type: 'toggle',
          value: searchVisibility,
          action: () => {
            setSearchVisibility(!searchVisibility);
            showNotification(
              'success',
              'Search Visibility Updated',
              `You are now ${!searchVisibility ? 'visible' : 'hidden'} in search results.`,
              []
            );
          },
          color: '#10b981',
        },
      ] as PrivacySetting[],
    },
    {
      title: 'Social Privacy',
      items: [
        {
          id: 'friend-requests',
          title: 'Accept Friend Requests',
          description: 'Allow others to send you friend requests',
          icon: 'person.2.fill',
          type: 'toggle',
          value: friendRequests,
          action: () => {
            setFriendRequests(!friendRequests);
            showNotification(
              'success',
              'Friend Request Settings Updated',
              `Friend requests are now ${!friendRequests ? 'enabled' : 'disabled'}.`,
              []
            );
          },
          color: '#8b5cf6',
        },
        {
          id: 'online-status',
          title: 'Show Online Status',
          description: 'Let friends see when you\'re online',
          icon: 'circle.fill',
          type: 'toggle',
          value: onlineStatus,
          action: () => {
            setOnlineStatus(!onlineStatus);
            showNotification(
              'success',
              'Online Status Updated',
              `Your online status is now ${!onlineStatus ? 'visible' : 'hidden'} to friends.`,
              []
            );
          },
          color: '#10b981',
        },
      ] as PrivacySetting[],
    },
    {
      title: 'Location & Data',
      items: [
        {
          id: 'location-sharing',
          title: 'Location Sharing',
          description: 'Share your location with friends',
          icon: 'location.fill',
          type: 'toggle',
          value: locationSharing,
          action: () => {
            setLocationSharing(!locationSharing);
            showNotification(
              locationSharing ? 'warning' : 'success',
              'Location Sharing Updated',
              `Location sharing is now ${!locationSharing ? 'enabled' : 'disabled'}. ${!locationSharing ? 'Friends can see your location.' : 'Your location is private.'}`,
              []
            );
          },
          color: '#f59e0b',
        },
        {
          id: 'data-collection',
          title: 'Analytics Data Collection',
          description: 'Help improve the app with usage analytics',
          icon: 'chart.bar.fill',
          type: 'toggle',
          value: dataCollection,
          action: () => {
            setDataCollection(!dataCollection);
            showNotification(
              'success',
              'Data Collection Updated',
              `Analytics data collection is now ${!dataCollection ? 'enabled' : 'disabled'}.`,
              []
            );
          },
          color: '#6b7280',
        },
        {
          id: 'third-party',
          title: 'Third-Party Data Sharing',
          description: 'Share data with partner services',
          icon: 'link',
          type: 'toggle',
          value: thirdPartySharing,
          action: () => {
            setThirdPartySharing(!thirdPartySharing);
            showNotification(
              thirdPartySharing ? 'success' : 'warning',
              'Third-Party Sharing Updated',
              `Third-party data sharing is now ${!thirdPartySharing ? 'enabled' : 'disabled'}.`,
              []
            );
          },
          color: '#ef4444',
        },
      ] as PrivacySetting[],
    },
    {
      title: 'Security Actions',
      items: [
        {
          id: 'active-sessions',
          title: 'Active Sessions',
          description: 'Manage your active login sessions',
          icon: 'desktopcomputer',
          type: 'action',
          action: () => showNotification('info', 'Active Sessions', 'Opening session management...'),
          color: PrimaryColor,
        },
        {
          id: 'login-history',
          title: 'Login History',
          description: 'View your recent login activity',
          icon: 'clock.fill',
          type: 'action',
          action: () => showNotification('info', 'Login History', 'Opening login history...'),
          color: AccentColor,
        },
        {
          id: 'blocked-users',
          title: 'Blocked Users',
          description: 'Manage your blocked users list',
          icon: 'person.fill.xmark',
          type: 'action',
          action: () => showNotification('info', 'Blocked Users', 'Opening blocked users management...'),
          color: '#ef4444',
        },
      ] as PrivacySetting[],
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'export-data',
          title: 'Export My Data',
          description: 'Download a copy of your data',
          icon: 'square.and.arrow.up',
          type: 'action',
          action: () => setShowDataExportModal(true),
          color: '#10b981',
        },
        {
          id: 'delete-data',
          title: 'Delete My Data',
          description: 'Permanently delete all your data',
          icon: 'trash.fill',
          type: 'action',
          action: () => setShowDeleteDataModal(true),
          color: '#ef4444',
          danger: true,
        },
      ] as PrivacySetting[],
    },
  ];

  const handleExportData = () => {
    setShowDataExportModal(false);
    showNotification(
      'success',
      'Data Export Requested',
      'Your data export has been started. You\'ll receive an email with download instructions within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => hideNotification(),
          style: 'primary'
        }
      ]
    );
  };

  const handleDeleteData = () => {
    setShowDeleteDataModal(false);
    showNotification(
      'error',
      'Data Deletion Confirmation',
      'Are you absolutely sure? This will permanently delete ALL your data including activities, friends, and account information. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'default'
        },
        {
          text: 'Delete Everything',
          onPress: () => {
            showNotification('success', 'Data Deletion Started', 'Your data deletion request has been processed. Your account will be permanently deleted within 30 days.');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderPrivacyItem = (item: PrivacySetting) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.privacyItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }
      ]}
      onPress={item.action}
      activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.privacyContent}>
        <View style={[
          styles.privacyIcon,
          { backgroundColor: (item.color || PrimaryColor) + '20' }
        ]}>
          <IconSymbol
            name={item.icon as any}
            size={20}
            color={item.color || PrimaryColor}
          />
        </View>
        <View style={styles.privacyInfo}>
          <Text style={[
            styles.privacyTitle,
            { color: item.danger ? '#ef4444' : colors.text }
          ]}>
            {item.title}
          </Text>
          <Text style={[styles.privacyDescription, { color: colors.icon }]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.privacyAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{ false: colors.border, true: (item.color || PrimaryColor) + '50' }}
              thumbColor={item.value ? (item.color || PrimaryColor) : colors.icon}
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
          Privacy & Security
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Sections */}
        {privacySections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderPrivacyItem)}
            </View>
          </View>
        ))}

        {/* Privacy Policy */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.policyButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => showNotification('info', 'Privacy Policy', 'Opening privacy policy...')}
          >
            <IconSymbol name="doc.text.fill" size={20} color={PrimaryColor} />
            <Text style={[styles.policyButtonText, { color: colors.text }]}>
              Privacy Policy & Terms
            </Text>
            <IconSymbol name="arrow.up.right" size={16} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Data Export Modal */}
      <Modal
        visible={showDataExportModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDataExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <IconSymbol name="square.and.arrow.up" size={48} color={PrimaryColor} />
              <Text style={[styles.modalTitle, styles.exportTitle, { color: colors.text }]}>
                Export Your Data
              </Text>
              <Text style={[styles.modalDescription, { color: colors.icon }]}>
                We'll prepare a complete copy of your data including profile information, activities, friends, and settings. You'll receive an email with download instructions.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowDataExportModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: PrimaryColor }]}
                onPress={handleExportData}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Start Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Data Modal */}
      <Modal
        visible={showDeleteDataModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteDataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ef4444" />
              <Text style={[styles.modalTitle, styles.deleteTitle, { color: colors.text }]}>
                Delete All Data
              </Text>
              <Text style={[styles.modalDescription, { color: colors.icon }]}>
                This action will permanently delete ALL your data including your profile, activities, friends, and all associated information. This action cannot be undone.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowDeleteDataModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Keep My Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.dangerButton]}
                onPress={handleDeleteData}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerButtonText}>Delete Everything</Text>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
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
  privacyItem: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
  },
  privacyAction: {
    marginLeft: 12,
  },
  policyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginHorizontal: 20,
  },
  policyButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  exportTitle: {
    color: PrimaryColor,
  },
  deleteTitle: {
    color: '#ef4444',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: PrimaryColor,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
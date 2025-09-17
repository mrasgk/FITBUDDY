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

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
  color?: string;
}

export default function NotificationPreferencesPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [messages, setMessages] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [quietHours, setQuietHours] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);
  
  // Modal state
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [notificationSound, setNotificationSound] = useState('Default');

  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ visible: true, type, title, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const sounds = ['Default', 'Chime', 'Bell', 'Whistle', 'Ping', 'None'];

  const notificationSections = [
    {
      title: 'Notification Channels',
      items: [
        {
          id: 'push',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: 'bell.fill',
          type: 'toggle',
          value: pushNotifications,
          action: () => {
            setPushNotifications(!pushNotifications);
            showNotification('success', 'Push Notifications Updated', `Push notifications ${!pushNotifications ? 'enabled' : 'disabled'}.`);
          },
          color: PrimaryColor,
        },
        {
          id: 'email',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: 'envelope.fill',
          type: 'toggle',
          value: emailNotifications,
          action: () => {
            setEmailNotifications(!emailNotifications);
            showNotification('success', 'Email Notifications Updated', `Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}.`);
          },
          color: AccentColor,
        },
      ] as NotificationSetting[],
    },
    {
      title: 'Activity Notifications',
      items: [
        {
          id: 'activity-reminders',
          title: 'Activity Reminders',
          description: 'Get reminders about upcoming activities',
          icon: 'alarm.fill',
          type: 'toggle',
          value: activityReminders,
          action: () => {
            setActivityReminders(!activityReminders);
            showNotification('success', 'Activity Reminders Updated', `Activity reminders ${!activityReminders ? 'enabled' : 'disabled'}.`);
          },
          color: '#f59e0b',
        },
        {
          id: 'friend-activity',
          title: 'Friend Activities',
          description: 'When friends join or create activities',
          icon: 'person.2.fill',
          type: 'toggle',
          value: friendActivity,
          action: () => {
            setFriendActivity(!friendActivity);
            showNotification('success', 'Friend Activity Updated', `Friend activity notifications ${!friendActivity ? 'enabled' : 'disabled'}.`);
          },
          color: '#8b5cf6',
        },
      ] as NotificationSetting[],
    },
    {
      title: 'Social Notifications',
      items: [
        {
          id: 'messages',
          title: 'Messages',
          description: 'Direct messages and group chats',
          icon: 'bubble.fill',
          type: 'toggle',
          value: messages,
          action: () => {
            setMessages(!messages);
            showNotification('success', 'Message Notifications Updated', `Message notifications ${!messages ? 'enabled' : 'disabled'}.`);
          },
          color: AccentColor,
        },
        {
          id: 'promotions',
          title: 'Promotions & Offers',
          description: 'Special deals and promotional content',
          icon: 'tag.fill',
          type: 'toggle',
          value: promotions,
          action: () => {
            setPromotions(!promotions);
            showNotification('success', 'Promotional Notifications Updated', `Promotional notifications ${!promotions ? 'enabled' : 'disabled'}.`);
          },
          color: '#ef4444',
        },
      ] as NotificationSetting[],
    },
    {
      title: 'Notification Settings',
      items: [
        {
          id: 'quiet-hours',
          title: 'Quiet Hours',
          description: `${quietHours ? '22:00 - 08:00' : 'Disabled'}`,
          icon: 'moon.fill',
          type: 'action',
          action: () => {
            setQuietHours(!quietHours);
            showNotification('success', 'Quiet Hours Updated', `Quiet hours ${!quietHours ? 'enabled' : 'disabled'}.`);
          },
          color: '#374151',
        },
        {
          id: 'sound-vibration',
          title: 'Sound & Vibration',
          description: `${notificationSound} sound, vibration ${vibration ? 'on' : 'off'}`,
          icon: 'speaker.wave.3.fill',
          type: 'action',
          action: () => setShowSoundModal(true),
          color: AccentColor,
        },
      ] as NotificationSetting[],
    },
  ];

  const renderNotificationItem = (item: NotificationSetting) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.notificationItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={item.action}
      activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.notificationIcon, { backgroundColor: (item.color || PrimaryColor) + '20' }]}>
          <IconSymbol name={item.icon as any} size={20} color={item.color || PrimaryColor} />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.notificationDescription, { color: colors.icon }]}>{item.description}</Text>
        </View>
        <View style={styles.notificationAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{ false: colors.border, true: (item.color || PrimaryColor) + '50' }}
              thumbColor={item.value ? (item.color || PrimaryColor) : colors.icon}
            />
          ) : (
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              setPushNotifications(true);
              setEmailNotifications(true);
              setActivityReminders(true);
              setFriendActivity(true);
              setMessages(true);
              showNotification('success', 'All Notifications Enabled', 'All notification types have been enabled.');
            }}
          >
            <IconSymbol name="bell.badge.fill" size={24} color={PrimaryColor} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Enable All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              setPushNotifications(true);
              setEmailNotifications(false);
              setActivityReminders(true);
              setFriendActivity(false);
              setPromotions(false);
              showNotification('success', 'Essential Only', 'Only essential notifications are now enabled.');
            }}
          >
            <IconSymbol name="bell.slash.fill" size={24} color="#f59e0b" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Essential Only</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Sections */}
        {notificationSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderNotificationItem)}
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sound & Vibration Modal */}
      <Modal visible={showSoundModal} transparent={true} animationType="slide" onRequestClose={() => setShowSoundModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Sound & Vibration</Text>
              <TouchableOpacity onPress={() => setShowSoundModal(false)} style={styles.modalCloseButton}>
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.soundContent}>
              <Text style={[styles.soundLabel, { color: colors.text }]}>Notification Sound</Text>
              <ScrollView style={styles.soundList} showsVerticalScrollIndicator={false}>
                {sounds.map((sound) => (
                  <TouchableOpacity
                    key={sound}
                    style={[styles.soundItem, {
                      backgroundColor: notificationSound === sound ? PrimaryColor + '20' : 'transparent',
                      borderColor: colors.border,
                    }]}
                    onPress={() => setNotificationSound(sound)}
                  >
                    <Text style={[styles.soundText, {
                      color: notificationSound === sound ? PrimaryColor : colors.text,
                      fontWeight: notificationSound === sound ? '600' : 'normal',
                    }]}>{sound}</Text>
                    {notificationSound === sound && <IconSymbol name="checkmark" size={16} color={PrimaryColor} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.vibrationToggle}>
                <Text style={[styles.vibrationLabel, { color: colors.text }]}>Vibration</Text>
                <Switch
                  value={vibration}
                  onValueChange={setVibration}
                  trackColor={{ false: colors.border, true: PrimaryColor + '50' }}
                  thumbColor={vibration ? PrimaryColor : colors.icon}
                />
              </View>
              
              <Text style={[styles.volumeLabel, { color: colors.text }]}>Volume: {Math.round(soundVolume * 100)}%</Text>
              <View style={styles.volumeSlider}>
                <TouchableOpacity
                  style={[styles.volumeButton, { backgroundColor: soundVolume > 0.3 ? PrimaryColor : colors.border }]}
                  onPress={() => setSoundVolume(0.3)}
                />
                <TouchableOpacity
                  style={[styles.volumeButton, { backgroundColor: soundVolume > 0.7 ? PrimaryColor : colors.border }]}
                  onPress={() => setSoundVolume(0.7)}
                />
                <TouchableOpacity
                  style={[styles.volumeButton, { backgroundColor: soundVolume === 1 ? PrimaryColor : colors.border }]}
                  onPress={() => setSoundVolume(1)}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: PrimaryColor }]}
              onPress={() => {
                setShowSoundModal(false);
                showNotification('success', 'Sound Settings Updated', 'Your sound preferences have been saved.');
              }}
            >
              <Text style={styles.modalSaveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onHide={hideNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  placeholder: { width: 40 },
  content: { flex: 1 },
  quickActions: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
  quickAction: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  quickActionText: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600', paddingHorizontal: 20, marginBottom: 16 },
  sectionContent: { paddingHorizontal: 20, gap: 8 },
  notificationItem: { borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  notificationContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  notificationIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  notificationInfo: { flex: 1 },
  notificationTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  notificationDescription: { fontSize: 14 },
  notificationAction: { marginLeft: 12 },
  bottomPadding: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  modalCloseButton: { padding: 4 },
  soundContent: { marginBottom: 24 },
  soundLabel: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  soundList: { maxHeight: 200, marginBottom: 20 },
  soundItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderRadius: 8, marginBottom: 4 },
  soundText: { fontSize: 16 },
  vibrationToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  vibrationLabel: { fontSize: 18, fontWeight: '600' },
  volumeLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  volumeSlider: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 20 },
  volumeButton: { width: 20, height: 20, borderRadius: 10 },
  modalSaveButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  modalSaveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
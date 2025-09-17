import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { UserProfile, userProfileService } from '@/service/UserProfileService';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function UserProfilePage() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await userProfileService.getUserProfile(userId);
      
      if (userProfile) {
        setProfile(userProfile);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        showNotification('error', 'Profile Not Found', 'The user profile could not be loaded.', []);
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load user profile. Please try again.', []);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleConnectionAction = async (action: 'add' | 'message') => {
    if (!profile) return;

    try {
      if (action === 'add') {
        await userProfileService.sendFriendRequest(profile.id);
        setProfile(prev => prev ? { ...prev, connectionStatus: 'pending' } : null);
        showNotification('success', 'Friend Request Sent', `Friend request sent to ${profile.name}!`, []);
      } else {
        showNotification('info', 'Message', `Opening chat with ${profile.name}...`, []);
      }
    } catch (error) {
      showNotification('error', 'Action Failed', 'Failed to perform action. Please try again.', []);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Profile not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[{ backgroundColor: PrimaryColor, padding: 12, borderRadius: 8, marginTop: 16 }]}>
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              {profile.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
            <Text style={[styles.profileLocation, { color: colors.icon }]}>
              {profile.location} {profile.distance && `• ${profile.distance} away`}
            </Text>
            <Text style={[styles.profileBio, { color: colors.text }]}>{profile.bio}</Text>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: PrimaryColor }]}
                onPress={() => handleConnectionAction('add')}
              >
                <IconSymbol name="person.fill.badge.plus" size={18} color="white" />
                <Text style={styles.actionButtonText}>Add Friend</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                onPress={() => handleConnectionAction('message')}
              >
                <IconSymbol name="message.fill" size={18} color={PrimaryColor} />
                <Text style={[styles.secondaryButtonText, { color: PrimaryColor }]}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sports */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sports & Interests</Text>
            <View style={styles.sportsContainer}>
              {profile.sports.map((sport, index) => (
                <View key={index} style={[styles.sportTag, { backgroundColor: `${PrimaryColor}15`, borderColor: `${PrimaryColor}30` }]}>
                  <Text style={[styles.sportTagText, { color: PrimaryColor }]}>{sport}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.levelBadge, { backgroundColor: `${AccentColor}20` }]}>
              <IconSymbol name="star.fill" size={16} color={AccentColor} />
              <Text style={[styles.levelText, { color: AccentColor }]}>{profile.level} Level</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="calendar" size={24} color={PrimaryColor} />
                <Text style={[styles.statValue, { color: colors.text }]}>{profile.stats.activitiesJoined}</Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Activities</Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="figure.soccer" size={24} color={AccentColor} />
                <Text style={[styles.statValue, { color: colors.text }]}>{profile.stats.sportsPlayed}</Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Sports</Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="people.fill" size={24} color="#10b981" />
                <Text style={[styles.statValue, { color: colors.text }]}>{profile.stats.friendsCount}</Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Friends</Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="clock.fill" size={24} color="#f59e0b" />
                <Text style={[styles.statValue, { color: colors.text }]}>{profile.stats.hoursActive}h</Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Active</Text>
              </View>
            </View>
          </View>

          {/* Recent Activities */}
          {profile.recentActivities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
              {profile.recentActivities.slice(0, 3).map((activity) => (
                <View key={activity.id} style={[styles.activityItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.activityIcon, { backgroundColor: `${PrimaryColor}20` }]}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={PrimaryColor} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                    <Text style={[styles.activityMeta, { color: colors.icon }]}>
                      {activity.sport} • {activity.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

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
  headerTitle: { fontSize: 20, fontWeight: '600' },
  profileHeader: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    borderWidth: 4,
    borderColor: 'white',
  },
  profileName: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  profileLocation: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  profileBio: { fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 24 },
  actionButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1 },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  sportsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  sportTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  sportTagText: { fontSize: 14, fontWeight: '500' },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  levelText: { fontSize: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statItem: {
    flex: 1,
    minWidth: (width - 64) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 12, textAlign: 'center' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  activityMeta: { fontSize: 14 },
});
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Community, CommunityMember, communityService } from '@/service/CommunityService';
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

export default function CommunityDetailsPage() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];
  const params = useLocalSearchParams();
  const communityId = params.communityId as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'members' | 'events'>('about');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    loadCommunityDetails();
  }, [communityId]);

  const loadCommunityDetails = async () => {
    try {
      setIsLoading(true);
      const communityData = await communityService.getCommunityById(communityId);
      
      if (communityData) {
        setCommunity(communityData);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        showNotification('error', 'Community Not Found', 'The community could not be loaded.', []);
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load community details. Please try again.', []);
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

  const handleJoinCommunity = async () => {
    if (!community) return;

    try {
      if (community.isJoined) {
        // Leave community
        await communityService.leaveCommunity(community.id);
        setCommunity(prev => prev ? { ...prev, isJoined: false, members: prev.members - 1 } : null);
        showNotification('success', 'Left Community', `You have left ${community.name}.`, []);
      } else {
        // Join community
        await communityService.joinCommunity(community.id);
        
        if (community.privacy === 'invite-only') {
          showNotification('info', 'Request Sent', `Your request to join ${community.name} has been sent to the admins.`, []);
        } else {
          setCommunity(prev => prev ? { ...prev, isJoined: true, members: prev.members + 1 } : null);
          showNotification(
            'success', 
            'Joined Community!', 
            `Welcome to ${community.name}! You can now participate in events and discussions.`,
            [
              { text: 'Explore', onPress: () => {}, style: 'primary' },
              { text: 'Done', onPress: () => {}, style: 'default' }
            ]
          );
        }
      }
    } catch (error) {
      showNotification('error', 'Action Failed', 'Unable to complete action. Please try again.', []);
    }
  };

  const getJoinButtonText = (): string => {
    if (!community) return 'Join';
    
    if (community.isJoined) {
      return 'Leave';
    } else if (community.privacy === 'invite-only') {
      return 'Request to Join';
    } else {
      return 'Join Community';
    }
  };

  const getJoinButtonColor = (): string => {
    if (!community) return PrimaryColor;
    
    if (community.isJoined) {
      return '#ef4444';
    } else {
      return PrimaryColor;
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return AccentColor;
    }
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text style={[styles.description, { color: colors.text }]}>{community?.description}</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
        <View style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.detailItem}>
            <IconSymbol name="person.3.fill" size={18} color={PrimaryColor} />
            <Text style={[styles.detailText, { color: colors.text }]}>{community?.members} members</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="location.fill" size={18} color={PrimaryColor} />
            <Text style={[styles.detailText, { color: colors.text }]}>{community?.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="calendar" size={18} color={PrimaryColor} />
            <Text style={[styles.detailText, { color: colors.text }]}>Created {community?.createdDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="star.fill" size={18} color={getLevelColor(community?.level || '')} />
            <Text style={[styles.detailText, { color: colors.text }]}>{community?.level} level</Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      {community?.tags && community.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          <View style={styles.tagsContainer}>
            {community.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: `${AccentColor}15`, borderColor: `${AccentColor}30` }]}>
                <Text style={[styles.tagText, { color: AccentColor }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Rules */}
      {community?.rules && community.rules.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Community Rules</Text>
          <View style={[styles.rulesContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {community.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={[styles.ruleNumber, { color: PrimaryColor }]}>{index + 1}.</Text>
                <Text style={[styles.ruleText, { color: colors.text }]}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Events */}
      {community?.upcomingEvents && community.upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Events</Text>
          {community.upcomingEvents.map((event) => (
            <View key={event.id} style={[styles.eventItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.eventIcon, { backgroundColor: `${PrimaryColor}20` }]}>
                <IconSymbol name="calendar.badge.plus" size={20} color={PrimaryColor} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                <Text style={[styles.eventMeta, { color: colors.icon }]}>
                  {event.date} at {event.time} • {event.location}
                </Text>
                <Text style={[styles.eventParticipants, { color: colors.icon }]}>
                  {event.currentParticipants.length} participants
                  {event.maxParticipants && ` / ${event.maxParticipants} max`}
                </Text>
              </View>
              <TouchableOpacity style={[styles.joinEventButton, { backgroundColor: AccentColor }]}>
                <Text style={styles.joinEventText}>Join</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderMembersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Members ({community?.members})</Text>
        {community?.membersList.map((member: CommunityMember) => (
          <TouchableOpacity
            key={member.id}
            style={[styles.memberItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(`/user-profile?userId=${member.userId}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: member.userAvatar }} style={styles.memberAvatar} />
            <View style={styles.memberInfo}>
              <View style={styles.memberHeader}>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.userName}</Text>
                {member.role !== 'member' && (
                  <View style={[styles.rolesBadge, { backgroundColor: `${PrimaryColor}20` }]}>
                    <Text style={[styles.roleText, { color: PrimaryColor }]}>{member.role}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.memberJoinDate, { color: colors.icon }]}>
                Joined {member.joinedDate}
              </Text>
              <View style={styles.memberStats}>
                <View style={styles.memberStat}>
                  <IconSymbol name="star.fill" size={12} color="#f59e0b" />
                  <Text style={[styles.memberStatText, { color: colors.icon }]}>
                    {member.contributions} contributions
                  </Text>
                </View>
                {member.isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEventsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Events</Text>
        {community?.upcomingEvents && community.upcomingEvents.length > 0 ? (
          community.upcomingEvents.map((event) => (
            <View key={event.id} style={[styles.eventDetailItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.eventDetailHeader}>
                <Text style={[styles.eventDetailTitle, { color: colors.text }]}>{event.title}</Text>
                <TouchableOpacity style={[styles.eventJoinButton, { backgroundColor: PrimaryColor }]}>
                  <Text style={styles.eventJoinButtonText}>Join Event</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.eventDetailDescription, { color: colors.text }]}>{event.description}</Text>
              <View style={styles.eventDetailMeta}>
                <View style={styles.eventDetailMetaItem}>
                  <IconSymbol name="calendar" size={16} color={colors.icon} />
                  <Text style={[styles.eventDetailMetaText, { color: colors.icon }]}>{event.date} at {event.time}</Text>
                </View>
                <View style={styles.eventDetailMetaItem}>
                  <IconSymbol name="location.fill" size={16} color={colors.icon} />
                  <Text style={[styles.eventDetailMetaText, { color: colors.icon }]}>{event.location}</Text>
                </View>
                <View style={styles.eventDetailMetaItem}>
                  <IconSymbol name="person.3.fill" size={16} color={colors.icon} />
                  <Text style={[styles.eventDetailMetaText, { color: colors.icon }]}>
                    {event.currentParticipants.length}
                    {event.maxParticipants && `/${event.maxParticipants}`} participants
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="calendar.badge.exclamationmark" size={48} color={colors.icon} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No upcoming events</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.icon }]}>Check back later for new events!</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Loading community...</Text>
      </View>
    );
  }

  if (!community) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Community not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[{ backgroundColor: PrimaryColor, padding: 12, borderRadius: 8, marginTop: 16 }]}>
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
        <TouchableOpacity>
          <IconSymbol name="ellipsis" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Community Header */}
          <View style={styles.communityHeader}>
            {community.bannerImage && (
              <Image source={{ uri: community.bannerImage }} style={styles.bannerImage} />
            )}
            <View style={styles.communityInfo}>
              <View style={styles.communityImageContainer}>
                <Image source={{ uri: community.image }} style={styles.communityImage} />
                <View style={[styles.privacyBadge, { backgroundColor: community.privacy === 'public' ? '#10b981' : '#f59e0b' }]}>
                  <IconSymbol 
                    name={community.privacy === 'public' ? 'globe' : 'lock.fill'} 
                    size={12} 
                    color="white" 
                  />
                </View>
              </View>
              
              <View style={styles.communityDetails}>
                <Text style={[styles.communityName, { color: colors.text }]}>{community.name}</Text>
                <View style={styles.communityMeta}>
                  <View style={[styles.sportBadge, { backgroundColor: `${PrimaryColor}20` }]}>
                    <Text style={[styles.sportBadgeText, { color: PrimaryColor }]}>{community.sport}</Text>
                  </View>
                  <Text style={[styles.memberCount, { color: colors.icon }]}>{community.members} members</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.joinButton, { backgroundColor: getJoinButtonColor() }]}
              onPress={handleJoinCommunity}
              activeOpacity={0.8}
            >
              <IconSymbol 
                name={community.isJoined ? 'minus.circle.fill' : 'plus.circle.fill'} 
                size={18} 
                color="white" 
              />
              <Text style={styles.joinButtonText}>{getJoinButtonText()}</Text>
            </TouchableOpacity>
            
            {community.isJoined && (
              <TouchableOpacity
                style={[styles.messageButton, { borderColor: colors.border }]}
                onPress={() => showNotification('info', 'Community Chat', 'Opening community chat...', [])}
                activeOpacity={0.8}
              >
                <IconSymbol name="message.fill" size={18} color={PrimaryColor} />
                <Text style={[styles.messageButtonText, { color: PrimaryColor }]}>Chat</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tab Navigation */}
          <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {(['about', 'members', 'events'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor: activeTab === tab ? PrimaryColor : 'transparent',
                  }
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText,
                  {
                    color: activeTab === tab ? 'white' : colors.text,
                    fontWeight: activeTab === tab ? '600' : 'normal'
                  }
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'members' && renderMembersTab()}
          {activeTab === 'events' && renderEventsTab()}
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
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  communityHeader: { paddingHorizontal: 20, marginBottom: 20 },
  bannerImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 16 },
  communityInfo: { flexDirection: 'row', alignItems: 'flex-start' },
  communityImageContainer: { position: 'relative', marginRight: 16 },
  communityImage: { width: 80, height: 80, borderRadius: 16 },
  privacyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityDetails: { flex: 1 },
  communityName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  communityMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sportBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  sportBadgeText: { fontSize: 12, fontWeight: '600' },
  memberCount: { fontSize: 14 },
  actionContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  messageButtonText: { fontSize: 16, fontWeight: '600' },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabText: { fontSize: 14 },
  tabContent: { paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24 },
  detailsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailText: { fontSize: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '500' },
  rulesContainer: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ruleNumber: { fontSize: 16, fontWeight: 'bold', minWidth: 20 },
  ruleText: { fontSize: 16, lineHeight: 22, flex: 1 },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  eventMeta: { fontSize: 14, marginBottom: 2 },
  eventParticipants: { fontSize: 12 },
  joinEventButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  joinEventText: { color: 'white', fontSize: 12, fontWeight: '600' },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  memberInfo: { flex: 1 },
  memberHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  memberName: { fontSize: 16, fontWeight: '600', flex: 1 },
  rolesBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  roleText: { fontSize: 10, fontWeight: '600' },
  memberJoinDate: { fontSize: 12, marginBottom: 6 },
  memberStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memberStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberStatText: { fontSize: 12 },
  activeIndicator: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  activeText: { color: 'white', fontSize: 10, fontWeight: '600' },
  eventDetailItem: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  eventDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  eventDetailTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 12 },
  eventJoinButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  eventJoinButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  eventDetailDescription: { fontSize: 16, lineHeight: 22, marginBottom: 12 },
  eventDetailMeta: { gap: 8 },
  eventDetailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eventDetailMetaText: { fontSize: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, textAlign: 'center' },
});
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { communityService } from '@/service/CommunityService';
import { venueService } from '@/service/VenueService';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Venue {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  sports: string[];
  price: string;
  availability: 'available' | 'busy' | 'closed';
}

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  sport: string;
  image: string;
  isJoined: boolean;
}

interface NearbyUser {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  sports: string[];
  isOnline: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function ExplorePage() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'venues' | 'communities' | 'people'>('venues');
  const [fabVisible, setFabVisible] = useState(true);
  
  // Data states
  const [venues, setVenues] = useState<Venue[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
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

  useEffect(() => {
    loadData();
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [venuesData, communitiesData] = await Promise.all([
        venueService.getVenues(),
        communityService.getCommunities()
      ]);
      
      setVenues(venuesData);
      setCommunities(communitiesData);
      
      // Mock nearby users data since it's not in FriendService yet
      setNearbyUsers([
        {
          id: '1',
          name: 'Alex Johnson',
          avatar: 'https://picsum.photos/60/60?random=7',
          distance: '0.3 km',
          sports: ['Basketball', 'Tennis'],
          isOnline: true,
          level: 'Intermediate'
        },
        {
          id: '2',
          name: 'Sarah Chen',
          avatar: 'https://picsum.photos/60/60?random=8',
          distance: '0.7 km',
          sports: ['Running', 'Yoga'],
          isOnline: true,
          level: 'Advanced'
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          avatar: 'https://picsum.photos/60/60?random=9',
          distance: '1.1 km',
          sports: ['Football', 'Soccer'],
          isOnline: false,
          level: 'Beginner'
        }
      ]);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.sports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = nearbyUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.sports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderVenue = ({ item, index }: { item: Venue; index: number }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30 + (index * 10)],
              extrapolate: 'clamp',
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.venueCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/venue-details?venueId=${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.venueImage} />
        <View style={styles.venueInfo}>
          <View style={styles.venueHeader}>
            <Text style={[styles.venueName, { color: colors.text }]}>{item.name}</Text>
            <View style={[styles.availabilityBadge, {
              backgroundColor: item.availability === 'available' ? '#10b981' :
                             item.availability === 'busy' ? '#f59e0b' : '#ef4444'
            }]}>
              <Text style={styles.availabilityText}>
                {item.availability === 'available' ? 'Available' :
                 item.availability === 'busy' ? 'Busy' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text style={[styles.venueAddress, { color: colors.icon }]}>{item.address}</Text>
          <View style={styles.venueDetails}>
            <View style={styles.venueDetailItem}>
              <IconSymbol name="location.fill" size={14} color={colors.icon} />
              <Text style={[styles.venueDetailText, { color: colors.icon }]}>{item.distance}</Text>
            </View>
            <View style={styles.venueDetailItem}>
              <IconSymbol name="star.fill" size={14} color="#f59e0b" />
              <Text style={[styles.venueDetailText, { color: colors.icon }]}>{item.rating}</Text>
            </View>
            <View style={styles.venueDetailItem}>
              <IconSymbol name="dollarsign.circle.fill" size={14} color={PrimaryColor} />
              <Text style={[styles.venueDetailText, { color: colors.icon }]}>{item.price}</Text>
            </View>
          </View>
          <View style={styles.sportsContainer}>
            {item.sports.map((sport, sportIndex) => (
              <View key={sportIndex} style={[styles.sportTag, { backgroundColor: `${PrimaryColor}15`, borderColor: `${PrimaryColor}30` }]}>
                <Text style={[styles.sportTagText, { color: PrimaryColor }]}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCommunity = ({ item, index }: { item: Community; index: number }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30 + (index * 10)],
              extrapolate: 'clamp',
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.communityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/community-details?communityId=${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.communityImage} />
        <View style={styles.communityInfo}>
          <Text style={[styles.communityName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.communityDescription, { color: colors.icon }]}>{item.description}</Text>
          <View style={styles.communityMeta}>
            <Text style={[styles.communityMembers, { color: colors.text }]}>{item.members} members</Text>
            <View style={[styles.sportTag, { backgroundColor: `${AccentColor}15`, borderColor: `${AccentColor}30` }]}>
              <Text style={[styles.sportTagText, { color: AccentColor }]}>{item.sport}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.joinButton, {
            backgroundColor: item.isJoined ? colors.surface : PrimaryColor,
            borderColor: item.isJoined ? colors.border : PrimaryColor
          }]}
          onPress={async () => {
            try {
              if (item.isJoined) {
                await communityService.leaveCommunity(item.id);
                // Update local state
                setCommunities(prev => 
                  prev.map(c => c.id === item.id ? { ...c, isJoined: false } : c)
                );
                showNotification('info', 'Left Community', `You left ${item.name}`);
              } else {
                await communityService.joinCommunity(item.id);
                // Update local state
                setCommunities(prev => 
                  prev.map(c => c.id === item.id ? { ...c, isJoined: true } : c)
                );
                showNotification('success', 'Joined Community', `You joined ${item.name}`);
              }
            } catch (error) {
              showNotification('error', 'Error', 'Failed to update community membership.');
            }
          }}
        >
          <Text style={[styles.joinButtonText, {
            color: item.isJoined ? colors.text : 'white'
          }]}>
            {item.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderUser = ({ item, index }: { item: NearbyUser; index: number }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30 + (index * 10)],
              extrapolate: 'clamp',
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/user-profile?userId=${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.userImageContainer}>
          <Image source={{ uri: item.avatar }} style={styles.userImage} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.userDistance, { color: colors.icon }]}>{item.distance} away</Text>
          <View style={styles.userSports}>
            {item.sports.slice(0, 2).map((sport, sportIndex) => (
              <View key={sportIndex} style={[styles.sportTag, { backgroundColor: `${AccentColor}15`, borderColor: `${AccentColor}30` }]}>
                <Text style={[styles.sportTagText, { color: AccentColor }]}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.userLevel}>
          <Text style={[styles.userLevelText, {
            color: item.level === 'Beginner' ? '#10b981' :
                   item.level === 'Intermediate' ? '#f59e0b' : '#ef4444'
          }]}>
            {item.level}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'find-venue':
        showNotification('info', 'Find Venue', 'Opening venue finder...');
        break;
      case 'join-community':
        showNotification('info', 'Join Community', 'Opening community browser...');
        break;
      case 'find-buddy':
        showNotification('info', 'Find Buddy', 'Searching for nearby users...');
        break;
      case 'create-group':
        router.push('/create');
        break;
    }
  };

  const fabActions = [
    { icon: 'location.magnifyingglass', onPress: () => handleQuickAction('find-venue'), color: PrimaryColor },
    { icon: 'person.2.fill', onPress: () => handleQuickAction('join-community'), color: '#10b981' },
    { icon: 'person.crop.circle.badge.plus', onPress: () => handleQuickAction('find-buddy'), color: '#f59e0b' },
    { icon: 'plus.circle.fill', onPress: () => handleQuickAction('create-group'), color: AccentColor },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explore Sports</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>Discover venues, communities, and people</Text>
        
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search venues, sports, or communities..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(['venues', 'communities', 'people'] as const).map((tab) => (
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
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'venues' && (
          <FlatList
            data={filteredVenues}
            renderItem={renderVenue}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            onScroll={(event) => {
              const currentOffset = event.nativeEvent.contentOffset.y;
              setFabVisible(currentOffset < 100);
            }}
            scrollEventThrottle={16}
          />
        )}

        {activeTab === 'communities' && (
          <FlatList
            data={filteredCommunities}
            renderItem={renderCommunity}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            onScroll={(event) => {
              const currentOffset = event.nativeEvent.contentOffset.y;
              setFabVisible(currentOffset < 100);
            }}
            scrollEventThrottle={16}
          />
        )}

        {activeTab === 'people' && (
          <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            onScroll={(event) => {
              const currentOffset = event.nativeEvent.contentOffset.y;
              setFabVisible(currentOffset < 100);
            }}
            scrollEventThrottle={16}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton
        visible={fabVisible}
        expandable
        actions={fabActions}
        icon="sparkles"
        onPress={() => showNotification('info', 'Quick Actions', 'Choose an action from the menu')}
      />

      {/* Notification */}
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  venueCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  venueImage: {
    width: '100%',
    height: 200,
  },
  venueInfo: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  venueAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  venueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  venueDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueDetailText: {
    fontSize: 12,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  sportTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  communityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  communityImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  communityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityMembers: {
    fontSize: 12,
    fontWeight: '500',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userDistance: {
    fontSize: 12,
    marginBottom: 8,
  },
  userSports: {
    flexDirection: 'row',
    gap: 6,
  },
  userLevel: {
    alignItems: 'center',
  },
  userLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  sports: string[];
  mutualFriends: number;
  status: 'friend' | 'pending' | 'suggestion';
  lastActive: string;
}

export default function FriendsConnectionsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'friends' | 'suggestions'>('friends');

  const friends: Friend[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b029?w=100&h=100&fit=crop&crop=face',
      bio: 'Tennis enthusiast and runner',
      sports: ['Tennis', 'Running', 'Yoga'],
      mutualFriends: 3,
      status: 'friend',
      lastActive: '2 hours ago',
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Basketball player and cyclist',
      sports: ['Basketball', 'Cycling', 'Swimming'],
      mutualFriends: 5,
      status: 'friend',
      lastActive: '1 day ago',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Soccer lover and fitness coach',
      sports: ['Soccer', 'Weightlifting', 'Boxing'],
      mutualFriends: 2,
      status: 'friend',
      lastActive: '3 hours ago',
    },
    {
      id: '4',
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      bio: 'Volleyball and swimming enthusiast',
      sports: ['Volleyball', 'Swimming', 'Tennis'],
      mutualFriends: 1,
      status: 'friend',
      lastActive: '5 hours ago',
    },
  ];

  const suggestions: Friend[] = [
    {
      id: '5',
      name: 'Jessica Wong',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      bio: 'Marathon runner and yoga instructor',
      sports: ['Running', 'Yoga', 'Cycling'],
      mutualFriends: 8,
      status: 'suggestion',
      lastActive: 'Active now',
    },
    {
      id: '6',
      name: 'Ryan Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Soccer player and basketball fan',
      sports: ['Soccer', 'Basketball', 'Running'],
      mutualFriends: 4,
      status: 'suggestion',
      lastActive: '1 hour ago',
    },
    {
      id: '7',
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
      bio: 'Tennis pro and fitness enthusiast',
      sports: ['Tennis', 'Weightlifting', 'Swimming'],
      mutualFriends: 6,
      status: 'suggestion',
      lastActive: '30 minutes ago',
    },
  ];

  const pendingRequests: Friend[] = [
    {
      id: '8',
      name: 'Tom Wilson',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      bio: 'Cycling enthusiast and runner',
      sports: ['Cycling', 'Running', 'Hiking'],
      mutualFriends: 2,
      status: 'pending',
      lastActive: '2 days ago',
    },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (friendId: string) => {
    Alert.alert(
      'Friend Request Sent',
      'Your friend request has been sent successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleAcceptRequest = (friendId: string) => {
    Alert.alert(
      'Friend Request Accepted',
      'You are now connected!',
      [{ text: 'OK' }]
    );
  };

  const handleDeclineRequest = (friendId: string) => {
    Alert.alert(
      'Request Declined',
      'Friend request has been declined.',
      [{ text: 'OK' }]
    );
  };

  const handleMessageFriend = (friendId: string) => {
    Alert.alert(
      'Message',
      'Opening chat with friend...',
      [{ text: 'OK' }]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const renderFriendCard = (friend: Friend) => (
    <View
      key={friend.id}
      style={[
        styles.friendCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }
      ]}
    >
      <View style={styles.friendHeader}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <View style={styles.friendInfo}>
          <Text style={[styles.friendName, { color: colors.text }]}>
            {friend.name}
          </Text>
          <Text style={[styles.friendBio, { color: colors.icon }]}>
            {friend.bio}
          </Text>
          <View style={styles.sportsContainer}>
            {friend.sports.slice(0, 3).map((sport, index) => (
              <View
                key={index}
                style={[styles.sportTag, { backgroundColor: PrimaryColor + '20' }]}
              >
                <Text style={[styles.sportTagText, { color: PrimaryColor }]}>
                  {sport}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.friendFooter}>
        <View style={styles.friendStats}>
          <Text style={[styles.mutualFriends, { color: colors.icon }]}>
            {friend.mutualFriends} mutual friends • {friend.lastActive}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {friend.status === 'friend' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: PrimaryColor }]}
              onPress={() => handleMessageFriend(friend.id)}
              activeOpacity={0.8}
            >
              <IconSymbol name="message.fill" size={16} color="white" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
          )}
          
          {friend.status === 'suggestion' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: PrimaryColor }]}
              onPress={() => handleAddFriend(friend.id)}
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={16} color="white" />
              <Text style={styles.actionButtonText}>Add Friend</Text>
            </TouchableOpacity>
          )}
          
          {friend.status === 'pending' && (
            <View style={styles.pendingActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptRequest(friend.id)}
                activeOpacity={0.8}
              >
                <IconSymbol name="checkmark" size={16} color="white" />
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleDeclineRequest(friend.id)}
                activeOpacity={0.8}
              >
                <IconSymbol name="xmark" size={16} color="white" />
                <Text style={styles.actionButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
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
          Friends & Connections
        </Text>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search friends..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pending Requests ({pendingRequests.length})
            </Text>
            {pendingRequests.map(renderFriendCard)}
          </View>
        )}

        {/* Tab Selector */}
        <View style={styles.tabSection}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: selectedTab === 'friends' ? PrimaryColor : colors.surface,
                borderColor: selectedTab === 'friends' ? PrimaryColor : colors.border,
              }
            ]}
            onPress={() => setSelectedTab('friends')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'friends' ? 'white' : colors.text }
            ]}>
              My Friends ({filteredFriends.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: selectedTab === 'suggestions' ? PrimaryColor : colors.surface,
                borderColor: selectedTab === 'suggestions' ? PrimaryColor : colors.border,
              }
            ]}
            onPress={() => setSelectedTab('suggestions')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'suggestions' ? 'white' : colors.text }
            ]}>
              Suggestions ({filteredSuggestions.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Friends/Suggestions List */}
        <View style={styles.section}>
          {selectedTab === 'friends' ? (
            filteredFriends.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="person.3.fill" size={64} color={colors.icon} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {searchQuery ? 'No friends found' : 'No friends yet'}
                </Text>
                <Text style={[styles.emptyMessage, { color: colors.icon }]}>
                  {searchQuery 
                    ? 'Try adjusting your search terms.'
                    : 'Start connecting with other sports enthusiasts!'
                  }
                </Text>
              </View>
            ) : (
              filteredFriends.map(renderFriendCard)
            )
          ) : (
            filteredSuggestions.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="person.badge.plus" size={64} color={colors.icon} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No suggestions found
                </Text>
                <Text style={[styles.emptyMessage, { color: colors.icon }]}>
                  We'll recommend new friends based on your activities.
                </Text>
              </View>
            ) : (
              filteredSuggestions.map(renderFriendCard)
            )
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  tabSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  friendCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  friendBio: {
    fontSize: 14,
    marginBottom: 8,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sportTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  friendFooter: {
    gap: 12,
  },
  friendStats: {
    marginBottom: 8,
  },
  mutualFriends: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  declineButton: {
    backgroundColor: '#ef4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});
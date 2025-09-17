import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  sports: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  location: string;
  distance?: string;
  isOnline: boolean;
  joinedDate: string;
  lastActive: string;
  stats: {
    activitiesJoined: number;
    sportsPlayed: number;
    friendsCount: number;
    hoursActive: number;
    rating: number;
    reviewsCount: number;
  };
  achievements: Achievement[];
  recentActivities: RecentActivity[];
  mutualFriends: MutualFriend[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  preferences: {
    availableDays: string[];
    preferredTimes: string[];
    skillLevel: string[];
    lookingFor: 'casual' | 'competitive' | 'both';
  };
  connectionStatus: 'none' | 'pending' | 'friends' | 'blocked';
  privacy: {
    showStats: boolean;
    showActivities: boolean;
    showMutualFriends: boolean;
    allowMessages: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate: string;
  category: 'activity' | 'social' | 'skill' | 'milestone';
}

export interface RecentActivity {
  id: string;
  type: 'joined' | 'created' | 'completed';
  sport: string;
  title: string;
  date: string;
  location: string;
  participants?: number;
}

export interface MutualFriend {
  id: string;
  name: string;
  avatar: string;
}

class UserProfileService {
  private static instance: UserProfileService;
  private readonly STORAGE_KEY = '@FitBuddy:UserProfiles';
  private profiles: Map<string, UserProfile> = new Map();

  private constructor() {
    this.loadProfiles();
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  // Load profiles from storage
  private async loadProfiles(): Promise<void> {
    try {
      const savedProfiles = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (savedProfiles) {
        const profilesData = JSON.parse(savedProfiles);
        this.profiles = new Map(Object.entries(profilesData));
      } else {
        // Initialize with mock data
        this.initializeMockData();
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      this.initializeMockData();
    }
  }

  // Save profiles to storage
  private async saveProfiles(): Promise<void> {
    try {
      const profilesData = Object.fromEntries(this.profiles);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(profilesData));
    } catch (error) {
      console.error('Error saving profiles:', error);
      throw error;
    }
  }

  // Initialize with mock data
  private initializeMockData(): void {
    const mockProfiles: UserProfile[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://picsum.photos/200/200?random=7',
        bio: 'Passionate athlete who loves connecting with fellow sports enthusiasts. Always up for a challenge!',
        sports: ['Basketball', 'Tennis', 'Swimming'],
        level: 'Intermediate',
        location: 'San Francisco, CA',
        distance: '0.3 km',
        isOnline: true,
        joinedDate: '2023-06-15',
        lastActive: '2 hours ago',
        stats: {
          activitiesJoined: 47,
          sportsPlayed: 6,
          friendsCount: 23,
          hoursActive: 127,
          rating: 4.8,
          reviewsCount: 15
        },
        achievements: [
          {
            id: 'early_bird',
            title: 'Early Bird',
            description: 'Joined 10 morning activities',
            icon: 'sunrise.fill',
            unlockedDate: '2024-01-10',
            category: 'activity'
          },
          {
            id: 'social_butterfly',
            title: 'Social Butterfly',
            description: 'Made 20+ friends',
            icon: 'person.2.fill',
            unlockedDate: '2024-01-05',
            category: 'social'
          }
        ],
        recentActivities: [
          {
            id: 'act1',
            type: 'completed',
            sport: 'Basketball',
            title: 'Pickup Basketball Game',
            date: '2024-01-15',
            location: 'Central Park',
            participants: 8
          },
          {
            id: 'act2',
            type: 'joined',
            sport: 'Tennis',
            title: 'Weekend Tennis Match',
            date: '2024-01-12',
            location: 'Sports Club'
          }
        ],
        mutualFriends: [
          {
            id: 'friend1',
            name: 'Sarah Chen',
            avatar: 'https://picsum.photos/60/60?random=8'
          },
          {
            id: 'friend2',
            name: 'Mike Rodriguez',
            avatar: 'https://picsum.photos/60/60?random=9'
          }
        ],
        socialLinks: {
          instagram: '@alexj_sports',
          twitter: '@alexjohnson'
        },
        preferences: {
          availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          preferredTimes: ['Morning', 'Evening'],
          skillLevel: ['Beginner', 'Intermediate'],
          lookingFor: 'both'
        },
        connectionStatus: 'none',
        privacy: {
          showStats: true,
          showActivities: true,
          showMutualFriends: true,
          allowMessages: true
        }
      },
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: 'https://picsum.photos/200/200?random=8',
        bio: 'Yoga instructor and running enthusiast. Love helping others discover the joy of movement!',
        sports: ['Running', 'Yoga', 'Cycling'],
        level: 'Advanced',
        location: 'San Francisco, CA',
        distance: '0.7 km',
        isOnline: true,
        joinedDate: '2023-04-20',
        lastActive: '30 minutes ago',
        stats: {
          activitiesJoined: 73,
          sportsPlayed: 8,
          friendsCount: 41,
          hoursActive: 203,
          rating: 4.9,
          reviewsCount: 28
        },
        achievements: [
          {
            id: 'marathon_runner',
            title: 'Marathon Runner',
            description: 'Completed 5 running events',
            icon: 'figure.running',
            unlockedDate: '2023-12-01',
            category: 'milestone'
          },
          {
            id: 'mentor',
            title: 'Mentor',
            description: 'Helped 50+ beginners',
            icon: 'person.fill.badge.plus',
            unlockedDate: '2024-01-08',
            category: 'social'
          }
        ],
        recentActivities: [
          {
            id: 'act3',
            type: 'created',
            sport: 'Yoga',
            title: 'Morning Yoga Session',
            date: '2024-01-16',
            location: 'Golden Gate Park'
          }
        ],
        mutualFriends: [
          {
            id: 'friend3',
            name: 'Alex Johnson',
            avatar: 'https://picsum.photos/60/60?random=7'
          }
        ],
        preferences: {
          availableDays: ['Tuesday', 'Thursday', 'Sunday'],
          preferredTimes: ['Morning'],
          skillLevel: ['Intermediate', 'Advanced'],
          lookingFor: 'casual'
        },
        connectionStatus: 'friends',
        privacy: {
          showStats: true,
          showActivities: true,
          showMutualFriends: true,
          allowMessages: true
        }
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        avatar: 'https://picsum.photos/200/200?random=9',
        bio: 'Football player and team captain. Looking for competitive matches and new teammates.',
        sports: ['Football', 'Soccer', 'Basketball'],
        level: 'Beginner',
        location: 'San Francisco, CA',
        distance: '1.1 km',
        isOnline: false,
        joinedDate: '2023-09-10',
        lastActive: '1 day ago',
        stats: {
          activitiesJoined: 28,
          sportsPlayed: 4,
          friendsCount: 17,
          hoursActive: 85,
          rating: 4.6,
          reviewsCount: 9
        },
        achievements: [
          {
            id: 'team_player',
            title: 'Team Player',
            description: 'Joined 15 team activities',
            icon: 'person.3.fill',
            unlockedDate: '2023-12-20',
            category: 'activity'
          }
        ],
        recentActivities: [
          {
            id: 'act4',
            type: 'joined',
            sport: 'Soccer',
            title: 'Weekend Soccer League',
            date: '2024-01-13',
            location: 'City Stadium',
            participants: 22
          }
        ],
        mutualFriends: [],
        preferences: {
          availableDays: ['Saturday', 'Sunday'],
          preferredTimes: ['Afternoon', 'Evening'],
          skillLevel: ['Beginner'],
          lookingFor: 'competitive'
        },
        connectionStatus: 'none',
        privacy: {
          showStats: true,
          showActivities: false,
          showMutualFriends: false,
          allowMessages: true
        }
      }
    ];

    mockProfiles.forEach(profile => {
      this.profiles.set(profile.id, profile);
    });
  }

  // Get user profile by ID
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      await this.loadProfiles(); // Ensure profiles are loaded
      return this.profiles.get(userId) || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Search profiles by name or sport
  public async searchProfiles(query: string): Promise<UserProfile[]> {
    try {
      await this.loadProfiles();
      const profiles = Array.from(this.profiles.values());
      
      return profiles.filter(profile =>
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.sports.some(sport => sport.toLowerCase().includes(query.toLowerCase())) ||
        profile.bio.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  }

  // Get nearby users (mock implementation)
  public async getNearbyUsers(limit: number = 10): Promise<UserProfile[]> {
    try {
      await this.loadProfiles();
      const profiles = Array.from(this.profiles.values());
      
      // Sort by distance (mock sorting)
      return profiles
        .filter(profile => profile.distance)
        .sort((a, b) => {
          const distanceA = parseFloat(a.distance?.split(' ')[0] || '0');
          const distanceB = parseFloat(b.distance?.split(' ')[0] || '0');
          return distanceA - distanceB;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return [];
    }
  }

  // Update connection status
  public async updateConnectionStatus(
    userId: string, 
    newStatus: UserProfile['connectionStatus']
  ): Promise<void> {
    try {
      const profile = this.profiles.get(userId);
      if (profile) {
        profile.connectionStatus = newStatus;
        await this.saveProfiles();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error updating connection status:', error);
      throw error;
    }
  }

  // Send friend request
  public async sendFriendRequest(userId: string): Promise<void> {
    try {
      await this.updateConnectionStatus(userId, 'pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  // Accept friend request
  public async acceptFriendRequest(userId: string): Promise<void> {
    try {
      await this.updateConnectionStatus(userId, 'friends');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  }

  // Block user
  public async blockUser(userId: string): Promise<void> {
    try {
      await this.updateConnectionStatus(userId, 'blocked');
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Get user stats
  public async getUserStats(userId: string): Promise<UserProfile['stats'] | null> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.stats || null;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }

  // Get user achievements
  public async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.achievements || [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Get recent activities
  public async getRecentActivities(userId: string): Promise<RecentActivity[]> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.recentActivities || [];
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }
}

// Export singleton instance
export const userProfileService = UserProfileService.getInstance();
export default UserProfileService;
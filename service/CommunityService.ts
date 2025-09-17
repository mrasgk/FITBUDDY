import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  sport: string;
  image: string;
  bannerImage?: string;
  isJoined: boolean;
  privacy: 'public' | 'private' | 'invite-only';
  location: string;
  createdBy: string;
  createdDate: string;
  tags: string[];
  rules: string[];
  membersList: CommunityMember[];
  upcomingEvents: CommunityEvent[];
  posts: CommunityPost[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  maxMembers?: number;
  joinRequests: JoinRequest[];
}

export interface CommunityMember {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedDate: string;
  isActive: boolean;
  contributions: number;
}

export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants?: number;
  currentParticipants: string[];
  createdBy: string;
  sport: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images?: string[];
  createdDate: string;
  likes: number;
  comments: PostComment[];
  isPinned: boolean;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdDate: string;
  likes: number;
}

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

class CommunityService {
  private static instance: CommunityService;
  private readonly STORAGE_KEY = '@FitBuddy:Communities';
  private communities: Map<string, Community> = new Map();

  private constructor() {
    this.loadCommunities();
  }

  public static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService();
    }
    return CommunityService.instance;
  }

  private async loadCommunities(): Promise<void> {
    try {
      const savedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const communitiesData = JSON.parse(savedData);
        this.communities = new Map(Object.entries(communitiesData));
      } else {
        this.initializeMockData();
      }
    } catch (error) {
      console.error('Error loading communities:', error);
      this.initializeMockData();
    }
  }

  private async saveCommunities(): Promise<void> {
    try {
      const communitiesData = Object.fromEntries(this.communities);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(communitiesData));
    } catch (error) {
      console.error('Error saving communities:', error);
      throw error;
    }
  }

  private initializeMockData(): void {
    const mockCommunities: Community[] = [
      {
        id: '1',
        name: 'Weekend Warriors',
        description: 'Casual sports enthusiasts who love weekend games and friendly competition',
        members: 234,
        sport: 'Basketball',
        image: 'https://picsum.photos/400/400?random=4',
        bannerImage: 'https://picsum.photos/800/300?random=14',
        isJoined: false,
        privacy: 'public',
        location: 'San Francisco, CA',
        createdBy: 'user123',
        createdDate: '2023-08-15',
        tags: ['casual', 'weekends', 'friendly', 'beginner-friendly'],
        rules: [
          'Be respectful to all members',
          'Show up on time for scheduled games',
          'Bring your own equipment when possible',
          'Have fun and stay active!'
        ],
        level: 'Mixed',
        maxMembers: 500,
        membersList: [
          {
            id: 'mem1',
            userId: '1',
            userName: 'Alex Johnson',
            userAvatar: 'https://picsum.photos/60/60?random=7',
            role: 'admin',
            joinedDate: '2023-08-15',
            isActive: true,
            contributions: 25
          },
          {
            id: 'mem2',
            userId: '2',
            userName: 'Sarah Chen',
            userAvatar: 'https://picsum.photos/60/60?random=8',
            role: 'moderator',
            joinedDate: '2023-08-20',
            isActive: true,
            contributions: 18
          }
        ],
        upcomingEvents: [
          {
            id: 'evt1',
            communityId: '1',
            title: 'Saturday Basketball Tournament',
            description: 'Friendly 3v3 tournament with prizes!',
            date: '2024-01-20',
            time: '10:00',
            location: 'Central Sports Complex',
            maxParticipants: 18,
            currentParticipants: ['1', '2', '3'],
            createdBy: '1',
            sport: 'Basketball'
          }
        ],
        posts: [
          {
            id: 'post1',
            communityId: '1',
            authorId: '1',
            authorName: 'Alex Johnson',
            authorAvatar: 'https://picsum.photos/60/60?random=7',
            content: 'Great game yesterday! Looking forward to next weekend. Who\'s in?',
            createdDate: '2024-01-15',
            likes: 12,
            comments: [
              {
                id: 'com1',
                authorId: '2',
                authorName: 'Sarah Chen',
                authorAvatar: 'https://picsum.photos/60/60?random=8',
                content: 'Count me in! Same time?',
                createdDate: '2024-01-15',
                likes: 3
              }
            ],
            isPinned: false
          }
        ],
        joinRequests: []
      },
      {
        id: '2',
        name: 'Morning Runners',
        description: 'Early birds who start their day with a run. All paces welcome!',
        members: 156,
        sport: 'Running',
        image: 'https://picsum.photos/400/400?random=5',
        bannerImage: 'https://picsum.photos/800/300?random=15',
        isJoined: true,
        privacy: 'public',
        location: 'Golden Gate Park',
        createdBy: 'user456',
        createdDate: '2023-06-10',
        tags: ['morning', 'running', 'fitness', 'all-levels'],
        rules: [
          'Meet at 6:30 AM sharp',
          'Bring water and wear reflective gear',
          'No one gets left behind',
          'Post-run coffee is optional but encouraged!'
        ],
        level: 'Mixed',
        membersList: [
          {
            id: 'mem3',
            userId: '2',
            userName: 'Sarah Chen',
            userAvatar: 'https://picsum.photos/60/60?random=8',
            role: 'admin',
            joinedDate: '2023-06-10',
            isActive: true,
            contributions: 42
          }
        ],
        upcomingEvents: [
          {
            id: 'evt2',
            communityId: '2',
            title: 'Weekend Long Run',
            description: '10K scenic route through the park',
            date: '2024-01-21',
            time: '07:00',
            location: 'Golden Gate Park Entrance',
            currentParticipants: ['2', '4', '5'],
            createdBy: '2',
            sport: 'Running'
          }
        ],
        posts: [],
        joinRequests: []
      },
      {
        id: '3',
        name: 'Tennis Masters',
        description: 'Competitive tennis players and learners. Improve your game with us!',
        members: 89,
        sport: 'Tennis',
        image: 'https://picsum.photos/400/400?random=6',
        bannerImage: 'https://picsum.photos/800/300?random=16',
        isJoined: false,
        privacy: 'invite-only',
        location: 'Tennis Club Pro',
        createdBy: 'user789',
        createdDate: '2023-09-05',
        tags: ['tennis', 'competitive', 'skill-building', 'tournaments'],
        rules: [
          'Intermediate level or above required',
          'Must have own racket and balls',
          'Respect court time limits',
          'Participate in monthly tournaments'
        ],
        level: 'Advanced',
        maxMembers: 100,
        membersList: [],
        upcomingEvents: [],
        posts: [],
        joinRequests: []
      }
    ];

    mockCommunities.forEach(community => {
      this.communities.set(community.id, community);
    });
  }

  // Get all communities
  public async getCommunities(): Promise<Community[]> {
    await this.loadCommunities();
    return Array.from(this.communities.values());
  }

  // Get community by ID
  public async getCommunityById(communityId: string): Promise<Community | null> {
    await this.loadCommunities();
    return this.communities.get(communityId) || null;
  }

  // Search communities
  public async searchCommunities(query: string): Promise<Community[]> {
    await this.loadCommunities();
    const communities = Array.from(this.communities.values());
    
    return communities.filter(community =>
      community.name.toLowerCase().includes(query.toLowerCase()) ||
      community.sport.toLowerCase().includes(query.toLowerCase()) ||
      community.description.toLowerCase().includes(query.toLowerCase()) ||
      community.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Get communities by sport
  public async getCommunitiesBySport(sport: string): Promise<Community[]> {
    await this.loadCommunities();
    const communities = Array.from(this.communities.values());
    
    return communities.filter(community =>
      community.sport.toLowerCase().includes(sport.toLowerCase())
    );
  }

  // Join community
  public async joinCommunity(communityId: string, userId: string = 'current_user'): Promise<void> {
    try {
      const community = this.communities.get(communityId);
      if (!community) {
        throw new Error('Community not found');
      }

      if (community.privacy === 'invite-only') {
        // Create join request
        const joinRequest: JoinRequest = {
          id: `req_${Date.now()}`,
          userId,
          userName: 'Current User', // This would come from user context
          userAvatar: 'https://picsum.photos/60/60?random=100',
          requestDate: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        
        community.joinRequests.push(joinRequest);
      } else {
        // Add as member directly
        const newMember: CommunityMember = {
          id: `mem_${Date.now()}`,
          userId,
          userName: 'Current User',
          userAvatar: 'https://picsum.photos/60/60?random=100',
          role: 'member',
          joinedDate: new Date().toISOString().split('T')[0],
          isActive: true,
          contributions: 0
        };

        community.membersList.push(newMember);
        community.members += 1;
        community.isJoined = true;
      }

      await this.saveCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  }

  // Leave community
  public async leaveCommunity(communityId: string, userId: string = 'current_user'): Promise<void> {
    try {
      const community = this.communities.get(communityId);
      if (!community) {
        throw new Error('Community not found');
      }

      // Remove member
      community.membersList = community.membersList.filter(member => member.userId !== userId);
      community.members = Math.max(0, community.members - 1);
      community.isJoined = false;

      await this.saveCommunities();
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  }

  // Get user's communities
  public async getUserCommunities(userId: string): Promise<Community[]> {
    await this.loadCommunities();
    const communities = Array.from(this.communities.values());
    
    return communities.filter(community =>
      community.membersList.some(member => member.userId === userId)
    );
  }

  // Create new community
  public async createCommunity(communityData: Omit<Community, 'id' | 'members' | 'membersList' | 'upcomingEvents' | 'posts' | 'joinRequests'>): Promise<Community> {
    try {
      const newCommunity: Community = {
        ...communityData,
        id: `community_${Date.now()}`,
        members: 1,
        membersList: [
          {
            id: `mem_${Date.now()}`,
            userId: 'current_user',
            userName: 'Current User',
            userAvatar: 'https://picsum.photos/60/60?random=100',
            role: 'admin',
            joinedDate: new Date().toISOString().split('T')[0],
            isActive: true,
            contributions: 0
          }
        ],
        upcomingEvents: [],
        posts: [],
        joinRequests: []
      };

      this.communities.set(newCommunity.id, newCommunity);
      await this.saveCommunities();

      return newCommunity;
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  }

  // Add community post
  public async addPost(communityId: string, postContent: Omit<CommunityPost, 'id' | 'communityId' | 'createdDate' | 'likes' | 'comments' | 'isPinned'>): Promise<void> {
    try {
      const community = this.communities.get(communityId);
      if (!community) {
        throw new Error('Community not found');
      }

      const newPost: CommunityPost = {
        ...postContent,
        id: `post_${Date.now()}`,
        communityId,
        createdDate: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: [],
        isPinned: false
      };

      community.posts.unshift(newPost); // Add to beginning
      await this.saveCommunities();
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  // Get recommended communities
  public async getRecommendedCommunities(userSports: string[], limit: number = 5): Promise<Community[]> {
    await this.loadCommunities();
    const communities = Array.from(this.communities.values());
    
    // Filter by user sports and not already joined
    const recommended = communities
      .filter(community => 
        !community.isJoined && 
        userSports.some(sport => 
          community.sport.toLowerCase().includes(sport.toLowerCase())
        )
      )
      .sort((a, b) => b.members - a.members) // Sort by popularity
      .slice(0, limit);

    return recommended;
  }

  // Handle join request
  public async handleJoinRequest(communityId: string, requestId: string, action: 'approve' | 'reject'): Promise<void> {
    try {
      const community = this.communities.get(communityId);
      if (!community) {
        throw new Error('Community not found');
      }

      const requestIndex = community.joinRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        throw new Error('Join request not found');
      }

      const request = community.joinRequests[requestIndex];
      
      if (action === 'approve') {
        // Add as member
        const newMember: CommunityMember = {
          id: `mem_${Date.now()}`,
          userId: request.userId,
          userName: request.userName,
          userAvatar: request.userAvatar,
          role: 'member',
          joinedDate: new Date().toISOString().split('T')[0],
          isActive: true,
          contributions: 0
        };

        community.membersList.push(newMember);
        community.members += 1;
        request.status = 'approved';
      } else {
        request.status = 'rejected';
      }

      await this.saveCommunities();
    } catch (error) {
      console.error('Error handling join request:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const communityService = CommunityService.getInstance();
export default CommunityService;
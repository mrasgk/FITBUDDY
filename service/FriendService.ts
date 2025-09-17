import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FriendConnection {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked' | 'rejected';
  requestedBy: string;
  requestDate: string;
  acceptedDate?: string;
  mutualFriends?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  message?: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface BlockedUser {
  id: string;
  userId: string;
  blockedUserId: string;
  blockedUserName: string;
  blockedUserAvatar: string;
  blockedDate: string;
  reason?: string;
}

export interface FriendActivity {
  id: string;
  userId: string;
  friendId: string;
  type: 'friend_request_sent' | 'friend_request_received' | 'friend_accepted' | 'friend_blocked';
  date: string;
  metadata?: any;
}

class FriendService {
  private static instance: FriendService;
  private readonly CONNECTIONS_KEY = '@FitBuddy:FriendConnections';
  private readonly REQUESTS_KEY = '@FitBuddy:FriendRequests';
  private readonly BLOCKED_KEY = '@FitBuddy:BlockedUsers';
  private readonly ACTIVITIES_KEY = '@FitBuddy:FriendActivities';

  private connections: Map<string, FriendConnection> = new Map();
  private requests: Map<string, FriendRequest> = new Map();
  private blockedUsers: Map<string, BlockedUser> = new Map();
  private activities: Map<string, FriendActivity> = new Map();

  private constructor() {
    this.loadData();
  }

  public static getInstance(): FriendService {
    if (!FriendService.instance) {
      FriendService.instance = new FriendService();
    }
    return FriendService.instance;
  }

  private async loadData(): Promise<void> {
    try {
      const [connectionsData, requestsData, blockedData, activitiesData] = await Promise.all([
        AsyncStorage.getItem(this.CONNECTIONS_KEY),
        AsyncStorage.getItem(this.REQUESTS_KEY),
        AsyncStorage.getItem(this.BLOCKED_KEY),
        AsyncStorage.getItem(this.ACTIVITIES_KEY)
      ]);

      if (connectionsData) {
        const connections = JSON.parse(connectionsData);
        this.connections = new Map(Object.entries(connections));
      }

      if (requestsData) {
        const requests = JSON.parse(requestsData);
        this.requests = new Map(Object.entries(requests));
      }

      if (blockedData) {
        const blocked = JSON.parse(blockedData);
        this.blockedUsers = new Map(Object.entries(blocked));
      }

      if (activitiesData) {
        const activities = JSON.parse(activitiesData);
        this.activities = new Map(Object.entries(activities));
      }

      // Initialize with some mock data if empty
      if (this.connections.size === 0) {
        this.initializeMockData();
      }
    } catch (error) {
      console.error('Error loading friend data:', error);
      this.initializeMockData();
    }
  }

  private async saveConnections(): Promise<void> {
    try {
      const connectionsData = Object.fromEntries(this.connections);
      await AsyncStorage.setItem(this.CONNECTIONS_KEY, JSON.stringify(connectionsData));
    } catch (error) {
      console.error('Error saving connections:', error);
      throw error;
    }
  }

  private async saveRequests(): Promise<void> {
    try {
      const requestsData = Object.fromEntries(this.requests);
      await AsyncStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requestsData));
    } catch (error) {
      console.error('Error saving requests:', error);
      throw error;
    }
  }

  private async saveBlockedUsers(): Promise<void> {
    try {
      const blockedData = Object.fromEntries(this.blockedUsers);
      await AsyncStorage.setItem(this.BLOCKED_KEY, JSON.stringify(blockedData));
    } catch (error) {
      console.error('Error saving blocked users:', error);
      throw error;
    }
  }

  private async saveActivities(): Promise<void> {
    try {
      const activitiesData = Object.fromEntries(this.activities);
      await AsyncStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activitiesData));
    } catch (error) {
      console.error('Error saving activities:', error);
      throw error;
    }
  }

  private initializeMockData(): void {
    // Mock existing friendship with Sarah Chen
    const mockConnection: FriendConnection = {
      id: 'conn_1',
      userId: 'current_user',
      friendId: '2',
      status: 'accepted',
      requestedBy: 'current_user',
      requestDate: '2024-01-01',
      acceptedDate: '2024-01-01',
      mutualFriends: 3
    };

    this.connections.set(mockConnection.id, mockConnection);

    // Mock pending request from Alex Johnson
    const mockRequest: FriendRequest = {
      id: 'req_1',
      fromUserId: '1',
      toUserId: 'current_user',
      fromUserName: 'Alex Johnson',
      fromUserAvatar: 'https://picsum.photos/60/60?random=7',
      requestDate: '2024-01-10',
      status: 'pending'
    };

    this.requests.set(mockRequest.id, mockRequest);
  }

  // Send friend request
  public async sendFriendRequest(
    toUserId: string, 
    fromUserId: string = 'current_user',
    message?: string
  ): Promise<FriendRequest> {
    try {
      await this.loadData();

      // Check if already friends or request exists
      const existingConnection = this.getConnectionBetweenUsers(fromUserId, toUserId);
      if (existingConnection) {
        throw new Error('Connection already exists');
      }

      const existingRequest = Array.from(this.requests.values()).find(
        req => (req.fromUserId === fromUserId && req.toUserId === toUserId) ||
               (req.fromUserId === toUserId && req.toUserId === fromUserId)
      );

      if (existingRequest) {
        throw new Error('Friend request already exists');
      }

      // Check if user is blocked
      const isBlocked = this.isUserBlocked(fromUserId, toUserId);
      if (isBlocked) {
        throw new Error('Cannot send friend request to blocked user');
      }

      const request: FriendRequest = {
        id: `req_${Date.now()}`,
        fromUserId,
        toUserId,
        fromUserName: 'Current User', // This would come from user context
        fromUserAvatar: 'https://picsum.photos/60/60?random=100',
        message,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      this.requests.set(request.id, request);
      await this.saveRequests();

      // Log activity
      await this.logActivity({
        id: `act_${Date.now()}`,
        userId: fromUserId,
        friendId: toUserId,
        type: 'friend_request_sent',
        date: new Date().toISOString(),
      });

      return request;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  // Accept friend request
  public async acceptFriendRequest(requestId: string): Promise<void> {
    try {
      const request = this.requests.get(requestId);
      if (!request) {
        throw new Error('Friend request not found');
      }

      if (request.status !== 'pending') {
        throw new Error('Friend request is not pending');
      }

      // Create connection
      const connection: FriendConnection = {
        id: `conn_${Date.now()}`,
        userId: request.toUserId,
        friendId: request.fromUserId,
        status: 'accepted',
        requestedBy: request.fromUserId,
        requestDate: request.requestDate,
        acceptedDate: new Date().toISOString().split('T')[0],
        mutualFriends: 0 // This would be calculated
      };

      this.connections.set(connection.id, connection);
      await this.saveConnections();

      // Update request status
      request.status = 'accepted';
      await this.saveRequests();

      // Log activities
      await this.logActivity({
        id: `act_${Date.now()}`,
        userId: request.toUserId,
        friendId: request.fromUserId,
        type: 'friend_accepted',
        date: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  }

  // Reject friend request
  public async rejectFriendRequest(requestId: string): Promise<void> {
    try {
      const request = this.requests.get(requestId);
      if (!request) {
        throw new Error('Friend request not found');
      }

      request.status = 'rejected';
      await this.saveRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  }

  // Remove friend
  public async removeFriend(friendId: string, userId: string = 'current_user'): Promise<void> {
    try {
      const connection = this.getConnectionBetweenUsers(userId, friendId);
      if (!connection) {
        throw new Error('Friendship not found');
      }

      this.connections.delete(connection.id);
      await this.saveConnections();
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }

  // Block user
  public async blockUser(
    blockedUserId: string, 
    userId: string = 'current_user',
    reason?: string
  ): Promise<void> {
    try {
      // Remove existing friendship if any
      const connection = this.getConnectionBetweenUsers(userId, blockedUserId);
      if (connection) {
        this.connections.delete(connection.id);
        await this.saveConnections();
      }

      // Remove any pending requests
      const requests = Array.from(this.requests.values()).filter(
        req => (req.fromUserId === userId && req.toUserId === blockedUserId) ||
               (req.fromUserId === blockedUserId && req.toUserId === userId)
      );

      requests.forEach(req => {
        this.requests.delete(req.id);
      });
      await this.saveRequests();

      // Add to blocked list
      const blockedUser: BlockedUser = {
        id: `block_${Date.now()}`,
        userId,
        blockedUserId,
        blockedUserName: 'Blocked User', // This would come from user context
        blockedUserAvatar: 'https://picsum.photos/60/60?random=100',
        blockedDate: new Date().toISOString().split('T')[0],
        reason
      };

      this.blockedUsers.set(blockedUser.id, blockedUser);
      await this.saveBlockedUsers();

      // Log activity
      await this.logActivity({
        id: `act_${Date.now()}`,
        userId,
        friendId: blockedUserId,
        type: 'friend_blocked',
        date: new Date().toISOString(),
        metadata: { reason }
      });

    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Unblock user
  public async unblockUser(blockedUserId: string, userId: string = 'current_user'): Promise<void> {
    try {
      const blockedEntries = Array.from(this.blockedUsers.entries());
      const blockedEntry = blockedEntries.find(
        ([_, blocked]) => blocked.userId === userId && blocked.blockedUserId === blockedUserId
      );

      if (blockedEntry) {
        this.blockedUsers.delete(blockedEntry[0]);
        await this.saveBlockedUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  // Get user's friends
  public async getFriends(userId: string = 'current_user'): Promise<FriendConnection[]> {
    await this.loadData();
    const connections = Array.from(this.connections.values());
    
    return connections.filter(
      conn => (conn.userId === userId || conn.friendId === userId) && conn.status === 'accepted'
    );
  }

  // Get pending friend requests (received)
  public async getPendingRequests(userId: string = 'current_user'): Promise<FriendRequest[]> {
    await this.loadData();
    const requests = Array.from(this.requests.values());
    
    return requests.filter(
      req => req.toUserId === userId && req.status === 'pending'
    );
  }

  // Get sent friend requests
  public async getSentRequests(userId: string = 'current_user'): Promise<FriendRequest[]> {
    await this.loadData();
    const requests = Array.from(this.requests.values());
    
    return requests.filter(
      req => req.fromUserId === userId && req.status === 'pending'
    );
  }

  // Get blocked users
  public async getBlockedUsers(userId: string = 'current_user'): Promise<BlockedUser[]> {
    await this.loadData();
    const blocked = Array.from(this.blockedUsers.values());
    
    return blocked.filter(block => block.userId === userId);
  }

  // Check if users are friends
  public async areFriends(userId1: string, userId2: string): Promise<boolean> {
    await this.loadData();
    const connection = this.getConnectionBetweenUsers(userId1, userId2);
    return connection ? connection.status === 'accepted' : false;
  }

  // Check if user is blocked
  public isUserBlocked(userId: string, targetUserId: string): boolean {
    const blocked = Array.from(this.blockedUsers.values());
    return blocked.some(
      block => (block.userId === userId && block.blockedUserId === targetUserId) ||
               (block.userId === targetUserId && block.blockedUserId === userId)
    );
  }

  // Get connection status between users
  public async getConnectionStatus(
    userId: string = 'current_user', 
    targetUserId: string
  ): Promise<'none' | 'pending_sent' | 'pending_received' | 'friends' | 'blocked'> {
    await this.loadData();

    // Check if blocked
    if (this.isUserBlocked(userId, targetUserId)) {
      return 'blocked';
    }

    // Check if friends
    const connection = this.getConnectionBetweenUsers(userId, targetUserId);
    if (connection && connection.status === 'accepted') {
      return 'friends';
    }

    // Check for pending requests
    const requests = Array.from(this.requests.values());
    const pendingRequest = requests.find(
      req => ((req.fromUserId === userId && req.toUserId === targetUserId) ||
              (req.fromUserId === targetUserId && req.toUserId === userId)) &&
             req.status === 'pending'
    );

    if (pendingRequest) {
      return pendingRequest.fromUserId === userId ? 'pending_sent' : 'pending_received';
    }

    return 'none';
  }

  // Get mutual friends
  public async getMutualFriends(userId1: string, userId2: string): Promise<string[]> {
    await this.loadData();
    
    const user1Friends = (await this.getFriends(userId1)).map(conn => 
      conn.userId === userId1 ? conn.friendId : conn.userId
    );
    
    const user2Friends = (await this.getFriends(userId2)).map(conn => 
      conn.userId === userId2 ? conn.friendId : conn.userId
    );

    return user1Friends.filter(friendId => user2Friends.includes(friendId));
  }

  // Get friend activities
  public async getFriendActivities(userId: string = 'current_user', limit: number = 20): Promise<FriendActivity[]> {
    await this.loadData();
    const activities = Array.from(this.activities.values());
    
    return activities
      .filter(activity => activity.userId === userId || activity.friendId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Private helper methods
  private getConnectionBetweenUsers(userId1: string, userId2: string): FriendConnection | null {
    const connections = Array.from(this.connections.values());
    return connections.find(
      conn => (conn.userId === userId1 && conn.friendId === userId2) ||
              (conn.userId === userId2 && conn.friendId === userId1)
    ) || null;
  }

  private async logActivity(activity: FriendActivity): Promise<void> {
    try {
      this.activities.set(activity.id, activity);
      await this.saveActivities();
    } catch (error) {
      console.error('Error logging friend activity:', error);
    }
  }
}

// Export singleton instance
export const friendService = FriendService.getInstance();
export default FriendService;
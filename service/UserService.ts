export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  dateOfBirth?: string;
  location?: {
    city: string;
    country: string;
  };
  preferences: {
    favoriteSports: string[];
    skillLevels: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>;
    maxTravelDistance: number;
    notifications: {
      newActivities: boolean;
      activityReminders: boolean;
      socialUpdates: boolean;
    };
  };
  stats: {
    activitiesJoined: number;
    activitiesCreated: number;
    sportsPlayed: number;
    friendsCount: number;
    totalHoursActive: number;
  };
  createdAt: string;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profileImage?: string;
  location?: {
    city: string;
    country: string;
  };
  preferences?: Partial<User['preferences']>;
}

class UserService {
  private currentUser: User | null = null;
  private baseUrl = '/api/users'; // Replace with your API base URL

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Login user
  async login(credentials: LoginRequest): Promise<User> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'Alex Johnson',
        email: credentials.email,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: {
          city: 'New York',
          country: 'USA'
        },
        preferences: {
          favoriteSports: ['Football', 'Basketball', 'Tennis'],
          skillLevels: {
            'Football': 'Intermediate',
            'Basketball': 'Advanced',
            'Tennis': 'Beginner'
          },
          maxTravelDistance: 25,
          notifications: {
            newActivities: true,
            activityReminders: true,
            socialUpdates: false
          }
        },
        stats: {
          activitiesJoined: 24,
          activitiesCreated: 8,
          sportsPlayed: 6,
          friendsCount: 12,
          totalHoursActive: 48
        },
        createdAt: '2024-01-01T00:00:00Z',
        isVerified: true
      };

      this.currentUser = mockUser;
      await this.saveUserToStorage(mockUser);
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<User> {
    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Mock user creation
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: userData.dateOfBirth,
        preferences: {
          favoriteSports: [],
          skillLevels: {},
          maxTravelDistance: 10,
          notifications: {
            newActivities: true,
            activityReminders: true,
            socialUpdates: true
          }
        },
        stats: {
          activitiesJoined: 0,
          activitiesCreated: 0,
          sportsPlayed: 0,
          friendsCount: 0,
          totalHoursActive: 0
        },
        createdAt: new Date().toISOString(),
        isVerified: false
      };

      this.currentUser = newUser;
      await this.saveUserToStorage(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Simulate API call
      // await fetch(`${this.baseUrl}/logout`, { method: 'POST' });

      this.currentUser = null;
      await this.clearUserFromStorage();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local user data even if API call fails
      this.currentUser = null;
      await this.clearUserFromStorage();
    }
  }

  // Update user profile
  async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    try {
      if (!this.currentUser) {
        throw new Error('User not logged in');
      }

      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${this.currentUser.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates),
      // });
      // const updatedUser = await response.json();

      // Mock update
      const updatedUser: User = {
        ...this.currentUser,
        ...updates,
        preferences: {
          ...this.currentUser.preferences,
          ...updates.preferences
        }
      };

      this.currentUser = updatedUser;
      await this.saveUserToStorage(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Load user from storage on app start
  async loadUserFromStorage(): Promise<User | null> {
    try {
      // In a real app, use AsyncStorage or SecureStore
      // const userData = await AsyncStorage.getItem('user');
      // if (userData) {
      //   this.currentUser = JSON.parse(userData);
      //   return this.currentUser;
      // }
      return null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }

  // Save user to storage
  private async saveUserToStorage(user: User): Promise<void> {
    try {
      // In a real app, use AsyncStorage or SecureStore
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('User saved to storage:', user.name);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Clear user from storage
  private async clearUserFromStorage(): Promise<void> {
    try {
      // In a real app, use AsyncStorage or SecureStore
      // await AsyncStorage.removeItem('user');
      console.log('User cleared from storage');
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }

  // Get user statistics
  getUserStats(): User['stats'] | null {
    return this.currentUser?.stats || null;
  }

  // Update user statistics
  async updateUserStats(statUpdates: Partial<User['stats']>): Promise<void> {
    if (!this.currentUser) return;

    try {
      this.currentUser.stats = {
        ...this.currentUser.stats,
        ...statUpdates
      };
      await this.saveUserToStorage(this.currentUser);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
}

// Export singleton instance
export const userService = new UserService();
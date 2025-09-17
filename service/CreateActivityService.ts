import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from './ActivitiesData';

export interface CreateActivityData {
  id: string;
  type: Activity['type'];
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  requiredSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  userImage: string;
  userName: string;
  createdAt: string;
  status: 'active' | 'cancelled' | 'completed';
}

class CreateActivityService {
  private storageKey = 'created_activities';

  /**
   * Create a new activity
   */
  async createActivity(formData: {
    type: Activity['type'];
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    maxParticipants: number;
    isPublic: boolean;
    requiredSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  }): Promise<CreateActivityData> {
    try {
      const newActivity: CreateActivityData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...formData,
        currentParticipants: 1, // Creator is first participant
        userImage: 'https://picsum.photos/60/60?random=' + Math.floor(Math.random() * 1000),
        userName: 'You', // Could be replaced with actual user data
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Get existing activities
      const existingActivities = await this.getCreatedActivities();
      
      // Add new activity
      const updatedActivities = [newActivity, ...existingActivities];
      
      // Save to storage
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedActivities));
      
      return newActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  }

  /**
   * Get all created activities
   */
  async getCreatedActivities(): Promise<CreateActivityData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        const activities: CreateActivityData[] = JSON.parse(stored);
        return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return [];
    } catch (error) {
      console.error('Error getting created activities:', error);
      return [];
    }
  }

  /**
   * Get activities by date for home page integration
   */
  async getActivitiesByDate(dateString: string): Promise<Activity[]> {
    try {
      const createdActivities = await this.getCreatedActivities();
      
      // Filter activities by date and convert to Activity format
      const activitiesForDate = createdActivities
        .filter(activity => activity.date === dateString && activity.status === 'active')
        .map(activity => this.convertToActivity(activity));
      
      return activitiesForDate;
    } catch (error) {
      console.error('Error getting activities by date:', error);
      return [];
    }
  }

  /**
   * Update activity status
   */
  async updateActivityStatus(id: string, status: CreateActivityData['status']): Promise<boolean> {
    try {
      const activities = await this.getCreatedActivities();
      const activityIndex = activities.findIndex(activity => activity.id === id);
      
      if (activityIndex === -1) {
        return false;
      }

      activities[activityIndex].status = status;
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(activities));
      
      return true;
    } catch (error) {
      console.error('Error updating activity status:', error);
      return false;
    }
  }

  /**
   * Delete activity
   */
  async deleteActivity(id: string): Promise<boolean> {
    try {
      const activities = await this.getCreatedActivities();
      const filteredActivities = activities.filter(activity => activity.id !== id);
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(filteredActivities));
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  }

  /**
   * Join activity (increment participants)
   */
  async joinActivity(id: string): Promise<boolean> {
    try {
      const activities = await this.getCreatedActivities();
      const activityIndex = activities.findIndex(activity => activity.id === id);
      
      if (activityIndex === -1) {
        return false;
      }

      const activity = activities[activityIndex];
      if (activity.currentParticipants >= activity.maxParticipants) {
        throw new Error('Activity is full');
      }

      activities[activityIndex].currentParticipants += 1;
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(activities));
      
      return true;
    } catch (error) {
      console.error('Error joining activity:', error);
      return false;
    }
  }

  /**
   * Leave activity (decrement participants)
   */
  async leaveActivity(id: string): Promise<boolean> {
    try {
      const activities = await this.getCreatedActivities();
      const activityIndex = activities.findIndex(activity => activity.id === id);
      
      if (activityIndex === -1) {
        return false;
      }

      const activity = activities[activityIndex];
      if (activity.currentParticipants > 1) {
        activities[activityIndex].currentParticipants -= 1;
      }

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(activities));
      
      return true;
    } catch (error) {
      console.error('Error leaving activity:', error);
      return false;
    }
  }

  /**
   * Get user's created activities
   */
  async getUserActivities(): Promise<CreateActivityData[]> {
    try {
      const activities = await this.getCreatedActivities();
      // Filter by current user (in a real app, you'd filter by user ID)
      return activities.filter(activity => activity.userName === 'You');
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  /**
   * Clear all activities (for development/testing)
   */
  async clearAllActivities(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing activities:', error);
    }
  }

  /**
   * Convert CreateActivityData to Activity format for home page
   */
  private convertToActivity(createdActivity: CreateActivityData): Activity {
    return {
      id: createdActivity.id,
      type: createdActivity.type,
      description: createdActivity.description,
      date: createdActivity.date,
      time: createdActivity.time,
      location: createdActivity.location,
      city: createdActivity.city,
      maxParticipants: createdActivity.maxParticipants,
      currentParticipants: createdActivity.currentParticipants,
      userImage: createdActivity.userImage,
      userName: createdActivity.userName
    };
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const activities = await this.getCreatedActivities();
      
      return {
        total: activities.length,
        active: activities.filter(a => a.status === 'active').length,
        completed: activities.filter(a => a.status === 'completed').length,
        cancelled: activities.filter(a => a.status === 'cancelled').length,
      };
    } catch (error) {
      console.error('Error getting activity stats:', error);
      return { total: 0, active: 0, completed: 0, cancelled: 0 };
    }
  }
}

// Export singleton instance
export const createActivityService = new CreateActivityService();
export default createActivityService;
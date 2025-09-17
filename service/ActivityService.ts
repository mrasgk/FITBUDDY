import { Activity } from './ActivitiesData';

export interface CreateActivityRequest {
  type: Activity['type'];
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  maxParticipants: number;
  isPublic: boolean;
  requiredSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string[];
  cost?: number;
}

export interface ActivityFilters {
  type?: Activity['type'];
  date?: string;
  city?: string;
  maxDistance?: number;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  priceRange?: { min: number; max: number };
}

export interface JoinActivityRequest {
  activityId: string;
  userId: string;
  message?: string;
}

class ActivityService {
  private activities: Activity[] = [];
  private baseUrl = '/api/activities'; // Replace with your API base URL

  // Create a new activity
  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    try {
      // Simulate API call
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: activityData.type,
        userName: 'Current User', // Get from user service
        userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        time: activityData.time,
        date: activityData.date,
        location: activityData.location,
        city: activityData.city,
        description: activityData.description,
        maxParticipants: activityData.maxParticipants,
        currentParticipants: 1, // Creator is first participant
      };

      // In a real app, this would be an API call:
      // const response = await fetch(`${this.baseUrl}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(activityData),
      // });
      // return await response.json();

      return newActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  }

  // Get activities with filters
  async getActivities(filters?: ActivityFilters): Promise<Activity[]> {
    try {
      let queryParams = '';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.date) params.append('date', filters.date);
        if (filters.city) params.append('city', filters.city);
        queryParams = `?${params.toString()}`;
      }

      // Simulate API call
      // const response = await fetch(`${this.baseUrl}${queryParams}`);
      // return await response.json();

      // For now, return mock data with filters applied
      return this.activities.filter(activity => {
        if (filters?.type && activity.type !== filters.type) return false;
        if (filters?.date && activity.date !== filters.date) return false;
        if (filters?.city && !activity.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        return true;
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  }

  // Join an activity
  async joinActivity(request: JoinActivityRequest): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${request.activityId}/join`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error joining activity:', error);
      throw new Error('Failed to join activity');
    }
  }

  // Leave an activity
  async leaveActivity(activityId: string, userId: string): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${activityId}/leave`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId }),
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error leaving activity:', error);
      throw new Error('Failed to leave activity');
    }
  }

  // Get user's activities
  async getUserActivities(userId: string): Promise<Activity[]> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/user/${userId}`);
      // return await response.json();

      return this.activities.filter(activity => activity.userName === 'Current User');
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw new Error('Failed to fetch user activities');
    }
  }

  // Delete an activity
  async deleteActivity(activityId: string): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${activityId}`, {
      //   method: 'DELETE',
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw new Error('Failed to delete activity');
    }
  }

  // Update an activity
  async updateActivity(activityId: string, updates: Partial<CreateActivityRequest>): Promise<Activity> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${activityId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates),
      // });
      // return await response.json();

      // Mock response
      const activity = this.activities.find(a => a.id === activityId);
      if (!activity) throw new Error('Activity not found');
      
      return { ...activity, ...updates } as Activity;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw new Error('Failed to update activity');
    }
  }
}

// Export singleton instance
export const activityService = new ActivityService();
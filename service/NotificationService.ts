export interface Notification {
  id: string;
  type: 'activity_created' | 'activity_joined' | 'activity_reminder' | 'friend_request' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface CreateNotificationRequest {
  type: Notification['type'];
  title: string;
  message: string;
  data?: Record<string, any>;
  targetUserId?: string;
  expiresAt?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private baseUrl = '/api/notifications';

  // Get all notifications for current user
  async getNotifications(): Promise<Notification[]> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}`);
      // return await response.json();

      // Mock notifications
      return [
        {
          id: '1',
          type: 'activity_created',
          title: 'New activity near you',
          message: 'Sarah created a Basketball game at Downtown Court',
          data: { activityId: '123', creatorId: '456' },
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
          id: '2',
          type: 'activity_joined',
          title: 'Someone joined your activity',
          message: 'Mike joined your Football match at Central Park',
          data: { activityId: '789', joinerId: '101' },
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        },
        {
          id: '3',
          type: 'activity_reminder',
          title: 'Activity reminder',
          message: 'Your Tennis match starts in 30 minutes',
          data: { activityId: '112' },
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
      ];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
      //   method: 'PATCH',
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/read-all`, {
      //   method: 'PATCH',
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/${notificationId}`, {
      //   method: 'DELETE',
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Create notification (admin/system use)
  async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notification),
      // });
      // return await response.json();

      const newNotification: Notification = {
        id: Date.now().toString(),
        ...notification,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(): Promise<boolean> {
    try {
      // In a real app, this would handle push notification registration
      // const token = await Notifications.getExpoPushTokenAsync();
      // const response = await fetch(`${this.baseUrl}/subscribe`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: token.data }),
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      // Simulate API call
      // const response = await fetch(`${this.baseUrl}/unsubscribe`, {
      //   method: 'POST',
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
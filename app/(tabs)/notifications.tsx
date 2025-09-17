import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, PrimaryColor } from '@/constants/theme';
import { Notification, notificationService } from '@/service/NotificationService';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function NotificationsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Handle notification action based on type
    // This would typically navigate to relevant screen
    console.log('Notification pressed:', notification);
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'activity_created':
        return 'plus.circle.fill';
      case 'activity_joined':
        return 'people.fill';
      case 'activity_reminder':
        return 'clock.fill';
      case 'friend_request':
        return 'person.fill';
      case 'system':
        return 'bell.fill';
      default:
        return 'bell.fill';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activity Feed</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Stay updated with your sports activities
        </Text>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PrimaryColor}
          />
        }
      >
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderLeftColor: notification.isRead ? colors.border : PrimaryColor,
              }
            ]}
            activeOpacity={0.7}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.notificationContent}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: PrimaryColor + '20' }
              ]}>
                <IconSymbol
                  name={getNotificationIcon(notification.type) as any}
                  size={24}
                  color={PrimaryColor}
                />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[
                  styles.notificationTitle,
                  { 
                    color: colors.text,
                    fontWeight: notification.isRead ? '500' : '600'
                  }
                ]}>
                  {notification.title}
                </Text>
                <Text style={[styles.notificationMessage, { color: colors.icon }]}>
                  {notification.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.icon }]}>
                  {formatTimeAgo(notification.createdAt)}
                </Text>
              </View>
              
              {!notification.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: PrimaryColor }]} />
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.emptyState}>
          <IconSymbol name="bell.fill" size={48} color={colors.icon} />
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            That's all for now!
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.icon }]}>
            We'll notify you when there are new activities or updates.
          </Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
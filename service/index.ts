// Service exports for easy importing
export * from './ActivitiesData';
export * from './ActivityService';
export * from './ApiService';
export { AuthResponse, User as AuthUser, LoginCredentials, SignUpData } from './AuthService';
export * from './CityService';
export * from './CommunityService';
export * from './CreateActivityService';
export { EmailVerificationResponse, ResendCodeResponse } from './EmailService';
export * from './FriendService';
export * from './NotificationService';
export { SettingsState } from './SettingsService';
export { Achievement, MutualFriend, RecentActivity, UserProfile } from './UserProfileService';
export * from './UserService';
export * from './VenueService';

// Re-export service instances
export { activityService } from './ActivityService';
export { apiService } from './ApiService';
export { default as authService } from './AuthService';
export { cityService } from './CityService';
export { communityService } from './CommunityService';
export { createActivityService } from './CreateActivityService';
export { default as emailService } from './EmailService';
export { friendService } from './FriendService';
export { notificationService } from './NotificationService';
export { settingsService } from './SettingsService';
export { userProfileService } from './UserProfileService';
export { userService } from './UserService';
export { venueService } from './VenueService';


export interface Activity {
  id: string;
  type: 'Football' | 'Soccer' | 'Basketball' | 'Tennis' | 'Volleyball' | 'Baseball' | 'Swimming' | 'Running' | 'Cycling' | 'Yoga';
  userName: string;
  userImage: string;
  time: string;
  date: string;
  location: string;
  city: string;
  description?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

// Fake data for testing
export const activitiesData: Activity[] = [
  {
    id: '1',
    type: 'Football',
    userName: 'Alex Johnson',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    time: '18:00',
    date: '2025-09-16',
    location: 'Central Park Field',
    city: 'New York',
    description: 'Looking for players for a friendly football match',
    maxParticipants: 22,
    currentParticipants: 8
  },
  {
    id: '2',
    type: 'Basketball',
    userName: 'Sarah Williams',
    userImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    time: '19:30',
    date: '2025-09-17',
    location: 'Downtown Basketball Court',
    city: 'Los Angeles',
    description: 'Quick 3v3 basketball game, all levels welcome',
    maxParticipants: 6,
    currentParticipants: 4
  },
  {
    id: '3',
    type: 'Soccer',
    userName: 'Miguel Rodriguez',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    time: '17:00',
    date: '2025-09-17',
    location: 'Riverside Soccer Field',
    city: 'Miami',
    description: 'Weekly soccer practice, beginners welcome',
    maxParticipants: 20,
    currentParticipants: 12
  },
  {
    id: '4',
    type: 'Tennis',
    userName: 'Emma Davis',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    time: '16:00',
    date: '2025-09-17',
    location: 'City Tennis Club',
    city: 'Chicago',
    description: 'Looking for a tennis partner for doubles',
    maxParticipants: 4,
    currentParticipants: 2
  },
  {
    id: '5',
    type: 'Swimming',
    userName: 'David Kim',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    time: '07:00',
    date: '2025-09-18',
    location: 'Olympic Pool Center',
    city: 'San Francisco',
    description: 'Morning swimming session, join our group',
    maxParticipants: 15,
    currentParticipants: 7
  },
  {
    id: '6',
    type: 'Volleyball',
    userName: 'Jessica Chen',
    userImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    time: '20:00',
    date: '2025-09-18',
    location: 'Beach Volleyball Court',
    city: 'San Diego',
    description: 'Beach volleyball under the lights',
    maxParticipants: 12,
    currentParticipants: 6
  },
  {
    id: '7',
    type: 'Running',
    userName: 'Michael Thompson',
    userImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    time: '06:30',
    date: '2025-09-19',
    location: 'Harbor Running Trail',
    city: 'Seattle',
    description: 'Morning 5K run along the waterfront',
    maxParticipants: 10,
    currentParticipants: 5
  },
  {
    id: '8',
    type: 'Yoga',
    userName: 'Lisa Anderson',
    userImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    time: '18:30',
    date: '2025-09-19',
    location: 'Zen Garden Studio',
    city: 'Portland',
    description: 'Relaxing evening yoga session in the park',
    maxParticipants: 20,
    currentParticipants: 14
  },
  {
    id: '9',
    type: 'Cycling',
    userName: 'Robert Garcia',
    userImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    time: '08:00',
    date: '2025-09-16',
    location: 'Mountain Bike Trail',
    city: 'Denver',
    description: 'Weekend mountain biking adventure',
    maxParticipants: 8,
    currentParticipants: 3
  },
  {
    id: '10',
    type: 'Baseball',
    userName: 'Chris Wilson',
    userImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    time: '15:00',
    date: '2025-09-16',
    location: 'Community Baseball Diamond',
    city: 'Boston',
    description: 'Sunday baseball game, need more players',
    maxParticipants: 18,
    currentParticipants: 11
  },
  {
    id: '11',
    type: 'Football',
    userName: 'Tyler Brooks',
    userImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    time: '14:00',
    date: '2025-09-21',
    location: 'University Sports Complex',
    city: 'Austin',
    description: 'Flag football tournament, teams forming',
    maxParticipants: 16,
    currentParticipants: 9
  },
  {
    id: '12',
    type: 'Basketball',
    userName: 'Jordan Smith',
    userImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    time: '19:00',
    date: '2025-09-21',
    location: 'Streetball Court',
    city: 'Philadelphia',
    description: 'Evening streetball session, bring your A-game',
    maxParticipants: 10,
    currentParticipants: 6
  }
];

// Helper function to get activities by date
export const getActivitiesByDate = (date: string): Activity[] => {
  return activitiesData.filter(activity => activity.date === date);
};

// Helper function to get activities for the next 7 days
export const getUpcomingActivities = (): Activity[] => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return activitiesData.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= today && activityDate <= nextWeek;
  });
};

// Sport type colors for UI
export const sportColors: Record<Activity['type'], string> = {
  Football: '#1f2937',
  Soccer: '#059669',
  Basketball: '#f59e0b',
  Tennis: '#8b5cf6',
  Volleyball: '#ef4444',
  Baseball: '#3b82f6',
  Swimming: '#06b6d4',
  Running: '#f97316',
  Cycling: '#84cc16',
  Yoga: '#ec4899'
};

// Sport icons (can be used with @expo/vector-icons)
export const sportIcons: Record<Activity['type'], string> = {
  Football: 'american-football',
  Soccer: 'football',
  Basketball: 'basketball',
  Tennis: 'tennis-ball',
  Volleyball: 'volleyball-ball',
  Baseball: 'baseball-ball',
  Swimming: 'swimmer',
  Running: 'running',
  Cycling: 'bicycle',
  Yoga: 'meditation'
};
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface Activity {
  id: string;
  sport: string;
  icon: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  duration: string;
  calories?: number;
}

export default function ActivityHistoryPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const activities: Activity[] = [
    {
      id: '1',
      sport: 'Soccer',
      icon: 'figure.soccer',
      title: 'Weekly Soccer Match',
      date: '2024-01-15',
      time: '6:00 PM',
      location: 'Central Park Field A',
      participants: 12,
      status: 'completed',
      duration: '2 hours',
      calories: 650,
    },
    {
      id: '2',
      sport: 'Basketball',
      icon: 'figure.basketball',
      title: 'Pickup Basketball',
      date: '2024-01-12',
      time: '7:30 AM',
      location: 'Downtown Court',
      participants: 8,
      status: 'completed',
      duration: '1.5 hours',
      calories: 420,
    },
    {
      id: '3',
      sport: 'Tennis',
      icon: 'figure.tennis',
      title: 'Tennis Doubles',
      date: '2024-01-18',
      time: '5:00 PM',
      location: 'Tennis Club Pro',
      participants: 4,
      status: 'upcoming',
      duration: '1 hour',
    },
    {
      id: '4',
      sport: 'Running',
      icon: 'figure.running',
      title: 'Morning Run Group',
      date: '2024-01-10',
      time: '6:00 AM',
      location: 'Riverside Trail',
      participants: 6,
      status: 'completed',
      duration: '45 minutes',
      calories: 380,
    },
    {
      id: '5',
      sport: 'Yoga',
      icon: 'figure.yoga',
      title: 'Sunset Yoga Session',
      date: '2024-01-08',
      time: '6:30 PM',
      location: 'Beach Pavilion',
      participants: 15,
      status: 'cancelled',
      duration: '1 hour',
    },
    {
      id: '6',
      sport: 'Cycling',
      icon: 'figure.cycling',
      title: 'City Bike Tour',
      date: '2024-01-20',
      time: '9:00 AM',
      location: 'City Center',
      participants: 10,
      status: 'upcoming',
      duration: '3 hours',
    },
  ];

  const filters = [
    { key: 'all', label: 'All Activities', count: activities.length },
    { key: 'completed', label: 'Completed', count: activities.filter(a => a.status === 'completed').length },
    { key: 'upcoming', label: 'Upcoming', count: activities.filter(a => a.status === 'upcoming').length },
    { key: 'cancelled', label: 'Cancelled', count: activities.filter(a => a.status === 'cancelled').length },
  ];

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.status === selectedFilter);

  const totalCalories = activities
    .filter(a => a.status === 'completed' && a.calories)
    .reduce((sum, a) => sum + (a.calories || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'upcoming': return PrimaryColor;
      case 'cancelled': return '#ef4444';
      default: return colors.icon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark.circle.fill';
      case 'upcoming': return 'clock.fill';
      case 'cancelled': return 'xmark.circle.fill';
      default: return 'clock.fill';
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Activity History
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="flame.fill" size={32} color="#f59e0b" />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {totalCalories.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Total Calories Burned
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="calendar" size={32} color={PrimaryColor} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {activities.filter(a => a.status === 'completed').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Activities Completed
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: selectedFilter === filter.key ? PrimaryColor : colors.surface,
                    borderColor: selectedFilter === filter.key ? PrimaryColor : colors.border,
                  }
                ]}
                onPress={() => setSelectedFilter(filter.key)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterText,
                  {
                    color: selectedFilter === filter.key ? 'white' : colors.text
                  }
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  {
                    backgroundColor: selectedFilter === filter.key ? 'rgba(255,255,255,0.3)' : AccentColor,
                  }
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    {
                      color: selectedFilter === filter.key ? 'white' : 'white'
                    }
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesSection}>
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="calendar" size={64} color={colors.icon} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Activities Found
              </Text>
              <Text style={[styles.emptyMessage, { color: colors.icon }]}>
                {selectedFilter === 'all' 
                  ? 'You haven\'t joined any activities yet.'
                  : `No ${selectedFilter} activities to show.`
                }
              </Text>
            </View>
          ) : (
            filteredActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityIcon}>
                    <IconSymbol
                      name={activity.icon as any}
                      size={28}
                      color={PrimaryColor}
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>
                      {activity.title}
                    </Text>
                    <Text style={[styles.activitySport, { color: colors.icon }]}>
                      {activity.sport} • {activity.duration}
                    </Text>
                  </View>
                  <View style={styles.activityStatus}>
                    <IconSymbol
                      name={getStatusIcon(activity.status) as any}
                      size={20}
                      color={getStatusColor(activity.status)}
                    />
                  </View>
                </View>

                <View style={styles.activityDetails}>
                  <View style={styles.detailRow}>
                    <IconSymbol name="calendar" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { color: colors.icon }]}>
                      {new Date(activity.date).toLocaleDateString()} at {activity.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="location.fill" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { color: colors.icon }]}>
                      {activity.location}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="person.3.fill" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { color: colors.icon }]}>
                      {activity.participants} participants
                    </Text>
                  </View>
                  {activity.calories && (
                    <View style={styles.detailRow}>
                      <IconSymbol name="flame.fill" size={16} color="#f59e0b" />
                      <Text style={[styles.detailText, { color: colors.icon }]}>
                        {activity.calories} calories burned
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterSection: {
    paddingBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activitiesSection: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  activityCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  activitySport: {
    fontSize: 14,
  },
  activityStatus: {
    marginLeft: 12,
  },
  activityDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
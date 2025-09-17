import { Colors, PrimaryColor } from '@/constants/theme';
import { createActivityService } from '@/service';
import { Activity, getActivitiesByDate, sportColors } from '@/service/ActivitiesData';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface DateInfo {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  dateString: string;
}

interface FilterOptions {
  sportType: string[];
  timeRange: string;
  location: string;
  participantRange: string;
}

const SPORT_TYPES = ['All', 'Football', 'Basketball', 'Soccer', 'Tennis', 'Running', 'Cycling', 'Swimming'];
const TIME_RANGES = ['Any Time', 'Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'];
const LOCATIONS = ['Any Location', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const PARTICIPANT_RANGES = ['Any Size', '1-5 people', '6-10 people', '11-20 people', '20+ people'];

export default function HomePage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [weekDates, setWeekDates] = useState<DateInfo[]>([]);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sportType: ['All'],
    timeRange: 'Any Time',
    location: 'Any Location',
    participantRange: 'Any Size'
  });
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.95)).current;

  // Initialize dates for the current week starting from today
  useEffect(() => {
    const today = new Date();
    const dates: DateInfo[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dateString = date.toISOString().split('T')[0];
      
      dates.push({
        date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        isToday: i === 0,
        dateString
      });
    }
    
    setWeekDates(dates);
    setSelectedDate(dates[0].dateString);
    
    // Trigger entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(headerScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Load activities for selected date
  useEffect(() => {
    const loadActivities = async () => {
      if (selectedDate) {
        // Get original activities
        const originalActivities = getActivitiesByDate(selectedDate);
        
        // Get created activities
        const createdActivities = await createActivityService.getActivitiesByDate(selectedDate);
        
        // Combine both
        const combinedActivities = [...originalActivities, ...createdActivities];
        
        setAllActivities(combinedActivities);
        applyFilters(combinedActivities);
      }
    };
    
    loadActivities();
  }, [selectedDate]);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters(allActivities);
  }, [filters, allActivities]);

  const applyFilters = (activities: Activity[]) => {
    let filteredActivities = [...activities];

    // Filter by sport type
    if (!filters.sportType.includes('All')) {
      filteredActivities = filteredActivities.filter(activity => 
        filters.sportType.includes(activity.type)
      );
    }

    // Filter by time range
    if (filters.timeRange !== 'Any Time') {
      filteredActivities = filteredActivities.filter(activity => {
        const hour = parseInt(activity.time.split(':')[0]);
        switch (filters.timeRange) {
          case 'Morning (6AM-12PM)':
            return hour >= 6 && hour < 12;
          case 'Afternoon (12PM-6PM)':
            return hour >= 12 && hour < 18;
          case 'Evening (6PM-12AM)':
            return hour >= 18 || hour < 6;
          default:
            return true;
        }
      });
    }

    // Filter by location
    if (filters.location !== 'Any Location') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.city === filters.location
      );
    }

    // Filter by participant range
    if (filters.participantRange !== 'Any Size') {
      filteredActivities = filteredActivities.filter(activity => {
        const maxParticipants = activity.maxParticipants || 0;
        switch (filters.participantRange) {
          case '1-5 people':
            return maxParticipants >= 1 && maxParticipants <= 5;
          case '6-10 people':
            return maxParticipants >= 6 && maxParticipants <= 10;
          case '11-20 people':
            return maxParticipants >= 11 && maxParticipants <= 20;
          case '20+ people':
            return maxParticipants > 20;
          default:
            return true;
        }
      });
    }

    setTodayActivities(filteredActivities);
  };

  const renderDateCard = ({ item }: { item: DateInfo }) => {
    const isSelected = item.dateString === selectedDate;
    
    return (
      <TouchableOpacity
        style={[
          styles.dateCard,
          {
            backgroundColor: isSelected ? PrimaryColor : colors.surface,
            borderColor: item.isToday ? PrimaryColor : colors.border,
          }
        ]}
        onPress={() => setSelectedDate(item.dateString)}
      >
        <Text style={[
          styles.dayName,
          {
            color: isSelected ? 'white' : colors.text,
            fontWeight: item.isToday ? 'bold' : 'normal'
          }
        ]}>
          {item.dayName}
        </Text>
        <Text style={[
          styles.dayNumber,
          {
            color: isSelected ? 'white' : colors.text,
            fontWeight: isSelected || item.isToday ? 'bold' : 'normal'
          }
        ]}>
          {item.dayNumber}
        </Text>
        {item.isToday && (
          <View style={[
            styles.todayDot,
            { backgroundColor: isSelected ? 'white' : PrimaryColor }
          ]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderActivityCard = ({ item, index }: { item: Activity; index: number }) => {
    const sportColor = sportColors[item.type];
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 30 + (index * 10)],
                extrapolate: 'clamp',
              })
            }]
          }
        ]}
      >
        <TouchableOpacity style={[
          styles.activityCard,
          { backgroundColor: colors.surface, borderColor: colors.border }
        ]} activeOpacity={0.8}>
          <View style={styles.activityHeader}>
            <View style={styles.userImageContainer}>
              <Image
                source={{ uri: item.userImage }}
                style={styles.userImage}
              />
              <View style={[styles.onlineIndicator, { backgroundColor: '#10b981' }]} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {item.userName}
              </Text>
              <View style={styles.activityMeta}>
                <View style={[
                  styles.sportBadge,
                  { backgroundColor: sportColor + '20', borderColor: sportColor + '40', borderWidth: 1 }
                ]}>
                  <View style={[styles.sportDot, { backgroundColor: sportColor }]} />
                  <Text style={[
                    styles.sportText,
                    { color: sportColor }
                  ]}>
                    {item.type}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.timeContainer, { backgroundColor: `${PrimaryColor}10`, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }]}>
              <Ionicons
                name="time-outline"
                size={16}
                color={PrimaryColor}
              />
              <Text style={[styles.timeText, { color: PrimaryColor, fontWeight: '600' }]}>
                {item.time}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.description, { color: colors.text }]}>
            {item.description}
          </Text>
          
          <View style={styles.activityFooter}>
            <View style={styles.locationContainer}>
              <View style={[styles.iconBackground, { backgroundColor: `${colors.icon}15` }]}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.icon}
                />
              </View>
              <Text style={[styles.locationText, { color: colors.text }]}>
                {item.location}, {item.city}
              </Text>
            </View>
            
            <View style={styles.participantsContainer}>
              <View style={[styles.iconBackground, { backgroundColor: `${PrimaryColor}15` }]}>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={PrimaryColor}
                />
              </View>
              <Text style={[styles.participantsText, { color: colors.text, fontWeight: '600' }]}>
                {item.currentParticipants}/{item.maxParticipants}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const selectedDateObj = weekDates.find(d => d.dateString === selectedDate);
  const formattedSelectedDate = selectedDateObj 
    ? `${selectedDateObj.dayName}, ${selectedDateObj.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
    : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced Header with Gradient Background */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: headerScaleAnim }
            ]
          }
        ]}
      >
        <View style={[styles.gradientBackground, { backgroundColor: `${PrimaryColor}15` }]} />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Fit Buddy</Text>
            <Text style={[styles.headerSubtitle, { color: colors.icon }]}>Find your workout buddy</Text>
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.surface }]} 
            activeOpacity={0.7}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="options-outline" size={24} color={PrimaryColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Calendar Week View */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={weekDates}
          renderItem={renderDateCard}
          keyExtractor={(item) => item.dateString}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        />
      </View>

      {/* Selected Date Display */}
      <View style={styles.selectedDateContainer}>
        <Text style={[styles.selectedDateText, { color: colors.text }]}>
          {formattedSelectedDate}
        </Text>
        <Text style={[styles.activitiesCount, { color: colors.icon }]}>
          {todayActivities.length} {todayActivities.length === 1 ? 'activity' : 'activities'}
        </Text>
      </View>

      {/* Activities List */}
      <FlatList
        data={todayActivities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.activitiesContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View 
            style={[
              styles.emptyContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.emptyIconContainer, { backgroundColor: `${PrimaryColor}15` }]}>
              <Ionicons name="calendar-outline" size={48} color={PrimaryColor} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No activities scheduled
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.icon }]}>
              Try selecting a different date or create a new activity to get started
            </Text>
          </Animated.View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Activities</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Sport Type Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Sport Type</Text>
                <View style={styles.filterOptions}>
                  {SPORT_TYPES.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: filters.sportType.includes(sport) 
                            ? PrimaryColor 
                            : colors.background,
                          borderColor: filters.sportType.includes(sport)
                            ? PrimaryColor
                            : colors.border
                        }
                      ]}
                      onPress={() => {
                        if (sport === 'All') {
                          setFilters(prev => ({ ...prev, sportType: ['All'] }));
                        } else {
                          setFilters(prev => {
                            const newSports = prev.sportType.includes('All') 
                              ? [sport]
                              : prev.sportType.includes(sport)
                                ? prev.sportType.filter(s => s !== sport)
                                : [...prev.sportType.filter(s => s !== 'All'), sport];
                            return { ...prev, sportType: newSports.length === 0 ? ['All'] : newSports };
                          });
                        }
                      }}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: filters.sportType.includes(sport) ? 'white' : colors.text }
                      ]}>
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Range Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Time Range</Text>
                <View style={styles.filterOptions}>
                  {TIME_RANGES.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: filters.timeRange === time 
                            ? PrimaryColor 
                            : colors.background,
                          borderColor: filters.timeRange === time
                            ? PrimaryColor
                            : colors.border
                        }
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, timeRange: time }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: filters.timeRange === time ? 'white' : colors.text }
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Location</Text>
                <View style={styles.filterOptions}>
                  {LOCATIONS.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: filters.location === location 
                            ? PrimaryColor 
                            : colors.background,
                          borderColor: filters.location === location
                            ? PrimaryColor
                            : colors.border
                        }
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, location: location }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: filters.location === location ? 'white' : colors.text }
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Participant Range Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Group Size</Text>
                <View style={styles.filterOptions}>
                  {PARTICIPANT_RANGES.map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: filters.participantRange === range 
                            ? PrimaryColor 
                            : colors.background,
                          borderColor: filters.participantRange === range
                            ? PrimaryColor
                            : colors.border
                        }
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, participantRange: range }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: filters.participantRange === range ? 'white' : colors.text }
                      ]}>
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => {
                  setFilters({
                    sportType: ['All'],
                    timeRange: 'Any Time',
                    location: 'Any Location',
                    participantRange: 'Any Size'
                  });
                }}
              >
                <Text style={[styles.clearButtonText, { color: colors.text }]}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: PrimaryColor }]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarContainer: {
    paddingVertical: 15,
  },
  calendarContent: {
    paddingHorizontal: 20,
  },
  dateCard: {
    width: 60,
    height: 80,
    borderRadius: 16,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 8,
  },
  selectedDateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  activitiesCount: {
    fontSize: 14,
  },
  activitiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  activityCard: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userImageContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: 'white',
  },
  activityInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBackground: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
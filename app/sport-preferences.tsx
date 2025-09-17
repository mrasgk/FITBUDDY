import { IconSymbol } from '@/components/ui/icon-symbol';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface Sport {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function SportPreferencesPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const allSports: Sport[] = [
    { id: '1', name: 'Soccer', icon: 'figure.soccer', description: 'The beautiful game' },
    { id: '2', name: 'Basketball', icon: 'figure.basketball', description: 'Fast-paced court action' },
    { id: '3', name: 'Tennis', icon: 'figure.tennis', description: 'Precision and power' },
    { id: '4', name: 'Running', icon: 'figure.running', description: 'Hit the pavement' },
    { id: '5', name: 'Cycling', icon: 'figure.cycling', description: 'Pedal your way to fitness' },
    { id: '6', name: 'Swimming', icon: 'figure.swimming', description: 'Make a splash' },
    { id: '7', name: 'Volleyball', icon: 'figure.volleyball', description: 'Bump, set, spike' },
    { id: '8', name: 'Baseball', icon: 'figure.baseball', description: 'America\'s pastime' },
    { id: '9', name: 'American Football', icon: 'figure.american.football', description: 'Gridiron glory' },
    { id: '10', name: 'Yoga', icon: 'figure.yoga', description: 'Mind, body, soul' },
    { id: '11', name: 'Weight Lifting', icon: 'figure.weightlifting', description: 'Pump iron' },
    { id: '12', name: 'Boxing', icon: 'figure.boxing', description: 'Sweet science' },
    { id: '13', name: 'Golf', icon: 'figure.golf', description: 'Precision on the green' },
    { id: '14', name: 'Hockey', icon: 'figure.hockey', description: 'Ice cold competition' },
    { id: '15', name: 'Skiing', icon: 'figure.skiing', description: 'Hit the slopes' },
    { id: '16', name: 'Surfing', icon: 'figure.surfing', description: 'Ride the waves' },
  ];

  const [selectedSports, setSelectedSports] = useState<string[]>(['1', '2', '4', '10']);
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>({
    '1': 'intermediate',
    '2': 'beginner',
    '4': 'advanced',
    '10': 'intermediate',
  });

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner', color: '#10b981' },
    { value: 'intermediate', label: 'Intermediate', color: '#f59e0b' },
    { value: 'advanced', label: 'Advanced', color: '#ef4444' },
  ];

  const handleSportToggle = (sportId: string) => {
    if (selectedSports.includes(sportId)) {
      setSelectedSports(selectedSports.filter(id => id !== sportId));
      const newSkillLevels = { ...skillLevels };
      delete newSkillLevels[sportId];
      setSkillLevels(newSkillLevels);
    } else {
      setSelectedSports([...selectedSports, sportId]);
      setSkillLevels({ ...skillLevels, [sportId]: 'beginner' });
    }
  };

  const handleSkillLevelChange = (sportId: string, level: string) => {
    setSkillLevels({ ...skillLevels, [sportId]: level });
  };

  const handleSave = () => {
    Alert.alert(
      'Preferences Saved',
      'Your sport preferences have been updated successfully!',
      [{ text: 'OK' }]
    );
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
          Sport Preferences
        </Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={[styles.saveButtonText, { color: PrimaryColor }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={[styles.instructionTitle, { color: colors.text }]}>
            Choose Your Favorite Sports
          </Text>
          <Text style={[styles.instructionText, { color: colors.icon }]}>
            Select the sports you enjoy playing and set your skill level for each one. 
            This helps us match you with the right activities and players.
          </Text>
        </View>

        {/* Selected Sports Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: PrimaryColor }]}>
              {selectedSports.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Sports Selected
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: AccentColor }]}>
              {Object.values(skillLevels).filter(level => level === 'advanced').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Advanced Level
            </Text>
          </View>
        </View>

        {/* Sports Grid */}
        <View style={styles.sportsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Sports
          </Text>
          <View style={styles.sportsGrid}>
            {allSports.map((sport) => {
              const isSelected = selectedSports.includes(sport.id);
              return (
                <View key={sport.id} style={styles.sportContainer}>
                  <TouchableOpacity
                    style={[
                      styles.sportCard,
                      {
                        backgroundColor: isSelected ? PrimaryColor + '20' : colors.surface,
                        borderColor: isSelected ? PrimaryColor : colors.border,
                      }
                    ]}
                    onPress={() => handleSportToggle(sport.id)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={sport.icon as any}
                      size={32}
                      color={isSelected ? PrimaryColor : colors.icon}
                    />
                    <Text style={[
                      styles.sportName,
                      { color: isSelected ? PrimaryColor : colors.text }
                    ]}>
                      {sport.name}
                    </Text>
                    <Text style={[styles.sportDescription, { color: colors.icon }]}>
                      {sport.description}
                    </Text>
                    
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <IconSymbol name="checkmark.circle.fill" size={20} color={PrimaryColor} />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Skill Level Selector */}
                  {isSelected && (
                    <View style={[styles.skillLevelContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Text style={[styles.skillLevelTitle, { color: colors.text }]}>
                        Skill Level:
                      </Text>
                      <View style={styles.skillLevelButtons}>
                        {skillLevelOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.skillButton,
                              {
                                backgroundColor: skillLevels[sport.id] === option.value 
                                  ? option.color 
                                  : 'transparent',
                                borderColor: option.color,
                              }
                            ]}
                            onPress={() => handleSkillLevelChange(sport.id, option.value)}
                            activeOpacity={0.7}
                          >
                            <Text style={[
                              styles.skillButtonText,
                              {
                                color: skillLevels[sport.id] === option.value 
                                  ? 'white' 
                                  : option.color
                              }
                            ]}>
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sportsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sportsGrid: {
    gap: 16,
  },
  sportContainer: {
    marginBottom: 8,
  },
  sportCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sportName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  sportDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  skillLevelContainer: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillLevelTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  skillLevelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  skillButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  skillButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Activity } from '@/service/ActivitiesData';
import { activityService, CreateActivityRequest } from '@/service/ActivityService';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

type FormStep = 'type' | 'details' | 'location' | 'settings' | 'preview';

interface ActivityFormData {
  type: Activity['type'] | null;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  maxParticipants: number;
  isPublic: boolean;
  requiredSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function CreatePage() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];
  
  const [currentStep, setCurrentStep] = useState<FormStep>('type');
  const [formData, setFormData] = useState<ActivityFormData>({
    type: null,
    title: '',
    description: '',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '18:00',
    location: '',
    city: '',
    maxParticipants: 10,
    isPublic: true,
    requiredSkillLevel: 'Beginner',
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [stepProgress] = useState(new Animated.Value(0));
  
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    actions: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }> = []
  ) => {
    setNotification({ visible: true, type, title, message, actions });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const updateFormData = (updates: Partial<ActivityFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleActivityTypeSelect = (activityType: Activity['type']) => {
    updateFormData({ 
      type: activityType,
      title: `${activityType} Game`,
      maxParticipants: activityType === 'Basketball' ? 10 : activityType === 'Tennis' ? 4 : 22
    });
    handleNextStep();
  };

  const getStepIndex = (step: FormStep): number => {
    const steps: FormStep[] = ['type', 'details', 'location', 'settings', 'preview'];
    return steps.indexOf(step);
  };

  const handleNextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    const steps: FormStep[] = ['type', 'details', 'location', 'settings', 'preview'];
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      Animated.timing(stepProgress, {
        toValue: (currentIndex + 1) / (steps.length - 1),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = getStepIndex(currentStep);
    const steps: FormStep[] = ['type', 'details', 'location', 'settings', 'preview'];
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      
      Animated.timing(stepProgress, {
        toValue: (currentIndex - 1) / (steps.length - 1),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'type':
        return formData.type !== null;
      case 'details':
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 'location':
        return formData.location.trim() !== '' && formData.city.trim() !== '';
      case 'settings':
        return formData.maxParticipants > 0;
      default:
        return true;
    }
  };

  const handleCreateActivity = async () => {
    if (!formData.type) {
      showNotification('error', 'Missing Information', 'Please complete all required fields.');
      return;
    }

    setIsCreating(true);
    
    try {
      const activityData: CreateActivityRequest = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        city: formData.city,
        maxParticipants: formData.maxParticipants,
        isPublic: formData.isPublic,
        requiredSkillLevel: formData.requiredSkillLevel,
      };

      const newActivity = await activityService.createActivity(activityData);
      
      showNotification(
        'success',
        'Activity Created!',
        `Your ${formData.type} activity has been created successfully!`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              hideNotification();
              resetForm();
            },
            style: 'default'
          },
          {
            text: 'Done',
            onPress: () => {
              hideNotification();
              router.push('/home');
            },
            style: 'primary'
          }
        ]
      );
    } catch (error) {
      showNotification(
        'error',
        'Creation Failed',
        'Failed to create activity. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => hideNotification(),
            style: 'primary'
          }
        ]
      );
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: null,
      title: '',
      description: '',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '18:00',
      location: '',
      city: '',
      maxParticipants: 10,
      isPublic: true,
      requiredSkillLevel: 'Beginner',
    });
    setCurrentStep('type');
    stepProgress.setValue(0);
  };

  const activityTypes = [
    { id: 'Football', name: 'Football', icon: 'figure.american.football', color: '#8b4513', gradient: ['#8b4513', '#a0522d'] },
    { id: 'Soccer', name: 'Soccer', icon: 'figure.soccer', color: '#059669', gradient: ['#059669', '#10b981'] },
    { id: 'Basketball', name: 'Basketball', icon: 'figure.basketball', color: '#f59e0b', gradient: ['#f59e0b', '#fbbf24'] },
    { id: 'Tennis', name: 'Tennis', icon: 'figure.tennis', color: '#8b5cf6', gradient: ['#8b5cf6', '#a78bfa'] },
    { id: 'Volleyball', name: 'Volleyball', icon: 'figure.volleyball', color: '#ef4444', gradient: ['#ef4444', '#f87171'] },
    { id: 'Running', name: 'Running', icon: 'figure.running', color: '#f97316', gradient: ['#f97316', '#fb923c'] },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Activity Type</Text>
              <Text style={[styles.stepSubtitle, { color: colors.icon }]}>What sport would you like to organize?</Text>
            </View>
            
            <View style={styles.activityGrid}>
              {activityTypes.map((activity, index) => (
                <Animated.View
                  key={activity.id}
                  style={{
                    opacity: 1,
                    transform: [{
                      translateY: 0
                    }]
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.activityCard,
                      { 
                        backgroundColor: formData.type === activity.id 
                          ? activity.color + '15'
                          : colors.surface,
                        borderColor: formData.type === activity.id 
                          ? activity.color
                          : colors.border,
                        borderWidth: formData.type === activity.id ? 2 : 1,
                        shadowColor: formData.type === activity.id ? activity.color : '#000',
                        shadowOpacity: formData.type === activity.id ? 0.3 : 0.1,
                        elevation: formData.type === activity.id ? 8 : 3,
                      }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleActivityTypeSelect(activity.id as Activity['type'])}
                  >
                    <View style={[
                      styles.iconContainer,
                      { 
                        backgroundColor: activity.color + '20',
                        borderColor: activity.color + '30',
                        borderWidth: 1
                      }
                    ]}>
                      <IconSymbol
                        name={activity.icon as any}
                        size={32}
                        color={activity.color}
                      />
                    </View>
                    <Text style={[styles.activityName, { color: colors.text }]}>
                      {activity.name}
                    </Text>
                    {formData.type === activity.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: activity.color }]}>
                        <IconSymbol name="checkmark" size={12} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        );
        
      case 'details':
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Activity Details</Text>
                <Text style={[styles.stepSubtitle, { color: colors.icon }]}>Tell us about your activity</Text>
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Activity Title *</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: colors.surface, 
                      borderColor: formData.title ? PrimaryColor + '50' : colors.border, 
                      color: colors.text 
                    }]}
                    value={formData.title}
                    onChangeText={(text) => updateFormData({ title: text })}
                    placeholder="e.g., Basketball Game at Central Park"
                    placeholderTextColor={colors.icon}
                    maxLength={50}
                  />
                  <Text style={[styles.inputHint, { color: colors.icon }]}>
                    {formData.title.length}/50 characters
                  </Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Description *</Text>
                  <TextInput
                    style={[styles.textArea, { 
                      backgroundColor: colors.surface, 
                      borderColor: formData.description ? PrimaryColor + '50' : colors.border, 
                      color: colors.text 
                    }]}
                    value={formData.description}
                    onChangeText={(text) => updateFormData({ description: text })}
                    placeholder="Describe your activity, skill level, what to bring, etc."
                    placeholderTextColor={colors.icon}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    maxLength={200}
                  />
                  <Text style={[styles.inputHint, { color: colors.icon }]}>
                    {formData.description.length}/200 characters
                  </Text>
                </View>
                
                <View style={styles.dateTimeContainer}>
                  <View style={[styles.formGroup, styles.dateTimeField]}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Date *</Text>
                    <View style={[styles.dateTimeInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <IconSymbol name="calendar" size={20} color={colors.icon} />
                      <TextInput
                        style={[styles.dateTimeText, { color: colors.text }]}
                        value={formData.date}
                        onChangeText={(text) => updateFormData({ date: text })}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.icon}
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.formGroup, styles.dateTimeField]}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Time *</Text>
                    <View style={[styles.dateTimeInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <IconSymbol name="clock" size={20} color={colors.icon} />
                      <TextInput
                        style={[styles.dateTimeText, { color: colors.text }]}
                        value={formData.time}
                        onChangeText={(text) => updateFormData({ time: text })}
                        placeholder="HH:MM"
                        placeholderTextColor={colors.icon}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
        
      case 'location':
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Location</Text>
              <Text style={[styles.stepSubtitle, { color: colors.icon }]}>Where will the activity take place?</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Venue/Address</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={formData.location}
                  onChangeText={(text) => updateFormData({ location: text })}
                  placeholder="e.g., Central Park Basketball Courts"
                  placeholderTextColor={colors.icon}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>City</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={formData.city}
                  onChangeText={(text) => updateFormData({ city: text })}
                  placeholder="e.g., New York"
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
        
      case 'settings':
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Activity Settings</Text>
              <Text style={[styles.stepSubtitle, { color: colors.icon }]}>Configure your activity preferences</Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Max Participants</Text>
                <View style={styles.participantSelector}>
                  {[4, 6, 8, 10, 15, 20, 25].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.participantOption,
                        {
                          backgroundColor: formData.maxParticipants === num ? PrimaryColor : colors.surface,
                          borderColor: formData.maxParticipants === num ? PrimaryColor : colors.border,
                          shadowColor: formData.maxParticipants === num ? PrimaryColor : 'transparent',
                          shadowOpacity: formData.maxParticipants === num ? 0.2 : 0,
                          elevation: formData.maxParticipants === num ? 4 : 0,
                        }
                      ]}
                      onPress={() => updateFormData({ maxParticipants: num })}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.participantText,
                        { color: formData.maxParticipants === num ? 'white' : colors.text }
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Skill Level Required</Text>
                <View style={styles.skillLevelSelector}>
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.skillLevelOption,
                        {
                          backgroundColor: formData.requiredSkillLevel === level ? PrimaryColor : colors.surface,
                          borderColor: formData.requiredSkillLevel === level ? PrimaryColor : colors.border,
                        }
                      ]}
                      onPress={() => updateFormData({ requiredSkillLevel: level })}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.skillLevelText,
                        { color: formData.requiredSkillLevel === level ? 'white' : colors.text }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.toggleInfo}>
                    <View style={styles.toggleHeader}>
                      <IconSymbol 
                        name={formData.isPublic ? "eye" : "eye.slash"} 
                        size={20} 
                        color={formData.isPublic ? PrimaryColor : colors.icon} 
                      />
                      <Text style={[styles.toggleLabel, { color: colors.text }]}>Public Activity</Text>
                    </View>
                    <Text style={[styles.toggleDescription, { color: colors.icon }]}>
                      {formData.isPublic ? 'Anyone can find and join this activity' : 'Only people with the link can join'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      { backgroundColor: formData.isPublic ? PrimaryColor : colors.border }
                    ]}
                    onPress={() => updateFormData({ isPublic: !formData.isPublic })}
                    activeOpacity={0.8}
                  >
                    <Animated.View style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: 'white',
                        transform: [{ translateX: formData.isPublic ? 20 : 2 }]
                      }
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
        
      case 'preview':
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Preview & Confirm</Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>Review your activity details</Text>
            
            <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.previewHeader}>
                <View style={[
                  styles.previewIcon,
                  { backgroundColor: activityTypes.find(t => t.id === formData.type)?.color + '20' }
                ]}>
                  <IconSymbol
                    name={activityTypes.find(t => t.id === formData.type)?.icon as any}
                    size={32}
                    color={activityTypes.find(t => t.id === formData.type)?.color || PrimaryColor}
                  />
                </View>
                <View style={styles.previewInfo}>
                  <Text style={[styles.previewTitle, { color: colors.text }]}>{formData.title}</Text>
                  <Text style={[styles.previewType, { color: colors.icon }]}>{formData.type}</Text>
                </View>
              </View>
              
              <Text style={[styles.previewDescription, { color: colors.text }]}>{formData.description}</Text>
              
              <View style={styles.previewDetails}>
                <View style={styles.previewDetailRow}>
                  <IconSymbol name="calendar" size={16} color={colors.icon} />
                  <Text style={[styles.previewDetailText, { color: colors.text }]}>{formData.date} at {formData.time}</Text>
                </View>
                
                <View style={styles.previewDetailRow}>
                  <IconSymbol name="location" size={16} color={colors.icon} />
                  <Text style={[styles.previewDetailText, { color: colors.text }]}>{formData.location}, {formData.city}</Text>
                </View>
                
                <View style={styles.previewDetailRow}>
                  <IconSymbol name="person.2" size={16} color={colors.icon} />
                  <Text style={[styles.previewDetailText, { color: colors.text }]}>Max {formData.maxParticipants} participants</Text>
                </View>
                
                <View style={styles.previewDetailRow}>
                  <IconSymbol name={formData.isPublic ? "eye" : "eye.slash"} size={16} color={colors.icon} />
                  <Text style={[styles.previewDetailText, { color: colors.text }]}>{formData.isPublic ? 'Public' : 'Private'} activity</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: PrimaryColor }]}
              onPress={handleCreateActivity}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <IconSymbol name="plus.circle.fill" size={24} color="white" />
              )}
              <Text style={styles.createButtonText}>
                {isCreating ? 'Creating Activity...' : 'Create Activity'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => currentStep === 'type' ? router.back() : handlePreviousStep()}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Activity</Text>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>Step {getStepIndex(currentStep) + 1} of 5</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setCurrentStep('preview')}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipButtonText, { color: PrimaryColor }]}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                backgroundColor: PrimaryColor,
                width: stepProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {currentStep !== 'type' && currentStep !== 'preview' && (
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.footerButton, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handlePreviousStep}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.footerButton, 
              styles.primaryButton, 
              { 
                backgroundColor: validateCurrentStep() ? PrimaryColor : colors.border,
                opacity: validateCurrentStep() ? 1 : 0.5 
              }
            ]}
            onPress={handleNextStep}
            disabled={!validateCurrentStep()}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: validateCurrentStep() ? 'white' : colors.icon }]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        actions={notification.actions || []}
        onHide={hideNotification}
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
  },
  dateTimeRow: {
    flexDirection: 'row',
  },
  participantSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  participantOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  participantText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewType: {
    fontSize: 16,
  },
  previewDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  previewDetails: {
    gap: 12,
  },
  previewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewDetailText: {
    fontSize: 16,
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {},
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // New improved styles
  stepHeader: {
    marginBottom: 32,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputHint: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeField: {
    flex: 1,
  },
  dateTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
    fontSize: 16,
  },
  skillLevelSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  skillLevelOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  skillLevelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
});
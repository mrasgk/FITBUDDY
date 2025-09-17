import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

export default function EditProfilePage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Sports enthusiast who loves exploring new activities and meeting like-minded people.',
    location: 'San Francisco, CA',
    birthDate: '1995-03-15',
  });

  const handleSave = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated!',
      [{ text: 'OK' }]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Library selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
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
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
              <View style={[styles.imageOverlay, { backgroundColor: PrimaryColor }]}>
                <IconSymbol name="camera.fill" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.changePhotoText, { color: colors.icon }]}>
            Tap to change photo
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Fields */}
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                value={profileData.firstName}
                onChangeText={(text) => setProfileData({...profileData, firstName: text})}
                placeholder="Enter first name"
                placeholderTextColor={colors.icon}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                value={profileData.lastName}
                onChangeText={(text) => setProfileData({...profileData, lastName: text})}
                placeholder="Enter last name"
                placeholderTextColor={colors.icon}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text 
              }]}
              value={profileData.email}
              onChangeText={(text) => setProfileData({...profileData, email: text})}
              placeholder="Enter email"
              placeholderTextColor={colors.icon}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text 
              }]}
              value={profileData.phone}
              onChangeText={(text) => setProfileData({...profileData, phone: text})}
              placeholder="Enter phone number"
              placeholderTextColor={colors.icon}
              keyboardType="phone-pad"
            />
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text 
              }]}
              value={profileData.location}
              onChangeText={(text) => setProfileData({...profileData, location: text})}
              placeholder="Enter location"
              placeholderTextColor={colors.icon}
            />
          </View>

          {/* Birth Date */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Birth Date</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, { 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }]}
              onPress={() => Alert.alert('Date Picker', 'Date picker would open here')}
            >
              <Text style={[styles.dateText, { color: colors.text }]}>
                {new Date(profileData.birthDate).toLocaleDateString()}
              </Text>
              <IconSymbol name="calendar" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput, { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text 
              }]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData({...profileData, bio: text})}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
  imageSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  changePhotoText: {
    fontSize: 14,
    marginTop: 8,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    paddingTop: 16,
  },
  bottomPadding: {
    height: 100,
  },
});
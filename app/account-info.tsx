import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { authService } from '@/service';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Type definitions for account section items
type EditableItem = {
  id: string;
  type: 'editable';
  content: React.ReactElement;
};

type InfoItem = {
  id: string;
  type: 'info';
  title: string;
  value: string;
  action?: () => void;
  actionText?: string;
  copyable?: boolean;
};

type AccountSectionItem = EditableItem | InfoItem;

export default function AccountInfoPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // User data state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [originalData, setOriginalData] = useState({ firstName: '', lastName: '', email: '' });
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    // Load user data
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
      setOriginalData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
  }, []);

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

  const handleBack = () => {
    if (isEditing) {
      const hasChanges = firstName !== originalData.firstName || 
                        lastName !== originalData.lastName;
      
      if (hasChanges) {
        Alert.alert(
          'Discard Changes?',
          'You have unsaved changes. Are you sure you want to go back?',
          [
            { text: 'Stay', style: 'cancel' },
            { 
              text: 'Discard', 
              style: 'destructive',
              onPress: () => {
                setFirstName(originalData.firstName);
                setLastName(originalData.lastName);
                setIsEditing(false);
                router.back();
              }
            }
          ]
        );
      } else {
        setIsEditing(false);
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showNotification('warning', 'Invalid Input', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update original data
      setOriginalData({ firstName, lastName, email });
      setIsEditing(false);
      
      showNotification('success', 'Profile Updated', 'Your account information has been updated successfully.');
    } catch (error) {
      showNotification('error', 'Update Failed', 'Failed to update your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      showNotification('warning', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showNotification('warning', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowChangeEmailModal(false);
      setNewEmail('');
      
      showNotification(
        'success', 
        'Verification Email Sent', 
        'A verification email has been sent to your new email address. Please check your inbox and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => hideNotification(),
            style: 'primary'
          }
        ]
      );
    } catch (error) {
      showNotification('error', 'Change Failed', 'Failed to change email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const accountSections: Array<{
    title: string;
    items: AccountSectionItem[];
  }> = [
    {
      title: 'Personal Information',
      items: [
        {
          id: 'basic-info',
          type: 'editable',
          content: (
            <View style={styles.editableSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>First Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor={colors.icon}
                  editable={isEditing}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Last Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor={colors.icon}
                  editable={isEditing}
                />
              </View>
            </View>
          )
        }
      ]
    },
    {
      title: 'Account Details',
      items: [
        {
          id: 'email',
          type: 'info',
          title: 'Email Address',
          value: email,
          action: () => setShowChangeEmailModal(true),
          actionText: 'Change'
        },
        {
          id: 'account-id',
          type: 'info',
          title: 'Account ID',
          value: '#FB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          copyable: true
        },
        {
          id: 'member-since',
          type: 'info',
          title: 'Member Since',
          value: 'January 2024'
        },
        {
          id: 'last-login',
          type: 'info',
          title: 'Last Login',
          value: 'Today at 2:30 PM'
        }
      ]
    }
  ];

  const renderInfoItem = (item: InfoItem) => (
    <View key={item.id} style={[styles.infoItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.infoValue, { color: colors.icon }]}>{item.value}</Text>
      </View>
      {item.action && (
        <TouchableOpacity onPress={item.action} style={styles.infoAction}>
          <Text style={[styles.infoActionText, { color: PrimaryColor }]}>{item.actionText}</Text>
        </TouchableOpacity>
      )}
      {item.copyable && (
        <TouchableOpacity 
          onPress={() => showNotification('success', 'Copied', 'Account ID copied to clipboard')}
          style={styles.infoAction}
        >
          <IconSymbol name="doc.on.doc" size={16} color={colors.icon} />
        </TouchableOpacity>
      )}
    </View>
  );

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
          Account Information
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={PrimaryColor} />
          ) : (
            <Text style={[styles.editButtonText, { color: PrimaryColor }]}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {accountSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => {
                if (item.type === 'editable') {
                  const editableItem = item as EditableItem;
                  return (
                    <View key={editableItem.id} style={[styles.editableContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      {editableItem.content}
                    </View>
                  );
                } else {
                  return renderInfoItem(item as InfoItem);
                }
              })}
            </View>
          </View>
        ))}

        {/* Security Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Security Actions
          </Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => showNotification('info', 'Change Password', 'Redirecting to password change page...')}
            >
              <IconSymbol name="key.fill" size={20} color={PrimaryColor} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Change Password</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => showNotification('info', 'Two-Factor Auth', 'Opening two-factor authentication setup...')}
            >
              <IconSymbol name="shield.fill" size={20} color={AccentColor} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Two-Factor Authentication</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Change Email Modal */}
      <Modal
        visible={showChangeEmailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChangeEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Change Email Address</Text>
              <TouchableOpacity
                onPress={() => setShowChangeEmailModal(false)}
                style={styles.modalCloseButton}
              >
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: colors.icon }]}>
              Enter your new email address. You'll need to verify it before the change takes effect.
            </Text>
            
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                }
              ]}
              placeholder="Enter new email address"
              placeholderTextColor={colors.icon}
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowChangeEmailModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: PrimaryColor }]}
                onPress={handleChangeEmail}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Send Verification</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Component */}
      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        actions={notification.actions || []}
        onHide={hideNotification}
      />
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  editableContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  editableSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
  },
  infoAction: {
    marginLeft: 12,
  },
  infoActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: PrimaryColor,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
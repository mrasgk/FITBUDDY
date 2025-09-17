import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { AccentColor, Colors, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface HelpItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'faq' | 'contact' | 'link' | 'action';
  action?: () => void;
  url?: string;
  color?: string;
  expandable?: boolean;
  content?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // State
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ visible: true, type, title, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // FAQ Data
  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a new activity?',
      answer: 'To create a new activity, go to the Create tab and tap the "+" button. Fill in the activity details including sport type, location, date, and time. You can also set participant limits and add a description.',
      category: 'Activities'
    },
    {
      id: '2',
      question: 'How do I join an activity?',
      answer: 'Browse activities in the Explore tab, tap on an activity you\'re interested in, and hit the "Join" button. You\'ll receive a confirmation once the organizer approves your request.',
      category: 'Activities'
    },
    {
      id: '3',
      question: 'Can I cancel my participation in an activity?',
      answer: 'Yes, you can cancel your participation up to 24 hours before the activity starts. Go to your profile, find the activity under "Upcoming Activities," and tap "Cancel Participation."',
      category: 'Activities'
    },
    {
      id: '4',
      question: 'How do I add friends?',
      answer: 'You can add friends by searching for their username in the search bar, scanning their QR code, or importing contacts. Friend requests need to be accepted by the other user.',
      category: 'Social'
    },
    {
      id: '5',
      question: 'How do I change my notification settings?',
      answer: 'Go to Settings > Notification Preferences to customize which notifications you receive. You can control push notifications, email alerts, and set quiet hours.',
      category: 'Settings'
    },
    {
      id: '6',
      question: 'How do I report inappropriate behavior?',
      answer: 'Tap on the user\'s profile and select "Report User." Choose the reason for reporting and provide additional details. Our team reviews all reports within 24 hours.',
      category: 'Safety'
    }
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const helpSections = [
    {
      title: 'Quick Help',
      items: [
        {
          id: 'getting-started',
          title: 'Getting Started Guide',
          description: 'Learn the basics of using FitBuddy',
          icon: 'book.fill',
          type: 'action',
          action: () => showNotification('info', 'Getting Started', 'Opening the beginner\'s guide...'),
          color: PrimaryColor,
        },
        {
          id: 'video-tutorials',
          title: 'Video Tutorials',
          description: 'Watch step-by-step video guides',
          icon: 'play.rectangle.fill',
          type: 'action',
          action: () => showNotification('info', 'Video Tutorials', 'Opening video tutorial library...'),
          color: '#ef4444',
        },
        {
          id: 'community-guidelines',
          title: 'Community Guidelines',
          description: 'Learn about our community rules',
          icon: 'person.3.sequence.fill',
          type: 'action',
          action: () => showNotification('info', 'Community Guidelines', 'Opening community guidelines...'),
          color: '#10b981',
        },
      ] as HelpItem[],
    },
    {
      title: 'Contact Support',
      items: [
        {
          id: 'contact-us',
          title: 'Contact Support',
          description: 'Get help from our support team',
          icon: 'envelope.fill',
          type: 'contact',
          action: () => setShowContactModal(true),
          color: AccentColor,
        },
        {
          id: 'live-chat',
          title: 'Live Chat',
          description: 'Chat with support (Mon-Fri 9AM-6PM)',
          icon: 'bubble.left.and.bubble.right.fill',
          type: 'action',
          action: () => showNotification('info', 'Live Chat', 'Connecting to live chat support...'),
          color: '#10b981',
        },
        {
          id: 'call-support',
          title: 'Phone Support',
          description: '+1 (555) 123-4567',
          icon: 'phone.fill',
          type: 'action',
          action: () => {
            Alert.alert(
              'Call Support',
              'Would you like to call our support team?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL('tel:+15551234567') }
              ]
            );
          },
          color: '#f59e0b',
        },
      ] as HelpItem[],
    },
    {
      title: 'Resources',
      items: [
        {
          id: 'knowledge-base',
          title: 'Knowledge Base',
          description: 'Browse our comprehensive help articles',
          icon: 'doc.text.fill',
          type: 'link',
          url: 'https://fitbuddy.com/help',
          action: () => showNotification('info', 'Knowledge Base', 'Opening knowledge base...'),
          color: '#6b7280',
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          description: 'Learn how we protect your data',
          icon: 'shield.fill',
          type: 'link',
          url: 'https://fitbuddy.com/privacy',
          action: () => showNotification('info', 'Privacy Policy', 'Opening privacy policy...'),
          color: '#8b5cf6',
        },
        {
          id: 'terms-service',
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          icon: 'doc.text.fill',
          type: 'link',
          url: 'https://fitbuddy.com/terms',
          action: () => showNotification('info', 'Terms of Service', 'Opening terms of service...'),
          color: '#374151',
        },
      ] as HelpItem[],
    },
    {
      title: 'Feedback',
      items: [
        {
          id: 'feature-request',
          title: 'Request a Feature',
          description: 'Suggest new features for FitBuddy',
          icon: 'lightbulb.fill',
          type: 'action',
          action: () => showNotification('info', 'Feature Request', 'Opening feature request form...'),
          color: '#f59e0b',
        },
        {
          id: 'bug-report',
          title: 'Report a Bug',
          description: 'Help us fix issues in the app',
          icon: 'ant.fill',
          type: 'action',
          action: () => showNotification('info', 'Bug Report', 'Opening bug report form...'),
          color: '#ef4444',
        },
        {
          id: 'app-review',
          title: 'Rate the App',
          description: 'Leave a review on the App Store',
          icon: 'star.fill',
          type: 'action',
          action: () => showNotification('info', 'App Review', 'Opening app store review...'),
          color: AccentColor,
        },
      ] as HelpItem[],
    },
  ];

  const handleContactSubmit = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      showNotification('warning', 'Missing Information', 'Please fill in all fields before submitting.');
      return;
    }

    setShowContactModal(false);
    setContactSubject('');
    setContactMessage('');
    showNotification('success', 'Message Sent', 'Your support request has been submitted. We\'ll get back to you within 24 hours.');
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderHelpItem = (item: HelpItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.helpItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.helpContent}>
        <View style={[styles.helpIcon, { backgroundColor: (item.color || PrimaryColor) + '20' }]}>
          <IconSymbol name={item.icon as any} size={20} color={item.color || PrimaryColor} />
        </View>
        <View style={styles.helpInfo}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>{item.title}</Text>
          {item.description && (
            <Text style={[styles.helpDescription, { color: colors.icon }]}>{item.description}</Text>
          )}
        </View>
        <IconSymbol name="chevron.right" size={16} color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  const renderFAQItem = (faq: FAQItem) => (
    <TouchableOpacity
      key={faq.id}
      style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => toggleFAQ(faq.id)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
        <IconSymbol 
          name={expandedFAQ === faq.id ? "chevron.up" : "chevron.down"} 
          size={16} 
          color={colors.icon} 
        />
      </View>
      {expandedFAQ === faq.id && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.faqAnswerText, { color: colors.icon }]}>{faq.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search FAQ */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search FAQs..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FAQ Section */}
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Search Results ({filteredFAQs.length})
            </Text>
            <View style={styles.sectionContent}>
              {filteredFAQs.map(renderFAQItem)}
            </View>
          </View>
        )}

        {/* Popular FAQs */}
        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Questions</Text>
            <View style={styles.sectionContent}>
              {faqData.slice(0, 3).map(renderFAQItem)}
            </View>
          </View>
        )}

        {/* Help Sections */}
        {helpSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderHelpItem)}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={[styles.appInfoTitle, { color: colors.text }]}>App Information</Text>
          <View style={[styles.appInfoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.appInfoItem}>
              <Text style={[styles.appInfoLabel, { color: colors.icon }]}>Version</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>1.0.0</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={[styles.appInfoLabel, { color: colors.icon }]}>Build</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>2024.01.15</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={[styles.appInfoLabel, { color: colors.icon }]}>Platform</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>React Native</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Contact Support Modal */}
      <Modal visible={showContactModal} transparent={true} animationType="slide" onRequestClose={() => setShowContactModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Contact Support</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)} style={styles.modalCloseButton}>
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: colors.icon }]}>
              Describe your issue and we'll get back to you as soon as possible.
            </Text>
            
            <TextInput
              style={[styles.contactInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Subject"
              placeholderTextColor={colors.icon}
              value={contactSubject}
              onChangeText={setContactSubject}
            />
            
            <TextInput
              style={[styles.contactTextArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor={colors.icon}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowContactModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: PrimaryColor }]}
                onPress={handleContactSubmit}
              >
                <Text style={styles.submitButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onHide={hideNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  placeholder: { width: 40 },
  content: { flex: 1 },
  searchSection: { paddingHorizontal: 20, paddingVertical: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600', paddingHorizontal: 20, marginBottom: 16 },
  sectionContent: { paddingHorizontal: 20, gap: 8 },
  helpItem: { borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  helpContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  helpIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  helpInfo: { flex: 1 },
  helpTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  helpDescription: { fontSize: 14 },
  faqItem: { borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  faqQuestion: { flex: 1, fontSize: 16, fontWeight: '600' },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16 },
  faqAnswerText: { fontSize: 14, lineHeight: 20 },
  appInfoSection: { paddingHorizontal: 20, marginBottom: 32 },
  appInfoTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  appInfoContainer: { borderRadius: 12, borderWidth: 1, padding: 16 },
  appInfoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  appInfoLabel: { fontSize: 14 },
  appInfoValue: { fontSize: 14, fontWeight: '600' },
  bottomPadding: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContent: { width: '100%', maxWidth: 400, borderRadius: 20, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  modalCloseButton: { padding: 4 },
  modalDescription: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  contactInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
  contactTextArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, height: 120, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1 },
  submitButton: { backgroundColor: PrimaryColor },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
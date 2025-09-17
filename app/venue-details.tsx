import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { Colors, PrimaryColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Venue, venueService } from '@/service/VenueService';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function VenueDetailsPage() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];
  const params = useLocalSearchParams();
  const venueId = params.venueId as string;

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [participants, setParticipants] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{ text: string; onPress: () => void; style?: 'default' | 'destructive' | 'primary' }>;
  }>({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    loadVenueDetails();
  }, [venueId]);

  const loadVenueDetails = async () => {
    try {
      setIsLoading(true);
      const venueData = await venueService.getVenueById(venueId);
      
      if (venueData) {
        setVenue(venueData);
        if (venueData.sports.length > 0) {
          setSelectedSport(venueData.sports[0]);
        }
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        showNotification('error', 'Venue Not Found', 'The venue could not be loaded.', []);
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load venue details. Please try again.', []);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleBookVenue = async () => {
    if (!venue || !bookingDate || !bookingTime || !participants) {
      showNotification('warning', 'Missing Information', 'Please fill in all required fields.', []);
      return;
    }

    try {
      await venueService.bookVenue({
        venueId: venue.id,
        date: bookingDate,
        startTime: bookingTime,
        endTime: calculateEndTime(bookingTime),
        sport: selectedSport,
        participants: parseInt(participants),
        notes: bookingNotes
      });

      setShowBookingModal(false);
      showNotification(
        'success',
        'Booking Confirmed!',
        `Your booking at ${venue.name} has been confirmed for ${bookingDate} at ${bookingTime}.`,
        [
          { text: 'View Bookings', onPress: () => {}, style: 'primary' },
          { text: 'Done', onPress: () => {}, style: 'default' }
        ]
      );

      // Reset form
      setBookingDate('');
      setBookingTime('');
      setParticipants('');
      setBookingNotes('');
    } catch (error) {
      showNotification('error', 'Booking Failed', 'Unable to complete booking. Please try again.', []);
    }
  };

  const handleSubmitReview = async () => {
    if (!venue || !reviewComment.trim()) {
      showNotification('warning', 'Missing Information', 'Please provide a rating and comment.', []);
      return;
    }

    try {
      await venueService.addReview(venue.id, {
        userId: 'current_user',
        userName: 'Current User',
        userAvatar: 'https://picsum.photos/60/60?random=100',
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      });

      // Refresh venue data to show new review
      await loadVenueDetails();
      
      setShowReviewModal(false);
      showNotification('success', 'Review Submitted', 'Thank you for your feedback!', []);
      
      // Reset form
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      showNotification('error', 'Review Failed', 'Unable to submit review. Please try again.', []);
    }
  };

  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + 1; // Default 1 hour booking
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getAvailabilityColor = (availability: string): string => {
    switch (availability) {
      case 'available': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'closed': return '#ef4444';
      default: return colors.icon;
    }
  };

  const renderStarRating = (rating: number, size: number = 16, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress?.(star)}
            disabled={!onPress}
          >
            <IconSymbol
              name={star <= rating ? "star.fill" : "star"}
              size={size}
              color={star <= rating ? "#f59e0b" : colors.icon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Loading venue details...</Text>
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text }]}>Venue not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[{ backgroundColor: PrimaryColor, padding: 12, borderRadius: 8, marginTop: 16 }]}>
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Venue Details</Text>
        <TouchableOpacity>
          <IconSymbol name="heart" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Image Gallery */}
          <View style={styles.imageGallery}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {venue.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.venueImage} />
              ))}
            </ScrollView>
            <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(venue.availability) }]}>
              <Text style={styles.availabilityText}>
                {venue.availability.charAt(0).toUpperCase() + venue.availability.slice(1)}
              </Text>
            </View>
          </View>

          {/* Venue Info */}
          <View style={styles.section}>
            <View style={styles.venueHeader}>
              <View style={styles.venueHeaderLeft}>
                <Text style={[styles.venueName, { color: colors.text }]}>{venue.name}</Text>
                <View style={styles.ratingContainer}>
                  {renderStarRating(venue.rating)}
                  <Text style={[styles.ratingText, { color: colors.icon }]}>
                    {venue.rating} ({venue.reviews.length} reviews)
                  </Text>
                </View>
                <View style={styles.locationContainer}>
                  <IconSymbol name="location.fill" size={16} color={colors.icon} />
                  <Text style={[styles.locationText, { color: colors.icon }]}>{venue.address}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.priceText, { color: PrimaryColor }]}>{venue.price}</Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.text }]}>{venue.description}</Text>
          </View>

          {/* Sports */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sports Available</Text>
            <View style={styles.sportsContainer}>
              {venue.sports.map((sport, index) => (
                <View key={index} style={[styles.sportTag, { backgroundColor: `${PrimaryColor}15`, borderColor: `${PrimaryColor}30` }]}>
                  <Text style={[styles.sportTagText, { color: PrimaryColor }]}>{sport}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {venue.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#10b981" />
                  <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
            <View style={[styles.contactContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.contactItem}>
                <IconSymbol name="phone.fill" size={18} color={PrimaryColor} />
                <Text style={[styles.contactText, { color: colors.text }]}>{venue.contact.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <IconSymbol name="envelope.fill" size={18} color={PrimaryColor} />
                <Text style={[styles.contactText, { color: colors.text }]}>{venue.contact.email}</Text>
              </View>
              {venue.contact.website && (
                <View style={styles.contactItem}>
                  <IconSymbol name="globe" size={18} color={PrimaryColor} />
                  <Text style={[styles.contactText, { color: colors.text }]}>{venue.contact.website}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews ({venue.reviews.length})</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(true)}>
                <Text style={[styles.addReviewText, { color: PrimaryColor }]}>Add Review</Text>
              </TouchableOpacity>
            </View>
            
            {venue.reviews.map((review) => (
              <View key={review.id} style={[styles.reviewItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.userAvatar }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>{review.userName}</Text>
                    <View style={styles.reviewMeta}>
                      {renderStarRating(review.rating, 14)}
                      <Text style={[styles.reviewDate, { color: colors.icon }]}>{review.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: colors.text }]}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => showNotification('info', 'Contact', `Calling ${venue.name}...`, [])}
        >
          <IconSymbol name="phone.fill" size={18} color={PrimaryColor} />
          <Text style={[styles.secondaryButtonText, { color: PrimaryColor }]}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: PrimaryColor }]}
          onPress={() => setShowBookingModal(true)}
        >
          <IconSymbol name="calendar.badge.plus" size={18} color="white" />
          <Text style={styles.primaryButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Book {venue.name}</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Date *</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.icon}
                  value={bookingDate}
                  onChangeText={setBookingDate}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Time *</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.icon}
                  value={bookingTime}
                  onChangeText={setBookingTime}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Sport</Text>
                <View style={styles.sportSelector}>
                  {venue.sports.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      style={[
                        styles.sportOption,
                        {
                          backgroundColor: selectedSport === sport ? PrimaryColor : colors.background,
                          borderColor: selectedSport === sport ? PrimaryColor : colors.border
                        }
                      ]}
                      onPress={() => setSelectedSport(sport)}
                    >
                      <Text style={[
                        styles.sportOptionText,
                        { color: selectedSport === sport ? 'white' : colors.text }
                      ]}>
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Participants *</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Number of participants"
                  placeholderTextColor={colors.icon}
                  value={participants}
                  onChangeText={setParticipants}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Additional notes..."
                  placeholderTextColor={colors.icon}
                  value={bookingNotes}
                  onChangeText={setBookingNotes}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: PrimaryColor }]}
                onPress={handleBookVenue}
              >
                <Text style={styles.confirmButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={showReviewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <IconSymbol name="xmark" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Rating</Text>
              {renderStarRating(reviewRating, 24, setReviewRating)}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Comment</Text>
              <TextInput
                style={[styles.formInput, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Share your experience..."
                placeholderTextColor={colors.icon}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: PrimaryColor }]}
                onPress={handleSubmitReview}
              >
                <Text style={styles.confirmButtonText}>Submit</Text>
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
        actions={notification.actions || []}
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
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  imageGallery: { position: 'relative' },
  venueImage: { width: width, height: 250 },
  availabilityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityText: { color: 'white', fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  venueHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  venueHeaderLeft: { flex: 1 },
  venueName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  starContainer: { flexDirection: 'row', marginRight: 8 },
  ratingText: { fontSize: 14 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 14, marginLeft: 4 },
  priceContainer: { alignItems: 'flex-end' },
  priceText: { fontSize: 20, fontWeight: 'bold' },
  description: { fontSize: 16, lineHeight: 24 },
  sportsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  sportTagText: { fontSize: 14, fontWeight: '500' },
  amenitiesContainer: { gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amenityText: { fontSize: 16 },
  contactContainer: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactText: { fontSize: 16 },
  addReviewText: { fontSize: 14, fontWeight: '600' },
  reviewItem: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', marginBottom: 12 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewerInfo: { flex: 1 },
  reviewerName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewDate: { fontSize: 12 },
  reviewComment: { fontSize: 14, lineHeight: 20 },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: { backgroundColor: PrimaryColor },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1 },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  formInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  sportSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  sportOptionText: { fontSize: 14, fontWeight: '500' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1 },
  confirmButton: { backgroundColor: PrimaryColor },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
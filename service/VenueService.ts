import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Venue {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  images: string[];
  sports: string[];
  price: string;
  availability: 'available' | 'busy' | 'closed';
  description: string;
  amenities: string[];
  openHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  reviews: VenueReview[];
  bookings: VenueBooking[];
  capacity: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface VenueReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface VenueBooking {
  id: string;
  userId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  sport: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
}

export interface BookingRequest {
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  sport: string;
  participants: number;
  notes?: string;
}

class VenueService {
  private static instance: VenueService;
  private readonly VENUES_STORAGE_KEY = '@FitBuddy:Venues';
  private readonly BOOKINGS_STORAGE_KEY = '@FitBuddy:VenueBookings';
  private venues: Map<string, Venue> = new Map();
  private bookings: Map<string, VenueBooking> = new Map();

  private constructor() {
    this.loadData();
  }

  public static getInstance(): VenueService {
    if (!VenueService.instance) {
      VenueService.instance = new VenueService();
    }
    return VenueService.instance;
  }

  private async loadData(): Promise<void> {
    try {
      const [venuesData, bookingsData] = await Promise.all([
        AsyncStorage.getItem(this.VENUES_STORAGE_KEY),
        AsyncStorage.getItem(this.BOOKINGS_STORAGE_KEY)
      ]);

      if (venuesData) {
        const venues = JSON.parse(venuesData);
        this.venues = new Map(Object.entries(venues));
      } else {
        this.initializeMockVenues();
      }

      if (bookingsData) {
        const bookings = JSON.parse(bookingsData);
        this.bookings = new Map(Object.entries(bookings));
      }
    } catch (error) {
      console.error('Error loading venue data:', error);
      this.initializeMockVenues();
    }
  }

  private async saveVenues(): Promise<void> {
    try {
      const venuesData = Object.fromEntries(this.venues);
      await AsyncStorage.setItem(this.VENUES_STORAGE_KEY, JSON.stringify(venuesData));
    } catch (error) {
      console.error('Error saving venues:', error);
      throw error;
    }
  }

  private async saveBookings(): Promise<void> {
    try {
      const bookingsData = Object.fromEntries(this.bookings);
      await AsyncStorage.setItem(this.BOOKINGS_STORAGE_KEY, JSON.stringify(bookingsData));
    } catch (error) {
      console.error('Error saving bookings:', error);
      throw error;
    }
  }

  private initializeMockVenues(): void {
    const mockVenues: Venue[] = [
      {
        id: '1',
        name: 'Central Sports Complex',
        address: '123 Main St, Downtown',
        distance: '0.5 km',
        rating: 4.8,
        image: 'https://picsum.photos/300/200?random=1',
        images: [
          'https://picsum.photos/400/300?random=1',
          'https://picsum.photos/400/300?random=11',
          'https://picsum.photos/400/300?random=12',
        ],
        sports: ['Basketball', 'Tennis', 'Swimming'],
        price: '$25/hour',
        availability: 'available',
        description: 'Premier sports facility with state-of-the-art equipment and professional courts. Perfect for both casual games and competitive matches.',
        amenities: ['Parking', 'Lockers', 'Showers', 'Equipment Rental', 'Cafeteria', 'First Aid'],
        openHours: {
          Monday: { open: '06:00', close: '22:00' },
          Tuesday: { open: '06:00', close: '22:00' },
          Wednesday: { open: '06:00', close: '22:00' },
          Thursday: { open: '06:00', close: '22:00' },
          Friday: { open: '06:00', close: '23:00' },
          Saturday: { open: '07:00', close: '23:00' },
          Sunday: { open: '08:00', close: '21:00' },
        },
        contact: {
          phone: '+1 (555) 123-4567',
          email: 'info@centralsports.com',
          website: 'www.centralsports.com'
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        reviews: [
          {
            id: 'rev1',
            userId: '1',
            userName: 'Alex Johnson',
            userAvatar: 'https://picsum.photos/60/60?random=7',
            rating: 5,
            comment: 'Amazing facilities! The courts are well-maintained and staff is very helpful.',
            date: '2024-01-10',
            helpful: 12
          },
          {
            id: 'rev2',
            userId: '2',
            userName: 'Sarah Chen',
            userAvatar: 'https://picsum.photos/60/60?random=8',
            rating: 4,
            comment: 'Great place for basketball. Gets a bit crowded during peak hours.',
            date: '2024-01-08',
            helpful: 8
          }
        ],
        bookings: [],
        capacity: 50,
        priceRange: {
          min: 20,
          max: 35,
          currency: 'USD'
        }
      },
      {
        id: '2',
        name: 'Riverside Football Club',
        address: '456 River Rd, Westside',
        distance: '1.2 km',
        rating: 4.6,
        image: 'https://picsum.photos/300/200?random=2',
        images: [
          'https://picsum.photos/400/300?random=2',
          'https://picsum.photos/400/300?random=21',
          'https://picsum.photos/400/300?random=22',
        ],
        sports: ['Football', 'Soccer'],
        price: '$30/hour',
        availability: 'busy',
        description: 'Professional-grade football and soccer fields with natural grass and modern facilities.',
        amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Spectator Seating'],
        openHours: {
          Monday: { open: '09:00', close: '21:00' },
          Tuesday: { open: '09:00', close: '21:00' },
          Wednesday: { open: '09:00', close: '21:00' },
          Thursday: { open: '09:00', close: '21:00' },
          Friday: { open: '09:00', close: '22:00' },
          Saturday: { open: '08:00', close: '22:00' },
          Sunday: { open: '08:00', close: '20:00' },
        },
        contact: {
          phone: '+1 (555) 234-5678',
          email: 'bookings@riversidefc.com'
        },
        location: {
          latitude: 37.7849,
          longitude: -122.4094
        },
        reviews: [
          {
            id: 'rev3',
            userId: '3',
            userName: 'Mike Rodriguez',
            userAvatar: 'https://picsum.photos/60/60?random=9',
            rating: 5,
            comment: 'Perfect fields for competitive matches. Great atmosphere!',
            date: '2024-01-12',
            helpful: 15
          }
        ],
        bookings: [],
        capacity: 22,
        priceRange: {
          min: 25,
          max: 40,
          currency: 'USD'
        }
      },
      {
        id: '3',
        name: 'Elite Fitness Center',
        address: '789 Fitness Ave, Uptown',
        distance: '2.1 km',
        rating: 4.9,
        image: 'https://picsum.photos/300/200?random=3',
        images: [
          'https://picsum.photos/400/300?random=3',
          'https://picsum.photos/400/300?random=31',
          'https://picsum.photos/400/300?random=32',
        ],
        sports: ['Gym', 'Yoga', 'Boxing'],
        price: '$20/hour',
        availability: 'available',
        description: 'Modern fitness center with top-of-the-line equipment, group classes, and personal training.',
        amenities: ['Modern Equipment', 'Group Classes', 'Personal Training', 'Sauna', 'Juice Bar'],
        openHours: {
          Monday: { open: '05:00', close: '23:00' },
          Tuesday: { open: '05:00', close: '23:00' },
          Wednesday: { open: '05:00', close: '23:00' },
          Thursday: { open: '05:00', close: '23:00' },
          Friday: { open: '05:00', close: '23:00' },
          Saturday: { open: '06:00', close: '22:00' },
          Sunday: { open: '07:00', close: '21:00' },
        },
        contact: {
          phone: '+1 (555) 345-6789',
          email: 'hello@elitefitness.com',
          website: 'www.elitefitness.com'
        },
        location: {
          latitude: 37.7649,
          longitude: -122.4294
        },
        reviews: [
          {
            id: 'rev4',
            userId: '2',
            userName: 'Sarah Chen',
            userAvatar: 'https://picsum.photos/60/60?random=8',
            rating: 5,
            comment: 'Love the yoga classes here! Instructors are amazing.',
            date: '2024-01-14',
            helpful: 20
          }
        ],
        bookings: [],
        capacity: 100,
        priceRange: {
          min: 15,
          max: 25,
          currency: 'USD'
        }
      }
    ];

    mockVenues.forEach(venue => {
      this.venues.set(venue.id, venue);
    });
  }

  // Get all venues
  public async getVenues(): Promise<Venue[]> {
    await this.loadData();
    return Array.from(this.venues.values());
  }

  // Get venue by ID
  public async getVenueById(venueId: string): Promise<Venue | null> {
    await this.loadData();
    return this.venues.get(venueId) || null;
  }

  // Search venues
  public async searchVenues(query: string): Promise<Venue[]> {
    await this.loadData();
    const venues = Array.from(this.venues.values());
    
    return venues.filter(venue =>
      venue.name.toLowerCase().includes(query.toLowerCase()) ||
      venue.sports.some(sport => sport.toLowerCase().includes(query.toLowerCase())) ||
      venue.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get venues by sport
  public async getVenuesBySport(sport: string): Promise<Venue[]> {
    await this.loadData();
    const venues = Array.from(this.venues.values());
    
    return venues.filter(venue =>
      venue.sports.some(venueSport => 
        venueSport.toLowerCase().includes(sport.toLowerCase())
      )
    );
  }

  // Book a venue
  public async bookVenue(request: BookingRequest): Promise<VenueBooking> {
    try {
      const venue = await this.getVenueById(request.venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      const booking: VenueBooking = {
        id: `booking_${Date.now()}`,
        userId: 'current_user', // This would come from auth context
        venueId: request.venueId,
        date: request.date,
        startTime: request.startTime,
        endTime: request.endTime,
        sport: request.sport,
        participants: request.participants,
        status: 'pending',
        totalPrice: this.calculatePrice(venue, request.startTime, request.endTime),
        notes: request.notes
      };

      this.bookings.set(booking.id, booking);
      await this.saveBookings();

      return booking;
    } catch (error) {
      console.error('Error booking venue:', error);
      throw error;
    }
  }

  // Get user bookings
  public async getUserBookings(userId: string): Promise<VenueBooking[]> {
    await this.loadData();
    const bookings = Array.from(this.bookings.values());
    return bookings.filter(booking => booking.userId === userId);
  }

  // Cancel booking
  public async cancelBooking(bookingId: string): Promise<void> {
    try {
      const booking = this.bookings.get(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.status = 'cancelled';
      await this.saveBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Add review
  public async addReview(venueId: string, review: Omit<VenueReview, 'id'>): Promise<void> {
    try {
      const venue = this.venues.get(venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      const newReview: VenueReview = {
        ...review,
        id: `review_${Date.now()}`
      };

      venue.reviews.push(newReview);
      
      // Recalculate venue rating
      const totalRating = venue.reviews.reduce((sum, r) => sum + r.rating, 0);
      venue.rating = Number((totalRating / venue.reviews.length).toFixed(1));

      await this.saveVenues();
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Get venue availability
  public async getVenueAvailability(venueId: string, date: string): Promise<string[]> {
    try {
      const venue = await this.getVenueById(venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      // Mock implementation - return available time slots
      const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ];

      // Filter out booked slots (this would be more complex in a real implementation)
      return timeSlots;
    } catch (error) {
      console.error('Error getting venue availability:', error);
      throw error;
    }
  }

  // Calculate booking price
  private calculatePrice(venue: Venue, startTime: string, endTime: string): number {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Use average of price range
    const hourlyRate = (venue.priceRange.min + venue.priceRange.max) / 2;
    return Math.round(hours * hourlyRate);
  }

  // Get nearby venues
  public async getNearbyVenues(limit: number = 10): Promise<Venue[]> {
    await this.loadData();
    const venues = Array.from(this.venues.values());
    
    // Sort by distance (mock sorting)
    return venues
      .sort((a, b) => {
        const distanceA = parseFloat(a.distance.split(' ')[0] || '0');
        const distanceB = parseFloat(b.distance.split(' ')[0] || '0');
        return distanceA - distanceB;
      })
      .slice(0, limit);
  }
}

// Export singleton instance
export const venueService = VenueService.getInstance();
export default VenueService;
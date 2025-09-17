export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

class CityService {
  private cities: City[] = [
    {
      id: '1',
      name: 'Casablanca',
      country: 'Morocco',
      coordinates: { lat: 33.59, lng: -7.61 }
    },
    {
      id: '2',
      name: 'Rabat',
      country: 'Morocco',
      coordinates: { lat: 34.02, lng: -6.83 }
    },
    {
      id: '3',
      name: 'Marrakesh',
      country: 'Morocco',
      coordinates: { lat: 31.63, lng: -8.0 }
    },
    {
      id: '4',
      name: 'Fès',
      country: 'Morocco',
      coordinates: { lat: 34.03, lng: -5.0 }
    },
    {
      id: '5',
      name: 'Tangier',
      country: 'Morocco',
      coordinates: { lat: 35.77, lng: -5.8 }
    },
    {
      id: '6',
      name: 'Agadir',
      country: 'Morocco',
      coordinates: { lat: 30.42, lng: -9.6 }
    },
    {
      id: '7',
      name: 'Meknès',
      country: 'Morocco',
      coordinates: { lat: 33.89, lng: -5.55 }
    },
    {
      id: '8',
      name: 'Oujda',
      country: 'Morocco',
      coordinates: { lat: 34.68, lng: -1.91 }
    },
    {
      id: '9',
      name: 'Kenitra',
      country: 'Morocco',
      coordinates: { lat: 34.26, lng: -6.58 }
    },
    {
      id: '10',
      name: 'Tétouan',
      country: 'Morocco',
      coordinates: { lat: 35.58, lng: -5.37 }
    },
    {
      id: '11',
      name: 'Safi',
      country: 'Morocco',
      coordinates: { lat: 32.3, lng: -9.24 }
    },
    {
      id: '12',
      name: 'Khouribga',
      country: 'Morocco',
      coordinates: { lat: 32.88, lng: -6.91 }
    },
    {
      id: '13',
      name: 'Beni Mellal',
      country: 'Morocco',
      coordinates: { lat: 32.34, lng: -6.35 }
    },
    {
      id: '14',
      name: 'El Jadida',
      country: 'Morocco',
      coordinates: { lat: 33.26, lng: -8.51 }
    },
    {
      id: '15',
      name: 'Taza',
      country: 'Morocco',
      coordinates: { lat: 34.21, lng: -4.01 }
    },
    {
      id: '16',
      name: 'Essaouira',
      country: 'Morocco',
      coordinates: { lat: 31.51, lng: -9.77 }
    },
    {
      id: '17',
      name: 'Ksar El Kebir',
      country: 'Morocco',
      coordinates: { lat: 35.0, lng: -5.9 }
    },
    {
      id: '18',
      name: 'Chefchaouen',
      country: 'Morocco',
      coordinates: { lat: 35.17, lng: -5.28 }
    },
    {
      id: '19',
      name: 'Berrechid',
      country: 'Morocco',
      coordinates: { lat: 33.27, lng: -7.59 }
    },
    {
      id: '20',
      name: 'Temara',
      country: 'Morocco',
      coordinates: { lat: 33.93, lng: -6.91 }
    },
    {
      id: '21',
      name: 'Mohammedia',
      country: 'Morocco',
      coordinates: { lat: 33.69, lng: -7.38 }
    },
    {
      id: '22',
      name: 'Settat',
      country: 'Morocco',
      coordinates: { lat: 33.0, lng: -7.62 }
    },
    {
      id: '23',
      name: 'Berkane',
      country: 'Morocco',
      coordinates: { lat: 34.92, lng: -2.32 }
    },
    {
      id: '24',
      name: 'Taourirt',
      country: 'Morocco',
      coordinates: { lat: 34.41, lng: -2.9 }
    },
    {
      id: '25',
      name: 'Guelmim',
      country: 'Morocco',
      coordinates: { lat: 28.99, lng: -10.06 }
    },
    {
      id: '26',
      name: 'Ouarzazat',
      country: 'Morocco',
      coordinates: { lat: 30.92, lng: -6.89 }
    },
    {
      id: '27',
      name: 'Errachidia',
      country: 'Morocco',
      coordinates: { lat: 31.93, lng: -4.43 }
    },
    {
      id: '28',
      name: 'Al Hoceïma',
      country: 'Morocco',
      coordinates: { lat: 35.25, lng: -3.94 }
    },
    {
      id: '29',
      name: 'Nador',
      country: 'Morocco',
      coordinates: { lat: 35.17, lng: -2.93 }
    },
    {
      id: '30',
      name: 'Larache',
      country: 'Morocco',
      coordinates: { lat: 35.19, lng: -6.16 }
    },
    {
      id: '31',
      name: 'Khemisset',
      country: 'Morocco',
      coordinates: { lat: 33.82, lng: -6.07 }
    },
    {
      id: '32',
      name: 'Tiflet',
      country: 'Morocco',
      coordinates: { lat: 33.89, lng: -6.31 }
    },
    {
      id: '33',
      name: 'Taroudant',
      country: 'Morocco',
      coordinates: { lat: 30.47, lng: -8.88 }
    },
    {
      id: '34',
      name: 'Tan-Tan',
      country: 'Morocco',
      coordinates: { lat: 28.44, lng: -11.1 }
    },
    {
      id: '35',
      name: 'Sidi Slimane',
      country: 'Morocco',
      coordinates: { lat: 34.26, lng: -5.93 }
    },
    {
      id: '36',
      name: 'Sidi Qacem',
      country: 'Morocco',
      coordinates: { lat: 34.22, lng: -5.71 }
    },
    {
      id: '37',
      name: 'Sefrou',
      country: 'Morocco',
      coordinates: { lat: 33.83, lng: -4.83 }
    },
    {
      id: '38',
      name: 'Sale',
      country: 'Morocco',
      coordinates: { lat: 34.05, lng: -6.8 }
    },
    {
      id: '39',
      name: 'Ouezzane',
      country: 'Morocco',
      coordinates: { lat: 34.8, lng: -5.58 }
    },
    {
      id: '40',
      name: 'Oued Zem',
      country: 'Morocco',
      coordinates: { lat: 32.86, lng: -6.57 }
    },
    {
      id: '41',
      name: 'Oulad Teïma',
      country: 'Morocco',
      coordinates: { lat: 30.39, lng: -9.21 }
    },
    {
      id: '42',
      name: 'Tiznit',
      country: 'Morocco',
      coordinates: { lat: 29.7, lng: -9.73 }
    },
    {
      id: '43',
      name: 'Tinghir',
      country: 'Morocco',
      coordinates: { lat: 31.52, lng: -5.53 }
    },
    {
      id: '44',
      name: 'Youssoufia',
      country: 'Morocco',
      coordinates: { lat: 32.25, lng: -8.53 }
    },
    {
      id: '45',
      name: 'Guercif',
      country: 'Morocco',
      coordinates: { lat: 34.23, lng: -3.35 }
    },
    {
      id: '46',
      name: 'Tirhanimîne',
      country: 'Morocco',
      coordinates: { lat: 35.24, lng: -3.95 }
    },
    {
      id: '47',
      name: 'Laayoune',
      country: 'Morocco',
      coordinates: { lat: 27.13, lng: -13.16 }
    },
    {
      id: '48',
      name: 'Khenifra',
      country: 'Morocco',
      coordinates: { lat: 32.93, lng: -5.66 }
    },
    {
      id: '49',
      name: 'Al Fqih Ben Çalah',
      country: 'Morocco',
      coordinates: { lat: 32.5, lng: -6.69 }
    }
  ];

  /**
   * Get all available cities
   */
  async getCities(): Promise<City[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.cities];
  }

  /**
   * Search cities by name
   */
  async searchCities(query: string): Promise<City[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!query.trim()) {
      return this.cities;
    }

    const lowercaseQuery = query.toLowerCase();
    return this.cities.filter(city => 
      city.name.toLowerCase().includes(lowercaseQuery) ||
      city.state?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get city by ID
   */
  async getCityById(id: string): Promise<City | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.cities.find(city => city.id === id) || null;
  }

  /**
   * Get cities by country
   */
  async getCitiesByCountry(country: string): Promise<City[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.cities.filter(city => 
      city.country.toLowerCase() === country.toLowerCase()
    );
  }

  /**
   * Get popular cities (top 5)
   */
  async getPopularCities(): Promise<City[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return the most populated cities in Morocco
    const popularCityNames = ['Casablanca', 'Rabat', 'Marrakesh', 'Fès', 'Tangier'];
    return this.cities.filter(city => popularCityNames.includes(city.name));
  }

  /**
   * Add new city (for admin use)
   */
  async addCity(cityData: Omit<City, 'id'>): Promise<City> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newCity: City = {
      id: (this.cities.length + 1).toString(),
      ...cityData
    };

    this.cities.push(newCity);
    return newCity;
  }
}

// Export singleton instance
export const cityService = new CityService();
export default cityService;
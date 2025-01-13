// API endpoints configuration
const API_BASE_URL = 'http://localhost:5000/api';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  score: number;
  ratings: {
    overall: number;
    quality: number | null;
    safety: number | null;
  };
}

export const api = {
  async searchHospitals(location: string, healthIssue: string): Promise<Hospital[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hospitals/search?location=${encodeURIComponent(location)}&healthIssue=${encodeURIComponent(healthIssue)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  },

  async searchHealthConditions(query: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conditions/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch health conditions');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching health conditions:', error);
      throw error;
    }
  },

  async getLocations(query: string, field: string = 'City'): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/locations/search?query=${encodeURIComponent(query)}&field=${encodeURIComponent(field)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },
};
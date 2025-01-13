// API endpoints configuration
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async searchHospitals(location: string, healthIssue: string) {
    const response = await fetch(
      `${API_BASE_URL}/hospitals/search?location=${encodeURIComponent(location)}&healthIssue=${encodeURIComponent(healthIssue)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch hospitals');
    }

    return response.json();
  },

  // New function to search health conditions
  async searchHealthConditions(query: string) {
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

  // Other API functions like getLocations, registerPatient, etc. remain unchanged.
  async getLocations(query: string, field: string = 'City') {
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

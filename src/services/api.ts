import { Hospital, GroupedHospitals } from '@/types';
export type { Hospital };

// Determine the API base URL based on the environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PatientRegistration {
  name: string;
  email: string;
  healthIssue: string;
  location: string;
}

export const registerPatient = async (data: PatientRegistration): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/patients/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to register patient');
  }
}

export const api = {
  async searchHospitals(location: string, healthIssue: string): Promise<GroupedHospitals> {
    const response = await fetch(
      `${API_BASE_URL}/hospitals/search?location=${encodeURIComponent(location)}&healthIssue=${encodeURIComponent(healthIssue)}`
    );
    if (!response.ok) throw new Error('Failed to fetch hospitals');
    return response.json();
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

// Export the searchHospitals function directly
export const searchHospitals = async (
  location: string, 
  healthIssue: string, 
  page: number = 1, 
  perPage: number = 9
): Promise<{ hospitals: GroupedHospitals; metadata: { totalPages: number } }> => {
  const response = await fetch(
    `${API_BASE_URL}/hospitals/search?location=${encodeURIComponent(location)}&healthIssue=${encodeURIComponent(healthIssue)}&page=${page}&per_page=${perPage}`
  );
  if (!response.ok) throw new Error('Failed to fetch hospitals');
  return response.json();
};

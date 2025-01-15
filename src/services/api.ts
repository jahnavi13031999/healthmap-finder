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

export const searchHospitals = async (
  location: string, 
  healthIssue: string
): Promise<{ hospitals: Hospital[]; metadata: any }> => {
  console.log('API Call:', { location, healthIssue }); // Debug log

  const params = new URLSearchParams({
    location: location,
    healthIssue: healthIssue,
    page: '1',
    per_page: '50'
  });

  const url = `${API_BASE_URL}/hospitals/search?${params}`;
  console.log('Request URL:', url); // Debug log

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText); // Debug log
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API Call Error:', error); // Debug log
    throw error;
  }
};

export const api = {
  async searchHealthConditions(query: string): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/conditions/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to fetch health conditions');
    return response.json();
  },

  async getLocations(query: string, field: string = 'City'): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/locations/search?query=${encodeURIComponent(query)}&field=${encodeURIComponent(field)}`
    );
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
  }
};

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
  healthIssue: string, 
  page: number = 1, 
  perPage: number = 9
): Promise<{ hospitals: Hospital[]; metadata: { totalPages: number } }> => {
  const params = new URLSearchParams({
    location: encodeURIComponent(location),
    healthIssue: encodeURIComponent(healthIssue),
    page: page.toString(),
    per_page: perPage.toString()
  });

  const response = await fetch(`${API_BASE_URL}/hospitals/search?${params}`);
  if (!response.ok) throw new Error('Failed to fetch hospitals');
  return response.json();
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

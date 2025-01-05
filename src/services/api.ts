// API endpoints configuration
const API_BASE_URL = 'http://localhost:5000/api';

export interface Hospital {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  distance: string;
  address: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  healthIssue: string;
  location: string;
}

// Hospital-related API calls
export const searchHospitals = async (location: string, healthIssue: string): Promise<Hospital[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, healthIssue }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error searching hospitals:', error);
    return [];
  }
};

// Patient-related API calls
export const registerPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  return await response.json();
};
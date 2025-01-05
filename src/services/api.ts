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

// Mock data for development
const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'General Hospital',
    rating: 4.5,
    specialty: 'General Medicine',
    distance: '2.5 miles',
    address: '123 Healthcare Ave, Medical District'
  },
  {
    id: '2',
    name: 'City Medical Center',
    rating: 4.8,
    specialty: 'Emergency Care',
    distance: '3.1 miles',
    address: '456 Wellness Blvd, Downtown'
  },
  {
    id: '3',
    name: 'Community Health Hospital',
    rating: 4.2,
    specialty: 'Family Medicine',
    distance: '1.8 miles',
    address: '789 Care Street, Uptown'
  }
];

// Hospital-related API calls
export const searchHospitals = async (location: string, healthIssue: string): Promise<Hospital[]> => {
  // Return mock data for now
  console.log('Searching hospitals for:', { location, healthIssue });
  return Promise.resolve(mockHospitals);
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
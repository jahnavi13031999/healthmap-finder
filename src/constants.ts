export const HEALTH_CONDITIONS = [
  { value: 'cardiology', label: 'Heart & Cardiovascular Issues' },
  { value: 'orthopedics', label: 'Bone & Joint Problems' },
  { value: 'neurology', label: 'Neurological Conditions' },
  { value: 'pediatrics', label: 'Children\'s Health' },
  { value: 'emergency', label: 'Emergency Care' },
  { value: 'general', label: 'General Medical Care' }
];

export interface LocationDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude?: number;
  longitude?: number;
}

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  // ... Add all states
  { value: 'WY', label: 'Wyoming' }
];

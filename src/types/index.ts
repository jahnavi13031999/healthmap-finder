export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  score: number;
  distance?: number;
  performanceLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Unknown';
  comparedToNational: string;
  locationRelevance: 'city' | 'state' | 'other';
  measureScores?: {
    mortality: number;
    safety: number;
    readmission: number;
  };
  ratings: {
    mortalityRisk: number;
    overall: number;
    quality: number;
    safety: number;
  };
}

export interface FilterState {
  location: string;
  performance: string;
  sortBy: string;
  onlyWithData: boolean;
  maxDistance: number;
}

export interface GroupedHospitals {
  cityHospitals: Hospital[];
  stateHospitals: Hospital[];
  otherHospitals: Hospital[];
}
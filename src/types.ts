interface Ratings {
  overall: number | null;
  quality: number | null;
  safety: number | null;
  measure?: number;
  measureName?: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    score: number;
    hasData: boolean;
    locationRelevance: 'city' | 'state' | 'other';
    ratings: Ratings;
    performanceLevel: string;
    description: string;
    statistics: {
      denominator: string;
      lowerEstimate: string;
      higherEstimate: string;
      measureName: string;
    };
  }

export interface GroupedHospitals {
  cityHospitals: Hospital[];
  stateHospitals: Hospital[];
  otherHospitals: Hospital[];
}
export interface Location {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  displayString: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  performanceLevel: string;
  ratings: {
    overall: number;
    measure?: number;
    measureName?: string;
  };
  statistics?: {
    denominator: number;
    lowerEstimate: number;
    higherEstimate: number;
  };
  hasData: boolean;
  score: number;
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
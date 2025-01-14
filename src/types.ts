export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    score: number;
    hasData: boolean;
    performanceLevel: string;
    description: string;
    ratings: {
      overall: number | null;
      measure: number | null;
      measureName: string | null;
    };
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
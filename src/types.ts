export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    score: number;
    performanceLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Unknown';
    description: string;
    distance: number | null;
    specialties: string[];
    ratings: {
      overall: number | null;
      quality: number | null;
      safety: number | null;
    };
    statistics: {
      nationalComparison: string;
      denominator: string;
      lowerEstimate: string;
      higherEstimate: string;
      measurementPeriod: {
        start: string;
        end: string;
      };
    };
  }
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
    ratings?: {
      overall: number | null;
      quality: number | null;
      safety: number | null;
    };
    statistics?: {
      denominator: string;
      lowerEstimate: string;
      higherEstimate: string;
      measureName: string;
    };
  }
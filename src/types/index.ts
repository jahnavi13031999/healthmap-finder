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
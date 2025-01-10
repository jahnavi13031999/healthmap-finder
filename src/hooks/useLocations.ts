import { useState } from 'react';

interface Location {
  id: string;
  city: string;
  state: string;
  county: string;
  displayString: string;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      const response = await new Promise<Location[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              city: 'New York',
              state: 'NY',
              county: 'New York',
              displayString: 'New York, NY'
            },
            {
              id: '2',
              city: 'Los Angeles',
              state: 'CA',
              county: 'Los Angeles',
              displayString: 'Los Angeles, CA'
            }
          ]);
        }, 1000);
      });
      setLocations(response);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { locations, isLoading, searchLocations };
};
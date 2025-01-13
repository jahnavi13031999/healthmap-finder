import { Hospital } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useHospitals(location: string, coordinates: string) {
  return useQuery<Hospital[]>({
    queryKey: ['hospitals', location, coordinates],
    queryFn: async () => {
      const response = await fetch(`/api/hospitals?location=${location}&coordinates=${coordinates}`);
      const data = await response.json();
      return data;
    }
  });
} 
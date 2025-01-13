import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';
import { Hospital } from '@/types';

export const useHospitals = (location: string, healthIssue: string) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const fetchHospitals = async () => {
      if (!location || !healthIssue) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await api.searchHospitals(location, healthIssue);
        if (isSubscribed) {
          const hospitalsWithUniqueIds = data.map((hospital: Hospital) => ({
            ...hospital,
            id: `${hospital.id}-${hospital.name.replace(/\s+/g, '')}-${hospital.zipCode}`
          }));
          setHospitals(hospitalsWithUniqueIds);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
          toast({
            title: "Error",
            description: "Failed to fetch hospitals. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchHospitals();

    return () => {
      isSubscribed = false;
    };
  }, [location, healthIssue]); // Removed toast from dependencies

  return { hospitals, isLoading, error };
}; 
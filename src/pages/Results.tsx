import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { LoadingState } from "@/components/results/LoadingState";

interface GroupedHospitals {
  cityHospitals: Hospital[];
  stateHospitals: Hospital[];
  otherHospitals: Hospital[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { location: userLocation, healthIssue } = location.state || {};

  const [hospitals, setHospitals] = useState<GroupedHospitals>({
    cityHospitals: [],
    stateHospitals: [],
    otherHospitals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedHospitals = useMemo(() => {
    const city = hospitals?.cityHospitals || [];
    const state = hospitals?.stateHospitals || [];
    const other = hospitals?.otherHospitals || [];
    
    return city
      .concat(state)
      .concat(other)
      .sort((a, b) => {
        if (a.hasData !== b.hasData) return b.hasData ? 1 : -1;
        return a.score - b.score;
      });
  }, [hospitals]);

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <p className="text-red-500 text-lg font-medium mb-4">
        {message}
      </p>
      <Button 
        onClick={() => navigate('/')}
        variant="outline"
        className="mt-2"
      >
        Return to Search
      </Button>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!userLocation) {
        setError('Please select a location to search for hospitals.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching hospitals for:', userLocation, healthIssue);
        
        const response = await searchHospitals(userLocation, healthIssue || '');
        
        if (!response) {
          throw new Error('No response from server');
        }

        if (!response.hospitals || !Array.isArray(response.hospitals)) {
          throw new Error('Invalid response format');
        }

        if (response.hospitals.length === 0) {
          setError('No hospitals found for your search criteria.');
          setHospitals({ cityHospitals: [], stateHospitals: [], otherHospitals: [] });
          return;
        }

        const grouped = {
          cityHospitals: response.hospitals.filter(h => h.locationRelevance === 'city'),
          stateHospitals: response.hospitals.filter(h => h.locationRelevance === 'state'),
          otherHospitals: response.hospitals.filter(h => h.locationRelevance === 'other')
        };

        setHospitals(grouped);

      } catch (err) {
        console.error('Fetch Error:', err);
        let errorMessage = 'An unexpected error occurred.';
        
        if (err instanceof Error) {
          switch (err.message) {
            case 'Failed to fetch':
              errorMessage = 'Unable to connect to the server. Please check your internet connection.';
              break;
            case 'Invalid response format':
              errorMessage = 'The server returned invalid data. Please try again.';
              break;
            case 'No response from server':
              errorMessage = 'No response received from server. Please try again.';
              break;
            default:
              errorMessage = `Error: ${err.message}`;
          }
        }

        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation, healthIssue, toast, navigate]);

  if (!location.state) {
    return (
      <ErrorMessage message="No search parameters found. Please start a new search." />
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Search Results</h1>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {sortedHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHospitals.map((hospital) => (
                <HospitalCard 
                  key={hospital.id} 
                  hospital={hospital} 
                />
              ))}
            </div>
          ) : (
            <ErrorMessage message="No hospitals found matching your criteria." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
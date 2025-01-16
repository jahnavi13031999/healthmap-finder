import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital, GroupedHospitals, FilterState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { FilterBar } from "@/components/FilterBar";
import { HospitalSection } from "@/components/HospitalSection";
import { searchHospitals } from "@/services/api";

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
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    performance: 'all',
    sortBy: 'score',
    onlyWithData: false,
    maxDistance: 50
  });

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    const allHospitals = {
      cityHospitals: hospitals.cityHospitals.filter(hospital => 
        filters.location === 'all' || 
        (filters.location === 'city' && hospital.locationRelevance === 'city')
      ),
      stateHospitals: hospitals.stateHospitals.filter(hospital =>
        filters.location === 'all' ||
        (filters.location !== 'city' && hospital.locationRelevance === 'state')
      ),
      otherHospitals: hospitals.otherHospitals.filter(hospital =>
        filters.location === 'all' ||
        (filters.location !== 'city' && hospital.locationRelevance === 'other')
      )
    };

    // Apply sorting
    const sortFn = (a: Hospital, b: Hospital) => {
      if (filters.sortBy === 'score') {
        if (a.hasData !== b.hasData) return b.hasData ? 1 : -1;
        return b.score - a.score;
      }
      return a.name.localeCompare(b.name);
    };

    return {
      cityHospitals: [...allHospitals.cityHospitals].sort(sortFn),
      stateHospitals: [...allHospitals.stateHospitals].sort(sortFn),
      otherHospitals: [...allHospitals.otherHospitals].sort(sortFn)
    };
  }, [hospitals, filters]);

  // Fetch hospitals
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
        
        const response = await searchHospitals(userLocation, healthIssue || '');
        
        const grouped = {
          cityHospitals: response.filter(h => h.city.toLowerCase() === userLocation.toLowerCase()),
          stateHospitals: response.filter(h => 
            h.state.toLowerCase() === userLocation.toLowerCase() && 
            h.city.toLowerCase() !== userLocation.toLowerCase()
          ),
          otherHospitals: response.filter(h => 
            h.state.toLowerCase() !== userLocation.toLowerCase() && 
            h.city.toLowerCase() !== userLocation.toLowerCase()
          )
        };

        setHospitals(grouped);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
        toast({
          title: "Error",
          description: "Failed to fetch hospitals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation, healthIssue, toast]);

  // Handle filter reset
  const handleReset = () => {
    setFilters({
      location: 'all',
      performance: 'all',
      sortBy: 'score',
      onlyWithData: false,
      maxDistance: 50
    });
  };

  if (!location.state) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Please select a location to search for hospitals.</p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Return to Search
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Hospital Search Results</h1>
            <p className="text-gray-600">
              Showing results for {userLocation}
              {healthIssue && <span> - {healthIssue}</span>}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </div>

        <FilterBar
          onSortChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          onLocationChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
          onReset={handleReset}
          currentFilters={filters}
        />

        {error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <HospitalSection 
              title="Hospitals in Your City" 
              description="These hospitals are located within your specified city"
              hospitals={filteredHospitals.cityHospitals}
            />
            <HospitalSection 
              title="Hospitals in Your State" 
              description="These hospitals are in your state but outside your city"
              hospitals={filteredHospitals.stateHospitals}
            />
            <HospitalSection 
              title="Other Nearby Hospitals" 
              description="These hospitals are outside your state but may be relevant"
              hospitals={filteredHospitals.otherHospitals}
            />
            
            {Object.values(filteredHospitals).every(arr => arr.length === 0) && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No hospitals found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
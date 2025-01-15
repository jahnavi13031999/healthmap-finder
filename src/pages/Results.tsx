import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { LoadingState } from "@/components/results/LoadingState";
import { FilterBar } from "@/components/results/FilterBar";

const ITEMS_PER_PAGE = 9;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: 'all',
    sortBy: 'score'
  });

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    const allHospitals = [
      ...hospitals.cityHospitals,
      ...hospitals.stateHospitals,
      ...hospitals.otherHospitals
    ];

    return allHospitals.filter(hospital => 
      filters.location === 'all' || 
      (filters.location === 'city' ? 
        hospital.locationRelevance === 'city' : 
        hospital.locationRelevance !== 'city')
    );
  }, [hospitals, filters.location]);

  // Sort hospitals
  const sortedHospitals = useMemo(() => {
    return [...filteredHospitals].sort((a, b) => {
      if (filters.sortBy === 'score') {
        if (a.hasData !== b.hasData) return b.hasData ? 1 : -1;
        return b.score - a.score; // Higher score first
      }
      return a.name.localeCompare(b.name);
    });
  }, [filteredHospitals, filters.sortBy]);

  // Paginate hospitals
  const paginatedHospitals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedHospitals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedHospitals, currentPage]);

  const totalPages = Math.ceil(sortedHospitals.length / ITEMS_PER_PAGE);

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
        
        if (!response?.hospitals) {
          throw new Error('No hospitals found');
        }

        const grouped = {
          cityHospitals: response.hospitals.filter(h => h.locationRelevance === 'city'),
          stateHospitals: response.hospitals.filter(h => h.locationRelevance === 'state'),
          otherHospitals: response.hospitals.filter(h => h.locationRelevance === 'other')
        };

        setHospitals(grouped);
        setCurrentPage(1); // Reset to first page when new data arrives

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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter reset
  const handleReset = () => {
    setFilters({
      location: 'all',
      sortBy: 'score'
    });
    setCurrentPage(1);
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
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Search Results</h1>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </div>

        <FilterBar
          onSortChange={(value) => {
            setFilters(prev => ({ ...prev, sortBy: value }));
            setCurrentPage(1);
          }}
          onLocationChange={(value) => {
            setFilters(prev => ({ ...prev, location: value }));
            setCurrentPage(1);
          }}
          onReset={handleReset}
        />

        {error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {paginatedHospitals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedHospitals.map((hospital) => (
                    <HospitalCard 
                      key={hospital.id} 
                      hospital={hospital}
                    />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
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
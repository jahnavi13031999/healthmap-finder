import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital, GroupedHospitals, FilterState } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { FilterBar } from "@/components/FilterBar";

const ITEMS_PER_PAGE = 9;

const ResultsSection = ({ title, hospitals, description }: { 
  title: string; 
  hospitals: Hospital[]; 
  description?: string;
}) => {
  if (hospitals.length === 0) return null;
  
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        <span className="text-sm text-gray-500 mt-2 block">
          {hospitals.length} {hospitals.length === 1 ? 'hospital' : 'hospitals'} found
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {hospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
};

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
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    performance: 'all',
    sortBy: 'score',
    onlyWithData: false,
    maxDistance: 50
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

  // Separate the filtered hospitals by location
  const { cityHospitals, otherHospitals } = useMemo(() => {
    return {
      cityHospitals: sortedHospitals.filter(h => h.locationRelevance === 'city'),
      otherHospitals: sortedHospitals.filter(h => h.locationRelevance !== 'city')
    };
  }, [sortedHospitals]);

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
        setCurrentPage(1);

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
      performance: 'all',
      sortBy: 'score',
      onlyWithData: false,
      maxDistance: 50
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
          onSortChange={(value) => {
            setFilters(prev => ({ ...prev, sortBy: value }));
            setCurrentPage(1);
          }}
          onLocationChange={(value) => {
            setFilters(prev => ({ ...prev, location: value }));
            setCurrentPage(1);
          }}
          onReset={handleReset}
          currentFilters={filters}
        />

        {error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <ResultsSection 
              title="Hospitals in Your City" 
              description="These hospitals are located within your specified city"
              hospitals={hospitals.cityHospitals} 
            />
            <ResultsSection 
              title="Hospitals in Your State" 
              description="These hospitals are in your state but outside your city"
              hospitals={hospitals.stateHospitals} 
            />
            <ResultsSection 
              title="Other Nearby Hospitals" 
              description="These hospitals are outside your state but may be relevant"
              hospitals={hospitals.otherHospitals} 
            />
            
            {Object.values(hospitals).every(arr => arr.length === 0) && (
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

import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { FilterComponents } from "@/components/results/FilterComponents";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import { LoadingState } from "@/components/results/LoadingState";
import { debounce } from 'lodash';

const HOSPITALS_PER_PAGE = 9;

interface GroupedHospitals {
  cityHospitals: Hospital[];
  stateHospitals: Hospital[];
  otherHospitals: Hospital[];
}

interface FilterState {
  location: string;
  performance: string;
  sortBy: string;
  onlyWithData: boolean;
  maxDistance: number;
}

const Results = () => {
  const location = useLocation();
  const { location: userLocation, healthIssue } = location.state || {};
  const [hospitals, setHospitals] = useState<GroupedHospitals>({
    cityHospitals: [],
    stateHospitals: [],
    otherHospitals: []
  });
  const [displayedHospitals, setDisplayedHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    performance: 'all',
    sortBy: 'rating',
    onlyWithData: true,
    maxDistance: 50
  });
  const navigate = useNavigate();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const sortedHospitals = useMemo(() => {
    return hospitals.cityHospitals
      .concat(hospitals.stateHospitals)
      .concat(hospitals.otherHospitals)
      .sort((a, b) => {
        if (a.hasData !== b.hasData) return b.hasData ? 1 : -1;
        return a.score - b.score;
      });
  }, [hospitals]);

  const loadMore = useCallback(() => {
    const start = (page - 1) * HOSPITALS_PER_PAGE;
    const end = page * HOSPITALS_PER_PAGE;
    const newHospitals = sortedHospitals.slice(start, end);
    
    setDisplayedHospitals(prev => [...prev, ...newHospitals]);
    setPage(prev => prev + 1);
  }, [page, sortedHospitals]);

  useEffect(() => {
    if (inView && !loading && displayedHospitals.length < sortedHospitals.length) {
      loadMore();
    }
  }, [inView, loading, loadMore, displayedHospitals.length, sortedHospitals.length]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userLocation) return;
      
      try {
        setLoading(true);
        const response = await searchHospitals(userLocation, healthIssue || '');
        
        if (response) {
          setHospitals(response);
        }
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

  const handleFilterChange = useCallback(
    debounce((key: keyof FilterState, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }, 150),
    []
  );

  const handleResetFilter = useCallback((key: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'onlyWithData' ? false : 'all'
    }));
  }, []);

  const handleResetAll = useCallback(() => {
    setFilters({
      location: 'all',
      performance: 'all',
      sortBy: 'rating',
      onlyWithData: true,
      maxDistance: 50
    });
  }, []);

  const handleNewSearch = () => {
    navigate('/');
  };

  if (loading && !displayedHospitals.length) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const totalHospitals = useMemo(() => 
    sortedHospitals.length,
    [sortedHospitals]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Search Results</h1>
          <Button 
            onClick={handleNewSearch}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </div>

        <ResultsHeader 
          filters={filters}
          totalHospitals={totalHospitals}
          userLocation={userLocation}
          healthIssue={healthIssue}
          onResetFilter={handleResetFilter}
          onResetAll={handleResetAll}
        />

        <FilterComponents
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onResetAll={handleResetAll}
        />
        
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-8">
            {sortedHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedHospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No hospitals found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            )}

            {!loading && displayedHospitals.length < sortedHospitals.length && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="text-primary hover:text-primary-dark"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
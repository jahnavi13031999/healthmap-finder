import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { debounce } from 'lodash';
import { Pagination } from "@/components/ui/pagination"
import { Search } from 'lucide-react';

const HOSPITALS_PER_PAGE = 9; // Show 9 hospitals at a time (3x3 grid)

interface GroupedHospitals {
  cityHospitals: Hospital[];
  stateHospitals: Hospital[];
  otherHospitals: Hospital[];
}

// Add these filter options
const FILTER_OPTIONS = {
  location: [
    { value: 'all', label: 'All Locations' },
    { value: 'city', label: 'Within City Only' },
    { value: 'state', label: 'Within State' },
  ],
  performance: [
    { value: 'all', label: 'All Ratings' },
    { value: 'excellent', label: '⭐⭐⭐⭐⭐ Excellent' },
    { value: 'good', label: '⭐⭐⭐⭐ Good' },
    { value: 'average', label: '⭐⭐⭐ Average' },
    { value: 'below', label: '⭐⭐ Below Average' },
    { value: 'poor', label: '⭐ Poor' },
  ],
  sortBy: [
    { value: 'rating', label: 'Best Rating First' },
    { value: 'distance', label: 'Closest First' },
    { value: 'name', label: 'Hospital Name' },
  ]
}

interface FilterState {
  location: string;
  performance: string;
  sortBy: string;
  onlyWithData: boolean;
  maxDistance: number;
}

const getActiveFiltersCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.location !== 'all') count++;
  if (filters.performance !== 'all') count++;
  if (filters.sortBy !== 'rating') count++;
  if (filters.onlyWithData) count++;
  return count;
};

const ResultsHeader = ({ 
  filters, 
  totalHospitals,
  userLocation,
  healthIssue,
  onResetFilter,
  onResetAll
}: { 
  filters: FilterState;
  totalHospitals: number;
  userLocation: string;
  healthIssue: string;
  onResetFilter: (key: keyof FilterState) => void;
  onResetAll: () => void;
}) => (
  <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Found {totalHospitals} hospitals
            {healthIssue && <span className="text-gray-600"> for {healthIssue}</span>}
            {userLocation && <span className="text-gray-600"> near {userLocation}</span>}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={onResetAll}
          >
            Reset all filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.location !== 'all' && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {FILTER_OPTIONS.location.find(opt => opt.value === filters.location)?.label}
              <X 
                className="h-3 w-3 cursor-pointer ml-1" 
                onClick={() => onResetFilter('location')}
              />
            </Badge>
          )}
          {filters.performance !== 'all' && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {FILTER_OPTIONS.performance.find(opt => opt.value === filters.performance)?.label}
              <X 
                className="h-3 w-3 cursor-pointer ml-1" 
                onClick={() => onResetFilter('performance')}
              />
            </Badge>
          )}
          {filters.sortBy !== 'rating' && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Sorted by: {FILTER_OPTIONS.sortBy.find(opt => opt.value === filters.sortBy)?.label}
              <X 
                className="h-3 w-3 cursor-pointer ml-1" 
                onClick={() => onResetFilter('sortBy')}
              />
            </Badge>
          )}
          {filters.onlyWithData && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              With available data only
              <X 
                className="h-3 w-3 cursor-pointer ml-1" 
                onClick={() => onResetFilter('onlyWithData')}
              />
            </Badge>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AILoadingState = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing hospital data...",
    "Processing health metrics...",
    "Calculating quality scores...",
    "Ranking facilities...",
    "Applying ML recommendations...",
    "Finalizing results..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900">
              AI Processing
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              {steps[currentStep]}
            </div>
            
            <Progress value={progress} className="h-2 w-full" />
            
            <div className="text-center text-sm text-gray-500">
              {progress}% complete
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="h-32 bg-white rounded-lg shadow-sm border p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaginationState {
  currentPage: number;
  totalPages: number;
  perPage: number;
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
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    perPage: 9
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  // Setup intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Memoize sorted hospitals
  const sortedHospitals = useMemo(() => {
    return hospitals.cityHospitals.concat(hospitals.stateHospitals).concat(hospitals.otherHospitals).sort((a, b) => {
      if (a.hasData !== b.hasData) return b.hasData ? 1 : -1;
      return a.score - b.score;
    });
  }, [hospitals]);

  // Load more hospitals when scrolling
  const loadMore = useCallback(() => {
    const start = (page - 1) * HOSPITALS_PER_PAGE;
    const end = page * HOSPITALS_PER_PAGE;
    const newHospitals = sortedHospitals.slice(start, end);
    
    setDisplayedHospitals(prev => [...prev, ...newHospitals]);
    setPage(prev => prev + 1);
  }, [page, sortedHospitals]);

  // Watch for scroll and load more
  useEffect(() => {
    if (inView && !loading && displayedHospitals.length < sortedHospitals.length) {
      loadMore();
    }
  }, [inView, loading, loadMore, displayedHospitals.length, sortedHospitals.length]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!userLocation) return;
      
      try {
        setLoading(true);
        const response = await searchHospitals(
          userLocation, 
          healthIssue || '', 
          pagination.currentPage, 
          pagination.perPage
        );
        
        console.log('API Response:', response); // Debug log
        
        if (response && response.hospitals) {
          setHospitals(response.hospitals);
          console.log('Set Hospitals:', response.hospitals); // Debug log
          setPagination(prev => ({
            ...prev,
            totalPages: response.metadata.totalPages
          }));
        }
      } catch (err) {
        console.error('Fetch Error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
      } finally {
        setLoading(false);
      }
    };

    console.log('UserLocation:', userLocation); // Debug log
    console.log('HealthIssue:', healthIssue); // Debug log
    fetchData();
  }, [userLocation, healthIssue, pagination.currentPage]);

  const filterHospitals = (hospitals: GroupedHospitals) => {
    let filtered = {
      cityHospitals: [...hospitals.cityHospitals],
      stateHospitals: [...hospitals.stateHospitals],
      otherHospitals: [...hospitals.otherHospitals]
    };

    // Filter by location
    if (filters.location === 'city') {
      filtered.stateHospitals = [];
      filtered.otherHospitals = [];
    } else if (filters.location === 'state') {
      filtered.otherHospitals = [];
    }

    // Filter by performance
    const performanceFilter = (hospital: Hospital) => {
      if (filters.performance === 'all') return true;
      const rating = hospital.ratings.overall || 0;
      switch (filters.performance) {
        case 'excellent': return rating >= 4.5;
        case 'good': return rating >= 3.5 && rating < 4.5;
        case 'average': return rating >= 2.5 && rating < 3.5;
        case 'below': return rating >= 1.5 && rating < 2.5;
        case 'poor': return rating < 1.5;
        default: return true;
      }
    };

    Object.keys(filtered).forEach(key => {
      filtered[key as keyof GroupedHospitals] = filtered[key as keyof GroupedHospitals]
        .filter(hospital => {
          if (filters.onlyWithData && !hospital.hasData) return false;
          return performanceFilter(hospital);
        })
        .sort((a, b) => {
          switch (filters.sortBy) {
            case 'rating':
              return (b.ratings.overall || 0) - (a.ratings.overall || 0);
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
    });

    return filtered;
  };

  // Memoize filter options
  const filterOptions = useMemo(() => ({
    location: FILTER_OPTIONS.location,
    performance: FILTER_OPTIONS.performance,
    sortBy: FILTER_OPTIONS.sortBy
  }), []);

  // Debounce filter changes
  const debouncedFilterChange = useCallback(
    debounce((key: keyof FilterState, value: string | boolean) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }, 150),
    []
  );

  // Memoize filtered hospitals
  const filteredHospitals = useMemo(() => 
    filterHospitals(hospitals),
    [hospitals, filters]
  );

  // Optimize filter reset
  const handleResetAll = useCallback(() => {
    setFilters({
      location: 'all',
      performance: 'all',
      sortBy: 'rating',
      onlyWithData: true,
      maxDistance: 50
    });
  }, []);

  const handleResetFilter = useCallback((key: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'onlyWithData' ? false : 'all'
    }));
  }, []);

  // Optimize Select components rendering
  const renderSelect = useCallback(({ 
    label, 
    value, 
    options, 
    filterKey 
  }: { 
    label: string;
    value: string;
    options: typeof FILTER_OPTIONS.location;
    filterKey: keyof FilterState;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select
        value={value}
        onValueChange={(newValue) => debouncedFilterChange(filterKey, newValue)}
      >
        <SelectTrigger className={cn(
          "w-full h-10 px-3 py-2",
          "bg-white border border-gray-200",
          "rounded-md shadow-sm",
          "hover:bg-gray-50 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent 
          className={cn(
            "bg-white rounded-md shadow-lg border border-gray-200",
            "z-50 overflow-hidden"
          )}
          position="popper"
          sideOffset={4}
        >
          {options.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={cn(
                "px-3 py-2 text-sm cursor-pointer",
                "hover:bg-gray-100 focus:bg-gray-100",
                "transition-colors duration-200"
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ), [debouncedFilterChange]);

  const totalHospitals = useMemo(() => 
    filteredHospitals.cityHospitals.length + 
    filteredHospitals.stateHospitals.length + 
    filteredHospitals.otherHospitals.length, 
    [filteredHospitals]
  );

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNewSearch = () => {
    navigate('/');
  };

  if (loading && !displayedHospitals.length) {
    return <AILoadingState />;
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
        
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-sm">
            {renderSelect({
              label: "Location",
              value: filters.location,
              options: filterOptions.location,
              filterKey: 'location'
            })}
            {renderSelect({
              label: "Performance Rating",
              value: filters.performance,
              options: filterOptions.performance,
              filterKey: 'performance'
            })}
            {renderSelect({
              label: "Sort By",
              value: filters.sortBy,
              options: filterOptions.sortBy,
              filterKey: 'sortBy'
            })}
          </div>

          <div className="space-y-8">
            {filteredHospitals.cityHospitals.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 px-2">
                  Hospitals in {userLocation}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHospitals.cityHospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>
              </section>
            )}

            {filteredHospitals.stateHospitals.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 px-2">
                  Other Hospitals in {userLocation.split(',')[1]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHospitals.stateHospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>
              </section>
            )}

            {filteredHospitals.otherHospitals.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 px-2">
                  Other Recommended Hospitals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHospitals.otherHospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>
              </section>
            )}

            {!filteredHospitals.cityHospitals.length && 
             !filteredHospitals.stateHospitals.length && 
             !filteredHospitals.otherHospitals.length && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No hospitals found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            )}

            {totalHospitals > 0 && (
              <div className="flex justify-center py-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  className="flex items-center gap-2"
                />
              </div>
            )}

            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for hospital sections
const HospitalSection = ({ title, hospitals }: { title: string; hospitals: Hospital[] }) => (
  <>
    <h2 className="text-2xl font-semibold text-textPrimary mb-2">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {hospitals.map((hospital) => (
        <HospitalCard key={hospital.id} hospital={hospital} />
      ))}
    </div>
  </>
);

// Add this component for pagination
const PaginationNumbers = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages = useMemo(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push('...');
      }
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center gap-2">
      {pages.map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 w-8 rounded-md",
              "flex items-center justify-center",
              "text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-gray-400">
            {page}
          </span>
        )
      ))}
    </div>
  );
};

export default Results;

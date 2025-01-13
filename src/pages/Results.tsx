import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { useToast } from "@/components/ui/use-toast";
import { searchHospitals } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

const HOSPITALS_PER_PAGE = 9; // Show 9 hospitals at a time (3x3 grid)

const Results = () => {
  const location = useLocation();
  const { location: userLocation, healthIssue } = location.state || {};
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [displayedHospitals, setDisplayedHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  // Setup intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Memoize sorted hospitals
  const sortedHospitals = useMemo(() => {
    return hospitals.sort((a, b) => {
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
    let mounted = true;

    const fetchHospitals = async () => {
      if (!userLocation) {
        setError("Location is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await searchHospitals(userLocation, healthIssue || '');
        if (mounted) {
          setHospitals(results);
          // Initialize with first page
          setDisplayedHospitals(results.slice(0, HOSPITALS_PER_PAGE));
          setPage(2);
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch hospital recommendations";
          setError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHospitals();
    return () => {
      mounted = false;
    };
  }, [userLocation, healthIssue, toast]);

  if (loading && !displayedHospitals.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(HOSPITALS_PER_PAGE)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
        <h2 className="text-2xl font-semibold text-textPrimary mb-2">
          Recommended Hospitals
        </h2>
        <p className="text-gray-600 mb-6">
          Based on mortality rates{healthIssue ? ` for ${healthIssue}` : ''} 
          {userLocation ? ` in ${userLocation}` : ''}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHospitals.map((hospital) => (
            <HospitalCard 
              key={hospital.id} 
              hospital={hospital}
            />
          ))}
        </div>
        
        {/* Loading indicator */}
        {displayedHospitals.length < sortedHospitals.length && (
          <div ref={loadMoreRef} className="mt-8 text-center">
            <div className="animate-pulse text-gray-500">
              Loading more hospitals...
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="mt-8 text-center text-gray-500">
          Showing {displayedHospitals.length} of {sortedHospitals.length} hospitals
        </div>
      </div>
    </div>
  );
};

export default Results;
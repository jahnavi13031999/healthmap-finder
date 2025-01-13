import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HospitalCard } from '@/components/HospitalCard';
import { searchHospitals, type Hospital } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";

const Results = () => {
  const location = useLocation();
  const { location: userLocation, healthIssue } = location.state || {};
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const results = await searchHospitals(userLocation, healthIssue);
        setHospitals(results);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch hospital recommendations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [userLocation, healthIssue, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading recommendations...</div>
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
          Based on your location: {userLocation} and condition: {healthIssue}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital, index) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
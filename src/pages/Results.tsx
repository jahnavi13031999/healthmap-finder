import { useLocation } from 'react-router-dom';
import { useHospitals } from '../hooks/useHospitals';
import { HospitalCard } from '../components/HospitalCard';
import { Loader2 } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  const { location: searchLocation, healthIssue } = location.state || {};
  const { hospitals, isLoading, error } = useHospitals(searchLocation, healthIssue);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No hospitals found for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          Hospitals near {searchLocation}
          {healthIssue && <span className="text-gray-500"> for {healthIssue}</span>}
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </div>
    </div>
  );
}
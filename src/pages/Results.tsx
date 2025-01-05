import { useLocation } from 'react-router-dom';
import { HospitalCard } from '@/components/HospitalCard';

const Results = () => {
  const location = useLocation();
  const { location: userLocation, healthIssue } = location.state || {};

  // Mock data - in a real app, this would come from your ML API
  const hospitals = [
    {
      name: "Central Medical Center",
      rating: 4.8,
      specialty: "General Medicine",
      distance: "2.3 miles",
      address: "123 Healthcare Ave"
    },
    {
      name: "St. Mary's Hospital",
      rating: 4.6,
      specialty: "Specialized Care",
      distance: "3.1 miles",
      address: "456 Medical Blvd"
    },
    {
      name: "City General Hospital",
      rating: 4.5,
      specialty: "Emergency Care",
      distance: "4.0 miles",
      address: "789 Hospital Street"
    }
  ];

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
            <HospitalCard key={index} {...hospital} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
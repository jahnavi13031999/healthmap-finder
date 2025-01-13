import { useHospitals } from '@/hooks/useHospitals';
import { HospitalCard } from '../components/HospitalCard';
import { HospitalMetrics } from '../components/HospitalMetrics';
import { useState } from 'react';
import { Hospital } from '@/types';

type SortOption = 'distance' | 'score' | 'name';

export default function Results() {
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const { data: hospitals, isLoading, error } = useHospitals('', '0,0');

  const sortHospitals = (hospitals: Hospital[]) => {
    return [...hospitals].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || Infinity) - (b.distance || Infinity);
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const sortedHospitals = sortHospitals(hospitals);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <HospitalMetrics hospitals={hospitals} />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Healthcare Facilities</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border rounded-md p-2"
        >
          <option value="distance">Sort by Distance</option>
          <option value="score">Sort by Performance</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedHospitals.map((hospital) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
          />
        ))}
      </div>
    </div>
  );
}
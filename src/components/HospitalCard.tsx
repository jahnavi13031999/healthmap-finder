import { memo } from 'react';
import { Hospital } from '@/types';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HospitalCardProps {
  hospital: Hospital;
  className?: string;
}

export const HospitalCard = memo(({ hospital, className }: HospitalCardProps) => {
  // Calculate rating based on score
  const rating = hospital.hasData 
    ? Math.max(1, Math.min(5, 5 - (hospital.score / 5))) 
    : 0;

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-sm", className)}>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
          <p className="text-gray-600 text-sm">
            {hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}
          </p>
        </div>

        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Overall Rating</p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating 
                        ? "fill-primary text-primary" 
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Performance</p>
            <p className="text-lg font-bold text-primary">
              {hospital.hasData ? 'Available' : 'No Data'}
            </p>
          </div>
        </div>

        {hospital.statistics && (
          <div className="text-sm text-gray-500">
            <p>Sample size: {hospital.statistics.denominator}</p>
            <p>Range: {hospital.statistics.lowerEstimate}% - {hospital.statistics.higherEstimate}%</p>
          </div>
        )}
      </div>
    </div>
  );
});

HospitalCard.displayName = 'HospitalCard'; 
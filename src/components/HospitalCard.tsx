import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Hospital } from '@/types';
import { AppointmentDialog } from './AppointmentDialog';

interface HospitalCardProps {
  hospital: Hospital;
  className?: string;
}

export function HospitalCard({ hospital, className }: HospitalCardProps) {
  const r5Score = hospital.score > 0 
    ? Math.min(5, Math.round((hospital.score / 20) * 10) / 10)
    : 0;

  const metrics = [
    { label: "Overall", value: hospital.ratings?.overall },
    { label: "Safety", value: hospital.ratings?.safety },
    { label: "Quality", value: hospital.ratings?.quality }
  ];

  return (
    <div className={cn("rounded-lg border border-gray-200", className)}>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{hospital.name}</h3>
          <p className="text-gray-600 text-sm">
            {hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Score</p>
            <p className="text-lg font-bold text-primary">
              {r5Score.toFixed(1)}
            </p>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(r5Score) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-sm font-semibold">
                {typeof metric.value === 'number' ? metric.value.toFixed(1) : 'N/A'}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-500">Performance</p>
            <p className={cn(
              "text-sm font-semibold",
              {
                'text-green-600': hospital.performanceLevel === 'Excellent',
                'text-blue-600': hospital.performanceLevel === 'Good',
                'text-yellow-600': hospital.performanceLevel === 'Fair',
                'text-red-600': hospital.performanceLevel === 'Needs Improvement',
                'text-gray-600': hospital.performanceLevel === 'Unknown'
              }
            )}>
              {hospital.performanceLevel}
            </p>
          </div>
          <AppointmentDialog hospitalName={hospital.name} />
        </div>
      </div>
    </div>
  );
} 
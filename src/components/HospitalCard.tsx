import { Hospital } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon, MapPinIcon, ClockIcon, ChartBarIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PerformanceBadge = ({ level }: { level: string }) => {
  const colors = {
    'Excellent': 'bg-green-100 text-green-800',
    'Good': 'bg-blue-100 text-blue-800',
    'Fair': 'bg-yellow-100 text-yellow-800',
    'Needs Improvement': 'bg-red-100 text-red-800',
    'Unknown': 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[level] || colors.Unknown}`}>
      {level}
    </span>
  );
};

export function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-white border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{hospital.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}
            </p>
          </div>
          <PerformanceBadge level={hospital.performanceLevel} />
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Ratings Section */}
          <div className="flex gap-4">
            {hospital.ratings.overall && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium">{hospital.ratings.overall.toFixed(1)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall Rating</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {hospital.score && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <ChartBarIcon className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{hospital.score.toFixed(0)}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Performance Score</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Statistics Section */}
          {hospital.statistics && (
            <div className="text-sm space-y-2">
              {hospital.statistics.nationalComparison && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {hospital.statistics.nationalComparison}
                  </Badge>
                </div>
              )}
              
              {hospital.statistics.measurementPeriod?.start && (
                <div className="flex items-center gap-1 text-gray-500">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    Data from {hospital.statistics.measurementPeriod.start} 
                    to {hospital.statistics.measurementPeriod.end}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {hospital.description && (
            <p className="text-sm text-gray-600 mt-2">
              {hospital.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
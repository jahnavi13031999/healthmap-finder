import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
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
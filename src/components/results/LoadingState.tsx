import { Loader2, Brain, Database, ChartBar } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-75">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <Brain className="h-12 w-12 text-primary relative" />
      </div>
      
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold text-gray-800">Analyzing Hospital Data</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <Database className="h-4 w-4 animate-pulse" />
            <span>Processing healthcare metrics...</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <ChartBar className="h-4 w-4 animate-pulse" />
            <span>Calculating performance scores...</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Ranking hospitals by quality...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
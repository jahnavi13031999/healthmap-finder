import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onReset: () => void;
  currentFilters: {
    location: string;
    sortBy: string;
    maxDistance: number;
    onlyWithData: boolean;
  };
}

export const FilterBar = ({ onSortChange, onLocationChange, onReset, currentFilters }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-gray-900">Filter Results</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Select value={currentFilters.location} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="city">Within City</SelectItem>
                <SelectItem value="outside">Outside City</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sort by</label>
            <Select value={currentFilters.sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Best Score First</SelectItem>
                <SelectItem value="name">Hospital Name</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Maximum Distance</label>
            <Slider
              value={[currentFilters.maxDistance]}
              onValueChange={([value]) => onLocationChange(String(value))}
              max={100}
              step={1}
              className="py-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Switch
              checked={currentFilters.onlyWithData}
              onCheckedChange={(checked) => onLocationChange(checked ? 'withData' : 'all')}
            />
            <label className="text-sm text-gray-600">Only show hospitals with available data</label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-gray-600 hover:text-gray-900"
          >
            Reset all filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {currentFilters.location !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {currentFilters.location === 'city' ? 'Within City' : 'Outside City'}
            <X className="h-3 w-3 cursor-pointer" onClick={() => onLocationChange('all')} />
          </Badge>
        )}
        {currentFilters.onlyWithData && (
          <Badge variant="secondary" className="flex items-center gap-1">
            With Data Only
            <X className="h-3 w-3 cursor-pointer" onClick={() => onLocationChange('all')} />
          </Badge>
        )}
      </div>
    </div>
  );
};
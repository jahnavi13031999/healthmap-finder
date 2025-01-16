import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onReset: () => void;
}

export const FilterBar = ({ onSortChange, onLocationChange, onReset }: FilterBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4 flex-1">
        <Select defaultValue="all" onValueChange={onLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="city">Within City</SelectItem>
            <SelectItem value="outside">Outside City</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="score" onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Best Score First</SelectItem>
            <SelectItem value="name">Hospital Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onReset}>Reset Filters</Button>
    </div>
  );
}; 
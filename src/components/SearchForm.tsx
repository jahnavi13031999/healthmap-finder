import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { HEALTH_CONDITIONS } from '@/constants';
import { useLocations } from '@/hooks/useLocations';
import { useGeolocation } from '@/hooks/useGeolocation';

export const SearchForm = () => {
  const [location, setLocation] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [open, setOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { locations, isLoading, searchLocations } = useLocations();
  const { getCurrentLocation } = useGeolocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || (!healthIssue && !selectedCondition)) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide both location and health condition details",
        variant: "destructive",
      });
      return;
    }

    const finalHealthIssue = selectedCondition 
      ? `${healthIssue} (${HEALTH_CONDITIONS.find(c => c.value === selectedCondition)?.label})`
      : healthIssue;
    
    navigate('/results', { state: { location, healthIssue: finalHealthIssue } });
  };

  const handleGeolocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleLocationSearch = (value: string) => {
    setLocationSearch(value);
    searchLocations(value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-8 w-full max-w-md bg-gradient-to-b from-white to-gray-50 p-8 rounded-xl shadow-xl border border-gray-100"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Find Healthcare Near You
          </h2>
          <p className="text-gray-600 text-sm">
            Enter your location and health concern to get personalized hospital recommendations
          </p>
        </div>
        
        <div className="relative space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Location
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-2 hover:border-primary/50 focus:border-primary transition-colors bg-white"
              >
                {location || "Select your location..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    placeholder="Search cities..."
                    value={locationSearch}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <CommandList>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : locations.length === 0 ? (
                    <CommandEmpty>No locations found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {locations.map((loc) => (
                        <CommandItem
                          key={loc.id}
                          onSelect={() => {
                            setLocation(loc.displayString);
                            setOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{loc.city}, {loc.state}</span>
                            <span className="text-sm text-muted-foreground">
                              {loc.county} County
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <button
            type="button"
            onClick={handleGeolocation}
            className="absolute right-3 top-[42px] p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            title="Use current location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Condition
          </label>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="w-full border-2 hover:border-primary/50 focus:border-primary transition-colors bg-white">
              <SelectValue placeholder="Choose your condition" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {HEALTH_CONDITIONS.map((condition) => (
                <SelectItem
                  key={condition.value}
                  value={condition.value}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <Input
            placeholder="Describe your symptoms or concerns (optional)"
            value={healthIssue}
            onChange={(e) => setHealthIssue(e.target.value)}
            className="border-2 hover:border-primary/50 focus:border-primary transition-colors bg-white"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold shadow-md transition-colors"
        disabled={!location || (!healthIssue && !selectedCondition)}
      >
        <Search className="w-5 h-5 mr-2" />
        Find Hospitals
      </Button>
    </form>
  );
};
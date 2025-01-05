import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

export const SearchForm = () => {
  const [location, setLocation] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !healthIssue) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    navigate('/results', { state: { location, healthIssue } });
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          toast({
            title: "Location detected",
            description: "Your location has been automatically filled",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not detect your location",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <div className="relative">
          <Input
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={handleGeolocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            📍
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Describe your health issue"
          value={healthIssue}
          onChange={(e) => setHealthIssue(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={!location || !healthIssue}
      >
        Find Best Hospitals
      </Button>
    </form>
  );
};
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const healthConditions = [
  { value: "hip_knee", label: "Hip/Knee Replacement Complications" },
  { value: "heart_attack", label: "Heart Attack" },
  { value: "cabg", label: "CABG Surgery" },
  { value: "copd", label: "COPD" },
  { value: "heart_failure", label: "Heart Failure" },
  { value: "pneumonia", label: "Pneumonia" },
  { value: "stroke", label: "Stroke" },
  { value: "pressure_ulcer", label: "Pressure Ulcers" },
  { value: "surgical_complications", label: "Surgical Complications" },
  { value: "pneumothorax", label: "Iatrogenic Pneumothorax" },
  { value: "fall_fracture", label: "Fall-Associated Fractures" },
  { value: "post_hemorrhage", label: "Postoperative Hemorrhage" },
  { value: "kidney_failure", label: "Acute Kidney Injury" },
  { value: "respiratory_failure", label: "Respiratory Failure" },
  { value: "blood_clots", label: "Pulmonary Embolism/DVT" },
  { value: "sepsis", label: "Postoperative Sepsis" },
  { value: "wound_dehiscence", label: "Wound Complications" },
  { value: "surgical_error", label: "Surgical Errors" },
  { value: "patient_safety", label: "General Patient Safety Concerns" }
];

export const SearchForm = () => {
  const [location, setLocation] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || (!healthIssue && !selectedCondition)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const finalHealthIssue = selectedCondition 
      ? `${healthIssue} (${healthConditions.find(c => c.value === selectedCondition)?.label})`
      : healthIssue;
    
    navigate('/results', { state: { location, healthIssue: finalHealthIssue } });
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
      
      <div className="space-y-4">
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your medical condition" />
          </SelectTrigger>
          <SelectContent>
            {healthConditions.map((condition) => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Additional details about your health issue (optional)"
          value={healthIssue}
          onChange={(e) => setHealthIssue(e.target.value)}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={!location || (!healthIssue && !selectedCondition)}
      >
        Find Best Hospitals
      </Button>
    </form>
  );
};
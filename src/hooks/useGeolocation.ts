import { useToast } from "@/components/ui/use-toast";

export const useGeolocation = () => {
  const { toast } = useToast();

  const getCurrentLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast({
          title: "Error",
          description: "Geolocation is not supported by your browser",
          variant: "destructive",
        });
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // For now, returning a mock location. Later we'll integrate with reverse geocoding
            const location = "New York, NY";
            resolve(location);
          } catch (error) {
            toast({
              title: "Error",
              description: "Could not determine your location",
              variant: "destructive",
            });
            reject(error);
          }
        },
        (error) => {
          let message = "Could not determine your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Please allow location access to use this feature";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              message = "Location request timed out";
              break;
          }
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
          reject(error);
        }
      );
    });
  };

  return { getCurrentLocation };
};
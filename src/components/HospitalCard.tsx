interface HospitalCardProps {
  name: string;
  rating: number;
  specialty: string;
  distance: string;
  address: string;
}

export const HospitalCard = ({ name, rating, specialty, distance, address }: HospitalCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-textPrimary">{name}</h3>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
          {rating.toFixed(1)} ★
        </span>
      </div>
      <p className="text-gray-600 mt-2">{specialty}</p>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Distance:</span> {distance}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Address:</span> {address}
        </p>
      </div>
    </div>
  );
};
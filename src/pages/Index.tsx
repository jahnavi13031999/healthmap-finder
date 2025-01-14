import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { SearchForm } from "@/components/SearchForm";
import { ResponsiveHeatMap } from '@nivo/heatmap';
// import { HeatMapGrid } from 'react-heat-map-grid';

interface StatsData {
  totalHospitals: number;
  stateDistribution: { state: string; count: number }[];
  ratingDistribution: { rating: string; count: number }[];
  topCities: { city: string; count: number }[];
  correlationData: { source: string; target: string; value: number }[];
}

const Index = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-12">
        <SearchForm />
      </section>
    </div>
  );
};

export default Index;
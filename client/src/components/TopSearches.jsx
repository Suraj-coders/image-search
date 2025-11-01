// client/src/components/TopSearches.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function TopSearches() {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/top-searches`);
      if (response.data.success) {
        setTopSearches(response.data.topSearches);
      }
    } catch (err) {
      console.error('Error fetching top searches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-6 animate-pulse">
        <div className="h-6 bg-white/30 rounded w-1/3 mb-3"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 bg-white/30 rounded-full flex-1"></div>
          ))}
        </div>
      </div>
    );
  }

  if (topSearches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold text-lg">Top Searches</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {topSearches.map((search, index) => (
          <div
            key={search.term}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span className="text-white font-bold text-sm">#{index + 1}</span>
            <span className="text-white font-medium capitalize">{search.term}</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              {search.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
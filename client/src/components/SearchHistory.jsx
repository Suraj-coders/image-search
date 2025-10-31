// client/src/components/SearchHistory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, History } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

axios.defaults.withCredentials = true;

export default function SearchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    
    // Refresh history every 30 seconds
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Search History</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No search history yet</p>
          <p className="text-gray-400 text-xs mt-1">Your searches will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 capitalize group-hover:text-blue-600 transition-colors flex-1">
                  {item.term}
                </p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {formatTimestamp(item.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing last {history.length} {history.length === 1 ? 'search' : 'searches'}
          </p>
        </div>
      )}
    </div>
  );
}
// client/src/components/RandomImages.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shuffle, Loader2, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function RandomImages({ query, onImageClick }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRandomImages();
  }, [query]);

  const fetchRandomImages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/api/images/random`, {
        params: {
          count: 12,
          query: query || null
        }
      });

      if (response.data.success) {
        setImages(response.data.images);
      }
    } catch (err) {
      console.error('Error fetching random images:', err);
      setError(err.response?.data?.message || 'Failed to load random images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {query ? `Random ${query} Images` : 'Random Images'}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {query ? `Random ${query} Images` : 'Random Images'}
          </h2>
        </div>
        <button
          onClick={fetchRandomImages}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onImageClick && onImageClick(image)}
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={image.thumb}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs font-medium truncate">
                {image.photographer}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white text-xs">❤️ {image.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


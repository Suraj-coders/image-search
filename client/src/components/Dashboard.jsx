// client/src/components/Dashboard.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TopSearches from './TopSearches';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import SearchHistory from './SearchHistory';
import { LogOut, Menu, X } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSearchComplete = (results) => {
    setSearchResults(results);
    setSelectedImages([]);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Image Search</h1>
                <p className="text-xs text-gray-500">Powered by Unsplash</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {showHistory ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-3">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Section */}
          <div className="flex-1">
            {/* Top Searches Banner */}
            <TopSearches />

            {/* Search Bar */}
            <SearchBar onSearchComplete={handleSearchComplete} />

            {/* Selection Counter */}
            {searchResults && selectedImages.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Selected: {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'}
                </p>
              </div>
            )}

            {/* Image Grid */}
            {searchResults && (
              <ImageGrid
                results={searchResults}
                selectedImages={selectedImages}
                onToggleSelection={toggleImageSelection}
              />
            )}

            {/* Empty State */}
            {!searchResults && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Searching</h3>
                <p className="text-gray-500">Enter a search term to find beautiful images</p>
              </div>
            )}
          </div>

          {/* Sidebar - Search History */}
          <div className={`${showHistory ? 'block' : 'hidden'} lg:block w-full lg:w-80`}>
            <SearchHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
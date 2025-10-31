// client/src/components/ImageGrid.jsx
import { Check } from 'lucide-react';

export default function ImageGrid({ results, selectedImages, onToggleSelection }) {
  if (!results || results.images.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No images found for "{results?.term}"</p>
        <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          You searched for <span className="text-blue-600 capitalize">"{results.term}"</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {results.count} {results.count === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.images.map((image) => {
          const isSelected = selectedImages.includes(image.id);
          
          return (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => onToggleSelection(image.id)}
            >
              {/* Image */}
              <div className="aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Checkbox Overlay */}
              <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-600 scale-100' 
                  : 'bg-white/80 backdrop-blur-sm scale-0 group-hover:scale-100'
              }`}>
                <Check className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
              </div>

              {/* Selection Border */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-blue-600 rounded-lg pointer-events-none"></div>
              )}

              {/* Photographer Info */}
              <div className="p-3 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0">
                <p className="text-white text-sm font-medium truncate">
                  Photo by {image.photographer}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Attribution */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          Images provided by{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}
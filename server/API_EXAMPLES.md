# Image API Examples

This document shows how to use the Image API endpoints in your frontend.

## Base URL
```
http://localhost:4000/api/images
```

## 1. Get Trending Images

Fetch popular/trending images:

```javascript
// GET /api/images/trending?page=1&per_page=20
const fetchTrending = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/images/trending`, {
      params: {
        page: 1,
        per_page: 20
      }
    });
    
    if (response.data.success) {
      console.log('Trending images:', response.data.images);
      // response.data.images is an array of image objects
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "abc123",
      "url": "https://images.unsplash.com/...",
      "thumb": "https://images.unsplash.com/...",
      "full": "https://images.unsplash.com/...",
      "alt": "Beautiful landscape",
      "photographer": "John Doe",
      "photographerUrl": "https://unsplash.com/@johndoe",
      "photographerAvatar": "https://...",
      "downloadUrl": "https://...",
      "likes": 1234,
      "width": 1920,
      "height": 1080,
      "color": "#123456",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "per_page": 20,
  "cached": false
}
```

## 2. Get Random Images

Fetch random images (optionally filtered by query):

```javascript
// GET /api/images/random?count=10&query=nature
const fetchRandom = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/images/random`, {
      params: {
        count: 10,
        query: 'nature' // Optional
      }
    });
    
    if (response.data.success) {
      console.log('Random images:', response.data.images);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 3. Get Image by ID

Fetch a specific image by its ID:

```javascript
// GET /api/images/:id
const fetchImageById = async (imageId) => {
  try {
    const response = await axios.get(`${API_URL}/api/images/${imageId}`);
    
    if (response.data.success) {
      console.log('Image details:', response.data.image);
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Image not found');
    }
  }
};
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "abc123",
    "url": "https://images.unsplash.com/...",
    "thumb": "https://images.unsplash.com/...",
    "full": "https://images.unsplash.com/...",
    "raw": "https://images.unsplash.com/...",
    "alt": "Image description",
    "photographer": "John Doe",
    "photographerUrl": "https://unsplash.com/@johndoe",
    "downloadUrl": "https://...",
    "likes": 1234,
    "width": 1920,
    "height": 1080,
    "color": "#123456",
    "description": "Full description...",
    "createdAt": "2024-01-01T00:00:00Z",
    "location": { ... },
    "tags": ["nature", "landscape"],
    "exif": { ... }
  },
  "cached": false
}
```

## 4. Get Collection Images

Fetch images from a specific collection (requires authentication):

```javascript
// GET /api/images/collection/:collectionId?page=1&per_page=20
const fetchCollection = async (collectionId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/images/collection/${collectionId}`,
      {
        params: {
          page: 1,
          per_page: 20
        },
        withCredentials: true // Important for session-based auth
      }
    );
    
    if (response.data.success) {
      console.log('Collection images:', response.data.images);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## React Component Example

Here's a complete React component that displays trending images:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function TrendingImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingImages();
  }, []);

  const fetchTrendingImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/images/trending`, {
        params: { page: 1, per_page: 20 }
      });
      
      if (response.data.success) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error('Error fetching trending images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.thumb}
            alt={image.alt}
            className="w-full h-64 object-cover rounded-lg"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
            <p className="text-white text-sm font-medium">
              Photo by {image.photographer}
            </p>
            <p className="text-white text-xs">{image.likes} likes</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrendingImages;
```

## Notes

- All endpoints are rate-limited for protection
- Trending and single image endpoints are cached for better performance
- Image URLs come directly from Unsplash - no proxying needed
- All endpoints return consistent image object structures
- Collection endpoint requires user authentication


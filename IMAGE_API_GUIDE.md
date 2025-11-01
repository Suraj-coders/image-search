# Image API Integration Guide

## Overview
This guide explains the new Image API endpoints and how they're integrated into the frontend.

## Backend API Endpoints

### 1. **GET `/api/images/trending`**
Get trending/popular images from Unsplash.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Images per page, max 30 (default: 20)

**Response:**
```json
{
  "success": true,
  "images": [...],
  "page": 1,
  "per_page": 20,
  "total": 20
}
```

### 2. **GET `/api/images/random`**
Get random images from Unsplash.

**Query Parameters:**
- `count` (optional): Number of images, max 30 (default: 10)
- `query` (optional): Filter random images by keyword

**Response:**
```json
{
  "success": true,
  "images": [...],
  "count": 10
}
```

### 3. **GET `/api/images/:id`**
Get a specific image by its ID.

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "...",
    "url": "...",
    "thumb": "...",
    "full": "...",
    "photographer": "...",
    "likes": 123,
    ...
  }
}
```

## Frontend Components

### 1. **TrendingImages Component**
- Displays trending/popular images
- Shows 12 images by default
- Includes loading states and error handling

**Location:** `client/src/components/TrendingImages.jsx`

### 2. **RandomImages Component**
- Displays random images
- Includes a refresh button to get new random images
- Optional query parameter for filtered random images

**Location:** `client/src/components/RandomImages.jsx`

### 3. **Updated Dashboard**
- Added tab navigation: Trending, Random, Search
- Shows trending images by default
- Integrated all three view modes

## How to Use

### Testing the API

1. **Get Trending Images:**
```bash
curl http://localhost:4000/api/images/trending?page=1&per_page=12
```

2. **Get Random Images:**
```bash
curl http://localhost:4000/api/images/random?count=10
```

3. **Get Specific Image:**
```bash
curl http://localhost:4000/api/images/IMAGE_ID
```

### Using in Frontend

The Dashboard now has three tabs:
- **Trending**: Shows popular images from Unsplash
- **Random**: Shows random images with refresh option
- **Search**: Your existing search functionality

## Image Object Structure

All endpoints return images with this structure:
```javascript
{
  id: "string",
  url: "string",        // Regular size image URL
  thumb: "string",      // Thumbnail URL
  full: "string",       // Full size URL
  alt: "string",        // Alt text
  photographer: "string",
  photographerUrl: "string",
  photographerAvatar: "string",
  downloadUrl: "string",
  likes: number,
  width: number,
  height: number,
  color: "string"       // Dominant color hex
}
```

## Next Steps

1. **Install Dependencies** (if needed):
   ```bash
   cd server
   npm install
   ```

2. **Start the Server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Start the Client:**
   ```bash
   cd client
   npm run dev
   ```

4. **Test in Browser:**
   - Login to the application
   - Navigate between Trending, Random, and Search tabs
   - Images should load automatically

## Notes

- All endpoints are public (no authentication required for viewing images)
- Images are fetched from Unsplash API
- The frontend handles loading and error states
- Images use lazy loading for better performance


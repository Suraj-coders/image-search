// server/routes/images.js
const express = require('express');
const axios = require('axios');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();


router.get('/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.per_page) || 20, 30);

    const response = await axios.get('https://api.unsplash.com/photos', {
      params: {
        order_by: 'popular',
        per_page: perPage,
        page
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = response.data.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      full: img.urls.full,
      alt: img.alt_description || img.description || 'Image',
      photographer: img.user.name,
      photographerUrl: img.user.links.html,
      photographerAvatar: img.user.profile_image?.small,
      downloadUrl: img.links.download,
      likes: img.likes,
      width: img.width,
      height: img.height,
      color: img.color
    }));

    res.json({
      success: true,
      images,
      page,
      per_page: perPage,
      total: images.length
    });
  } catch (err) {
    console.error('Error fetching trending images:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending images',
      error: err.message
    });
  }
});


router.get('/random', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 10, 30);
    const query = req.query.query || null;

    const params = {
      count,
      orientation: 'landscape'
    };
    
    if (query) {
      params.query = query;
    }

    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params,
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = (Array.isArray(response.data) ? response.data : [response.data]).map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      full: img.urls.full,
      alt: img.alt_description || img.description || 'Image',
      photographer: img.user.name,
      photographerUrl: img.user.links.html,
      photographerAvatar: img.user.profile_image?.small,
      downloadUrl: img.links.download,
      likes: img.likes,
      width: img.width,
      height: img.height,
      color: img.color
    }));

    res.json({
      success: true,
      images,
      count: images.length
    });
  } catch (err) {
    console.error('Error fetching random images:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching random images',
      error: err.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const image = {
      id: response.data.id,
      url: response.data.urls.regular,
      thumb: response.data.urls.small,
      full: response.data.urls.full,
      raw: response.data.urls.raw,
      alt: response.data.alt_description || response.data.description || 'Image',
      photographer: response.data.user.name,
      photographerUrl: response.data.user.links.html,
      photographerAvatar: response.data.user.profile_image?.small,
      downloadUrl: response.data.links.download,
      likes: response.data.likes,
      width: response.data.width,
      height: response.data.height,
      color: response.data.color,
      description: response.data.description,
      location: response.data.location,
      tags: response.data.tags?.map(tag => tag.title)
    };

    res.json({
      success: true,
      image
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    console.error('Error fetching image:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching image',
      error: err.message
    });
  }
});

module.exports = router;


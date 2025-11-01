// server/routes/search.js
const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/top-searches', async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          term: '$_id',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      topSearches
    });
  } catch (err) {
    console.error('Error fetching top searches:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching top searches',
      error: err.message
    });
  }
});


router.post('/search', isAuthenticated, async (req, res) => {
  try {
    const { term } = req.body;

    if (!term || term.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const searchTerm = term.trim().toLowerCase();

    // Save search to database
    await Search.create({
      userId: req.user._id,
      term: searchTerm,
      timestamp: new Date()
    });


    const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: searchTerm,
        per_page: 30,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = unsplashResponse.data.results.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      alt: img.alt_description || img.description || 'Image',
      photographer: img.user.name,
      photographerUrl: img.user.links.html,
      downloadUrl: img.links.download
    }));

    res.json({
      success: true,
      term: searchTerm,
      count: images.length,
      images
    });

  } catch (err) {
    console.error('Error searching images:', err);
    
    if (err.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Invalid Unsplash API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error searching images',
      error: err.message
    });
  }
});

module.exports = router;
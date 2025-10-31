// server/routes/history.js
const express = require('express');
const Search = require('../models/Search');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get user's search history
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('term timestamp -_id');

    res.json({
      success: true,
      history
    });
  } catch (err) {
    console.error('Error fetching search history:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching search history',
      error: err.message
    });
  }
});

module.exports = router;
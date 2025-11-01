const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true
  },
  facebookId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: String,
  provider: {
    type: String,
    enum: ['google', 'facebook', 'github'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

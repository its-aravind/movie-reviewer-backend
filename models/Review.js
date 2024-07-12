// models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Review', reviewSchema);

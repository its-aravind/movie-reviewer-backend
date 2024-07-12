// models/Movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 1,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Movie', movieSchema);

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().populate('reviews');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single movie
router.get('/:id', getMovie, (req, res) => {
  res.json(res.movie);
});

// Create a movie
router.post('/', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    releaseYear: req.body.releaseYear,
  });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add review for a movie
router.post('/:userId/:movieId/reviews', async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    const { rating, comment } = req.body;

    const newReview = new Review({
      user: userId,
      movie: movieId,
      rating,
      comment
    });

    const savedReview = await newReview.save();

    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    res.json({ msg: 'Review added successfully', savedReview });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get a single movie by ID
async function getMovie(req, res, next) {
  let movie;
  try {
    movie = await Movie.findById(req.params.id).populate('reviews');
    if (movie == null) {
      return res.status(404).json({ message: 'Movie not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.movie = movie;
  next();
}

module.exports = router;

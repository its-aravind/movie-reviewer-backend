// routes/movies.js

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

// Update a movie
// router.patch('/:id', getMovie, async (req, res) => {
//   if (req.body.title != null) {
//     res.movie.title = req.body.title;
//   }
//   if (req.body.releaseYear != null) {
//     res.movie.releaseYear = req.body.releaseYear;
//   }
//   try {
//     const updatedMovie = await res.movie.save();
//     res.json(updatedMovie);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Delete a movie
// router.delete('/:id', getMovie, async (req, res) => {
//   try {
//     await Review.deleteMany({ movie: res.movie._id }); // Delete associated reviews
//     await res.movie.remove();
//     res.json({ message: 'Deleted movie' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Add review for a movie
router.post('/:userId/:movieId/reviews', async (req, res) => {
  try {

    const movieId=req.params.movieId;


    const newReview = new Review({
      user: req.params.userId,
      movie: req.params.movieId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    const savedReview = await newReview.save();


    const movie = await Movie.findOneAndUpdate(
        { movieId },
        { $push: { reviews: savedReview._id } },
        { new: true }
      );
  
      if (!movie) {
        return res.status(404).json({ msg: 'Movie not found' });
      }
  
      res.json({ msg: 'Review added successfully', savedReview });


    // movie.reviews.push(savedReview._id);
    // movie.save();
 //   console.log(movie)
    // movie.averageRating = await calculateAverageRating(movie.reviews);

    // await movie.save();
 //   res.status(201).json({ message: 'review added' });
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message });
  }
});

// Helper function to calculate average rating
// async function calculateAverageRating(reviewIds) {
//   const reviews = await Review.find({ _id: { $in: reviewIds } });
//   const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
//   return totalRatings / reviews.length;
// }

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

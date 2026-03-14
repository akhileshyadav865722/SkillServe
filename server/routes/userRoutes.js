const express = require('express');
const router = express.Router();
const { getReviews } = require('../controllers/reviewController');
const { getUserProfile } = require('../controllers/userController');

// Get public user profile
router.route('/:id').get(getUserProfile);

// We re-route reviews attached to users here
router.route('/:professionalId/reviews').get(getReviews);

module.exports = router;

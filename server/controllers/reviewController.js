const Review = require('../models/Review');
const Request = require('../models/Request');

// @desc    Add review
// @route   POST /api/requests/:id/reviews/:professionalId
// @access  Private (Client only)
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id: requestId, professionalId } = req.params;

    // Verify user is a client
    if (req.user.role !== 'client') {
       return res.status(403).json({ message: 'Only clients can leave reviews' });
    }

    // Verify the request exists and belongs to the current user
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.createdBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized to review this request' });
    }

    // Verify the request is actually completed
    if (request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed requests' });
    }

    // Verify the professional actually worked on this request (was accepted)
    const isAcceptedApplicant = request.applicants.find(
      app => app.user.toString() === professionalId && app.status === 'accepted'
    );
     
    if (!isAcceptedApplicant) {
      return res.status(400).json({ message: 'This professional was not accepted for this request' });
    }

    // Create the review
    const newReview = await Review.create({
      rating,
      review,
      reviewer: req.user.id,
      professional: professionalId,
      request: requestId
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
       return res.status(400).json({ message: 'You have already reviewed this professional for this request' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get reviews for a professional
// @route   GET /api/users/:professionalId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ professional: req.params.professionalId })
      .populate('reviewer', 'name email')
      .populate('request', 'title category');
      
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

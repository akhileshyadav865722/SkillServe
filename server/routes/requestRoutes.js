const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
  getMyRequests,
  updateRequestStatus,
  updateApplicantStatus,
  applyForRequest
} = require('../controllers/requestController');
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/me')
  .get(protect, getMyRequests);

router.route('/')
  .get(getRequests)
  .post(protect, createRequest);

router.route('/:id/status')
  .put(protect, updateRequestStatus);

router.route('/:id/apply')
  .post(protect, applyForRequest);

router.route('/:id/applicants/:userId')
  .put(protect, updateApplicantStatus);

router.route('/:id/reviews/:professionalId')
  .post(protect, addReview);

router.route('/:id')
  .get(getRequest)
  .delete(protect, deleteRequest);

module.exports = router;

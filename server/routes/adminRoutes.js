const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  getAllRequests,
  deleteRequest
} = require('../controllers/adminController');

// All administrative routes require full auth + admin role
router.use(protect);
router.use(admin);

// --- Analytics & Statistics ---
router.get('/stats', getPlatformStats);

// --- User Management Matrix ---
router.route('/users')
  .get(getAllUsers);
router.route('/users/:id')
  .delete(deleteUser);

// --- Service Request Matrix ---
router.route('/requests')
  .get(getAllRequests);
router.route('/requests/:id')
  .delete(deleteRequest);

module.exports = router;

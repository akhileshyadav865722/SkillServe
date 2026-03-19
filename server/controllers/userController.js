const User = require('../models/User');

// @desc    Get all professional users
// @route   GET /api/users/professionals
// @access  Public
exports.getProfessionals = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Build query to find users with role 'professional'
    let query = { role: 'professional' };
    
    // Add location filter if provided (case-insensitive search)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Fetch professionals, sorted by rating descending
    const professionals = await User.find(query)
      .select('name email location phone bio role skills experience rating numReviews profileImage createdAt')
      .sort({ rating: -1 });

    res.status(200).json(professionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching professionals' });
  }
};

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    // Only return safe public fields
    const user = await User.findById(req.params.id)
      .select('name email location phone bio role skills experience rating numReviews profileImage resume createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

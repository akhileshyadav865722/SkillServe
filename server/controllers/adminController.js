const User = require('../models/User');
const Request = require('../models/Request');
const Conversation = require('../models/Conversation');

// @desc    Get total platform statistical metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalRequests = await Request.countDocuments({});
    const totalConversations = await Conversation.countDocuments({});
    
    // Group users by role natively in MongoDB
    const clients = await User.countDocuments({ role: 'client' });
    const professionals = await User.countDocuments({ role: 'professional' });

    res.json({
      totalUsers,
      totalRequests,
      totalConversations,
      clients,
      professionals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Secure Server Error extracting Stats' });
  }
};

// @desc    Get all active non-admin platform users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 }); // Newest first
    res.json(users);
  } catch (error) {
    res.error(error);
    res.status(500).json({ message: 'Secure Server Error extracting Users' });
  }
};

// @desc    Force-delete user account and cascade requests
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Target User not found.' });
    }
    
    // Security check against nested admins
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot execute deletion protocol on a fellow Administrator.' });
    }
    
    // Cascade delete: destroy all open requests originated by this user
    await Request.deleteMany({ createdBy: user._id });
    
    // Execute final account termination
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User and associated requests structurally removed from platform.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Platform error during user deletion protocol.' });
  }
};

// @desc    Get all current service requests globally
// @route   GET /api/admin/requests
// @access  Private/Admin
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('createdBy', 'name email profileImage role')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Secure Server Error extracting Requests' });
  }
};

// @desc    Force-delete a specific service request
// @route   DELETE /api/admin/requests/:id
// @access  Private/Admin
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Target Request not found.' });
    }
    
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request structurally removed from platform.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Platform error during request deletion protocol.' });
  }
};

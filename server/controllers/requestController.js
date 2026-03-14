const Request = require('../models/Request');

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (Client only)
exports.createRequest = async (req, res) => {
  try {
    // Check if the user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can post service requests' });
    }

    const { title, description, category, requiredSkills, budget, location, deadline } = req.body;

    const request = await Request.create({
      title,
      description,
      category,
      requiredSkills,
      budget,
      location,
      deadline,
      createdBy: req.user.id
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Public
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('createdBy', 'name email rating');
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Public
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('createdBy', 'name email rating')
      .populate('applicants.user', 'name email skills rating experience'); // Populate applied professionals inside the object

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    // Address issue if invalid ObjectId causes crash
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Request not found' })
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Creator only)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure only the original creator can delete
    if (request.createdBy.toString() !== req.user.id.toString()) {
       return res.status(401).json({ message: 'Not authorized to delete this request' });
    }

    await request.deleteOne();

    res.status(200).json({ message: 'Request removed' });
  } catch (error) {
    console.error(error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Request not found' })
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current client's requests
// @route   GET /api/requests/me
// @access  Private (Client only)
exports.getMyRequests = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can view their requests here' });
    }
    const requests = await Request.find({ createdBy: req.user.id })
      .populate('applicants.user', 'name email skills rating experience');
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update request status (e.g. mark completed)
// @route   PUT /api/requests/:id/status
// @access  Private (Creator only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.createdBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();
    
    // Repopulate to return full updated object
    request = await Request.findById(req.params.id).populate('applicants.user', 'name email skills rating experience');
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update applicant status (accept/reject)
// @route   PUT /api/requests/:id/applicants/:userId
// @access  Private (Creator only)
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.createdBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applicantIndex = request.applicants.findIndex(
      app => app.user.toString() === req.params.userId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Applicant not found on this request' });
    }

    request.applicants[applicantIndex].status = status;
    
    // If accepted, maybe change request status to in-progress
    // if (status === 'accepted') {
    //   request.status = 'in-progress';
    // }

    await request.save();
    
    request = await Request.findById(req.params.id).populate('applicants.user', 'name email skills rating experience');
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Apply for a request
// @route   POST /api/requests/:id/apply
// @access  Private (Professional only)
exports.applyForRequest = async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can apply' });
    }

    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if already applied
    const alreadyApplied = request.applicants.find(
      app => app.user.toString() === req.user.id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this request' });
    }

    request.applicants.push({ user: req.user.id });
    await request.save();

    res.status(200).json({ message: 'Successfully applied' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  review: {
    type: String,
    required: [true, 'Please add some text for the review'],
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  professional: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent a user from submitting more than one review per professional per request
ReviewSchema.index({ request: 1, reviewer: 1, professional: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function (professionalId) {
  const obj = await this.aggregate([
    {
      $match: { professional: professionalId },
    },
    {
      $group: {
        _id: '$professional',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await this.model('User').findByIdAndUpdate(professionalId, {
        rating: Math.ceil(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews
      });
    } else {
        await this.model('User').findByIdAndUpdate(professionalId, {
            rating: 0,
            numReviews: 0
          });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.professional);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.professional);
});

module.exports = mongoose.model('Review', ReviewSchema);

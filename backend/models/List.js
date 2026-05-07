const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a list name'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Ties this list to a specific user
  }
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);

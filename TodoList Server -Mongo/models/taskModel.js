// models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
  },
  due_date: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); 

// Create a task
router.post('/', async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      due_date,
      priority,
      user: req.user.id, 
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all tasks for a user with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  try {
    const totalTasks = await Task.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(totalTasks / limit);
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    res.json({
      tasks,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update a task 
router.put('/:id', async (req, res) => {
  const { title, description, due_date, status, priority } = req.body;
  const updatedFields = { title, description, due_date, status, priority };
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatedFields,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ msg: 'Task not found or user not authorized' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Partially update a task
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body, 
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ msg: 'Task not found or user not authorized' });
        }
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found or user not authorized' });
    }
    res.json({ msg: 'Task was deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
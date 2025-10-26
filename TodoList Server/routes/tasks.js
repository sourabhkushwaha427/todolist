const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  const user_id = req.user.user_id;

  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, due_date, priority, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, due_date, priority, user_id]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  const user_id = req.user.user_id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const totalResult = await pool.query(
      'SELECT COUNT(*) AS total FROM tasks WHERE user_id = $1',
      [user_id]
    );
    const totalTasks = parseInt(totalResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalTasks / limit);
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [user_id, limit, offset]
    );

    res.json({
      tasks: tasks.rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2',
      [id, req.user.user_id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json(task.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, status, priority } = req.body;

    try {
        const updatedTask = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, due_date = $3, status = $4, priority = $5 WHERE task_id = $6 AND user_id = $7 RETURNING *',
            [title, description, due_date, status, priority, id, req.user.user_id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ msg: "Task not found or user not authorized" });
        }
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body;

    // Build the query dynamically
    const fields = [];
    const values = [];
    let query = 'UPDATE tasks SET ';
    
    if (status) {
        fields.push(`status = $${fields.length + 1}`);
        values.push(status);
    }
    if (priority) {
        fields.push(`priority = $${fields.length + 1}`);
        values.push(priority);
    }
    if (fields.length === 0) {
        return res.status(400).json({ msg: "No fields to update provided" });
    }

    query += fields.join(', ');
    query += ` WHERE task_id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`;
    values.push(id, req.user.user_id);
    
    try {
        const updatedTask = await pool.query(query, values);

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ msg: "Task not found or user not authorized" });
        }
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await pool.query(
      'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.user_id]
    );

    if (deleteTask.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found or user not authorized' });
    }

    res.json({ msg: 'Task was deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
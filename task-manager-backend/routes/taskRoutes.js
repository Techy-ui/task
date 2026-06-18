const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 1. CREATE a task (Safely captures body parameters)
router.post('/', auth, async (req, res) => {
    try {
        // Find the user who is logged in making the request
        const user = await User.findById(req.userId);
        
        let teamArray = [];
        // Extract assignedTo from request body safely
        if (req.body.assignedTo && typeof req.body.assignedTo === 'string') {
            teamArray = req.body.assignedTo
                .split(',')
                .map(username => username.trim())
                .filter(username => username.length > 0);
        } else if (Array.isArray(req.body.assignedTo)) {
            teamArray = req.body.assignedTo;
        }

        // Create the task matching your schema properties precisely
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description || '',
            assignedTo: teamArray,
            createdBy: req.userId,
            creatorName: user ? user.username : 'Unknown'
        });

        const savedTask = await newTask.save();
        
        // Notify all clients via WebSockets
        req.io.emit('task_changed', { action: 'create', task: savedTask });
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Backend Error on Create:", err);
        res.status(400).json({ message: err.message });
    }
});

// 2. GET Filtered Feed: Show tasks if user is the creator OR an assignee
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const tasks = await Task.find({
            $or: [
                { createdBy: req.userId },
                { assignedTo: user.username }
            ]
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. UPDATE task status
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        req.io.emit('task_changed', { action: 'update', task: updatedTask });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        req.io.emit('task_changed', { action: 'delete', id: req.params.id });
        res.json({ message: 'Task deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
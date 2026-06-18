const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    creatorName: { type: String, required: true }, // Saved to easily show who initiated the task
    assignedTo: [{ type: String, required: true }] // <-- Changed to an Array of Strings
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // <-- Built-in Node tool
const { Server } = require('socket.io'); // <-- Import Socket.io
require('dotenv').config();

const app = express();

// Create an HTTP Server to wrap our Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
    cors: {
        origin: "https://techy_ui.github.io", // Allow connections from your React app
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Pass our 'io' instance to our requests so our routes can emit live updates
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Import Routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Task Manager Backend with WebSockets is running!');
});

// Listen for connection events from users
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Connect to MongoDB using 'server.listen' instead of 'app.listen'
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Database connection error:', err));
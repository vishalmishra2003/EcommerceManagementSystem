require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const route = require('./Route/route');
const { createServer } = require('http');
const socketIO = require('socket.io');

const app = express();
const DB_URL = process.env.DB;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(route);

// Database connection
mongoose.connect(DB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log(err));

// Create HTTP server for Express + Socket.IO
const server = createServer(app);

const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

// Store io in app for controller access
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for delivery status updates from delivery partners
    // socket.on('updateDeliveryStatus', (data) => {
    //     console.log("Delivery Status Update Received:", data);
    //     // Broadcast update to all connected clients
    //     io.emit('deliveryStatusUpdated', data);
    // });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`PORT is listening to ${process.env.PORT}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve the frontend file
app.get('/', (req, res) => {
    res.sendFile(path.join(__search, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('User connected');
    
    // Join a private room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });

    // Handle private messages
    socket.on('private-message', (data) => {
        // data contains: { roomId, message, sender }
        io.to(data.roomId).emit('receive-message', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

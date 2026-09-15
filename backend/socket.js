const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: 'https://rapidaid-frontend.onrender.com',  // Allow frontend connection
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);  

        socket.on('join', async (data) => {
            const { userId, userType } = data;
           

            if (!userId || !userType) {
                return socket.emit('error', { message: 'Missing user ID or type' });
            }

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (err) {
                console.error("Error updating socketId:", err.message);
            }
        });

        socket.on("send-location", (data) => {
             // Debugging line
            socket.emit("location + Data", data);  // Can change to broadcast if needed
        });

        socket.on('update-location-captain', async (data) => {
            
            const { userId, location } = data;
           
            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
                
                socket.broadcast.emit('location-updated', data);  
            } catch (err) {
                console.error("Error updating captain location:", err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
       
    } else {
        console.log('Socket.io not initialized.');
    }
};  

module.exports = { initializeSocket, sendMessageToSocketId };

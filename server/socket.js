const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all origins for now (adjust for production)
            methods: ["GET", "POST"]
        }
    });

    // authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const secret = process.env.JWT_SECRET || 'fallback_secret_only_for_dev_change_in_env';
            const decoded = jwt.verify(token, secret);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id} (User: ${socket.user.mobile})`);

        // 1. User/Driver joins a ride room
        socket.on('join_ride', ({ rideId }) => {
            socket.join(rideId);
            console.log(`User ${socket.user.mobile} joined ride room: ${rideId}`);
        });

        // 2. Driver Location Update
        socket.on('driver_location_update', ({ rideId, lat, lng, heading }) => {
            // Broadcast to everyone in the room (specifically the rider)
            socket.to(rideId).emit('driver_location_update', {
                lat,
                lng,
                heading
            });
        });

        // 3. Ride Accepted
        socket.on('ride_accepted', ({ rideId, driverDetails }) => {
            socket.to(rideId).emit('ride_accepted', {
                rideId,
                driverDetails,
                status: 'ACCEPTED'
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket Disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };

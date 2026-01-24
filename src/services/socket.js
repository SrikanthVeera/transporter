import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    socket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket'] // Force WebSocket for better performance
    });

    socket.on('connect', () => {
        console.log('✅ Connected to Socket Server:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('❌ Socket Connection Error:', err.message);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const joinRideRoom = (rideId) => {
    if (socket) socket.emit('join_ride', { rideId });
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};

import { Server } from "socket.io";
import User from '../models/userModel.js';

// Socket.io
let io;
let usersTracking = new Map(); // For users tracking

export const init = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.FRONT_END_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        usersTracking.set(userId, socket.id);
        
        socket.on("disconnect", () => {
            usersTracking.delete(userId);
            const updateStatus = async () => {
                await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { 
                        isActive: false,
                        lastSeen: new Date().toISOString()
                    }},
                )
            }
            updateStatus();

            if (userId) {
                io.emit("userStatus", {
                    userId,
                    status: "offline",
                    timestamp: new Date().toISOString(),
                });
            }
        });

        if (userId === 'undefined') {
            socket.disconnect();
            return;
        }

        const updateStatus = async () => {
            await User.findOneAndUpdate(
                { _id: userId },
                { isActive: true }
            )
        }
        updateStatus();

        io.emit("userStatus", {
            userId,
            status: "online",
            timestamp: new Date().toISOString(),
        });
        
    });

    return io;
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized! Please call init(server) first.')
    }

    return io;
}

export const getUsersTracking = () => {
    if (!usersTracking) {
        throw new Error('failed to track sockets');
    }

    return usersTracking;
}
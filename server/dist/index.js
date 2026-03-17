"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in development
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    // Join a classroom session
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        // Broadcast to others in the room
        socket.to(roomId).emit("user-connected", userId);
        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected from room ${roomId}`);
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
    // Quiz events
    socket.on("launch-quiz", (roomId, quizId) => {
        console.log(`Quiz ${quizId} launched in room ${roomId}`);
        socket.to(roomId).emit("quiz-started", quizId);
    });
    socket.on("submit-quiz-score", (roomId, data) => {
        // Forward the score to the teacher
        socket.to(roomId).emit("student-score-update", data);
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});

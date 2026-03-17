import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in development
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join a classroom session
  socket.on("join-room", (roomId: string, userId: string) => {
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
  socket.on("launch-quiz", (roomId: string, quizId: string) => {
    console.log(`Quiz ${quizId} launched in room ${roomId}`);
    socket.to(roomId).emit("quiz-started", quizId);
  });

  socket.on("submit-quiz-score", (roomId: string, data: { userId: string; score: number }) => {
    // Forward the score to the teacher
    socket.to(roomId).emit("student-score-update", data);
  });

});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});

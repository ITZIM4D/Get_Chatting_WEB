const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { Pool } = require("pg");

// Setup Express + HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.io with CORS
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }    
});

// Setup PostgreSQL pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Current landing page
app.get("/", (req, res) => {
  res.send("Backend is alive!");
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for messages from THIS socket
  socket.on("sendMessage", async (msg) => {
    try {
      const result = await pool.query(
        "INSERT INTO messages (content) VALUES ($1) RETURNING *",
        [msg]
      );

      // Broadcast the saved message to all clients
      io.emit("receiveMessage", result.rows[0]);
    } catch (err) {
      console.error("DB error:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(8080, () => {
  console.log("Server with Socket.io running on http://localhost:8080");
});

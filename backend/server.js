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

  // Listen for messages from this socket
  socket.on("sendMessage", async (roomID, userID, message) => {
    try {
      // Result is blocking so async/await makes it asynchronously run until it returns
      const result = await pool.query(
        "INSERT INTO messages (chatroom_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
        [roomID, userID, message]
      );
      // Broadcast the saved message to all clients
      io.emit("receiveMessage", result.rows[0]);
    } catch (err) {
      console.error("DB error in receiveMessage:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("attemptLogin", async (username, password) => {
    try {
      const result = await pool.query(
        "SELECT id, username, password FROM users WHERE username = ($1)" , [username]
      );

    if (result.rows.length === 0) {
      io.emit("loginSuccess", false, -1);
      return;
    }

      const storedUsername = result.rows[0]['username'];
      const storedPassword = result.rows[0]['password'];
      const storedUserID   = result.rows[0]['id'];

      if (storedUsername == username && storedPassword == password) {
        io.emit("loginSuccess", true, storedUserID);
      } else {
        io.emit("loginSuccess", false, -1);
      }
    } catch (err) {
      console.error("DB error in attemptLogin:", err);
    }
  });

});

// Server is on port 8080
server.listen(8080, () => {
  console.log("Server with Socket.io running on http://localhost:8080");
});

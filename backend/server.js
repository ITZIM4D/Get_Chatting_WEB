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
            const messagesResult = await pool.query(
                "INSERT INTO Messages (chatroom_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
                [roomID, userID, message]
            );

            const usersResult = await pool.query(
                "SELECT (username) FROM Users WHERE id = $1", 
                [userID]
            )
            
            // Broadcast the saved message to clients
            io.emit("receiveMessage", messagesResult.rows[0]["content"], usersResult.rows[0]["username"]);
        } catch (err) {
            console.error("DB error in receiveMessage:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    socket.on("attemptLogin", async (username, password) => {
        try {
            username = username.trim().toLowerCase();
            const result = await pool.query(
                "SELECT id, username, password FROM Users WHERE username = ($1)",
                [username]
            );

            if (result.rows.length == 0) {
                socket.emit("loginSuccess", false, -1);
                return;
            }

            const storedUsername = result.rows[0]['username'];
            const storedPassword = result.rows[0]['password'];
            const storedUserID   = result.rows[0]['id'];

            if (storedUsername == username && storedPassword == password) {
                socket.emit("loginSuccess", true, storedUserID);
            } else {
                socket.emit("loginSuccess", false, -1);
            }
        } catch (err) {
            console.error("Error in attemptLogin:", err);
        }
    });

    socket.on("attemptRegister", async (newUsername, newPassword) => {
        try {
            newUsername = newUsername.toLowerCase();
            const result = await pool.query(
                "SELECT username FROM Users WHERE username = $1", 
                [newUsername]
            )

            if (result.rows[0] == undefined) {
                await pool.query(
                    "INSERT INTO Users (username, password) VALUES ($1, $2)",
                    [newUsername, newPassword]
                );
                socket.emit("registerSuccess");
            } else {
                let err = "Username already exists"
                socket.emit("registerFail", err);
            }
        } catch (err) {    
            console.error("Error in attemptRegister", err);
        }
    })

    socket.on("createRoom", async (roomName, roomDesc) => {
        try {
            // Check if roomName exists
            const matchingRooms = await pool.query(
                "SELECT * FROM ChatRooms WHERE name = $1", 
                [roomName]
            );

            // Make room name if not exists
            if (matchingRooms.rows.length == 0) {
                const makeRoom = await pool.query(
                    "INSERT INTO ChatRooms (name, description) VALUES ($1, $2) RETURNING *", 
                    [roomName, roomDesc]
                );
                const roomID = makeRoom.rows[0].id;
                socket.emit("createRoomSuccess", roomID);
            } else {
                // Emit error if exists
                socket.emit("roomAlreadyExists");
            }
            
        } catch (err) {
            console.log("Error in createRoom", err)
        }
    });

    socket.on("getRoomInfo", async (roomID) => {
        try {
            const roomInfo = await pool.query(
                "SELECT * FROM ChatRooms WHERE id = $1",
                [roomID]
            )
            socket.emit("getRoomInfo", roomInfo.rows[0]);
        } catch (err) {
            console.log("Error in getRoomInfo", err);
        }
    })

    socket.on("getRooms", async () => {
        try {
            const rooms = await pool.query(
                "SELECT * FROM ChatRooms"
            )
            socket.emit("getRooms", rooms.rows);
        } catch (err) {
            console.log("Error in getRooms", err);
        }
    })

});

// Server is on port 8080
server.listen(8080, () => {
    console.log("Server with Socket.io running on http://localhost:8080");
});

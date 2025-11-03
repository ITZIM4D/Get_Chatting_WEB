import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../javascript/socket";
import "../styles/ChatRoom.module.css";
import ButtonOverlay from "./ButtonOverlay.jsx";

function ChatRoom() {
    const { roomID } = useParams();
    const [roomInfo, setRoomInfo] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Redirect if user isn't logged in
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) { return null; }

    // Call param function once on first render
    useEffect(() => {
        const handleMessage = (msg, username) => {
            setMessages((prev) => [...prev, msg]);
            setUsername(username);
        };
        socket.emit("getRoomInfo", roomID);

        socket.on("receiveMessage", handleMessage);
        socket.on("getRoomInfo", (roomInfo) => {
            setRoomInfo(roomInfo);
        })

        return () => {
            socket.off("receiveMessage", handleMessage); 
            socket.off("getRoomInfo");
        };
    }, [roomID]);

    const sendMessage = () => {
        if (message.trim() === "") return;
        const userID = user.userID;
        const roomID = user.roomID;

        socket.emit("sendMessage", roomID, userID, message);

        setMessage("");
    };

    

    // Remake chatbox eventually
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> {roomInfo?.name || "Loading..."} </title>
                </Helmet>
            </HelmetProvider>
            <ButtonOverlay/>
            <div>
                <h1>{roomInfo?.name || "Loading..."}</h1>
                <div style={{ border: "1px solid #ccc", height: "200px", overflowY: "scroll" }}>
                    {messages.map((m, i) => (
                        <div key={i}>{username + ": " + (m.content || m)}</div>
                    ))}
                </div>
                <input value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </>
    );
}

export default ChatRoom;

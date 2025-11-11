import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../javascript/socket";
import styles from "../styles/ChatRoom.module.css";
import ButtonOverlay from "./ButtonOverlay.jsx";

function ChatRoom() {
    const { roomID } = useParams();
    const [roomInfo, setRoomInfo] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
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
        socket.emit("joinRoom", roomID);
        socket.on("joinedRoom", () => {
            socket.emit("getRoomInfo", roomID);
            socket.emit("getMessages", roomID);
        })

        socket.on("getMessages", (msgs) => setMessages(msgs));
        socket.on("getRoomInfo", (roomInfo) => {
            setRoomInfo(roomInfo);
        })
        socket.on("receiveMessage", (msg, username) =>
            setMessages((prev) => [...prev, { content: msg, username }])
        );

        return () => {
            socket.off("joinedRoom");
            socket.off("receiveMessage"); 
            socket.off("getRoomInfo");
            socket.off("getMessages");
        };
    }, [roomID]);

    const sendMessage = () => {
        if (message.trim() === "") return;
        const userID = user.userID;

        socket.emit("sendMessage", roomID, userID, message);

        setMessage("");
    };

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> {roomInfo?.name || "Loading..."} </title>
                </Helmet>
            </HelmetProvider>
            <ButtonOverlay/>
            <div className={styles.chatRoom}>
                    <h1 className={styles.roomName}>{roomInfo?.name || "Loading..."}</h1>
                    <div className={styles.chatAndMessageBox}>
                        <div className={styles.chatBox}>
                            {messages.map((m, i) => (
                                <div key={i}>{m.username + ": " + m.content}</div>
                            ))}
                        </div>
                    <div className={styles.inputBox}>
                        <input value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatRoom;

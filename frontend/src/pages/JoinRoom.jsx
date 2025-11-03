import "../styles/ChatRoom.module.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonOverlay from "./ButtonOverlay.jsx";
import socket from "../javascript/socket";
import styles from "../styles/JoinRoom.module.css";

function JoinRoom() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const changeRoom = (r) => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        user.roomID = r["id"];
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/room/" + r["id"])
    }

    useEffect(() => {
        socket.emit("getRooms");

        socket.on("getRooms", (rooms) => {
            setRooms(rooms);
        })

        return (() => {
            socket.off("getRooms");
        });
    }, []);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> { "Join Chatroom"} </title>
                </Helmet>
            </HelmetProvider>
            <ButtonOverlay/>
            <div className={styles.JoinRoom}>
                <div className={styles.roomList}>
                    {rooms.map((r, i) => (
                        <button onClick={() => {changeRoom(r)}} key={i}>{r["name"]}</button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default JoinRoom;
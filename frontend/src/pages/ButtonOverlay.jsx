import styles from "../styles/ButtonOverlay.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../javascript/socket";

function ButtonOverlay () {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomDesc, setRoomDesc] = useState("");
    const [roomID, setRoomID] = useState(JSON.parse(sessionStorage.getItem("user")).roomID);

    const generalChat = () => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        user.roomID = 1;
        setRoomID(1);
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/room/1");
    };

    const submitRoom = () => {
        socket.emit("createRoom", roomName, roomDesc);
        setShowPopup(false);
        setRoomName("");
        setRoomDesc("");
    };

    const joinRoom = () => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        setRoomID(0); 
        user.roomID = 0;
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/join-room");
    }

    const settings = () => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        setRoomID(0); 
        user.roomID = 0;
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/settings");
    }

    useEffect(() => {
        socket.on("createRoomSuccess", (newRoomID) => {
            let user = JSON.parse(sessionStorage.getItem("user"));
            user.roomID = newRoomID;
            setRoomID(newRoomID);
        });

        socket.on("roomAlreadyExists", () => {
            console.log("This room name already exists");
        });

        return(() => {
            socket.off("createRoomSuccess");
            socket.off("roomAlreadyExists");
        })
    }, [])

    useEffect(() => {
        if (roomID > 0) {
            navigate("/room/" + roomID);
        }
    }, [roomID])

    return (
        <>
            <div className={styles.buttonOverlay}>
                <button className={styles.buttonOverlayButton} onClick={generalChat}> Global Chat </button>
                <button className={styles.buttonOverlayButton} onClick={joinRoom}> Join Chatroom </button>
                <button className={styles.buttonOverlayButton} onClick={() => {setShowPopup(true)}}> Create Chatroom </button>
                <button className={styles.buttonOverlayButton} onClick={settings}> Settings </button>
                <button className={styles.buttonOverlayButton} onClick={() => {sessionStorage.clear(); navigate("/")}}> Logout </button>
            </div>

            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <input 
                            type="text" 
                            placeholder="Room name" 
                            value={roomName} 
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Room Description" 
                            value={roomDesc} 
                            onChange={(e) => setRoomDesc(e.target.value)}
                        />
                        <button onClick={submitRoom}>Create</button>
                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ButtonOverlay;
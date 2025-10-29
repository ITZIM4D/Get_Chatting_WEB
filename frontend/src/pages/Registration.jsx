import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../javascript/socket";
import styles from "../styles/Registration.module.css"

function Registration () {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userID, setUserID] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const attemptRegister = (e) => {
        e.preventDefault(); // Stop form from reloading page

        if (newPassword != confirmPassword) {
            setError("Passwords do not match");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setError("");
            setNewUsername(newUsername.trim());
            socket.emit("attemptRegister", newUsername, newPassword);
        }
    }

    useEffect(() => {
        socket.on("registerFail", (err) => {
            setError(err);
        });

        socket.on("registerSuccess", () => {
            console.log("You succesfully registered");

            socket.emit("attemptLogin", newUsername, newPassword);
        })

        socket.on("loginSuccess", (isSuccessful, userID) => {
            if (isSuccessful) {setUserID(userID)}
            else {setError("Error logging in after registering");}
        });

        return () => {
            socket.off("registerFail");
            socket.off("registerSuccess");
            socket.off("loginSuccess");
        };
    }, [newUsername, newPassword]);

    useEffect(() => {
        if (userID) {
            const user = {
                "username": newUsername, 
                "roomID": 1,
                "userID": userID
            }

            sessionStorage.setItem("user", JSON.stringify(user));
            navigate("/room/1");
        }
        
    }, [userID, navigate])

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> Registration </title>
                </Helmet>
            </HelmetProvider>
            <div className={styles.registration}>
                <h1> Registration </h1>
                <form onSubmit={attemptRegister}>
                    <input 
                        type="text" 
                        id="newUsername" 
                        name="newUsername" 
                        placeholder="New Username" 
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    /><br/><br/>
                    <input 
                        type="password"
                        id= "newPassword" 
                        name="newPassword" 
                        placeholder="New Password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    /><br/><br/>
                    <input 
                        type="password"
                        id= "confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    /><br/><br/>
                    <input type="submit" value="Register"/>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </>
    );
}

export default Registration
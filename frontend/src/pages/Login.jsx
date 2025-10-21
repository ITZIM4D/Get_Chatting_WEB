import { HelmetProvider } from 'react-helmet-async';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../javascript/socket";
import styles from "../styles/Login.module.css"

function Login () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");

    const navigate = useNavigate();

    const attemptLogin = async (e) => {
        e.preventDefault(); // Stop form from reloading page
        setError(""); // Clear old errors
        socket.emit("attemptLogin", username, password);

        await socket.on("loginSuccess", (isSuccessful, userID) => {
            isSuccessful ? correctLogin(userID): incorrectLogin();
        });
    }

    const correctLogin = (userID) => {
        console.log("You successfully logged in!");

        const user = {
            "username": username, 
            "roomID": 1,
            "userID": userID
        }

        sessionStorage.setItem("user", JSON.stringify(user)); // Make user data persist during sesssion
        socket.off("loginSuccess");
        navigate("/room/1");
    }

    const incorrectLogin = () => {
        setError("Incorrect username or password");
    }

    return (
        <>
            <HelmetProvider>
                <title> Login </title>
            </HelmetProvider>
            <div className={styles.login}>
                <div>
                    <h1> Login </h1>
                    <form onSubmit={attemptLogin}>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        /><br/><br/>
                        <input 
                            type="password"
                            id= "password" 
                            name="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br/><br/>
                        <input type="submit" value="Login"/>
                    </form>
                    {error && <p className={styles.error}>{error}</p>}
                    </div>
                    <div className={styles.register}>
                        <input type="button" value="Register" onClick={() => navigate("/registration")}/>
                    </div>
            </div>
        </>
    );
}

export default Login
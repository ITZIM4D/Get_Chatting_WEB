import { HelmetProvider } from 'react-helmet-async';
import { useState } from "react";
import socket from "../javascript/socket";
import styles from "../styles/Login.module.css"

function Login () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const attemptLogin = async (e) => {
        e.preventDefault(); // stop form from reloading page
        socket.emit("attemptLogin", username, password);

        await socket.on("loginSuccess", (isSuccessful) => {
            isSuccessful ? correctLogin(): incorrectLogin();
        });

    }

    const correctLogin = () => {
        console.log("You successfully logged in!");
    }

    const incorrectLogin = () => {
        console.log("Incorrect username or password");
    }

    return (
        <>
            <HelmetProvider>
                <title> Login </title>
            </HelmetProvider>
            <div className={styles.login}>
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
            </div>
        </>
    );
}

export default Login
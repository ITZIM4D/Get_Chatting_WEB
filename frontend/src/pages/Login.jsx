import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../javascript/socket";
import styles from "../styles/Login.module.css"

function Login () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate();

    const attemptLogin = (e) => {
        e.preventDefault(); // Stop form from reloading page
        setError(""); // Clear old errors
        socket.emit("attemptLogin", username, password);
    }

    useEffect(() => {
        function handleLoginSuccess(isSuccessful, id) {
            if (isSuccessful) {
                setUserID(id);
            }  
            else {
                setError("Incorrect username or password");
                setPassword("");
            }
        }

        socket.on("loginSuccess", handleLoginSuccess);

        return () => {
            socket.off("loginSuccess", handleLoginSuccess);
        };
    }, []); 

    useEffect(() => {
        if (userID) {
            const user = { username, roomID: 1, userID };
            sessionStorage.setItem("user", JSON.stringify(user));
            navigate("/room/1");
        }
    }, [userID, navigate, username]);


    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> Login </title>
                </Helmet>
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
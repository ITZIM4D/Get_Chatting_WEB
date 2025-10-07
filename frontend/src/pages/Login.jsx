import { Helmet } from "react-helmet"
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css"

function Login () {
    const[userName, setMessage] = useState("");

    const attemptLogin = () => {
        console.log("Yay!");
    }

    return (
        <>
            <Helmet>
                <title> Login </title>
            </Helmet>
            <div className={styles.login}>
                <h1> Login </h1>
                <label htmlFor="username"> Username </label>
                <input type="text" id="username" name="username"/>
                <label htmlFor="password"> Password </label>
                <input type="text" id= "password" name="password"/>
                <button onClick={attemptLogin}>Login</button>
            </div>
        </>
    );
}

export default Login
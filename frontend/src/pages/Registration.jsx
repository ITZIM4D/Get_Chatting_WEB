import { HelmetProvider } from 'react-helmet-async';
import socket from "../javascript/socket";
import styles from "../styles/Registration.module.css"

function Registration () {
    
    const attemptRegister = () => {

    }

    return (
        <>
            <HelmetProvider>
                <title> Login </title>
            </HelmetProvider>
            <div className={styles.registration}>
                <h1> Registration </h1>
                <form onSubmit={attemptRegister}>

                </form>
            </div>
        </>
    );
}

export default Registration
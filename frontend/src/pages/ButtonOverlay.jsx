import styles from "../styles/ButtonOverlay.module.css";
import { useNavigate } from "react-router-dom";

function ButtonOverlay () {
    const navigate = useNavigate();

    const generalChat = () => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        user["roomID"] = 1;
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/room/1");
    };

    const settings = () => {
        navigate("/settings");
    };

    const logout = () => {
        sessionStorage.clear();
        navigate("/")
    };

    return (
        <div className={styles.buttonOverlay}>
            <button type="button" onClick={generalChat}> General Chat </button>
            <button type="button" onClick={settings}> Settings </button>
            <button type="button" onClick={logout}> Logout </button>
        </div>
    );
}

export default ButtonOverlay;
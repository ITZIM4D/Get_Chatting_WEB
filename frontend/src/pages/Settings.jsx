import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ButtonOverlay from "./ButtonOverlay.jsx";

function Settings() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();

    // Redirect if user isn't logged in
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) { return null; }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title> Settings </title>
                </Helmet>
            </HelmetProvider>
            <ButtonOverlay/>
        </>
    );
}

export default Settings
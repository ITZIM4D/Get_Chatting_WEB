import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.jsx";
import Login from "./pages/Login.jsx"; 
import Registration from "./pages/Registration.jsx";
import Settings from "./pages/Settings.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/room/:roomID" element={<ChatRoom/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/join-room" element={<JoinRoom/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;
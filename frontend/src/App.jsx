import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.jsx";
import Login from "./pages/Login.jsx"; 
import Registration from "./pages/Registration.jsx";

import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/room/:roomId" element={<ChatRoom/>}/>
        <Route path="/registration" element={<Registration/>}/>
      </Routes>
    </Router>
  );
}

export default App;
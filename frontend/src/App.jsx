import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.jsx";
import Login from "./pages/Login.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/room/:roomId" element={<ChatRoom/>}/>
      </Routes>
    </Router>
  );
}

export default App;
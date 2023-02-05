import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useSelector } from "react-redux";
import { useState } from "react";
import { AppContext, socket } from "./context/appContext";

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setmessages] = useState([]);
  const [privateMemberMsg, setprivateMemberMsg] = useState({});
  const [newMessages, setnewMessages] = useState([]);

  const user = useSelector((state) => state.user);

  return (
    <div>
      <AppContext.Provider
        value={{
          socket,
          rooms,
          setRooms,
          currentRoom,
          setCurrentRoom,
          members,
          setMembers,
          messages,
          setmessages,
          privateMemberMsg,
          setprivateMemberMsg,
          newMessages,
          setnewMessages,
        }}
      >
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            {!user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </>
            )}
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;

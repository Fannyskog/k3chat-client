import { useEffect, useState } from 'react'
import './App.css'
import { io }  from "socket.io-client";
import Chat from "./components/Chat";


const socket = io.connect("http://localhost:3000");



function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [showChat, setShowChat] = useState(false);



useEffect(() => {
  socket.on("connection", (data) => {
    console.log("server connected");
    setRooms(data.rooms);
    
  });

  socket.on("create_room", (data) => {
    console.log(data);
  })


})

function createRoom(room_name) {
if (username !== "" && room !== "")socket.emit("create_room", room_name); 
console.log(`${username} created room: ${room_name}`);
setShowChat(true); 


};


function joinRoom(room_name) {
if (username !== "" && room !== "")socket.emit("join_room", room_name); 
console.log(`${username} joined room: ${room_name}`); 
setShowChat(true);

};


  return (
    <div className="App">
      { !showChat ? (
      
          <div className="room-cont">
          <h2>Hi and welcome!</h2>
          
        <input placeholder="Username" onChange={(e) => { setUsername(e.target.value);}}></input>
        <input
              onKeyDown={(e) => {
                if (e.key === "Enter") joinRoom(roomInput);}}
              placeholder="Enter name"
              onChange={(e) => setRoomInput(e.target.value)}/>
              
            <button onClick={() => joinRoom(roomInput)}>Join room</button>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") createRoom(roomInput);}}
              placeholder="Enter name"
              onChange={(e) => setRoomInput(e.target.value)}/>

            <button onClick={() => createRoom(roomInput)}>Create room</button>
        </div>
        ) : (
     
      <Chat socket={socket} username={username} room={room}/>
      )}
      </div>
  )
};

export default App;

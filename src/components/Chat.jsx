import React, { useState, useEffect } from "react";
import { io }  from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io.connect("http://localhost:3000");


function Chat( {socket, username, room}) {
    const [thisMessage, setThisMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [rooms, setRooms] = useState("");
    const [showChat, setShowChat] = useState(true);
 
   useEffect(() => {

   
    socket.on("deleteRoom", (data) => {
        setRooms(data);
        console.log(data);
    });
   },[]);

const sendMessage = async () => {
    if (thisMessage !== "") {
       const messageData = {
        room: room,
        username: username,
        message: thisMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        userId:socket.id,
       };

       await socket.emit("send_message", messageData);
       console.log("message sent");
       setChat((mess) => [...mess, messageData]);
       setThisMessage("");
       
    
    }
};

useEffect(() => {
    socket.on("receive_message", (data) => {
        setChat((mess) => [...mess, data]);
        
    });
}, [socket]);

const deleteRoom =(room_name) => {
    socket.emit("deleteRoom", room_name);
    console.log(`Room was deleted`);
    
};

function leaveRoom(data) {
    socket.emit("leave_room", data);
    console.log("User left");
    setRooms("");
    setShowChat(false);

  }




    return (
      
          
        <div className="chat">
            
          
        <div className="chat-body">
      
                <ScrollToBottom classname="message-container">
                {chat.map((talk) => {
                    return (
                <div className="message" id={username === talk.username ? "me" : "other"}>
                <div>
                <div className="message-content">
                    <p>{talk.message}</p>
                    </div>
                    <div className="message-info">
                        <p id="time">{talk.time}</p>
                        <p id="username">{talk.username}</p>
                    </div>
                  
                    
                    </div>

                    
                    
            </div>
              
                    );
                })}
                 
                 
                </ScrollToBottom>
              
       </div>
       
            <div className="chat-box">
            <input value={thisMessage} onChange={(e) => {setThisMessage(e.target.value);}}/>
            <button onClick={sendMessage}>Send</button>
            <button onClick={() => leaveRoom(room)}>Leave</button>
            <button onClick={() => deleteRoom("room")}>Delete room</button>
            
            
         </div>
         
         
         
          </div>
      
              
             

            
    ); 
 
}
export default Chat;
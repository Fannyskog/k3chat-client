import React, { useState, useEffect } from "react";
import { io }  from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import App from "../App";

const socket = io.connect("http://localhost:3000");


function Chat( {socket, username, room}) {
    const [thisMessage, setThisMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [rooms, setRooms] = useState("");
    const [showApp, setShowApp] = useState(false);
 
    useEffect(() => {
        socket.on("connection", (data) => {
          console.log("server connected");
          setRooms(data.room);
          
        });
      
        socket.on("delete_room", (data) => {
          console.log(data);
        })
      
      
      })

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
       console.log(`${username} sent a message`);
       
    
    }
};

useEffect(() => {
    socket.on("receive_message", (data) => {
        setChat((mess) => [...mess, data]);
        
        
    });
}, [socket]);

/*const deleteRoom =(room_name) => {
    socket.emit("deleteRoom", room_name);
    console.log(`${room_name} was deleted`);
    setShowApp(true);
    
};*/

function deleteRoom() {
    socket.emit("delete_room"); 
    console.log(`${room} was deleted`);
    setShowApp(true); 
    
    
    };

function leaveRoom() {
    socket.emit("leave_room");
    console.log(`${username} left room: ${room}`);
    setShowApp(true);

  }




    return (
      <div>
        
        { !showApp ? (
        <><div className="chat">


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
                        <input value={thisMessage} onChange={(e) => { setThisMessage(e.target.value); } } />
                        <button onClick={sendMessage}>Send</button>
                       


                    </div>



                </div> <button onClick={() => leaveRoom(room)}>Leave</button>
                       <button onClick={() => deleteRoom(room)}>Delete room</button></>
       ) : (
        <App socket={socket} username={username} room={room}/>
        )}
       
      
       </div>
              
             

            
    ); 
 
}
export default Chat;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './RoomsPage.css';

const socket = io('http://localhost:5000');

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('http://localhost:5000/rooms');
      setRooms(response.data);
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const handleCreateRoom = async () => {
    try {
      await axios.post('http://localhost:5000/rooms', { name: newRoom });
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewRoom('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinRoom = (room) => {
    if (username) {
      setCurrentRoom(room);
      socket.emit('joinRoom', { room, username });
      setMessages([]);
    } else {
      alert('Please enter a username');
    }
  };

  const handleSendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div className="rooms-page">
      {!currentRoom ? (
        <div className="rooms-selection">
          <h1>Join a Room</h1>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="New room name"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
          <button onClick={handleCreateRoom}>Create Room</button>
          <h2>Available Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li key={room}>
                {room} <button onClick={() => handleJoinRoom(room)}>Join</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="chat-room">
          <h1>Room: {currentRoom}</h1>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.user}: </strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

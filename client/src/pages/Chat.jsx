import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Chat() {
  const [messageContent, setMessageContent] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const userType = localStorage.getItem('type');
  const idClient = localStorage.getItem('id');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      let response;
      if (userType === 'admin') {
        response = await axios.get('http://localhost:8000/manage/chats/');
      } else {
        response = await axios.post('http://localhost:8000/manage/userchats/', {
          client: idClient
        });
      }
      setChats(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de chats:', error);
    }
  }

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8000/manage/messages/?chat=${chatId}`);
      setChatMessages(prevChatMessages => ({
        ...prevChatMessages,
        [chatId]: response.data.filter(message => message.chat === chatId)
      }));
    } catch (error) {
      console.error('Error al obtener los mensajes del chat:', error);
    }
  }

  const createChat = async () => {
    try {
      const response = await axios.post('http://localhost:8000/manage/chats/', {
        client: idClient
      });
      console.log('Chat creado:', response.data);
      if (response.status === 201) {
        setSelectedChat(response.data.id);
        await fetchMessages(response.data.id);
        fetchChats();
      } else {
        console.error('Error al crear el chat dentro del if:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear el chat en el catch:', error);
    }
  }

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:8000/manage/messages/', {
        content: messageContent,
        user: 1,
        usertype: userType,
        date: new Date().toISOString(),
        chat: selectedChat
      });
      console.log('Mensaje enviado:', response.data);
      setMessageContent('');
      fetchMessages(selectedChat);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageContent.trim() !== '') {
      sendMessage();
    } else {
      alert('Por favor, escribe un mensaje antes de enviarlo.');
    }
  }

  const handleSelectChat = async (chatId) => {
    setSelectedChat(chatId);
    if (!chatMessages[chatId]) {
      await fetchMessages(chatId);
    }
  }

  return (
    <div className="container-fluid">
      <br /><br /><br /><br /><br />
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card" style={{ height: "80vh" }}>
            <div className="card-header">Chat</div>
            <div className="card-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <ul className="list-group">
                {chats.map(chat => (
                  <li
                    key={chat.id}
                    className={`list-group-item ${selectedChat === chat.id ? 'active' : ''}`}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    Chat ID: {chat.id}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body" style={{ maxHeight: "40vh", overflowY: "auto" }}>
              {selectedChat && chatMessages[selectedChat]?.map(message => (
                <div
                  key={message.id}
                  className={`alert ${message.usertype === 'admin' ? 'alert-primary' : 'alert-success'}`}
                  role="alert"
                >
                  <p>{message.content}</p>
                  <p>{new Date(message.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe tu mensaje aquí"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    disabled={selectedChat === null}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={selectedChat === null}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-3">
            {(userType === 'client') && (
              <button className="btn btn-success" onClick={createChat}>Crear Chat</button>
            )}
          </div>
        </div>
      </div>
      <br /><br /><br />
    </div>
  );
}

export default Chat;

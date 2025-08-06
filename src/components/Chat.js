import React, { useState, useEffect } from 'react';
import './Chat.css';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa';
import { FaRegFaceSmile } from 'react-icons/fa6';

const Chat = ({ userRole, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);
  const openChatWith = (user) => setCurrentChat(user);
  const goBack = () => setCurrentChat(null);

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chat_messages')) || [];
    const users = new Map();

    storedMessages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const isReceiver = msg.receiverId === userId;

      if (isSender || isReceiver) {
        const otherId = isSender ? msg.receiverId : msg.senderId;
        const name = localStorage.getItem(otherId) || `User ${otherId}`;
        users.set(otherId, { id: otherId, name });
      }
    });

    setChatUsers(Array.from(users.values()));
    setMessages(storedMessages);
  }, [isOpen, userId]);

  // Store name when chat is opened
  useEffect(() => {
    if (currentChat && !localStorage.getItem(currentChat.id)) {
      localStorage.setItem(currentChat.id, currentChat.name);
    }
  }, [currentChat]);

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg = {
      senderId: userId,
      receiverId: currentChat.id,
      text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
    setText('');
  };

  const currentChatMessages = messages.filter(
    (msg) =>
      (msg.senderId === userId && msg.receiverId === currentChat?.id) ||
      (msg.receiverId === userId && msg.senderId === currentChat?.id)
  );

  return (
    <>
      <button className="chat-icon" onClick={toggleChat}>
        <IoChatboxEllipsesSharp size={24} />
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            {currentChat ? (
              <>
                <FaArrowLeft onClick={goBack} className="back-arrow" />
                <span>{currentChat.name}</span>
              </>
            ) : (
              'Conversations'
            )}
            <span onClick={toggleChat} className="chat-close-btn">✕</span>
          </div>

          <div className="chat-body">
            {currentChat ? (
              <>
                <div className="chat-message-header">
                  <em>Chatting with {currentChat.name}</em>
                </div>
                <div className="chat-messages">
                  {currentChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={msg.senderId === userId ? 'chat-bubble self' : 'chat-bubble other'}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chat-user-list">
                {chatUsers.length === 0 ? (
                  <div className="empty-chat">
                    <FaRegFaceSmile size={20} style={{ marginRight: '8px' }} />
                    No conversations yet.
                  </div>
                ) : (
                  chatUsers.map((user) => (
                    <div
                      key={user.id}
                      className="chat-user-item"
                      onClick={() => openChatWith(user)}
                    >
                      {user.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {currentChat && (
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;

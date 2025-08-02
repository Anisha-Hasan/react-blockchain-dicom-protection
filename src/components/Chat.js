import React, { useState } from 'react';
import './Chat.css';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa';

const Chat = ({ userRole, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null); // null = chat list, otherwise = user id

  const toggleChat = () => setIsOpen(!isOpen);
  const openChatWith = (user) => setCurrentChat(user);
  const goBack = () => setCurrentChat(null);

  // Fake patient/doctor list for now
  const chatUsers = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Alice Brown' }
  ];

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
                <FaArrowLeft onClick={goBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                {currentChat.name}
              </>
            ) : (
              'Conversations'
            )}
            <span onClick={toggleChat} style={{ cursor: 'pointer' }}>✕</span>
          </div>

          <div className="chat-body">
            {currentChat ? (
              <div>
                {/* Chat with selected user */}
                <div><em>Chatting with {currentChat.name}</em></div>
                {/* Chat messages would go here */}
              </div>
            ) : (
              <ul>
                {chatUsers.map((user) => (
                  <li
                    key={user.id}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer'
                    }}
                    onClick={() => openChatWith(user)}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {currentChat && (
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button>Send</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;

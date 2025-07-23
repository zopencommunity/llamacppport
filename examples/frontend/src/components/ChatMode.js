import React, { useState, useEffect, useRef } from 'react';
import './ChatMode.css';
import CONFIG from '../config';
import { parseAdvancedText } from './utils';

const ChatMode = ({ conversationStarted, setConversationStarted }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;

      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          chatMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  }, [messages, isTyping]);

  // Add message to chat
  const addMessage = (content, type) => {
    const newMessage = {
      id: Date.now(),
      content,
      type,
      formattedContent: type === 'assistant' ? parseAdvancedText(content) : content
    };
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }, 10);
  };

  // Handle chat submit
  const handleChatSubmit = async () => {
    const input = inputValue.trim();
    if (!input || isTyping) return;

    // Start conversation if not started
    if (!conversationStarted) {
      setConversationStarted(true);
    }

    addMessage(input, 'user');
    setInputValue('');

    // Scroll to bottom immediately
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        chatMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);

    setIsTyping(true);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/tools/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      setIsTyping(false);
      addMessage(data.response, 'assistant');

      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (err) {
      setIsTyping(false);
      addMessage("Error: Could not connect to server.", 'assistant');
      console.error(err);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleChatSubmit();
    }
  };

  return (
    <>
      <div className={`chat-container ${conversationStarted ? 'active' : ''}`} id="chatContainer">
        <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'assistant' ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: message.formattedContent }}
                  />
                ) : (
                  <div>{message.content}</div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator active" id="typingIndicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`chat-input-container ${conversationStarted || !conversationStarted ? 'active' : ''}`} id="chatInputContainer">
        <div className="input-wrapper">
          <input
            type="text"
            id="chatInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything! (Example: 'What is z/OS?')"
            autoFocus
          />
          <button
            className="submit-btn"
            id="chatSubmitBtn"
            onClick={handleChatSubmit}
            disabled={isTyping}
          >
            â¤
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatMode;
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào bạn! 👋 Mình là bạn trợ lý AI đáng yêu của bạn! 💫 Mình có thể giúp bạn học tập và trả lời câu hỏi. Bạn muốn hỏi gì nào? ✨',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatPanelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside to close chatbot
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        // Kiểm tra nếu click không phải trong panel
        if (
          chatPanelRef.current &&
          !chatPanelRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }
    };

    // Thêm event listener khi panel mở
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Thêm tin nhắn của người dùng
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate bot response (sau này sẽ tích hợp với AI API)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Cảm ơn bạn đã tin nhắn! 💖 Mình đang suy nghĩ... 🤔 Tính năng này sẽ được tích hợp với AI thông minh trong tương lai để giúp bạn học tốt hơn! 🌟',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button - Đáng yêu với animation */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-pink-600 text-white rounded-full p-5 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110 animate-bounce z-50 flex items-center justify-center group"
          aria-label="Open chat"
          style={{
            animation: 'bounce 2s infinite',
          }}
        >
          <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
          <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </button>
      )}

      {/* Chat Panel - Giao diện đáng yêu cho trẻ em */}
      {isOpen && (
        <div ref={chatPanelRef} className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-2xl shadow-2xl flex flex-col z-50 border-4 border-pink-200 overflow-hidden">
          {/* Header - Màu sắc tươi sáng */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 text-white p-4 rounded-t-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg animate-pulse">
                  🤖
                </div>
                <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Cô giáo biết tuốt ✨</h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-pink-600 rounded-full p-2 transition-all transform hover:rotate-90 hover:scale-110"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area - Nền đáng yêu */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-pink-50/50 to-purple-50/50 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
                style={{
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                {/* Avatar đáng yêu */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md ${
                    message.sender === 'bot'
                      ? 'bg-gradient-to-br from-pink-400 to-purple-400 text-white'
                      : 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white'
                  }`}
                >
                  {message.sender === 'bot' ? '🤖' : '👤'}
                </div>
                {/* Message bubble */}
                <div
                  className={`flex-1 rounded-2xl p-4 shadow-md ${
                    message.sender === 'bot'
                      ? 'bg-white text-gray-800 border-2 border-pink-200'
                      : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {message.text}
                  </p>
                  <span className={`text-xs mt-2 block ${message.sender === 'bot' ? 'text-gray-500' : 'text-blue-100'}`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Thiết kế vui nhộn */}
          <div className="border-t-4 border-pink-200 p-4 bg-gradient-to-r from-white to-pink-50 rounded-b-xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Viết tin nhắn của bạn... 💬"
                className="flex-1 border-2 border-pink-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 hover:shadow-lg shadow-md flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;

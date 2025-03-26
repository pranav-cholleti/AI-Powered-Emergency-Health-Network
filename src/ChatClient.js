import React, { useState } from "react";
import Nav from "./Nav.js"; // Updated import path
import Footer from "./Footer.js"; // Updated import path
import "./css/Chat.css";

const ChatClient = ({ username, role, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:3000/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Error: Unable to fetch response." };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="chat-page">
      <Nav username={username} role={role} onLogout={onLogout} />
      <div className="chat-container">
        <h1 className="chat-title">Chat with MedReady</h1>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="chat-send-btn" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatClient;
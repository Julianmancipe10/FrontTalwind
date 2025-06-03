import React from "react";
import FAQChat from "./FAQChat";
import "./ChatModal.css";

const ChatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <FAQChat />
      </div>
    </div>
  );
};

export default ChatModal; 
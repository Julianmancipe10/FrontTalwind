import React from "react";
import FAQChat from "./FAQChat";

const ChatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black/35 flex items-end justify-end z-[2000]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-lg max-w-[420px] w-[95vw] flex flex-col relative p-0 overflow-hidden m-8 transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute top-2.5 right-4 bg-transparent border-none text-3xl text-blue-600 cursor-pointer hover:text-blue-700 transition-colors z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <FAQChat />
      </div>
    </div>
  );
};

export default ChatModal; 
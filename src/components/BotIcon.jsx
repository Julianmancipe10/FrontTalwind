import React from "react";
import botImage from "../assets/images/boot.png";

const BotIcon = ({ onClick }) => (
  <div 
    className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-110"
    onClick={onClick} 
    title="Abrir chat de ayuda"
  >
    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
      ?
    </div>
    <img 
      src={botImage} 
      alt="Chatbot" 
      className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-xl"
    />
  </div>
);

export default BotIcon; 
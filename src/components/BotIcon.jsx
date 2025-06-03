import React from "react";
import "./BotIcon.css";
import botImage from "../assets/images/boot.png";

const BotIcon = ({ onClick }) => (
  <div className="bot-icon-float" onClick={onClick} title="Abrir chat de ayuda">
    <div className="question-icon">?</div>
    <img src={botImage} alt="Chatbot" className="bot-image" />
  </div>
);

export default BotIcon; 
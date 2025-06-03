import React, { useState, useRef, useEffect } from "react";
import { preguntarFAQ } from "../services/faqService";
import "./FAQChat.css";

const MAX_CHARS = 500;
const STORAGE_KEY = 'chat_history';
const THEME_KEY = 'theme_mode';

// Preguntas predeterminadas
const SUGGESTED_QUESTIONS = [
  "¿Qué programas de formación ofrece el SENA?",
  "¿Cómo me registro en SenaUnity?",
  "¿Cuáles son los requisitos para estudiar en el SENA?",
];

const FAQChat = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme ? JSON.parse(savedTheme) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const chatEndRef = useRef(null);
  const remainingChars = MAX_CHARS - question.length;
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
      setShowSuggestions(chatHistory.length === 0);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [chatHistory]);

  // Efecto para manejar el tema
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setIsDarkMode(prev => !prev);
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Verificar conexión
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    checkConnection(); // Verificar estado inicial
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const handleAsk = async (questionText = question) => {
    if (!questionText.trim() || !isConnected || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const context = chatHistory
        .slice(-6)
        .map(msg => `${msg.type === 'question' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n');

      const respuesta = await preguntarFAQ(questionText, context);
      
      const newMessages = [
        { type: 'question', content: questionText, timestamp: new Date() },
        { type: 'answer', content: respuesta, timestamp: new Date() }
      ];

      setChatHistory(prev => [...prev, ...newMessages]);
      setQuestion("");
    } catch (err) {
      setError(err.message || "Error al obtener la respuesta");
      console.error('Error in handleAsk:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearChat = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial del chat?')) {
      setChatHistory([]);
      localStorage.removeItem(STORAGE_KEY);
      setShowSuggestions(true);
      setError(null);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    if (!isLoading) {
      handleAsk(suggestedQuestion);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setQuestion(value);
    }
  };

  return (
    <div className="faq-chat-container">
      <div className="chat-header">
        <h3>
          <img 
            src="/bot-avatar.png" 
            alt="Bot Avatar" 
            className="bot-avatar"
            onError={(e) => e.target.style.display = 'none'}
          />
          Asistente SenaUnity
        </h3>
        <div className="header-controls">
          <button 
            type="button"
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label="Cambiar tema"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          {chatHistory.length > 0 && (
            <button 
              type="button"
              onClick={clearChat} 
              className="clear-chat-btn"
            >
              Limpiar Chat
            </button>
          )}
        </div>
      </div>

      <div className="connection-status">
        {!isConnected && (
          <div className="offline-warning">
            Sin conexión - El chat no está disponible
          </div>
        )}
      </div>

      <div className="chat-history">
        {chatHistory.length === 0 ? (
          <div className="empty-chat">
            <span className="empty-chat-icon">👋</span>
            <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
            {showSuggestions && (
              <div className="suggested-questions">
                {SUGGESTED_QUESTIONS.map((suggestedQuestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggested-question-btn"
                    onClick={() => handleSuggestedQuestion(suggestedQuestion)}
                    disabled={isLoading}
                  >
                    {suggestedQuestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'question' ? 'Tú: ' : 'Asistente: '}
                  {message.content}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </>
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="input-container">
        <div className="textarea-wrapper">
          <textarea
            value={question}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading || !isConnected}
            rows="3"
          />
          <div className="char-counter">
            {remainingChars} caracteres restantes
          </div>
        </div>
        <button 
          type="button"
          onClick={() => handleAsk()}
          disabled={isLoading || !question.trim() || !isConnected}
          className={`send-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Enviando...' : 'Preguntar'}
        </button>
      </div>
    </div>
  );
};

export default FAQChat;

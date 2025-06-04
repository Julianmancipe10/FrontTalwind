import React, { useState, useRef, useEffect } from "react";
import { preguntarFAQ } from "../services/faqService";

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
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setIsDarkMode(prevMode => !prevMode);
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
    <div className="flex flex-col h-screen max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="sticky top-0 z-10 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
            <img 
              src="/bot-avatar.png" 
              alt="Bot Avatar" 
              className="w-8 h-8 rounded-full"
              onError={(e) => e.target.style.display = 'none'}
            />
            Asistente SenaUnity
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-lg rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {chatHistory.length > 0 && (
              <button 
                onClick={clearChat}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Limpiar Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="bg-red-500 text-white text-sm py-2 px-4 text-center">
          Sin conexión - El chat no está disponible
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <span className="text-4xl mb-4">👋</span>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              ¡Hola! ¿En qué puedo ayudarte hoy?
            </p>
            {showSuggestions && (
              <div className="w-full max-w-md space-y-3">
                {SUGGESTED_QUESTIONS.map((suggestedQuestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(suggestedQuestion)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div 
                key={index} 
                className={`flex flex-col ${message.type === 'question' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  message.type === 'question'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}>
                  <div className="mb-1">
                    {message.type === 'question' ? 'Tú: ' : 'Asistente: '}
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {isLoading && (
          <div className="flex justify-center items-center gap-2 py-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="relative mb-4">
          <textarea
            value={question}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading || !isConnected}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[60px] disabled:opacity-50"
            rows="3"
          />
          <div className="absolute right-2 -bottom-5 text-xs text-gray-500 dark:text-gray-400">
            {remainingChars} caracteres restantes
          </div>
        </div>
        <button 
          onClick={() => handleAsk()}
          disabled={isLoading || !question.trim() || !isConnected}
          className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Preguntar'}
        </button>
      </div>
    </div>
  );
};

export default FAQChat;

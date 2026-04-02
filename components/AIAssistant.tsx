import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SparklesIcon, CloseIcon } from './icons';
import { chatWithAIAssistant } from '../services/geminiService';
import { AppDataContext } from '../App';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! Ask me about your competitors or market trends." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const appData = useContext(AppDataContext);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !appData) return;

    const userMessageText = input;
    const userMessage: Message = { sender: 'user', text: userMessageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await chatWithAIAssistant(userMessageText, appData.competitors, location.pathname);
      const aiMessage: Message = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I couldn't get a response. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse-glow transition-transform duration-300 hover:scale-110"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? <CloseIcon className="w-8 h-8"/> : <SparklesIcon className="w-8 h-8"/>}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-black/30 backdrop-blur-2xl border border-blue-400/30 rounded-2xl shadow-2xl z-40 flex flex-col animate-fadeInUp">
          <div className="p-4 border-b border-blue-400/30">
            <h3 className="text-lg font-bold text-white text-center">AI Assistant</h3>
          </div>
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-xs text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-slate-700 p-3 rounded-lg max-w-xs text-sm">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-blue-400/30">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-900/50 border border-blue-400/40 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] disabled:opacity-50"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

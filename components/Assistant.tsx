
import React, { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Привет! Я ваш гид по бонусной программе LoyaltyPro. Спрашивайте что угодно!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const aiResponse = await askAssistant(userMsg, history);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-1 border border-gray-200">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            placeholder="Задайте вопрос ассистенту..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

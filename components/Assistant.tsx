
import React, { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../services/geminiService.ts';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Привет! Я ваш ИИ-помощник LoyaltyPro. Могу рассказать о правилах программы или о доступных наградах. О чем хотите узнать?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const reply = await askAssistant(text, history);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-indigo-400 p-2">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="Ваш вопрос ассистенту..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
          />
          <button 
            onClick={onSend} 
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 active:scale-90 disabled:opacity-50 transition-all"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

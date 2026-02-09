
import React, { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Привет! Я ваш ИИ-помощник LoyaltyPro. Чем могу помочь?' }
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
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-gray-400 font-bold uppercase animate-pulse">Ассистент думает...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Ваш вопрос..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
          />
          <button onClick={onSend} className="bg-indigo-600 text-white p-2 rounded-xl">🚀</button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

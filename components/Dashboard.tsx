
import React from 'react';
import { User, Transaction } from '../types';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onAddMockPoints: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onAddMockPoints }) => {
  const nextLevelPoints = user.level === 'Base' ? 1000 : user.level === 'Silver' ? 5000 : 10000;
  const progress = Math.min((user.points / nextLevelPoints) * 100, 100);

  return (
    <div className="p-6 space-y-6">
      {/* Loyalty Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl rotate-12">💎</div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Ваши бонусы</p>
            <h3 className="text-4xl font-bold mt-1">{user.points} <span className="text-lg">баллов</span></h3>
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            {user.level} Level
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-100">
            <span>Прогресс до следующего уровня</span>
            <span>{user.points} / {nextLevelPoints}</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action QR */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h4 className="text-sm font-bold text-gray-700 mb-4">Предъявите QR код кассиру</h4>
        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 mb-4">
          {/* Mock QR */}
          <div className="w-32 h-32 bg-white flex flex-wrap p-1 border border-gray-100 shadow-inner">
             {Array.from({length: 64}).map((_, i) => (
               <div key={i} className={`w-[12.5%] h-[12.5%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
             ))}
          </div>
        </div>
        <button 
          onClick={onAddMockPoints}
          className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
        >
          Симулировать покупку (+100 баллов)
        </button>
      </div>

      {/* History Preview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800">История</h4>
          <button className="text-xs text-indigo-600 font-semibold">Все</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  tx.type === 'earn' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {tx.type === 'earn' ? '📈' : '📉'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{tx.description}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-bold ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'earn' ? '+' : '-'}{tx.amount}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm italic">История пока пуста</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { MOCK_REWARDS } from '../constants';
import { User } from '../types';

interface RewardsProps {
  user: User;
  onRedeem: (rewardId: string) => void;
}

const Rewards: React.FC<RewardsProps> = ({ user, onRedeem }) => {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">Каталог наград</h2>
        <p className="text-sm text-gray-500">Обменивайте баллы на вкусные призы</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_REWARDS.map((reward) => (
          <div key={reward.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="h-32 bg-gray-200 overflow-hidden relative">
              <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-bold text-indigo-600">
                {reward.category}
              </div>
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{reward.title}</h3>
              <p className="text-[10px] text-gray-500 mt-1 mb-3 line-clamp-2 leading-relaxed">{reward.description}</p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-600">{reward.cost} баллов</span>
                </div>
                <button
                  disabled={user.points < reward.cost}
                  onClick={() => onRedeem(reward.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    user.points >= reward.cost
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 active:scale-95'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {user.points >= reward.cost ? 'Обменять' : 'Мало баллов'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;

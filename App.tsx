
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Rewards from './components/Rewards';
import Assistant from './components/Assistant';
import { User, Transaction, AppScreen } from './types';
import { MOCK_REWARDS } from './constants';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<AppScreen>(AppScreen.REGISTER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
      } catch (e) {
        console.warn("Telegram SDK warning:", e);
      }
    }

    const saved = localStorage.getItem('loyalty_user_v1');
    if (saved) {
      try {
        const parsedUser = JSON.parse(saved);
        setUser(parsedUser);
        setScreen(AppScreen.HOME);
      } catch (e) {
        localStorage.removeItem('loyalty_user_v1');
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('loyalty_user_v1', JSON.stringify(user));
    }
  }, [user]);

  const handleRegistration = (newUser: User) => {
    setUser(newUser);
    setScreen(AppScreen.HOME);
    setTransactions([{
      id: 'welcome',
      type: 'earn',
      amount: 50,
      description: 'Приветственные баллы',
      date: new Date().toISOString()
    }]);
    
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const addPoints = () => {
    if (!user) return;
    const amount = 100;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'earn',
      amount,
      description: 'Покупка в магазине',
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
  };

  const handleRedeem = (rewardId: string) => {
    if (!user) return;
    const reward = MOCK_REWARDS.find(r => r.id === rewardId);
    if (!reward || user.points < reward.cost) return;

    const performRedeem = () => {
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'spend',
        amount: reward.cost,
        description: `Награда: ${reward.title}`,
        date: new Date().toISOString()
      };
      
      setTransactions(prev => [newTx, ...prev]);
      setUser(prev => prev ? { ...prev, points: prev.points - reward.cost } : null);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      window.Telegram?.WebApp?.showAlert?.(`Получено: ${reward.title}`);
    };

    if (window.Telegram?.WebApp?.showConfirm) {
      window.Telegram.WebApp.showConfirm(`Обменять ${reward.cost} баллов?`, (ok: boolean) => {
        if (ok) performRedeem();
      });
    } else if (confirm(`Обменять ${reward.cost} баллов?`)) {
      performRedeem();
    }
  };

  if (!isInitialized) return null;

  if (!user || screen === AppScreen.REGISTER) {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    return (
      <Registration 
        onComplete={handleRegistration} 
        initialData={{
          firstName: tgUser?.first_name || '',
          lastName: tgUser?.last_name || ''
        }} 
      />
    );
  }

  return (
    <Layout activeScreen={screen} setScreen={setScreen}>
      {screen === AppScreen.HOME && (
        <Dashboard user={user} transactions={transactions} onAddMockPoints={addPoints} />
      )}
      {screen === AppScreen.REWARDS && (
        <Rewards user={user} onRedeem={handleRedeem} />
      )}
      {screen === AppScreen.ASSISTANT && (
        <Assistant />
      )}
      {screen === AppScreen.PROFILE && (
        <div className="p-6 space-y-6">
          <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-indigo-50 mx-auto mb-4 flex items-center justify-center text-3xl overflow-hidden border-2 border-indigo-100">
              {window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url ? (
                <img src={window.Telegram.WebApp.initDataUnsafe.user.photo_url} alt="" className="w-full h-full object-cover" />
              ) : "👤"}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold text-indigo-500">{user.level} Member</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Телефон</span>
              <span className="font-medium">{user.phone}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('loyalty_user_v1');
              window.location.reload();
            }}
            className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl"
          >
            Выйти
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;

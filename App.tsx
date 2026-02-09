
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Registration from './components/Registration.tsx';
import Dashboard from './components/Dashboard.tsx';
import Rewards from './components/Rewards.tsx';
import Assistant from './components/Assistant.tsx';
import { User, Transaction, AppScreen } from './types.ts';
import { MOCK_REWARDS } from './constants.tsx';

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
        console.error("Telegram SDK init error:", e);
      }
    }

    const saved = localStorage.getItem('loyalty_user');
    if (saved) {
      try {
        const parsedUser = JSON.parse(saved);
        setUser(parsedUser);
        setScreen(AppScreen.HOME);
      } catch (e) {
        localStorage.removeItem('loyalty_user');
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('loyalty_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (screen !== AppScreen.HOME && screen !== AppScreen.REGISTER) {
      tg.BackButton?.show();
      const handleBack = () => setScreen(AppScreen.HOME);
      tg.onEvent('backButtonClicked', handleBack);
      return () => tg.offEvent('backButtonClicked', handleBack);
    } else {
      tg.BackButton?.hide();
    }
  }, [screen]);

  const handleRegistration = (newUser: User) => {
    setUser(newUser);
    setScreen(AppScreen.HOME);
    setTransactions([{
      id: 'init',
      type: 'earn',
      amount: 50,
      description: 'Приветственный бонус',
      date: new Date().toISOString()
    }]);
    
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const addPoints = () => {
    if (!user) return;
    const amount = 100;
    const newTx: Transaction = {
      id: Math.random().toString(),
      type: 'earn',
      amount,
      description: 'Покупка в магазине',
      date: new Date().toISOString()
    };
    setTransactions([newTx, ...transactions]);
    setUser({ ...user, points: user.points + amount });
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
  };

  const handleRedeem = (rewardId: string) => {
    if (!user) return;
    const reward = MOCK_REWARDS.find(r => r.id === rewardId);
    if (!reward || user.points < reward.cost) return;

    const performRedeem = () => {
      const newTx: Transaction = {
        id: Math.random().toString(),
        type: 'spend',
        amount: reward.cost,
        description: `Награда: ${reward.title}`,
        date: new Date().toISOString()
      };
      
      setTransactions([newTx, ...transactions]);
      setUser({ ...user, points: user.points - reward.cost });
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      window.Telegram?.WebApp?.showAlert?.(`Успешно! Вы получили ${reward.title}.`);
    };

    if (window.Telegram?.WebApp?.showConfirm) {
      window.Telegram.WebApp.showConfirm(
        `Обменять ${reward.cost} баллов на ${reward.title}?`,
        (confirmed: boolean) => {
          if (confirmed) performRedeem();
        }
      );
    } else {
      if (confirm(`Обменять ${reward.cost} баллов?`)) performRedeem();
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
          <header className="text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden text-indigo-300">
              {window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url ? (
                <img src={window.Telegram.WebApp.initDataUnsafe.user.photo_url} alt="Ava" className="w-full h-full object-cover" />
              ) : "👤"}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Телефон</span>
              <span className="font-medium text-gray-800">{user.phone}</span>
            </div>
            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Статус</span>
              <span className="font-medium text-indigo-600 font-bold">{user.level}</span>
            </div>
          </div>

          <button
            onClick={() => {
              const logout = () => {
                localStorage.removeItem('loyalty_user');
                window.location.reload();
              };
              if (window.Telegram?.WebApp?.showConfirm) {
                window.Telegram.WebApp.showConfirm("Выйти из аккаунта?", (ok: boolean) => { if (ok) logout(); });
              } else if (confirm("Выйти?")) {
                logout();
              }
            }}
            className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl active:scale-95 transition-transform"
          >
            Выйти из аккаунта
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface RegistrationProps {
  onComplete: (user: User) => void;
  initialData?: { firstName: string, lastName: string };
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      points: 50,
      level: 'Base',
      joinedDate: new Date().toISOString(),
      isRegistered: true,
    };
    onComplete(newUser);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-full bg-white">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-gray-800">LoyaltyPro</h2>
        <p className="text-gray-500 mt-2">Зарегистрируйтесь и получите 50 приветственных баллов</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Имя</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Иван"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Фамилия</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Иванов"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Телефон</label>
          <input
            required
            type="tel"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Email</label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="example@mail.ru"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-transform mt-6"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Registration;

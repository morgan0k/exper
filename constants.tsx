
import React from 'react';
import { Reward } from './types';

export const MOCK_REWARDS: Reward[] = [
  {
    id: '1',
    title: 'Капучино 0.3',
    description: 'Классический капучино за баллы',
    cost: 150,
    category: 'Напитки',
    imageUrl: 'https://picsum.photos/seed/coffee/400/300'
  },
  {
    id: '2',
    title: 'Круассан',
    description: 'Свежий французский круассан',
    cost: 100,
    category: 'Выпечка',
    imageUrl: 'https://picsum.photos/seed/croissant/400/300'
  },
  {
    id: '3',
    title: 'Сэндвич с лососем',
    description: 'Сытный перекус для бодрого дня',
    cost: 350,
    category: 'Еда',
    imageUrl: 'https://picsum.photos/seed/sandwich/400/300'
  },
  {
    id: '4',
    title: 'Скидка 20%',
    description: 'На весь чек в ваш день рождения',
    cost: 500,
    category: 'Купоны',
    imageUrl: 'https://picsum.photos/seed/discount/400/300'
  }
];

export const SYSTEM_PROMPT = `
Вы — виртуальный ассистент бонусной программы "LoyaltyPro". 
Ваша цель — помогать пользователям понять, как работает программа.
Основные правила:
- 1 потраченный рубль = 1 бонусный балл.
- Уровни: Base (0+), Silver (1000+), Gold (5000+), Platinum (10000+).
- Бонусами можно оплатить до 50% покупки.
- Бонусы сгорают через 12 месяцев.
Отвечайте вежливо, кратко и на русском языке.
`;

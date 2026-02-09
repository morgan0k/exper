
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  points: number;
  level: 'Base' | 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
  isRegistered: boolean;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  imageUrl: string;
}

export enum AppScreen {
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  REWARDS = 'REWARDS',
  ASSISTANT = 'ASSISTANT',
  PROFILE = 'PROFILE'
}

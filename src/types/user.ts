export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  notifications: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  settings: UserSettings | null;
} 

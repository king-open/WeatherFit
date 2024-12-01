import { User, UserSettings, AuthState } from '../types/user';

const STORAGE_KEY = 'weather-reminder-auth';

const defaultSettings: UserSettings = {
  theme: 'light',
  language: 'zh-CN',
  notifications: true
};

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'superadmin',
    email: 'superadmin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// 超级用户登录凭证
const SUPER_ADMIN = {
  username: 'superadmin',
  password: 'super123'
};

// 获取认证状态
export const getAuthState = (): AuthState => {
  try {
    const auth = localStorage.getItem(STORAGE_KEY);
    return auth ? JSON.parse(auth) : { isAuthenticated: false, user: null, settings: null };
  } catch (error) {
    console.error('Failed to load auth state:', error);
    return { isAuthenticated: false, user: null, settings: null };
  }
};

// 保存认证状态
const saveAuthState = (state: AuthState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
};

// 创建认证状态
const createAuthState = (user: User): AuthState => {
  return {
    isAuthenticated: true,
    user,
    settings: defaultSettings
  };
};

// 密码登录
export const login = async (username: string, password: string): Promise<AuthState> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查是否是超级用户登录
      if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
        const user = mockUsers.find(u => u.username === SUPER_ADMIN.username);
        if (user) {
          const authState = createAuthState(user);
          saveAuthState(authState);
          resolve(authState);
          return;
        }
      }

      // 其他用户使用默认密码
      const user = mockUsers.find(u => u.username === username);
      if (user && password === '123456') {
        const authState = createAuthState(user);
        saveAuthState(authState);
        resolve(authState);
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 1000);
  });
};

// 邮箱登录
export const loginWithEmail = async (email: string, code: string): Promise<AuthState> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code !== '123456') {
        reject(new Error('验证码错误'));
        return;
      }

      const existingUser = mockUsers.find(u => u.email === email);
      const user = existingUser || {
        id: Date.now().toString(),
        username: email.split('@')[0],
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      const authState = createAuthState(user);
      saveAuthState(authState);
      resolve(authState);
    }, 1000);
  });
};

// 发送验证码
export const sendVerificationCode = async (email: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`验证码已发送到邮箱: ${email}`);
      resolve();
    }, 1000);
  });
};

// 获取二维码
export const getQRCode = async (): Promise<{ qrUrl: string; token: string }> => {
  return new Promise((resolve) => {
    const token = Date.now().toString();
    resolve({
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${token}`,
      token
    });
  });
};

// 检查二维码状态
export const checkQRCodeStatus = async (token: string): Promise<'pending' | 'scanning' | 'confirmed'> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.7) {
        resolve('pending');
      } else if (random < 0.9) {
        resolve('scanning');
      } else {
        const user: User = {
          id: token,
          username: `用户${token.slice(-4)}`,
          email: `user${token.slice(-4)}@example.com`,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        saveAuthState(createAuthState(user));
        resolve('confirmed');
      }
    }, 500);
  });
};

// 登出
export const logout = (): void => {
  saveAuthState({ isAuthenticated: false, user: null, settings: null });
};

// 更新用户设置
export const updateUserSettings = (settings: Partial<UserSettings>): void => {
  const authState = getAuthState();
  if (authState.isAuthenticated && authState.settings) {
    const updatedSettings = { ...authState.settings, ...settings };
    saveAuthState({ ...authState, settings: updatedSettings });
  }
}; 

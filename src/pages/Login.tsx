import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { login, loginWithEmail, sendVerificationCode, getQRCode, checkQRCodeStatus } from '../services/auth';

type LoginMethod = 'password' | 'email' | 'qrcode';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeStatus, setQrCodeStatus] = useState<'pending' | 'scanning' | 'confirmed'>('pending');

  const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    try {
      setLoading(true);
      await sendVerificationCode(email);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('发送验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginMethod === 'qrcode') {
      const fetchQRCode = async () => {
        try {
          const { qrUrl, token } = await getQRCode();
          setQrCodeUrl(qrUrl);
          
          const checkInterval = setInterval(async () => {
            const status = await checkQRCodeStatus(token);
            setQrCodeStatus(status);
            
            if (status === 'confirmed') {
              clearInterval(checkInterval);
              navigate('/home');
            }
          }, 2000);

          return () => clearInterval(checkInterval);
        } catch (err) {
          setError('获取二维码失败，请刷新重试');
        }
      };

      fetchQRCode();
    }
  }, [loginMethod, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      switch (loginMethod) {
        case 'password':
          await login(username, password);
          break;
        case 'email':
          if (!email || !verificationCode) {
            throw new Error('请填写完整信息');
          }
          await loginWithEmail(email, verificationCode);
          break;
      }
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/10 to-secondary-light/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 backdrop-blur-sm bg-white/80">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            欢迎回来
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            选择你喜欢的方式登录
          </p>
        </div>

        <div className="flex justify-center space-x-2 p-1 bg-gray-100 rounded-lg">
          {(['password', 'email', 'qrcode'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setLoginMethod(method)}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${loginMethod === method 
                  ? 'bg-white text-primary-dark shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
                }
              `}
            >
              {method === 'password' && '密码登录'}
              {method === 'email' && '邮箱登录'}
              {method === 'qrcode' && '扫码登录'}
            </button>
          ))}
        </div>

        {loginMethod === 'qrcode' ? (
          <div className="text-center p-4">
            {qrCodeUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block p-4 bg-white rounded-lg shadow-sm">
                  <img src={qrCodeUrl} alt="登录二维码" className="w-64 h-64" />
                  {qrCodeStatus === 'scanning' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-lg">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <p>正在确认...</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  请使用手机扫描二维码登录
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-light border-t-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {loginMethod === 'password' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 input-field w-full transition-shadow duration-200"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 input-field w-full transition-shadow duration-200"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    邮箱地址
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 input-field w-full transition-shadow duration-200"
                    placeholder="请输入邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    验证码
                  </label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      id="code"
                      type="text"
                      className="input-field flex-1 transition-shadow duration-200"
                      placeholder="请输入验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || loading}
                      className="w-32"
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  登录中...
                </>
              ) : '登录'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}; 

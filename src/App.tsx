import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { PlanManager } from './pages/PlanManager';
import { Settings } from './pages/Settings';
import { getNotifications, markAsRead, Notification } from './services/notification';
import { Login } from './pages/Login';
import { getAuthState, logout } from './services/auth';

// 检查是否是移动设备或平板
const isMobileOrTablet = () => {
  return window.innerWidth < 1024; // lg breakpoint in Tailwind
};

// 定义导航项类型
interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

// 导航项配置
const navItems: NavItem[] = [
  {
    path: '/home',
    label: '天气概览',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    path: '/plans',
    label: '计划管理',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    path: '/settings',
    label: '系统置',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

// 创建需要认证的路由包装组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = getAuthState();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 监听路由变化和窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 在登录页面时始终保持侧边栏收起
      if (location.pathname === '/login') {
        setIsSidebarOpen(false);
      } else {
        // 在其他页面根据屏幕大小决定侧边栏状态
        setIsSidebarOpen(!isMobileOrTablet());
      }
    };

    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  // 加载通知
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = getNotifications();
      setNotifications(allNotifications);
    };

    loadNotifications();
    window.addEventListener('notificationUpdate', loadNotifications);
    return () => window.removeEventListener('notificationUpdate', loadNotifications);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition duration-200 ease-in-out
          w-64 bg-white shadow-lg z-30
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo区域 */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-xl font-semibold text-primary">WeatherFit</span>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className={`
            flex-1 px-4 py-4 space-y-2 overflow-y-auto
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            {navItems.map(item => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          {/* 用户信息 */}
          <div className="border-t p-4">
            {getAuthState().user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                    {getAuthState().user?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{getAuthState().user?.username ?? '未知用户'}</p>
                    <p className="text-xs text-gray-500">{getAuthState().user?.email ?? '未知邮箱'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-primary-light hover:text-primary-dark">
                登录
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 顶部栏 */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <PageTitle />
          </div>
          
          {/* 右侧工具栏 */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <div className="relative">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
              </button>

              {/* 通知下拉面板 */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">通知</h3>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          notifications.forEach(n => markAsRead(n.id));
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        }}
                      >
                        全部标记为已读
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            notification.read ? 'bg-white' : 'bg-blue-50'
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            setNotifications(notifications.map(n => 
                              n.id === notification.id ? { ...n, read: true } : n
                            ));
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        暂无通知
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 页内容 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/plans" element={
              <PrivateRoute>
                <PlanManager />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* 移动端遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// 修改 NavLink 组件
const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`
        flex items-center px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30 translate-x-2' 
          : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
        }
      `}
    >
      <span className={`
        flex items-center justify-center w-10 h-10 rounded-lg
        ${isActive ? 'bg-white/20' : 'bg-gray-100'}
      `}>
        {item.icon}
      </span>
      <span className="ml-3 font-medium">{item.label}</span>
      {isActive && (
        <span className="ml-auto">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </Link>
  );
};

// 页面标题组件
const PageTitle: React.FC = () => {
  const location = useLocation();
  const titles: Record<string, string> = {
    '/home': '天气概览',
    '/plans': '计划管理',
    '/settings': '系统设置'
  };

  return (
    <h1 className="text-xl font-semibold">
      {titles[location.pathname]}
    </h1>
  );
};

// 由于 useNavigate 必须在 Router 上下文中使用，我们需要创建一个包装组件
const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;

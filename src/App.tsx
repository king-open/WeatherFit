import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { PlanManager } from './pages/PlanManager';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* 侧边栏 */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 transition duration-200 ease-in-out
            w-64 bg-white shadow-lg z-30
          `}
        >
          <div className="h-full flex flex-col">
            {/* Logo区域 */}
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <span className="text-xl font-semibold text-primary">Weather Reminder</span>
              <button 
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              <NavLink to="/home">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>首页</span>
              </NavLink>
              <NavLink to="/plans">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>计划管理</span>
              </NavLink>
              <NavLink to="/settings">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>设置</span>
              </NavLink>
            </nav>

            {/* 用户信息 */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                  U
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">用户名</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 主要内容区域 */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* 顶部栏 */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <button 
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <PageTitle />
            {/* 右侧工具栏 */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </header>

          {/* 页面内容 */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/plans" element={<PlanManager />} />
              <Route path="/settings" element={<div>设置页面开发中...</div>} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>

        {/* 移动端遮罩 */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
};

// 导航链接组件
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center space-x-3 p-3 rounded-lg
        ${isActive 
          ? 'bg-primary-light text-white' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      {children}
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
      {titles[location.pathname] || '404'}
    </h1>
  );
};

export default App;

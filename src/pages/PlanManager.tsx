import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import type { Plan, PlanType } from '../types/plan';

const STORAGE_KEY = 'weather-reminder-plans';

const planTypes: { value: PlanType; label: string; icon: JSX.Element }[] = [
  { 
    value: 'outdoor', 
    label: '户外活动',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  { 
    value: 'business', 
    label: '商务会议',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    value: 'sports', 
    label: '运动健身',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    value: 'entertainment', 
    label: '休闲娱乐',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    value: 'study', 
    label: '学习培训',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    value: 'family', 
    label: '家庭活动',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    value: 'other', 
    label: '其他安排',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
];

// 存储相关的工具函数
const storage = {
  getPlans: (): Plan[] => {
    try {
      const plans = localStorage.getItem(STORAGE_KEY);
      return plans ? JSON.parse(plans) : [];
    } catch (error) {
      console.error('Failed to load plans:', error);
      return [];
    }
  },

  savePlans: (plans: Plan[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Failed to save plans:', error);
    }
  }
};

export const PlanManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    type: 'other'
  });

  // 从 localStorage 加载计划
  useEffect(() => {
    const loadedPlans = storage.getPlans();
    setPlans(loadedPlans);
  }, []);

  // 保存计划到 localStorage
  const savePlans = (updatedPlans: Plan[]) => {
    storage.savePlans(updatedPlans);
    setPlans(updatedPlans);
    
    // 触发自定义事件，通知其他组件计划已更新
    window.dispatchEvent(new Event('planUpdated'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.title && newPlan.date && newPlan.time) {
      let updatedPlans: Plan[];
      
      if (editingPlan) {
        // 更新现有计划
        updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...newPlan, updatedAt: new Date().toISOString() }
            : plan
        );
      } else {
        // 创建新计划
        const plan: Plan = {
          id: Date.now().toString(),
          ...newPlan as Omit<Plan, 'id'>,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedPlans = [...plans, plan];
      }

      // 按日期和时间排序
      updatedPlans.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
      });

      savePlans(updatedPlans);
      handleCloseForm();
    }
  };

  const handleDelete = (planId: string) => {
    if (window.confirm('确定要删除这个计划吗？')) {
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      savePlans(updatedPlans);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setNewPlan(plan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlan(null);
    setNewPlan({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      type: 'other'
    });
  };

  // 获取今天的计划
  const todayPlans = plans.filter(plan => plan.date === new Date().toISOString().split('T')[0]);
  // 获取未来的计划
  const futurePlans = plans.filter(plan => plan.date > new Date().toISOString().split('T')[0]);
  // 获取过去的计划
  const pastPlans = plans.filter(plan => plan.date < new Date().toISOString().split('T')[0]);

  const renderPlanCard = (plan: Plan) => {
    const planType = planTypes.find(t => t.value === plan.type);
    
    return (
      <Card key={plan.id}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className={`
                p-2 rounded-lg 
                ${plan.type === 'outdoor' ? 'bg-blue-100 text-blue-600' :
                  plan.type === 'business' ? 'bg-purple-100 text-purple-600' :
                  plan.type === 'sports' ? 'bg-green-100 text-green-600' :
                  plan.type === 'entertainment' ? 'bg-yellow-100 text-yellow-600' :
                  plan.type === 'study' ? 'bg-red-100 text-red-600' :
                  plan.type === 'family' ? 'bg-pink-100 text-pink-600' :
                  'bg-gray-100 text-gray-600'}
              `}>
                {planType?.icon}
              </span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{plan.title}</h3>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <span>{new Date(plan.date).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{plan.time}</span>
                  <span>·</span>
                  <span>{plan.location}</span>
                </div>
              </div>
            </div>
            {plan.description && (
              <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <button 
              onClick={() => handleEdit(plan)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDelete(plan.id)}
              className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">计划管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {plans.length} 个计划</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>新增计划</span>
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPlan ? '编辑计划' : '新增计划'}
                </h2>
                <button 
                  type="button"
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">计划名称</label>
                <input
                  type="text"
                  className="input-field w-full mt-1 text-gray-900 bg-white"
                  value={newPlan.title}
                  onChange={e => setNewPlan({...newPlan, title: e.target.value})}
                  placeholder="请输入计划名称"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">日期</label>
                  <input
                    type="date"
                    className="input-field w-full mt-1 text-gray-900 bg-white"
                    value={newPlan.date}
                    onChange={e => setNewPlan({...newPlan, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">时间</label>
                  <input
                    type="time"
                    className="input-field w-full mt-1 text-gray-900 bg-white"
                    value={newPlan.time}
                    onChange={e => setNewPlan({...newPlan, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">地点</label>
                <input
                  type="text"
                  className="input-field w-full mt-1 text-gray-900 bg-white"
                  value={newPlan.location}
                  onChange={e => setNewPlan({...newPlan, location: e.target.value})}
                  placeholder="请输入地点"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">类型</label>
                <select
                  className="input-field w-full mt-1 text-gray-900 bg-white"
                  value={newPlan.type}
                  onChange={e => setNewPlan({...newPlan, type: e.target.value as PlanType})}
                  required
                >
                  {planTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="secondary" type="button" onClick={handleCloseForm}>
                  取消
                </Button>
                <Button type="submit">
                  {editingPlan ? '保存修改' : '创建计划'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 计划列表 */}
      <div className="grid gap-6">
        {/* 今日计划 */}
        {todayPlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>今日计划</span>
            </h2>
            <div className="space-y-4">
              {todayPlans.map(renderPlanCard)}
            </div>
          </section>
        )}

        {/* 未来计划 */}
        {futurePlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>未来计划</span>
            </h2>
            <div className="space-y-4">
              {futurePlans.map(renderPlanCard)}
            </div>
          </section>
        )}

        {/* 历史计划 */}
        {pastPlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-500 mb-4 flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>历史计划</span>
            </h2>
            <div className="space-y-4 opacity-75">
              {pastPlans.map(renderPlanCard)}
            </div>
          </section>
        )}

        {plans.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无计划</h3>
            <p className="mt-1 text-sm text-gray-500">开始创建你的第一个计划吧</p>
            <div className="mt-6">
              <Button onClick={() => setShowForm(true)}>
                新增计划
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 

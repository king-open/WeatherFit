import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import type { Plan, PlanType, PlanCategory, PlanTag } from '../types/plan';

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

// 修改类别配置，添加颜色
const planCategories: { value: PlanCategory; label: string; icon: JSX.Element; color: string }[] = [
  {
    value: 'work',
    label: '工作',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    value: 'exercise',
    label: '运动',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    value: 'social',
    label: '社交',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    value: 'study',
    label: '学习',
    color: 'bg-red-100 text-red-800 hover:bg-red-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    value: 'travel',
    label: '旅游',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    value: 'other',
    label: '其他',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
];

// 添加标签配置
const planTags: { value: PlanTag; label: string; color: string }[] = [
  {
    value: 'important',
    label: '重要',
    color: 'bg-red-100 text-red-800'
  },
  {
    value: 'urgent',
    label: '紧急',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    value: 'longterm',
    label: '长期',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'recurring',
    label: '重复',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'flexible',
    label: '灵活',
    color: 'bg-green-100 text-green-800'
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
  const [selectedTags, setSelectedTags] = useState<PlanTag[]>([]);
  const [filterCategory, setFilterCategory] = useState<PlanCategory | 'all'>('all');
  const [filterTags, setFilterTags] = useState<PlanTag[]>([]);

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

  // 修改新增计划按钮的处理函数
  const handleAddPlan = () => {
    // 如果已经选择了类别筛选，则使用该类别作为默认值
    setNewPlan({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      type: filterCategory === 'all' ? 'other' : filterCategory,
      category: filterCategory === 'all' ? 'other' : filterCategory,
      tags: filterTags // 如果有筛选的标签，也可以默认选中
    });
    setShowForm(true);
  };

  // 修改表单渲染函数
  const renderForm = () => (
    <div className="space-y-4">
      {/* 只在没有选择筛选类别时显示类别选择 */}
      {filterCategory === 'all' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">类别</label>
          <div className="flex flex-wrap gap-2">
            {planCategories.map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() => setNewPlan({...newPlan, category: category.value})}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${newPlan.category === category.value 
                    ? category.color.replace('hover:', '')
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                <span className={`
                  flex items-center justify-center
                  ${newPlan.category === category.value ? 'text-current' : 'text-gray-500'}
                `}>
                  {category.icon}
                </span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 只在没有选择筛选标签时显示标签选择 */}
      {filterTags.length === 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">标签</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {planTags.map(tag => (
              <button
                key={tag.value}
                type="button"
                onClick={() => {
                  const isSelected = selectedTags.includes(tag.value);
                  setSelectedTags(isSelected
                    ? selectedTags.filter(t => t !== tag.value)
                    : [...selectedTags, tag.value]
                  );
                }}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedTags.includes(tag.value) 
                    ? tag.color 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 添加筛选功能
  const renderFilters = () => (
    <div className="mb-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">按类别筛选</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${filterCategory === 'all' 
                ? 'bg-primary-light text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            全部
          </button>
          {planCategories.map(category => (
            <button
              key={category.value}
              onClick={() => setFilterCategory(category.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2
                ${filterCategory === category.value 
                  ? 'bg-primary-light text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">按标签筛选</label>
        <div className="flex flex-wrap gap-2">
          {planTags.map(tag => (
            <button
              key={tag.value}
              onClick={() => {
                const isSelected = filterTags.includes(tag.value);
                setFilterTags(isSelected
                  ? filterTags.filter(t => t !== tag.value)
                  : [...filterTags, tag.value]
                );
              }}
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${filterTags.includes(tag.value) ? tag.color : 'bg-gray-100 text-gray-600'}
                transition-colors duration-200
              `}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 过滤计划
  const filteredPlans = plans.filter(plan => {
    if (filterCategory !== 'all' && plan.category !== filterCategory) {
      return false;
    }
    if (filterTags.length > 0 && !filterTags.some(tag => plan.tags.includes(tag))) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">计划管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {plans.length} 个计划</p>
        </div>
        <Button 
          onClick={handleAddPlan}  // 修改这里，使用新的处理函数
          className="flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>新增{filterCategory !== 'all' ? planCategories.find(c => c.value === filterCategory)?.label : ''}计划</span>
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

              {renderForm()}

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

      {renderFilters()}

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

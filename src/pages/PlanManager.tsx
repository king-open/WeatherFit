import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import type { Plan, PlanType } from '../types/plan';

const planTypes: PlanType[] = ['outdoor', 'business', 'sports', 'other'];

export const PlanManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'other'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.title && newPlan.date && newPlan.time) {
      const plan: Plan = {
        id: Date.now().toString(),
        ...newPlan as Omit<Plan, 'id'>
      };
      setPlans([...plans, plan]);
      setShowForm(false);
      setNewPlan({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'other'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">计划管理</h1>
        <Button onClick={() => setShowForm(true)}>
          新增计划
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                className="input-field w-full"
                value={newPlan.title}
                onChange={e => setNewPlan({...newPlan, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">日期</label>
                <input
                  type="date"
                  className="input-field w-full"
                  value={newPlan.date}
                  onChange={e => setNewPlan({...newPlan, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">时间</label>
                <input
                  type="time"
                  className="input-field w-full"
                  value={newPlan.time}
                  onChange={e => setNewPlan({...newPlan, time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">地点</label>
              <input
                type="text"
                className="input-field w-full"
                value={newPlan.location}
                onChange={e => setNewPlan({...newPlan, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">类型</label>
              <select
                className="input-field w-full"
                value={newPlan.type}
                onChange={e => setNewPlan({...newPlan, type: e.target.value as PlanType})}
              >
                {planTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                取消
              </Button>
              <Button type="submit">
                保存
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {plans.map(plan => (
          <Card key={plan.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{plan.title}</h3>
                <p className="text-sm text-gray-600">{plan.date} {plan.time}</p>
                <p className="text-sm text-gray-600">@ {plan.location}</p>
              </div>
              <span className="px-2 py-1 text-sm rounded-full bg-primary-light text-white">
                {plan.type}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'weight' | 'fitness' | 'nutrition' | 'wellness';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

const goalCategories = [
  { value: 'weight', label: 'Weight Management', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'fitness', label: 'Fitness', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { value: 'nutrition', label: 'Nutrition', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'wellness', label: 'Wellness', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
];

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Lose 10 pounds',
    description: 'Reach my target weight for better health',
    category: 'weight',
    targetValue: 10,
    currentValue: 6,
    unit: 'lbs',
    deadline: '2024-06-01',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Run 5K daily',
    description: 'Build cardiovascular endurance',
    category: 'fitness',
    targetValue: 30,
    currentValue: 18,
    unit: 'days',
    deadline: '2024-05-01',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    title: 'Drink 8 glasses of water daily',
    description: 'Stay properly hydrated',
    category: 'wellness',
    targetValue: 30,
    currentValue: 30,
    unit: 'days',
    deadline: '2024-04-01',
    status: 'completed',
    createdAt: new Date('2024-03-01'),
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetValue: '',
    unit: '',
    deadline: '',
  });

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.category || !newGoal.targetValue || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category as Goal['category'],
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: 'active',
      createdAt: new Date(),
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', category: '', targetValue: '', unit: '', deadline: '' });
    setIsCreateDialogOpen(false);
    toast.success('Goal created successfully!');
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: newValue };
        if (newValue >= goal.targetValue && goal.status !== 'completed') {
          updatedGoal.status = 'completed';
          toast.success(`Congratulations! You've completed "${goal.title}"!`);
        }
        return updatedGoal;
      }
      return goal;
    }));
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    return goalCategories.find(cat => cat.value === category)?.color || 'bg-gray-100 text-gray-700';
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Health Goals
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Set, track, and achieve your health and wellness objectives
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new health goal to track your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Lose 10 pounds"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your goal..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetValue">Target Value *</Label>
                    <Input
                      id="targetValue"
                      type="number"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="lbs, days, etc."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>
                    Create Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedGoals.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals List */}
        <div className="space-y-6">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <CardDescription className="mt-1">{goal.description}</CardDescription>
                          </div>
                          <Badge className={getCategoryColor(goal.category)}>
                            {goalCategories.find(cat => cat.value === goal.category)?.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                            </div>
                            <Progress value={getProgressPercentage(goal)} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(getProgressPercentage(goal))}% complete
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Update"
                                className="w-20 h-8 text-xs"
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    updateGoalProgress(goal.id, value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Completed Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                              {goal.title}
                            </CardTitle>
                            <CardDescription className="mt-1">{goal.description}</CardDescription>
                          </div>
                          <Badge className={getCategoryColor(goal.category)}>
                            {goalCategories.find(cat => cat.value === goal.category)?.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Progress value={100} className="h-2" />
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              Goal completed! 🎉
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed: {goal.targetValue} {goal.unit}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {goals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start your health journey by setting your first goal.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Home, 
  ChefHat, 
  Utensils, 
  Calculator, 
  BarChart3, 
  Users, 
  Settings, 
  User,
  Heart,
  Brain,
  Activity,
  Droplets,
  Moon,
  Target,
  Trophy,
  MessageCircle,
  Bell,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: true,
  },
  {
    name: 'Meal Planner',
    href: '/meal-planner',
    icon: ChefHat,
    current: false,
  },
  {
    name: 'Food Logger',
    href: '/food-logger',
    icon: Utensils,
    current: false,
  },
  {
    name: 'Health Calculators',
    href: '/health-calculators',
    icon: Calculator,
    current: false,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    current: false,
  },
  {
    name: 'AI Coach',
    href: '/ai-coach',
    icon: Brain,
    current: false,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    current: false,
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: Trophy,
    current: false,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: false,
  },
];

const quickActions = [
  {
    name: 'Log Meal',
    href: '/food-logger?action=log',
    icon: Utensils,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  {
    name: 'Log Water',
    href: '/dashboard?action=water',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    name: 'Log Exercise',
    href: '/dashboard?action=exercise',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    name: 'Check In',
    href: '/dashboard?action=checkin',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950',
  },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                VitaPulse
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                  onClick={onClose}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-500' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-3 py-4 border-t">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200"
                  onClick={onClose}
                >
                  <div className={`mr-3 h-8 w-8 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  {action.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="px-3 py-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="px-3 py-4 border-t">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="flex-1">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

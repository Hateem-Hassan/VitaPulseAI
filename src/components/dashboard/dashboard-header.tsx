'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User as UserIcon,
  LogOut,
  Heart,
  Brain,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  user: User;
}

export function DashboardHeader({ onMenuClick, user }: DashboardHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      // This will be handled by the auth hook
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                VitaPulse
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search meals, exercises, or health data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-danger-500 text-xs flex items-center justify-center text-white">
                3
              </span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 rounded-lg bg-background border shadow-lg py-2 z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                
                <div className="py-1">
                  <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200">
                    <UserIcon className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  
                  <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </button>
                  
                  <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200">
                    <Activity className="mr-3 h-4 w-4" />
                    Analytics
                  </button>
                  
                  <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200">
                    <Brain className="mr-3 h-4 w-4" />
                    AI Coach
                  </button>
                </div>
                
                <div className="border-t py-1">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors duration-200"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

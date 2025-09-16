'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

export function RegistrationPopup({ isOpen, onClose, onRegister }: RegistrationPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      
      if (mode === 'login') {
        success = await signInWithEmail(email, password);
      } else {
        success = await signUp(email, password, name);
      }
      
      if (success) {
        await onRegister(email, password, name);
        onClose();
      }
    } catch (error) {
      toast.error(mode === 'register' ? 'Registration failed' : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueBrowsing = () => {
    toast.success('You can explore our free features! Pro tools require registration.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to VitaPulse!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'register' 
                ? 'Join thousands achieving their health goals with AI-powered tools'
                : 'Welcome back! Sign in to access your personalized health dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isLoading ? 'Processing...' : (mode === 'register' ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="text-center mt-4">
            <button
              onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              {mode === 'register' 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"
              }
            </button>
          </div>

          {/* Continue Browsing */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleContinueBrowsing}
              variant="outline"
              className="w-full h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Continue Browsing (Limited Features)
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              You can explore basic features without registration. Pro AI tools require an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
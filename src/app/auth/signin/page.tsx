'use client';

// Sign In Page with Multiple Authentication Methods
// Modern UI with email/password, Google, and Apple sign-in options

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Chrome, Apple as AppleIcon, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, signInWithApple, user, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Get redirect URL from query params
  const redirectTo = searchParams?.get('redirect') || '/dashboard';
  const message = searchParams?.get('message');
  const error = searchParams?.get('error');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show messages from URL params
  useEffect(() => {
    if (message) {
      toast.success(decodeURIComponent(message));
    }
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [message, error]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setErrors({ general: error.message });
      } else {
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('vitapulse-remember-email', formData.email);
        } else {
          localStorage.removeItem('vitapulse-remember-email');
        }
        
        router.push(redirectTo);
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Apple sign in
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign in with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('vitapulse-remember-email');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Welcome back
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Sign in to your VitaPulse account
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Sign In Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <AppleIcon className="mr-2 h-4 w-4" />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`pl-10 h-11 ${errors.email ? 'border-error-500 focus:border-error-500' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-error-600 dark:text-error-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`pl-10 pr-10 h-11 ${errors.password ? 'border-error-500 focus:border-error-500' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-error-600 dark:text-error-400">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-neutral-600 dark:text-neutral-400">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pt-4">
            <div className="text-center w-full">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Don&apos;t have an account?{' '}
                <Link
                  href={`/auth/signup${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            By signing in, you agree to our{' '}
            <Link href="/legal/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
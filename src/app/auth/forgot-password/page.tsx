'use client';

// Forgot Password Page with Email Reset Functionality
// Clean UI with email validation and reset instructions

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
}

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword, user, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const { error } = await resetPassword(formData.email);
      
      if (error) {
        setErrors({ general: error.message });
      } else {
        setIsSubmitted(true);
        toast.success('Password reset email sent successfully!');
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
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

  // Handle resend email
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(formData.email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent again!');
      }
    } catch (err) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {isSubmitted ? 'Check your email' : 'Forgot password?'}
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {isSubmitted 
              ? 'We\'ve sent password reset instructions to your email'
              : 'No worries, we\'ll send you reset instructions'
            }
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          {!isSubmitted ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Error Alert */}
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Reset Form */}
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
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.email}</p>
                    )}
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
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="pt-4">
                <div className="w-full">
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4">
                <div className="mx-auto w-16 h-16 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-center">
                  Email Sent!
                </CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to <strong>{formData.email}</strong>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    What's next?
                  </h3>
                  <ol className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                    <li className="flex items-start">
                      <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        1
                      </span>
                      Check your email inbox (and spam folder)
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        2
                      </span>
                      Click the reset link in the email
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        3
                      </span>
                      Create a new password
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        4
                      </span>
                      Sign in with your new password
                    </li>
                  </ol>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The reset link will expire in 1 hour for security reasons. If you don't see the email, check your spam folder.
                  </AlertDescription>
                </Alert>

                {/* Resend Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Resending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Resend Email
                    </div>
                  )}
                </Button>
              </CardContent>
              
              <CardFooter className="pt-4">
                <div className="w-full space-y-3">
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Link>
                  
                  <div className="text-center">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Wrong email?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ email: '' });
                          setErrors({});
                        }}
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                      >
                        Try again
                      </button>
                    </p>
                  </div>
                </div>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Help Section */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Still having trouble?{' '}
            <Link
              href="/support/contact"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
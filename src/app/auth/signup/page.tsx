'use client';

// Sign Up Page with Comprehensive Registration Form
// Multi-step registration with health profile setup

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Ruler, Weight, Chrome, Apple as AppleIcon, ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface FormData {
  // Account Info
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  
  // Health Profile
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  healthGoals: string[];
  medicalConditions: string;
  allergies: string;
  medications: string;
  
  // Preferences
  language: string;
  units: string;
  notifications: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

type Step = 'account' | 'profile' | 'preferences';

const HEALTH_GOALS = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'General Fitness',
  'Disease Prevention',
  'Stress Management',
  'Better Sleep',
  'Nutrition Improvement',
  'Mental Health',
  'Chronic Disease Management'
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)' },
  { value: 'extremely_active', label: 'Extremely Active (very hard exercise, physical job)' }
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ar', label: 'العربية' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'hi', label: 'हिन्दी' }
];

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle, signInWithApple, user, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    healthGoals: [],
    medicalConditions: '',
    allergies: '',
    medications: '',
    language: 'en',
    units: 'metric',
    notifications: true,
    termsAccepted: false,
    privacyAccepted: false,
    marketingConsent: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get redirect URL from query params
  const redirectTo = searchParams?.get('redirect') || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Validate current step
  const validateStep = (step: Step): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 'account') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 'profile') {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 13) {
          newErrors.dateOfBirth = 'You must be at least 13 years old';
        }
      }
      
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }
      
      if (!formData.height) {
        newErrors.height = 'Height is required';
      } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
        newErrors.height = 'Please enter a valid height';
      }
      
      if (!formData.weight) {
        newErrors.weight = 'Weight is required';
      } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
        newErrors.weight = 'Please enter a valid weight';
      }
      
      if (!formData.activityLevel) {
        newErrors.activityLevel = 'Activity level is required';
      }
    }
    
    if (step === 'preferences') {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the Terms of Service';
      }
      
      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = 'You must accept the Privacy Policy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'account') {
        setCurrentStep('profile');
      } else if (currentStep === 'profile') {
        setCurrentStep('preferences');
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep === 'profile') {
      setCurrentStep('account');
    } else if (currentStep === 'preferences') {
      setCurrentStep('profile');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep('preferences')) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: formData.activityLevel,
        healthGoals: formData.healthGoals,
        medicalConditions: formData.medicalConditions,
        allergies: formData.allergies,
        medications: formData.medications,
        language: formData.language,
        units: formData.units,
        notifications: formData.notifications,
        marketingConsent: formData.marketingConsent
      });
      
      if (error) {
        setErrors({ general: error.message });
      } else {
        toast.success('Account created successfully! Please check your email to verify your account.');
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Apple sign up
  const handleAppleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign up with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle health goals toggle
  const toggleHealthGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stepTitles = {
    account: 'Create Account',
    profile: 'Health Profile',
    preferences: 'Preferences'
  };

  const stepDescriptions = {
    account: 'Set up your account credentials',
    profile: 'Tell us about your health goals',
    preferences: 'Customize your experience'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Join VitaPulse
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Start your personalized health journey today
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {(['account', 'profile', 'preferences'] as Step[]).map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = (
              (step === 'account' && (currentStep === 'profile' || currentStep === 'preferences')) ||
              (step === 'profile' && currentStep === 'preferences')
            );
            
            return (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted ? 'bg-success-600 text-white' : 
                    isActive ? 'bg-primary-600 text-white' : 
                    'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}
                `}>
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-success-600' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              {stepTitles[currentStep]}
            </CardTitle>
            <CardDescription className="text-center">
              {stepDescriptions[currentStep]}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Account Step */}
            {currentStep === 'account' && (
              <>
                {/* Social Sign Up Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    onClick={handleAppleSignUp}
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
                      Or create account with email
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

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        className={`pl-10 h-11 ${errors.firstName ? 'border-error-500 focus:border-error-500' : ''}`}
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className={`h-11 ${errors.lastName ? 'border-error-500 focus:border-error-500' : ''}`}
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        autoComplete="new-password"
                        required
                        className={`pl-10 pr-10 h-11 ${errors.password ? 'border-error-500 focus:border-error-500' : ''}`}
                        placeholder="Create password"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? 'border-error-500 focus:border-error-500' : ''}`}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        formData.password.length >= 8 ? 'bg-success-500' : 'bg-neutral-300'
                      }`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /[A-Z]/.test(formData.password) ? 'bg-success-500' : 'bg-neutral-300'
                      }`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /[a-z]/.test(formData.password) ? 'bg-success-500' : 'bg-neutral-300'
                      }`} />
                      One lowercase letter
                    </li>
                    <li className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /\d/.test(formData.password) ? 'bg-success-500' : 'bg-neutral-300'
                      }`} />
                      One number
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Profile Step */}
            {currentStep === 'profile' && (
              <>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        className={`pl-10 h-11 ${errors.dateOfBirth ? 'border-error-500 focus:border-error-500' : ''}`}
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className={`h-11 ${errors.gender ? 'border-error-500 focus:border-error-500' : ''}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.gender}</p>
                    )}
                  </div>
                </div>

                {/* Physical Measurements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height ({formData.units === 'metric' ? 'cm' : 'inches'})
                    </Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        required
                        className={`pl-10 h-11 ${errors.height ? 'border-error-500 focus:border-error-500' : ''}`}
                        placeholder={formData.units === 'metric' ? '170' : '67'}
                        value={formData.height}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        min="1"
                        max={formData.units === 'metric' ? '300' : '120'}
                      />
                    </div>
                    {errors.height && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.height}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">
                      Weight ({formData.units === 'metric' ? 'kg' : 'lbs'})
                    </Label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        required
                        className={`pl-10 h-11 ${errors.weight ? 'border-error-500 focus:border-error-500' : ''}`}
                        placeholder={formData.units === 'metric' ? '70' : '154'}
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        min="1"
                        max={formData.units === 'metric' ? '500' : '1100'}
                        step="0.1"
                      />
                    </div>
                    {errors.weight && (
                      <p className="text-sm text-error-600 dark:text-error-400">{errors.weight}</p>
                    )}
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-2">
                  <Label htmlFor="activityLevel" className="text-sm font-medium">
                    Activity Level
                  </Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleSelectChange('activityLevel', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={`h-11 ${errors.activityLevel ? 'border-error-500 focus:border-error-500' : ''}`}>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.activityLevel && (
                    <p className="text-sm text-error-600 dark:text-error-400">{errors.activityLevel}</p>
                  )}
                </div>

                {/* Health Goals */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Health Goals (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {HEALTH_GOALS.map((goal) => (
                      <label
                        key={goal}
                        className={`
                          flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                          ${formData.healthGoals.includes(goal)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.healthGoals.includes(goal)}
                          onChange={() => toggleHealthGoal(goal)}
                          disabled={isLoading}
                        />
                        <div className={`
                          w-4 h-4 rounded border-2 mr-2 flex items-center justify-center
                          ${formData.healthGoals.includes(goal)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-neutral-300 dark:border-neutral-600'
                          }
                        `}>
                          {formData.healthGoals.includes(goal) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions" className="text-sm font-medium">
                      Medical Conditions (Optional)
                    </Label>
                    <Textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      className="min-h-[80px]"
                      placeholder="List any medical conditions, chronic illnesses, or health concerns..."
                      value={formData.medicalConditions}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="text-sm font-medium">
                      Allergies (Optional)
                    </Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      className="min-h-[60px]"
                      placeholder="List any food allergies, drug allergies, or environmental allergies..."
                      value={formData.allergies}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="text-sm font-medium">
                      Current Medications (Optional)
                    </Label>
                    <Textarea
                      id="medications"
                      name="medications"
                      className="min-h-[60px]"
                      placeholder="List any medications, supplements, or treatments you're currently taking..."
                      value={formData.medications}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This information helps us provide personalized health recommendations. All data is encrypted and kept confidential.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {/* Preferences Step */}
            {currentStep === 'preferences' && (
              <>
                {/* Language & Units */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium">
                      Preferred Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleSelectChange('language', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="units" className="text-sm font-medium">
                      Measurement Units
                    </Label>
                    <Select
                      value={formData.units}
                      onValueChange={(value) => handleSelectChange('units', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="notifications"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <div>
                        <p className="text-sm font-medium">Health Reminders</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Receive reminders for medications, appointments, and health goals
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        checked={formData.marketingConsent}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <div>
                        <p className="text-sm font-medium">Marketing Communications</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Receive updates about new features, health tips, and special offers
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Legal Agreements</h3>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-0.5 ${
                        errors.termsAccepted ? 'border-error-500' : ''
                      }`}
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <div>
                      <p className="text-sm">
                        I agree to the{' '}
                        <Link href="/legal/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
                          Terms of Service
                        </Link>
                      </p>
                      {errors.termsAccepted && (
                        <p className="text-xs text-error-600 dark:text-error-400 mt-1">{errors.termsAccepted}</p>
                      )}
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-0.5 ${
                        errors.privacyAccepted ? 'border-error-500' : ''
                      }`}
                      checked={formData.privacyAccepted}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <div>
                      <p className="text-sm">
                        I acknowledge that I have read and understand the{' '}
                        <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
                          Privacy Policy
                        </Link>
                      </p>
                      {errors.privacyAccepted && (
                        <p className="text-xs text-error-600 dark:text-error-400 mt-1">{errors.privacyAccepted}</p>
                      )}
                    </div>
                  </label>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4">
            {currentStep !== 'account' && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            
            {currentStep === 'account' && (
              <div></div>
            )}
            
            {currentStep !== 'preferences' ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white flex items-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create Account
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link
              href={`/auth/signin${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

// User Profile Page - Comprehensive health data management and settings
// Multi-language support with cultural health considerations

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  Heart,
  Activity,
  Calendar,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Check,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  Crown,
  Star,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock,
  MapPin,
  Phone,
  Camera,
  FileText,
  Database,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  LogOut,
  UserCheck,
  UserX,
  Users,
  Briefcase,
  GraduationCap,
  Award,
  Badge as BadgeIcon,
  Gift,
  CreditCard,
  DollarSign,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number; // cm
  weight?: number; // kg
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  healthGoals?: string[];
  medicalConditions?: string[];
  allergies?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  culturalBackground?: string;
  dietaryRestrictions?: string[];
  preferredLanguage: string;
  timezone: string;
  country: string;
  city?: string;
  phoneNumber?: string;
  profilePicture?: string;
  bio?: string;
  occupation?: string;
  education?: string;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  sleepGoal?: number; // hours
  waterGoal?: number; // ml
  calorieGoal?: number;
  stepGoal?: number;
  subscriptionTier: 'free' | 'premium' | 'professional';
  subscriptionExpiry?: Date;
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    healthDataSharing: boolean;
    analyticsOptIn: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    dataExport: boolean;
  };
  notificationSettings: {
    medicationReminders: boolean;
    appointmentReminders: boolean;
    healthTips: boolean;
    goalAchievements: boolean;
    weeklyReports: boolean;
    emergencyAlerts: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface HealthStats {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageStepsPerDay: number;
  averageSleepHours: number;
  waterIntakeStreak: number;
  goalCompletionRate: number;
  healthScore: number;
  bmi: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  restingHeartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
}

const subscriptionFeatures = {
  free: {
    name: 'Free',
    price: '$0',
    features: [
      'Basic health tracking',
      'Limited AI consultations (3/month)',
      'Basic meal planning',
      'Community access',
      'Standard support'
    ],
    color: 'bg-neutral-100 text-neutral-800',
    icon: User
  },
  premium: {
    name: 'Premium',
    price: '$9.99/month',
    features: [
      'Advanced health analytics',
      'Unlimited AI consultations',
      'Personalized meal plans',
      'Priority support',
      'Export health data',
      'Advanced goal tracking',
      'Medication reminders'
    ],
    color: 'bg-blue-100 text-blue-800',
    icon: Star
  },
  professional: {
    name: 'Professional',
    price: '$19.99/month',
    features: [
      'All Premium features',
      'Healthcare provider integration',
      'Advanced biometric tracking',
      'Custom health reports',
      'API access',
      'White-label options',
      'Dedicated account manager'
    ],
    color: 'bg-purple-100 text-purple-800',
    icon: Crown
  }
};

const healthGoalOptions = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'Cardiovascular Health',
  'Stress Management',
  'Better Sleep',
  'Nutrition Improvement',
  'Chronic Disease Management',
  'Mental Health',
  'Pregnancy Health',
  'Senior Health',
  'Athletic Performance'
];

const culturalBackgrounds = [
  'Western',
  'Middle Eastern',
  'South Asian',
  'East Asian',
  'Southeast Asian',
  'African',
  'Latin American',
  'Mediterranean',
  'Nordic',
  'Other'
];

const dietaryRestrictions = [
  'Halal',
  'Kosher',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Sodium',
  'Diabetic',
  'Keto',
  'Paleo',
  'Mediterranean'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' }
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const { isDark } = useTheme();
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    subscriptionTier: 'free',
    preferredLanguage: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    country: 'US',
    privacySettings: {
      profileVisibility: 'private',
      healthDataSharing: false,
      analyticsOptIn: true,
      marketingEmails: false,
      pushNotifications: true,
      dataExport: true
    },
    notificationSettings: {
      medicationReminders: true,
      appointmentReminders: true,
      healthTips: true,
      goalAchievements: true,
      weeklyReports: false,
      emergencyAlerts: true
    }
  });
  
  const [healthStats, setHealthStats] = useState<HealthStats>({
    totalWorkouts: 45,
    totalCaloriesBurned: 12500,
    averageStepsPerDay: 8500,
    averageSleepHours: 7.2,
    waterIntakeStreak: 12,
    goalCompletionRate: 78,
    healthScore: 85,
    bmi: 23.5,
    bodyFatPercentage: 18,
    muscleMass: 65,
    restingHeartRate: 65,
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (userProfile) {
      setProfile(prev => ({ ...prev, ...userProfile }));
    }
    loadHealthStats();
  }, [userProfile]);

  const loadHealthStats = async () => {
    if (!user) return;
    
    try {
      // Load health statistics from database
      const { data, error } = await supabase
        .from('user_health_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setHealthStats(data);
      }
    } catch (error) {
      console.error('Error loading health stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      await updateProfile(profile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Delete user data
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Sign out and redirect
      await signOut();
      router.push('/');
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const exportHealthData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_health_records')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const exportData = {
        profile,
        healthStats,
        healthRecords: data,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vitapulse-health-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Health data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export health data');
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  const getSubscriptionBadge = () => {
    const subscription = subscriptionFeatures[profile.subscriptionTier || 'free'];
    const Icon = subscription.icon;
    
    return (
      <Badge className={subscription.color}>
        <Icon className="h-3 w-3 mr-1" />
        {subscription.name}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/auth/signin')} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profile.firstName ? profile.firstName[0] : user.email?.[0]?.toUpperCase()}
                </div>
                {profile.subscriptionTier !== 'free' && (
                  <div className="absolute -top-1 -right-1">
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : user.email
                  }
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  {getSubscriptionBadge()}
                  <Badge variant="outline">
                    Health Score: {healthStats.healthScore}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={isLoading}
              >
                {isEditing ? (
                  <><Save className="h-4 w-4 mr-2" />Save Changes</>
                ) : (
                  <><Edit3 className="h-4 w-4 mr-2" />Edit Profile</>
                )}
              </Button>
              
              {isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Basic information about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth ? profile.dateOfBirth.toISOString().split('T')[0] : ''}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          dateOfBirth: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={profile.gender || ''} 
                        onValueChange={(value: any) => setProfile(prev => ({ ...prev, gender: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={profile.phoneNumber || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Health Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Profile</CardTitle>
                  <CardDescription>
                    Your health information and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={profile.height || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, height: Number(e.target.value) }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={profile.weight || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select 
                      value={profile.activityLevel || ''} 
                      onValueChange={(value: any) => setProfile(prev => ({ ...prev, activityLevel: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="lightly_active">Lightly Active</SelectItem>
                        <SelectItem value="moderately_active">Moderately Active</SelectItem>
                        <SelectItem value="very_active">Very Active</SelectItem>
                        <SelectItem value="extremely_active">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Health Goals</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {healthGoalOptions.map(goal => (
                        <div key={goal} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={goal}
                            checked={profile.healthGoals?.includes(goal) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProfile(prev => ({
                                  ...prev,
                                  healthGoals: [...(prev.healthGoals || []), goal]
                                }));
                              } else {
                                setProfile(prev => ({
                                  ...prev,
                                  healthGoals: prev.healthGoals?.filter(g => g !== goal) || []
                                }));
                              }
                            }}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <Label htmlFor={goal} className="text-sm">{goal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Textarea
                      id="medicalConditions"
                      value={profile.medicalConditions?.join(', ') || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        medicalConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      disabled={!isEditing}
                      placeholder="List any medical conditions (comma-separated)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={profile.allergies?.join(', ') || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      disabled={!isEditing}
                      placeholder="List any allergies (comma-separated)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cultural & Dietary Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Cultural & Dietary Preferences</CardTitle>
                <CardDescription>
                  Help us provide culturally appropriate health advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="culturalBackground">Cultural Background</Label>
                    <Select 
                      value={profile.culturalBackground || ''} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, culturalBackground: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent>
                        {culturalBackgrounds.map(bg => (
                          <SelectItem key={bg} value={bg.toLowerCase()}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select 
                      value={profile.preferredLanguage || 'en'} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, preferredLanguage: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profile.country || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Dietary Restrictions</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {dietaryRestrictions.map(restriction => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={restriction}
                          checked={profile.dietaryRestrictions?.includes(restriction) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile(prev => ({
                                ...prev,
                                dietaryRestrictions: [...(prev.dietaryRestrictions || []), restriction]
                              }));
                            } else {
                              setProfile(prev => ({
                                ...prev,
                                dietaryRestrictions: prev.dietaryRestrictions?.filter(r => r !== restriction) || []
                              }));
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded"
                        />
                        <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Data Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Health Score</p>
                      <p className="text-2xl font-bold text-green-600">{healthStats.healthScore}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">BMI</p>
                      <p className="text-2xl font-bold text-blue-600">{healthStats.bmi}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Steps</p>
                      <p className="text-2xl font-bold text-purple-600">{healthStats.averageStepsPerDay.toLocaleString()}</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Sleep Avg</p>
                      <p className="text-2xl font-bold text-indigo-600">{healthStats.averageSleepHours}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Goal Completion Rate</span>
                    <span className="font-semibold">{healthStats.goalCompletionRate}%</span>
                  </div>
                  <Progress value={healthStats.goalCompletionRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Water Intake Streak</span>
                    <span className="font-semibold">{healthStats.waterIntakeStreak} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Total Workouts</span>
                    <span className="font-semibold">{healthStats.totalWorkouts}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Calories Burned</span>
                    <span className="font-semibold">{healthStats.totalCaloriesBurned.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthStats.restingHeartRate && (
                    <div className="flex justify-between items-center">
                      <span>Resting Heart Rate</span>
                      <span className="font-semibold">{healthStats.restingHeartRate} bpm</span>
                    </div>
                  )}
                  
                  {healthStats.bloodPressure && (
                    <div className="flex justify-between items-center">
                      <span>Blood Pressure</span>
                      <span className="font-semibold">
                        {healthStats.bloodPressure.systolic}/{healthStats.bloodPressure.diastolic} mmHg
                      </span>
                    </div>
                  )}
                  
                  {healthStats.bodyFatPercentage && (
                    <div className="flex justify-between items-center">
                      <span>Body Fat</span>
                      <span className="font-semibold">{healthStats.bodyFatPercentage}%</span>
                    </div>
                  )}
                  
                  {healthStats.muscleMass && (
                    <div className="flex justify-between items-center">
                      <span>Muscle Mass</span>
                      <span className="font-semibold">{healthStats.muscleMass} kg</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(subscriptionFeatures).map(([tier, features]) => {
                const Icon = features.icon;
                const isCurrentTier = profile.subscriptionTier === tier;
                
                return (
                  <Card key={tier} className={`relative ${isCurrentTier ? 'ring-2 ring-blue-500' : ''}`}>
                    {isCurrentTier && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">
                          Current Plan
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit">
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle>{features.name}</CardTitle>
                      <div className="text-3xl font-bold">{features.price}</div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {features.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className="w-full" 
                        variant={isCurrentTier ? 'outline' : 'default'}
                        disabled={isCurrentTier}
                      >
                        {isCurrentTier ? 'Current Plan' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {profile.subscriptionTier !== 'free' && profile.subscriptionExpiry && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Next billing date</p>
                      <p className="text-sm text-neutral-500">
                        {profile.subscriptionExpiry.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline">
                      Manage Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your data is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <p className="text-sm text-neutral-500">Who can see your profile</p>
                  </div>
                  <Select 
                    value={profile.privacySettings?.profileVisibility || 'private'} 
                    onValueChange={(value: any) => setProfile(prev => ({
                      ...prev,
                      privacySettings: {
                        ...prev.privacySettings!,
                        profileVisibility: value
                      }
                    }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="healthDataSharing">Health Data Sharing</Label>
                    <p className="text-sm text-neutral-500">Share anonymized health data for research</p>
                  </div>
                  <Switch
                    id="healthDataSharing"
                    checked={profile.privacySettings?.healthDataSharing || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacySettings: {
                        ...prev.privacySettings!,
                        healthDataSharing: checked
                      }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsOptIn">Analytics</Label>
                    <p className="text-sm text-neutral-500">Help improve our services with usage analytics</p>
                  </div>
                  <Switch
                    id="analyticsOptIn"
                    checked={profile.privacySettings?.analyticsOptIn || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacySettings: {
                        ...prev.privacySettings!,
                        analyticsOptIn: checked
                      }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-neutral-500">Receive promotional emails and newsletters</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={profile.privacySettings?.marketingEmails || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacySettings: {
                        ...prev.privacySettings!,
                        marketingEmails: checked
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export or delete your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Export Health Data</Label>
                    <p className="text-sm text-neutral-500">Download all your health data in JSON format</p>
                  </div>
                  <Button onClick={exportHealthData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-red-600">Delete Account</Label>
                    <p className="text-sm text-neutral-500">Permanently delete your account and all data</p>
                  </div>
                  <Button 
                    onClick={() => setShowDeleteDialog(true)} 
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="medicationReminders">Medication Reminders</Label>
                    <p className="text-sm text-neutral-500">Get notified when it's time to take medication</p>
                  </div>
                  <Switch
                    id="medicationReminders"
                    checked={profile.notificationSettings?.medicationReminders || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notificationSettings: {
                        ...prev.notificationSettings!,
                        medicationReminders: checked
                      }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                    <p className="text-sm text-neutral-500">Reminders for upcoming medical appointments</p>
                  </div>
                  <Switch
                    id="appointmentReminders"
                    checked={profile.notificationSettings?.appointmentReminders || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notificationSettings: {
                        ...prev.notificationSettings!,
                        appointmentReminders: checked
                      }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="healthTips">Health Tips</Label>
                    <p className="text-sm text-neutral-500">Daily health tips and educational content</p>
                  </div>
                  <Switch
                    id="healthTips"
                    checked={profile.notificationSettings?.healthTips || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notificationSettings: {
                        ...prev.notificationSettings!,
                        healthTips: checked
                      }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="goalAchievements">Goal Achievements</Label>
                    <p className="text-sm text-neutral-500">Celebrate when you reach your health goals</p>
                  </div>
                  <Switch
                    id="goalAchievements"
                    checked={profile.notificationSettings?.goalAchievements || false}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notificationSettings: {
                        ...prev.notificationSettings!,
                        goalAchievements: checked
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Change Password</Label>
                    <p className="text-sm text-neutral-500">Update your account password</p>
                  </div>
                  <Button onClick={() => setShowPasswordDialog(true)} variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-red-600">Sign Out</Label>
                    <p className="text-sm text-neutral-500">Sign out of your account on this device</p>
                  </div>
                  <Button onClick={signOut} variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                All your health data, progress, and settings will be permanently lost.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Globe, Smartphone, LogOut, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    height: string;
    weight: string;
    activityLevel: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    mealReminders: boolean;
    workoutReminders: boolean;
    progressUpdates: boolean;
    communityUpdates: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    units: string;
    timezone: string;
    dietaryRestrictions: string[];
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
    analyticsTracking: boolean;
    marketingEmails: boolean;
  };
}

const mockSettings: UserSettings = {
  profile: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    height: '180',
    weight: '75',
    activityLevel: 'moderate',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    mealReminders: true,
    workoutReminders: true,
    progressUpdates: false,
    communityUpdates: true,
  },
  preferences: {
    theme: 'system',
    language: 'en',
    units: 'metric',
    timezone: 'UTC-5',
    dietaryRestrictions: ['halal'],
  },
  privacy: {
    profileVisibility: 'friends',
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const updateProfile = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const updatePreferences = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const updatePrivacy = (field: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

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
              Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your account preferences and privacy settings
            </p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" alt={settings.profile.fullName} />
                      <AvatarFallback className="text-lg">
                        {settings.profile.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={settings.profile.fullName}
                        onChange={(e) => updateProfile('fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={settings.profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={settings.profile.dateOfBirth}
                        onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Health Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Health Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={settings.profile.gender} onValueChange={(value) => updateProfile('gender', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={settings.profile.height}
                          onChange={(e) => updateProfile('height', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={settings.profile.weight}
                          onChange={(e) => updateProfile('weight', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityLevel">Activity Level</Label>
                        <Select value={settings.profile.activityLevel} onValueChange={(value) => updateProfile('activityLevel', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="very-active">Very Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about your health journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateNotifications('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) => updateNotifications('pushNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="mealReminders">Meal Reminders</Label>
                        <p className="text-sm text-gray-500">Get reminded to log your meals</p>
                      </div>
                      <Switch
                        id="mealReminders"
                        checked={settings.notifications.mealReminders}
                        onCheckedChange={(checked) => updateNotifications('mealReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="workoutReminders">Workout Reminders</Label>
                        <p className="text-sm text-gray-500">Get reminded about your workout schedule</p>
                      </div>
                      <Switch
                        id="workoutReminders"
                        checked={settings.notifications.workoutReminders}
                        onCheckedChange={(checked) => updateNotifications('workoutReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progressUpdates">Progress Updates</Label>
                        <p className="text-sm text-gray-500">Weekly progress summaries</p>
                      </div>
                      <Switch
                        id="progressUpdates"
                        checked={settings.notifications.progressUpdates}
                        onCheckedChange={(checked) => updateNotifications('progressUpdates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="communityUpdates">Community Updates</Label>
                        <p className="text-sm text-gray-500">Updates from the VitaPulse community</p>
                      </div>
                      <Switch
                        id="communityUpdates"
                        checked={settings.notifications.communityUpdates}
                        onCheckedChange={(checked) => updateNotifications('communityUpdates', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>
                    Customize your app experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={settings.preferences.theme} onValueChange={(value) => updatePreferences('theme', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.preferences.language} onValueChange={(value) => updatePreferences('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="units">Units</Label>
                      <Select value={settings.preferences.units} onValueChange={(value) => updatePreferences('units', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                          <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.preferences.timezone} onValueChange={(value) => updatePreferences('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy &amp; Security</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <Select value={settings.privacy.profileVisibility} onValueChange={(value) => updatePrivacy('profileVisibility', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dataSharing">Data Sharing</Label>
                        <p className="text-sm text-gray-500">Share anonymized data for research</p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) => updatePrivacy('dataSharing', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                        <p className="text-sm text-gray-500">Help improve the app with usage analytics</p>
                      </div>
                      <Switch
                        id="analyticsTracking"
                        checked={settings.privacy.analyticsTracking}
                        onCheckedChange={(checked) => updatePrivacy('analyticsTracking', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={settings.privacy.marketingEmails}
                        onCheckedChange={(checked) => updatePrivacy('marketingEmails', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div>
                        <Label className="text-red-600">Sign Out</Label>
                        <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                      </div>
                      <Button variant="destructive" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
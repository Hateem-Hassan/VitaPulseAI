'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Send, 
  AlertTriangle, 
  Clock, 
  User, 
  Globe, 
  Loader2,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface SymptomAnalysis {
  severity: 'low' | 'medium' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  culturalConsiderations: string[];
  urgencyLevel: string;
  disclaimer: string;
}

interface UserProfile {
  age: string;
  gender: string;
  culturalBackground: string;
  medicalHistory: string[];
}

export default function SymptomCheckerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: '',
    gender: '',
    culturalBackground: '',
    medicalHistory: []
  });
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/ai-tools/symptom-checker');
    }
  }, [user, loading, router]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const culturalBackgrounds = [
    'Western/European',
    'Middle Eastern',
    'South Asian',
    'East Asian',
    'African',
    'Latin American',
    'Indigenous',
    'Other'
  ];

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis (replace with actual OpenAI/Claude API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockAnalysis: SymptomAnalysis = {
        severity: symptoms.toLowerCase().includes('severe') || symptoms.toLowerCase().includes('emergency') ? 'high' : 'medium',
        possibleConditions: [
          'Common Cold',
          'Seasonal Allergies',
          'Viral Infection'
        ],
        recommendations: [
          'Rest and stay hydrated',
          'Monitor symptoms for 24-48 hours',
          'Consider over-the-counter medications for symptom relief',
          'Consult healthcare provider if symptoms worsen'
        ],
        culturalConsiderations: [
          userProfile.culturalBackground === 'Middle Eastern' 
            ? 'Consider traditional remedies like honey and ginger tea'
            : 'Consider culturally appropriate comfort foods and remedies',
          'Discuss with family elders about traditional healing practices',
          'Ensure dietary restrictions are considered in treatment'
        ],
        urgencyLevel: 'Monitor closely',
        disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
      };

      setAnalysis(mockAnalysis);
      toast.success('Symptom analysis completed');
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'emergency': return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'emergency': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                <Brain className="h-8 w-8 mr-3 text-purple-600" />
                AI Symptom Checker
              </h1>
              <p className="text-gray-600 mt-1">
                Get AI-powered health insights with cultural sensitivity
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center">
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Important Notice */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> This AI tool provides general health information only. 
            For medical emergencies, call emergency services immediately. Always consult healthcare professionals for proper diagnosis and treatment.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Help us provide more accurate and culturally sensitive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range
                    </label>
                    <Select value={userProfile.age} onValueChange={(value) => setUserProfile({...userProfile, age: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-17">0-17 years</SelectItem>
                        <SelectItem value="18-30">18-30 years</SelectItem>
                        <SelectItem value="31-50">31-50 years</SelectItem>
                        <SelectItem value="51-70">51-70 years</SelectItem>
                        <SelectItem value="70+">70+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Select value={userProfile.gender} onValueChange={(value) => setUserProfile({...userProfile, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultural Background
                  </label>
                  <Select value={userProfile.culturalBackground} onValueChange={(value) => setUserProfile({...userProfile, culturalBackground: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cultural background" />
                    </SelectTrigger>
                    <SelectContent>
                      {culturalBackgrounds.map((background) => (
                        <SelectItem key={background} value={background}>
                          {background}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Input */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Describe Your Symptoms
                </CardTitle>
                <CardDescription>
                  Please describe your symptoms in detail, including when they started and their severity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Example: I have been experiencing a headache for the past 2 days, along with a runny nose and mild fever. The headache is moderate and gets worse in the evening..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32 resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {symptoms.length}/1000 characters
                  </span>
                  <Button 
                    onClick={handleAnalyzeSymptoms}
                    disabled={isAnalyzing || !symptoms.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Severity Level */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Severity Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getSeverityColor(analysis.severity)} flex items-center w-fit`}>
                      {getSeverityIcon(analysis.severity)}
                      <span className="ml-2 capitalize">{analysis.severity}</span>
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      {analysis.urgencyLevel}
                    </p>
                  </CardContent>
                </Card>

                {/* Possible Conditions */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Possible Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.possibleConditions.map((condition, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Cultural Considerations */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-purple-600" />
                      Cultural Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.culturalConsiderations.map((consideration, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    {analysis.disclaimer}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600">
                    Fill in your information and describe your symptoms to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
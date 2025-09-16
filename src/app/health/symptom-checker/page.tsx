'use client';

// AI Symptom Checker with Cultural Considerations
// Advanced symptom analysis with AI-powered insights and recommendations

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Search,
  Plus,
  X,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Calendar,
  Thermometer,
  Activity,
  Heart,
  Zap,
  Shield,
  FileText,
  ChevronRight,
  Loader2,
  CheckCircle,
  Info
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
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { aiService } from '@/lib/ai-services';
import { toast } from 'sonner';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description?: string;
}

interface SymptomAnalysis {
  id: string;
  possibleConditions: Array<{
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
    culturalConsiderations?: string;
  }>;
  recommendations: Array<{
    type: 'immediate' | 'urgent' | 'routine' | 'lifestyle';
    action: string;
    reason: string;
    culturalNote?: string;
  }>;
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  culturalContext: {
    region: string;
    considerations: string[];
    localResources: string[];
  };
  disclaimer: string;
  timestamp: string;
}

interface PatientInfo {
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}

export default function SymptomCheckerPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'details' | 'analysis'>('symptoms');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    age: userProfile?.age || 25,
    gender: (userProfile?.gender as 'male' | 'female' | 'other') || 'other',
    location: userProfile?.location || '',
    medicalHistory: [],
    currentMedications: [],
    allergies: []
  });
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Common symptoms for quick selection
  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest pain', 'Shortness of breath', 'Abdominal pain', 'Back pain',
    'Sore throat', 'Runny nose', 'Muscle aches', 'Joint pain', 'Rash',
    'Vomiting', 'Diarrhea', 'Constipation', 'Loss of appetite', 'Insomnia'
  ];

  // Filter symptoms based on search
  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add symptom
  const addSymptom = (symptomName: string, severity: 'mild' | 'moderate' | 'severe' = 'moderate') => {
    if (symptoms.find(s => s.name.toLowerCase() === symptomName.toLowerCase())) {
      toast.error('Symptom already added');
      return;
    }
    
    const newSymptomObj: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity,
      duration: '1-2 days'
    };
    
    setSymptoms(prev => [...prev, newSymptomObj]);
    setNewSymptom('');
    setSearchQuery('');
  };

  // Remove symptom
  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  // Update symptom
  const updateSymptom = (id: string, updates: Partial<Symptom>) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Analyze symptoms
  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    try {
      const analysisResult = await aiService.analyzeSymptoms({
        symptoms: symptoms.map(s => ({
          name: s.name,
          severity: s.severity,
          duration: s.duration,
          description: s.description
        })),
        patientInfo: {
          age: patientInfo.age,
          gender: patientInfo.gender,
          location: patientInfo.location,
          medicalHistory: patientInfo.medicalHistory,
          currentMedications: patientInfo.currentMedications,
          allergies: patientInfo.allergies
        },
        culturalContext: {
          language: 'en',
          region: patientInfo.location || 'global',
          culturalBackground: userProfile?.cultural_background || 'general'
        }
      });
      
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
      setCurrentStep('symptoms');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'moderate':
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'severe':
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'emergency':
        return 'text-red-700 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-900/20';
    }
  };

  // Get risk level icon
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-red-700" />;
      default:
        return <Info className="h-5 w-5 text-neutral-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                AI Symptom Checker
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Get AI-powered health insights with cultural considerations
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'symptoms' ? 'text-purple-600' : 
              currentStep === 'details' || currentStep === 'analysis' ? 'text-green-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'symptoms' ? 'bg-purple-600 text-white' :
                currentStep === 'details' || currentStep === 'analysis' ? 'bg-green-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                1
              </div>
              <span className="font-medium">Symptoms</span>
            </div>
            
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'details' ? 'text-purple-600' : 
              currentStep === 'analysis' ? 'text-green-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'details' ? 'bg-purple-600 text-white' :
                currentStep === 'analysis' ? 'bg-green-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                2
              </div>
              <span className="font-medium">Details</span>
            </div>
            
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'analysis' ? 'text-purple-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'analysis' ? 'bg-purple-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                3
              </div>
              <span className="font-medium">Analysis</span>
            </div>
          </div>
        </div>

        {/* Step 1: Symptoms */}
        {currentStep === 'symptoms' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Add Your Symptoms
                </CardTitle>
                <CardDescription>
                  Describe what you're experiencing. Be as specific as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Custom Symptom */}
                <div className="space-y-2">
                  <Label htmlFor="symptom">Describe your symptom</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="symptom"
                      placeholder="e.g., Sharp pain in lower back"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newSymptom.trim()) {
                          addSymptom(newSymptom.trim());
                        }
                      }}
                    />
                    <Button
                      onClick={() => newSymptom.trim() && addSymptom(newSymptom.trim())}
                      disabled={!newSymptom.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Search Common Symptoms */}
                <div className="space-y-2">
                  <Label htmlFor="search">Or search common symptoms</Label>
                  <Input
                    id="search"
                    placeholder="Search symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Common Symptoms */}
                {searchQuery && (
                  <div className="space-y-2">
                    <Label>Matching symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {filteredSymptoms.slice(0, 10).map((symptom) => (
                        <Button
                          key={symptom}
                          variant="outline"
                          size="sm"
                          onClick={() => addSymptom(symptom)}
                          className="text-sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery && (
                  <div className="space-y-2">
                    <Label>Common symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonSymptoms.slice(0, 12).map((symptom) => (
                        <Button
                          key={symptom}
                          variant="outline"
                          size="sm"
                          onClick={() => addSymptom(symptom)}
                          className="text-sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Added Symptoms */}
            {symptoms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Symptoms ({symptoms.length})</CardTitle>
                  <CardDescription>
                    Review and adjust the severity and duration of your symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {symptoms.map((symptom) => (
                      <div key={symptom.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                            {symptom.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSymptom(symptom.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Severity</Label>
                            <div className="flex space-x-2">
                              {(['mild', 'moderate', 'severe'] as const).map((level) => (
                                <Button
                                  key={level}
                                  variant={symptom.severity === level ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => updateSymptom(symptom.id, { severity: level })}
                                  className={`capitalize ${getSeverityColor(level)}`}
                                >
                                  {level}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <select
                              className="w-full p-2 border rounded-md bg-background"
                              value={symptom.duration}
                              onChange={(e) => updateSymptom(symptom.id, { duration: e.target.value })}
                            >
                              <option value="Less than 1 day">Less than 1 day</option>
                              <option value="1-2 days">1-2 days</option>
                              <option value="3-7 days">3-7 days</option>
                              <option value="1-2 weeks">1-2 weeks</option>
                              <option value="2-4 weeks">2-4 weeks</option>
                              <option value="More than 1 month">More than 1 month</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Additional details (optional)</Label>
                          <Textarea
                            placeholder="Describe when it occurs, what makes it better/worse, etc."
                            value={symptom.description || ''}
                            onChange={(e) => updateSymptom(symptom.id, { description: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep('details')}
                disabled={symptoms.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue to Details
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Patient Details */}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  This information helps provide more accurate analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="w-full p-2 border rounded-md bg-background"
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (for cultural context)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., United States, India, Saudi Arabia"
                    value={patientInfo.location}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical-history">Medical History (optional)</Label>
                  <Textarea
                    id="medical-history"
                    placeholder="Any chronic conditions, past surgeries, etc."
                    value={patientInfo.medicalHistory.join(', ')}
                    onChange={(e) => setPatientInfo(prev => ({ 
                      ...prev, 
                      medicalHistory: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications (optional)</Label>
                  <Textarea
                    id="medications"
                    placeholder="List any medications you're currently taking"
                    value={patientInfo.currentMedications.join(', ')}
                    onChange={(e) => setPatientInfo(prev => ({ 
                      ...prev, 
                      currentMedications: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (optional)</Label>
                  <Textarea
                    id="allergies"
                    placeholder="Any known allergies to medications, foods, etc."
                    value={patientInfo.allergies.join(', ')}
                    onChange={(e) => setPatientInfo(prev => ({ 
                      ...prev, 
                      allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('symptoms')}
              >
                Back to Symptoms
              </Button>
              <Button
                onClick={analyzeSymptoms}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Analyze Symptoms
                <Brain className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Analysis */}
        {currentStep === 'analysis' && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Analyzing Your Symptoms
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Our AI is processing your symptoms with cultural considerations...
                  </p>
                  <Progress value={75} className="w-64 mt-4" />
                </CardContent>
              </Card>
            ) : analysis ? (
              <>
                {/* Risk Level Alert */}
                <Alert className={`border-l-4 ${
                  analysis.riskLevel === 'emergency' ? 'border-red-600 bg-red-50 dark:bg-red-900/20' :
                  analysis.riskLevel === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  analysis.riskLevel === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="flex items-center">
                    {getRiskIcon(analysis.riskLevel)}
                    <AlertDescription className="ml-2">
                      <strong>Risk Level: {analysis.riskLevel.toUpperCase()}</strong>
                      {analysis.riskLevel === 'emergency' && ' - Seek immediate medical attention!'}
                      {analysis.riskLevel === 'high' && ' - Consider seeing a healthcare provider soon.'}
                      {analysis.riskLevel === 'medium' && ' - Monitor symptoms and consider medical consultation.'}
                      {analysis.riskLevel === 'low' && ' - Symptoms appear manageable with self-care.'}
                    </AlertDescription>
                  </div>
                </Alert>

                {/* Possible Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Possible Conditions</CardTitle>
                    <CardDescription>
                      Based on your symptoms, here are potential conditions to consider
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.possibleConditions.map((condition, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {condition.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getSeverityColor(condition.severity)}>
                                {condition.probability}% match
                              </Badge>
                              <Badge variant="outline" className={getSeverityColor(condition.severity)}>
                                {condition.severity} risk
                              </Badge>
                            </div>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                            {condition.description}
                          </p>
                          {condition.culturalConsiderations && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                              <p className="text-blue-800 dark:text-blue-200 text-sm">
                                <strong>Cultural Note:</strong> {condition.culturalConsiderations}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>
                      Personalized advice based on your symptoms and cultural context
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              rec.type === 'immediate' ? 'bg-red-100 dark:bg-red-900/20' :
                              rec.type === 'urgent' ? 'bg-orange-100 dark:bg-orange-900/20' :
                              rec.type === 'routine' ? 'bg-blue-100 dark:bg-blue-900/20' :
                              'bg-green-100 dark:bg-green-900/20'
                            }`}>
                              {rec.type === 'immediate' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                              {rec.type === 'urgent' && <Clock className="h-4 w-4 text-orange-600" />}
                              {rec.type === 'routine' && <Calendar className="h-4 w-4 text-blue-600" />}
                              {rec.type === 'lifestyle' && <Activity className="h-4 w-4 text-green-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="capitalize">
                                  {rec.type}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                                {rec.action}
                              </h3>
                              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                                {rec.reason}
                              </p>
                              {rec.culturalNote && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
                                  <p className="text-purple-800 dark:text-purple-200 text-xs">
                                    <strong>Cultural Note:</strong> {rec.culturalNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cultural Context */}
                {analysis.culturalContext && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Cultural Context
                      </CardTitle>
                      <CardDescription>
                        Considerations specific to your region and background
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                          Regional Considerations
                        </h3>
                        <ul className="space-y-1">
                          {analysis.culturalContext.considerations.map((consideration, index) => (
                            <li key={index} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {analysis.culturalContext.localResources.length > 0 && (
                        <div>
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            Local Resources
                          </h3>
                          <ul className="space-y-1">
                            {analysis.culturalContext.localResources.map((resource, index) => (
                              <li key={index} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Disclaimer */}
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Medical Disclaimer:</strong> {analysis.disclaimer}
                  </AlertDescription>
                </Alert>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setCurrentStep('symptoms');
                      setAnalysis(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Start New Analysis
                  </Button>
                  <Button
                    onClick={() => {
                      // Save analysis logic here
                      toast.success('Analysis saved to your health records');
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save to Health Records
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
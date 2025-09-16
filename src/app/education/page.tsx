'use client';

// Medical Education Hub - Comprehensive health resources and learning materials
// Culturally sensitive health education with multi-language support

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Search,
  Filter,
  Heart,
  Brain,
  Activity,
  Apple,
  Shield,
  Baby,
  Users,
  Stethoscope,
  Pill,
  Eye,
  Ear,
  Bone,
  Zap,
  Droplets,
  Wind,
  Sun,
  Moon,
  Star,
  Clock,
  Calendar,
  User,
  Globe,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Download,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Award,
  Target,
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Video,
  FileText,
  Headphones,
  Image as ImageIcon,
  Quiz,
  GraduationCap,
  Certificate,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory?: string;
  type: 'article' | 'video' | 'audio' | 'interactive' | 'quiz';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  author: string;
  authorCredentials?: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  language: string;
  culturalContext?: string[];
  medicallyReviewed: boolean;
  reviewedBy?: string;
  sources: string[];
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  rating: number;
  views: number;
  bookmarked?: boolean;
  completed?: boolean;
  progress?: number;
}

interface EducationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  subcategories: string[];
}

interface UserProgress {
  contentId: string;
  progress: number;
  completed: boolean;
  timeSpent: number;
  lastAccessed: Date;
  bookmarked: boolean;
  rating?: number;
  notes?: string;
}

const educationCategories: EducationCategory[] = [
  {
    id: 'cardiovascular',
    name: 'Heart Health',
    description: 'Learn about cardiovascular health, prevention, and management',
    icon: Heart,
    color: 'bg-red-500',
    subcategories: ['Prevention', 'Conditions', 'Lifestyle', 'Medications']
  },
  {
    id: 'mental-health',
    name: 'Mental Wellness',
    description: 'Mental health awareness, stress management, and emotional wellbeing',
    icon: Brain,
    color: 'bg-purple-500',
    subcategories: ['Stress Management', 'Depression', 'Anxiety', 'Sleep Health']
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    description: 'Healthy eating, dietary guidelines, and nutritional science',
    icon: Apple,
    color: 'bg-green-500',
    subcategories: ['Balanced Diet', 'Weight Management', 'Special Diets', 'Supplements']
  },
  {
    id: 'fitness',
    name: 'Physical Fitness',
    description: 'Exercise science, workout routines, and physical activity',
    icon: Activity,
    color: 'bg-blue-500',
    subcategories: ['Cardio', 'Strength Training', 'Flexibility', 'Sports Medicine']
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    description: 'Disease prevention, screenings, and health maintenance',
    icon: Shield,
    color: 'bg-teal-500',
    subcategories: ['Screenings', 'Vaccinations', 'Health Checks', 'Risk Factors']
  },
  {
    id: 'womens-health',
    name: 'Women\'s Health',
    description: 'Health topics specific to women across all life stages',
    icon: Baby,
    color: 'bg-pink-500',
    subcategories: ['Reproductive Health', 'Pregnancy', 'Menopause', 'Breast Health']
  },
  {
    id: 'chronic-conditions',
    name: 'Chronic Conditions',
    description: 'Managing diabetes, hypertension, and other chronic diseases',
    icon: Stethoscope,
    color: 'bg-orange-500',
    subcategories: ['Diabetes', 'Hypertension', 'Arthritis', 'Asthma']
  },
  {
    id: 'medications',
    name: 'Medications',
    description: 'Drug information, interactions, and safe medication use',
    icon: Pill,
    color: 'bg-indigo-500',
    subcategories: ['Drug Safety', 'Interactions', 'Side Effects', 'Adherence']
  }
];

const sampleContent: EducationContent[] = [
  {
    id: '1',
    title: 'Understanding Heart Disease: A Comprehensive Guide',
    description: 'Learn about the different types of heart disease, risk factors, and prevention strategies.',
    content: 'Heart disease remains the leading cause of death globally...',
    category: 'cardiovascular',
    subcategory: 'Conditions',
    type: 'article',
    difficulty: 'beginner',
    duration: 15,
    author: 'Dr. Sarah Johnson',
    authorCredentials: 'MD, Cardiologist',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['heart disease', 'prevention', 'cardiovascular health'],
    language: 'en',
    culturalContext: ['western', 'general'],
    medicallyReviewed: true,
    reviewedBy: 'Dr. Michael Chen, MD',
    sources: ['American Heart Association', 'Mayo Clinic'],
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20illustration%20of%20healthy%20heart%20anatomy%20educational%20diagram&image_size=landscape_4_3',
    rating: 4.8,
    views: 15420,
    bookmarked: false,
    completed: false,
    progress: 0
  },
  {
    id: '2',
    title: 'Stress Management Techniques for Better Mental Health',
    description: 'Discover evidence-based strategies to manage stress and improve your mental wellbeing.',
    content: 'Stress is a natural response to challenging situations...',
    category: 'mental-health',
    subcategory: 'Stress Management',
    type: 'video',
    difficulty: 'beginner',
    duration: 20,
    author: 'Dr. Lisa Rodriguez',
    authorCredentials: 'PhD, Clinical Psychologist',
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['stress management', 'mental health', 'relaxation'],
    language: 'en',
    culturalContext: ['multicultural', 'mindfulness'],
    medicallyReviewed: true,
    reviewedBy: 'Dr. James Wilson, PhD',
    sources: ['American Psychological Association', 'National Institute of Mental Health'],
    videoUrl: 'https://example.com/stress-management-video',
    rating: 4.9,
    views: 23150,
    bookmarked: true,
    completed: false,
    progress: 45
  },
  {
    id: '3',
    title: 'Halal Nutrition: Balancing Faith and Health',
    description: 'A guide to maintaining optimal nutrition while following Islamic dietary guidelines.',
    content: 'Islamic dietary laws provide a framework for healthy eating...',
    category: 'nutrition',
    subcategory: 'Special Diets',
    type: 'article',
    difficulty: 'intermediate',
    duration: 12,
    author: 'Dr. Amina Hassan',
    authorCredentials: 'MD, Nutritionist',
    publishedAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    tags: ['halal nutrition', 'islamic diet', 'cultural health'],
    language: 'en',
    culturalContext: ['islamic', 'middle-eastern'],
    medicallyReviewed: true,
    reviewedBy: 'Dr. Omar Al-Rashid, MD',
    sources: ['Islamic Society of North America', 'Halal Food Authority'],
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=halal%20healthy%20food%20ingredients%20islamic%20nutrition%20guide&image_size=landscape_4_3',
    rating: 4.7,
    views: 8930,
    bookmarked: false,
    completed: true,
    progress: 100
  },
  {
    id: '4',
    title: 'Exercise During Pregnancy: Safe Workouts for Expecting Mothers',
    description: 'Learn about safe exercise routines and precautions during pregnancy.',
    content: 'Regular exercise during pregnancy offers numerous benefits...',
    category: 'womens-health',
    subcategory: 'Pregnancy',
    type: 'interactive',
    difficulty: 'intermediate',
    duration: 25,
    author: 'Dr. Maria Santos',
    authorCredentials: 'MD, OB-GYN',
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tags: ['pregnancy', 'exercise', 'prenatal care'],
    language: 'en',
    culturalContext: ['general', 'prenatal'],
    medicallyReviewed: true,
    reviewedBy: 'Dr. Jennifer Lee, MD',
    sources: ['American College of Obstetricians and Gynecologists'],
    rating: 4.6,
    views: 12340,
    bookmarked: true,
    completed: false,
    progress: 20
  },
  {
    id: '5',
    title: 'Managing Type 2 Diabetes: Lifestyle and Medication',
    description: 'Comprehensive guide to managing type 2 diabetes through lifestyle changes and medication.',
    content: 'Type 2 diabetes affects millions worldwide...',
    category: 'chronic-conditions',
    subcategory: 'Diabetes',
    type: 'article',
    difficulty: 'advanced',
    duration: 30,
    author: 'Dr. Robert Kim',
    authorCredentials: 'MD, Endocrinologist',
    publishedAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    tags: ['diabetes', 'blood sugar', 'chronic disease'],
    language: 'en',
    culturalContext: ['general'],
    medicallyReviewed: true,
    reviewedBy: 'Dr. Susan Park, MD',
    sources: ['American Diabetes Association', 'CDC'],
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=diabetes%20management%20blood%20glucose%20monitoring%20medical%20illustration&image_size=landscape_4_3',
    rating: 4.9,
    views: 18750,
    bookmarked: false,
    completed: false,
    progress: 0
  }
];

export default function EducationPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState<EducationContent[]>(sampleContent);
  const [filteredContent, setFilteredContent] = useState<EducationContent[]>(sampleContent);
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('newest');

  // Load content and user progress
  useEffect(() => {
    loadContent();
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  // Filter content based on selections
  useEffect(() => {
    filterContent();
  }, [selectedCategory, selectedSubcategory, selectedType, selectedDifficulty, searchQuery, showBookmarked, sortBy, content]);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('education_content')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedContent: EducationContent[] = data.map(item => ({
          ...item,
          publishedAt: new Date(item.published_at),
          updatedAt: new Date(item.updated_at)
        }));
        setContent(formattedContent);
      } else {
        // Use sample data for demo
        setContent(sampleContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(sampleContent);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_education_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(item => {
        progressMap[item.content_id] = {
          contentId: item.content_id,
          progress: item.progress,
          completed: item.completed,
          timeSpent: item.time_spent,
          lastAccessed: new Date(item.last_accessed),
          bookmarked: item.bookmarked,
          rating: item.rating,
          notes: item.notes
        };
      });
      
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const filterContent = () => {
    let filtered = [...content];
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
    }
    
    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.author.toLowerCase().includes(query)
      );
    }
    
    // Bookmarked filter
    if (showBookmarked) {
      filtered = filtered.filter(item => userProgress[item.id]?.bookmarked);
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    setFilteredContent(filtered);
  };

  const toggleBookmark = async (contentId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark content');
      return;
    }
    
    const currentBookmarked = userProgress[contentId]?.bookmarked || false;
    const newBookmarked = !currentBookmarked;
    
    // Update local state immediately
    setUserProgress(prev => ({
      ...prev,
      [contentId]: {
        ...prev[contentId],
        contentId,
        bookmarked: newBookmarked,
        progress: prev[contentId]?.progress || 0,
        completed: prev[contentId]?.completed || false,
        timeSpent: prev[contentId]?.timeSpent || 0,
        lastAccessed: new Date()
      }
    }));
    
    try {
      const { error } = await supabase
        .from('user_education_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          bookmarked: newBookmarked,
          progress: userProgress[contentId]?.progress || 0,
          completed: userProgress[contentId]?.completed || false,
          time_spent: userProgress[contentId]?.timeSpent || 0,
          last_accessed: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(newBookmarked ? 'Content bookmarked' : 'Bookmark removed');
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const updateProgress = async (contentId: string, progress: number) => {
    if (!user) return;
    
    const completed = progress >= 100;
    
    setUserProgress(prev => ({
      ...prev,
      [contentId]: {
        ...prev[contentId],
        contentId,
        progress,
        completed,
        lastAccessed: new Date(),
        bookmarked: prev[contentId]?.bookmarked || false,
        timeSpent: (prev[contentId]?.timeSpent || 0) + 1
      }
    }));
    
    try {
      const { error } = await supabase
        .from('user_education_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          progress,
          completed,
          last_accessed: new Date().toISOString(),
          time_spent: (userProgress[contentId]?.timeSpent || 0) + 1,
          bookmarked: userProgress[contentId]?.bookmarked || false
        });
      
      if (error) throw error;
      
      if (completed) {
        toast.success('Content completed! 🎉');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'interactive': return Target;
      case 'quiz': return GraduationCap;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-400';
    }
  };

  const selectedCategoryData = educationCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  Medical Education Hub
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Evidence-based health education and resources
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={showBookmarked ? 'default' : 'outline'}
                onClick={() => setShowBookmarked(!showBookmarked)}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarked
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search health topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {educationCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Health Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('all')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  All Topics
                </Button>
                
                {educationCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
            
            {/* User Progress Summary */}
            {user && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(userProgress).filter(p => p.completed).length}
                    </div>
                    <div className="text-sm text-neutral-500">Completed</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(userProgress).filter(p => p.bookmarked).length}
                    </div>
                    <div className="text-sm text-neutral-500">Bookmarked</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(Object.values(userProgress).reduce((sum, p) => sum + p.timeSpent, 0) / 60)}
                    </div>
                    <div className="text-sm text-neutral-500">Hours Learned</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Content Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-neutral-500">Loading content...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No content found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContent.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  const progress = userProgress[item.id];
                  
                  return (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div onClick={() => setSelectedContent(item)}>
                        {item.imageUrl && (
                          <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-t-lg overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <TypeIcon className="h-4 w-4 text-neutral-500" />
                                <Badge className={getDifficultyColor(item.difficulty)}>
                                  {item.difficulty}
                                </Badge>
                                <Badge variant="outline">
                                  {item.duration} min
                                </Badge>
                                {item.medicallyReviewed && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <CardTitle className="text-lg leading-tight">
                                {item.title}
                              </CardTitle>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(item.id);
                              }}
                            >
                              <Bookmark 
                                className={`h-4 w-4 ${
                                  progress?.bookmarked 
                                    ? 'fill-current text-blue-600' 
                                    : 'text-neutral-400'
                                }`} 
                              />
                            </Button>
                          </div>
                          
                          <CardDescription className="line-clamp-2">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-3">
                            {progress && progress.progress > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{Math.round(progress.progress)}%</span>
                                </div>
                                <Progress value={progress.progress} className="h-2" />
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-neutral-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                                  {item.rating}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {item.views.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-xs">
                                {item.publishedAt.toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="text-xs text-neutral-400">
                              By {item.author}
                              {item.authorCredentials && `, ${item.authorCredentials}`}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Content Detail Dialog */}
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedContent && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl leading-tight mb-2">
                        {selectedContent.title}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        {selectedContent.description}
                      </DialogDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleBookmark(selectedContent.id)}
                    >
                      <Bookmark 
                        className={`h-5 w-5 ${
                          userProgress[selectedContent.id]?.bookmarked 
                            ? 'fill-current text-blue-600' 
                            : 'text-neutral-400'
                        }`} 
                      />
                    </Button>
                  </div>
                </DialogHeader>
                
                {selectedContent.imageUrl && (
                  <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                    <img
                      src={selectedContent.imageUrl}
                      alt={selectedContent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(selectedContent.difficulty)}>
                    {selectedContent.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {selectedContent.duration} minutes
                  </Badge>
                  <Badge variant="outline">
                    {selectedContent.type}
                  </Badge>
                  {selectedContent.medicallyReviewed && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Medically Reviewed
                    </Badge>
                  )}
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p>{selectedContent.content}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Author Information</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedContent.author}
                      {selectedContent.authorCredentials && (
                        <span className="block">{selectedContent.authorCredentials}</span>
                      )}
                    </p>
                    {selectedContent.reviewedBy && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Reviewed by: {selectedContent.reviewedBy}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Sources</h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      {selectedContent.sources.map((source, index) => (
                        <li key={index} className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                      {selectedContent.rating} rating
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedContent.views.toLocaleString()} views
                    </div>
                    <div>
                      Published {selectedContent.publishedAt.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateProgress(selectedContent.id, 100)}
                      disabled={userProgress[selectedContent.id]?.completed}
                    >
                      {userProgress[selectedContent.id]?.completed ? (
                        <><CheckCircle className="h-4 w-4 mr-2" />Completed</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" />Start Learning</>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
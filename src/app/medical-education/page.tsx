'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Heart, 
  Brain, 
  Stethoscope, 
  Activity, 
  Shield, 
  Baby, 
  Users, 
  Clock, 
  Star, 
  Play, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Download,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  Globe,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  subcategory: string;
  author: string;
  publishDate: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  views: number;
  isFavorited: boolean;
  language: string;
  medicallyReviewed: boolean;
  lastUpdated: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  instructor: string;
  rating: number;
  views: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isFavorited: boolean;
  language: string;
}

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  date: string;
}

export default function MedicalEducationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock data for articles
  const [articles] = useState<Article[]>([
    {
      id: '1',
      title: 'Understanding Heart Disease: Prevention and Management',
      summary: 'Comprehensive guide to cardiovascular health, risk factors, and prevention strategies.',
      content: 'Heart disease remains one of the leading causes of death worldwide. This comprehensive guide covers the various types of heart disease, including coronary artery disease, heart failure, and arrhythmias. We explore risk factors such as high blood pressure, high cholesterol, diabetes, smoking, and sedentary lifestyle. Prevention strategies include regular exercise, healthy diet, stress management, and regular medical checkups. Early detection through screening tests like ECG, echocardiogram, and stress tests can significantly improve outcomes.',
      category: 'cardiology',
      subcategory: 'prevention',
      author: 'Dr. Sarah Johnson, MD',
      publishDate: '2024-01-15',
      readTime: 8,
      difficulty: 'intermediate',
      tags: ['heart', 'prevention', 'cardiovascular', 'lifestyle'],
      rating: 4.8,
      views: 15420,
      isFavorited: false,
      language: 'en',
      medicallyReviewed: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mental Health Awareness: Breaking the Stigma',
      summary: 'Understanding mental health conditions and promoting awareness in diverse communities.',
      content: 'Mental health is as important as physical health, yet stigma often prevents people from seeking help. This article explores common mental health conditions including depression, anxiety, PTSD, and bipolar disorder. We discuss cultural perspectives on mental health, particularly in Middle Eastern and South Asian communities where mental health stigma can be particularly strong. The importance of family support, community resources, and professional help is emphasized. We also cover when to seek help and how to support loved ones struggling with mental health issues.',
      category: 'mental-health',
      subcategory: 'awareness',
      author: 'Dr. Ahmed Hassan, Psychiatrist',
      publishDate: '2024-01-10',
      readTime: 12,
      difficulty: 'beginner',
      tags: ['mental-health', 'stigma', 'awareness', 'cultural-sensitivity'],
      rating: 4.9,
      views: 22100,
      isFavorited: false,
      language: 'en',
      medicallyReviewed: true,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Diabetes Management: A Complete Guide',
      summary: 'Essential information for managing Type 1 and Type 2 diabetes effectively.',
      content: 'Diabetes affects millions worldwide and requires careful management to prevent complications. This guide covers both Type 1 and Type 2 diabetes, explaining the differences in causes, symptoms, and treatment approaches. We discuss blood sugar monitoring, medication management, insulin therapy, and the importance of diet and exercise. Special attention is given to cultural dietary considerations, including how to manage diabetes while maintaining traditional eating patterns. Complications such as diabetic retinopathy, neuropathy, and cardiovascular disease are explained, along with prevention strategies.',
      category: 'endocrinology',
      subcategory: 'management',
      author: 'Dr. Maria Rodriguez, Endocrinologist',
      publishDate: '2024-01-08',
      readTime: 15,
      difficulty: 'intermediate',
      tags: ['diabetes', 'blood-sugar', 'management', 'diet'],
      rating: 4.7,
      views: 18750,
      isFavorited: false,
      language: 'en',
      medicallyReviewed: true,
      lastUpdated: '2024-01-08'
    },
    {
      id: '4',
      title: 'Pregnancy Health: What Every Expecting Mother Should Know',
      summary: 'Essential prenatal care information for a healthy pregnancy journey.',
      content: 'Pregnancy is a transformative time requiring special attention to health and nutrition. This comprehensive guide covers prenatal vitamins, proper nutrition during pregnancy, safe exercises, and warning signs to watch for. We discuss the importance of regular prenatal checkups, screening tests, and vaccinations. Cultural practices around pregnancy and childbirth are acknowledged, with guidance on how to balance traditional practices with modern medical care. Topics include managing morning sickness, preparing for labor and delivery, and postpartum care.',
      category: 'obstetrics',
      subcategory: 'prenatal-care',
      author: 'Dr. Fatima Al-Zahra, OB-GYN',
      publishDate: '2024-01-05',
      readTime: 10,
      difficulty: 'beginner',
      tags: ['pregnancy', 'prenatal', 'nutrition', 'maternal-health'],
      rating: 4.9,
      views: 31200,
      isFavorited: false,
      language: 'en',
      medicallyReviewed: true,
      lastUpdated: '2024-01-05'
    },
    {
      id: '5',
      title: 'Nutrition Fundamentals: Building a Healthy Diet',
      summary: 'Science-based nutrition guidance for optimal health and disease prevention.',
      content: 'Proper nutrition is the foundation of good health. This article explains macronutrients (proteins, carbohydrates, fats) and micronutrients (vitamins and minerals) and their roles in the body. We explore different dietary patterns including Mediterranean, DASH, and plant-based diets, with special consideration for cultural dietary preferences and restrictions. Topics include reading nutrition labels, meal planning, portion control, and addressing common nutritional deficiencies. The article also covers nutrition for different life stages and special conditions.',
      category: 'nutrition',
      subcategory: 'fundamentals',
      author: 'Dr. Jennifer Chen, Nutritionist',
      publishDate: '2024-01-03',
      readTime: 11,
      difficulty: 'beginner',
      tags: ['nutrition', 'diet', 'healthy-eating', 'meal-planning'],
      rating: 4.6,
      views: 25800,
      isFavorited: false,
      language: 'en',
      medicallyReviewed: true,
      lastUpdated: '2024-01-03'
    }
  ]);

  // Mock data for videos
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'How to Check Your Blood Pressure at Home',
      description: 'Step-by-step guide to accurately measuring blood pressure using a home monitor.',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20professional%20demonstrating%20blood%20pressure%20measurement%20with%20digital%20monitor%20in%20clean%20medical%20setting&image_size=landscape_4_3',
      duration: '5:32',
      category: 'cardiology',
      instructor: 'Dr. Michael Thompson',
      rating: 4.8,
      views: 45200,
      difficulty: 'beginner',
      tags: ['blood-pressure', 'monitoring', 'home-care'],
      isFavorited: false,
      language: 'en'
    },
    {
      id: '2',
      title: 'Stress Management Techniques for Better Mental Health',
      description: 'Learn evidence-based stress reduction techniques including breathing exercises and mindfulness.',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20meditation%20scene%20with%20person%20practicing%20mindfulness%20in%20serene%20natural%20environment&image_size=landscape_4_3',
      duration: '12:45',
      category: 'mental-health',
      instructor: 'Dr. Lisa Park',
      rating: 4.9,
      views: 67800,
      difficulty: 'beginner',
      tags: ['stress', 'mindfulness', 'mental-health', 'relaxation'],
      isFavorited: false,
      language: 'en'
    },
    {
      id: '3',
      title: 'Understanding Insulin Injection Techniques',
      description: 'Proper insulin injection methods for diabetes management.',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=diabetes%20care%20insulin%20pen%20injection%20demonstration%20medical%20education%20clean%20background&image_size=landscape_4_3',
      duration: '8:15',
      category: 'endocrinology',
      instructor: 'Dr. Robert Kim',
      rating: 4.7,
      views: 23400,
      difficulty: 'intermediate',
      tags: ['diabetes', 'insulin', 'injection', 'self-care'],
      isFavorited: false,
      language: 'en'
    }
  ]);

  // Mock data for health tips
  const [healthTips] = useState<HealthTip[]>([
    {
      id: '1',
      title: 'Stay Hydrated Throughout the Day',
      content: 'Drink at least 8 glasses of water daily. Proper hydration supports kidney function, maintains body temperature, and helps transport nutrients.',
      category: 'general',
      priority: 'medium',
      source: 'WHO Guidelines',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Get 7-9 Hours of Quality Sleep',
      content: 'Adequate sleep is crucial for immune function, mental health, and physical recovery. Maintain a consistent sleep schedule and create a relaxing bedtime routine.',
      category: 'lifestyle',
      priority: 'high',
      source: 'Sleep Foundation',
      date: '2024-01-14'
    },
    {
      id: '3',
      title: 'Practice Regular Hand Hygiene',
      content: 'Wash hands with soap for at least 20 seconds, especially before eating and after using the restroom. This simple practice prevents many infectious diseases.',
      category: 'prevention',
      priority: 'high',
      source: 'CDC Guidelines',
      date: '2024-01-13'
    },
    {
      id: '4',
      title: 'Include Omega-3 Rich Foods in Your Diet',
      content: 'Fish, walnuts, and flaxseeds provide omega-3 fatty acids that support heart and brain health. Aim for 2-3 servings of fatty fish per week.',
      category: 'nutrition',
      priority: 'medium',
      source: 'American Heart Association',
      date: '2024-01-12'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cardiology', label: 'Heart Health', icon: Heart },
    { value: 'mental-health', label: 'Mental Health', icon: Brain },
    { value: 'endocrinology', label: 'Diabetes & Hormones', icon: Activity },
    { value: 'obstetrics', label: 'Women\'s Health', icon: Baby },
    { value: 'nutrition', label: 'Nutrition', icon: Users },
    { value: 'prevention', label: 'Prevention', icon: Shield }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ar', label: 'العربية' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
    { value: 'hi', label: 'हिन्दी' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/medical-education');
    }
  }, [user, loading, router]);

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;
    const matchesLanguage = article.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
  });

  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    const matchesLanguage = video.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
  });

  // Toggle favorite
  const toggleFavorite = (id: string, type: 'article' | 'video') => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fav => fav !== id));
      toast.success('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, id]);
      toast.success('Added to favorites');
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color for health tips
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                Medical Education Hub
              </h1>
              <p className="text-gray-600 mt-1">
                Evidence-based health information and educational resources
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles, videos, and health topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center">
                        {category.icon && <category.icon className="h-4 w-4 mr-2" />}
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Health Tips
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center">
              <Bookmark className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {selectedArticle ? (
              // Article Detail View
              <div className="space-y-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedArticle(null)}
                  className="mb-4"
                >
                  ← Back to Articles
                </Button>
                
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{selectedArticle.title}</CardTitle>
                        <CardDescription className="text-base">{selectedArticle.summary}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(selectedArticle.id, 'article')}
                        className={favorites.includes(selectedArticle.id) ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {selectedArticle.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(selectedArticle.publishDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedArticle.readTime} min read
                      </div>
                      <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                        {selectedArticle.difficulty}
                      </Badge>
                      {selectedArticle.medicallyReviewed && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Medically Reviewed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedArticle.content}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{selectedArticle.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedArticle.views.toLocaleString()} views
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Articles List View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(article.id, 'article');
                          }}
                          className={favorites.includes(article.id) ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      
                      <CardDescription className="line-clamp-3">
                        {article.summary}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime} min
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {article.rating}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          By {article.author.split(',')[0]}
                        </div>
                        {article.medicallyReviewed && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                            <CheckCircle className="h-2 w-2 mr-1" />
                            Reviewed
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => setSelectedArticle(article)}
                      >
                        Read Article
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="lg" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getDifficultyColor(video.difficulty)}>
                        {video.difficulty}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(video.id, 'video')}
                        className={favorites.includes(video.id) ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight">
                      {video.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {video.instructor}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {video.rating}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </TabsContent>

          {/* Health Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthTips.map((tip) => (
                <Card key={tip.id} className={`border-l-4 ${getPriorityColor(tip.priority)} bg-white/80 backdrop-blur-sm shadow-lg`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                      <Badge 
                        className={
                          tip.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                          tip.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }
                      >
                        {tip.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{tip.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        {tip.source}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(tip.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600">Start adding articles and videos to your favorites to see them here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Your Favorite Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* This would show favorited articles and videos */}
                  <div className="text-center py-8 text-gray-600">
                    Favorite content will appear here
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
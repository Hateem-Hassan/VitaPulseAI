'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Flag, 
  MoreVertical,
  Search,
  Filter,
  Plus,
  Users,
  TrendingUp,
  Award,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Bookmark,
  Star,
  Zap,
  Target,
  Calendar,
  MapPin,
  Camera,
  FileText,
  Link,
  Smile,
  Image as ImageIcon,
  Video,
  Mic,
  Send,
  Edit,
  Trash2,
  Shield,
  Crown,
  Flame,
  Trophy,
  Medal,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  badges: string[];
  joinDate: string;
  posts: number;
  reputation: number;
  isVerified: boolean;
  isModerator: boolean;
  isAdmin: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  attachments?: Array<{
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
  }>;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  isSolution: boolean;
  replies: Comment[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  points: number;
  participants: number;
  endDate: string;
  requirements: string[];
  rewards: string[];
  isActive: boolean;
  createdBy: User;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    level: 15,
    badges: ['Early Adopter', 'Health Champion', 'Community Helper'],
    joinDate: '2023-01-15',
    posts: 156,
    reputation: 2840,
    isVerified: true,
    isModerator: false,
    isAdmin: false
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    avatar: '/avatars/michael.jpg',
    level: 25,
    badges: ['Medical Expert', 'Top Contributor', 'Verified Professional'],
    joinDate: '2022-11-20',
    posts: 342,
    reputation: 5670,
    isVerified: true,
    isModerator: true,
    isAdmin: false
  },
  {
    id: '3',
    name: 'Alex Rodriguez',
    avatar: '/avatars/alex.jpg',
    level: 8,
    badges: ['Fitness Enthusiast', 'Motivator'],
    joinDate: '2024-02-10',
    posts: 23,
    reputation: 450,
    isVerified: false,
    isModerator: false,
    isAdmin: false
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'My 30-day weight loss journey - 15lbs down!',
    content: 'I started my weight loss journey exactly 30 days ago and I\'m thrilled to share that I\'ve lost 15 pounds! Here\'s what worked for me...',
    author: MOCK_USERS[0],
    category: 'Success Stories',
    tags: ['weight-loss', 'motivation', 'journey', '30-days'],
    likes: 47,
    dislikes: 2,
    comments: 23,
    views: 156,
    isPinned: true,
    isLocked: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-20T14:22:00Z',
    attachments: [
      { type: 'image', url: '/images/before-after.jpg', name: 'Before and After Photo' }
    ]
  },
  {
    id: '2',
    title: 'Best protein sources for vegetarians?',
    content: 'I\'m trying to increase my protein intake but I\'m vegetarian. What are the best plant-based protein sources that you\'ve found effective?',
    author: MOCK_USERS[2],
    category: 'Nutrition',
    tags: ['protein', 'vegetarian', 'nutrition', 'advice'],
    likes: 12,
    dislikes: 0,
    comments: 8,
    views: 89,
    isPinned: false,
    isLocked: false,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    lastActivity: '2024-01-19T09:15:00Z'
  },
  {
    id: '3',
    title: 'Understanding BMI vs Body Fat Percentage',
    content: 'Many people focus only on BMI, but body fat percentage gives a much more accurate picture of health. Let me explain the differences...',
    author: MOCK_USERS[1],
    category: 'Education',
    tags: ['BMI', 'body-fat', 'health', 'education'],
    likes: 34,
    dislikes: 1,
    comments: 15,
    views: 203,
    isPinned: false,
    isLocked: false,
    createdAt: '2024-01-16T08:20:00Z',
    updatedAt: '2024-01-16T08:20:00Z',
    lastActivity: '2024-01-19T11:30:00Z'
  }
];

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '30-Day Water Challenge',
    description: 'Drink 8 glasses of water every day for 30 days',
    type: 'monthly',
    points: 500,
    participants: 1247,
    endDate: '2024-02-15',
    requirements: ['Log water intake daily', 'Take progress photos', 'Share your experience'],
    rewards: ['Water Challenge Badge', '500 points', 'Exclusive avatar frame'],
    isActive: true,
    createdBy: MOCK_USERS[1]
  },
  {
    id: '2',
    title: 'Weekly Workout Streak',
    description: 'Complete at least 3 workouts this week',
    type: 'weekly',
    points: 200,
    participants: 892,
    endDate: '2024-01-28',
    requirements: ['Log 3+ workouts', 'Share workout photos', 'Encourage others'],
    rewards: ['Workout Warrior Badge', '200 points', 'Fitness tips guide'],
    isActive: true,
    createdBy: MOCK_USERS[0]
  }
];

const CATEGORIES = [
  'All', 'Success Stories', 'Nutrition', 'Fitness', 'Mental Health', 
  'Medical Questions', 'Education', 'Challenges', 'General Discussion'
];

export default function Forum() {

  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General Discussion',
    tags: ''
  });

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: MOCK_USERS[0], // Current user
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      dislikes: 0,
      comments: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'General Discussion', tags: '' });
    setShowNewPost(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, participants: challenge.participants + 1 }
        : challenge
    ));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-purple-600';
    if (level >= 15) return 'text-blue-600';
    if (level >= 10) return 'text-green-600';
    if (level >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Community Forum
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect, share, and learn with fellow health enthusiasts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">12,847</div>
          <div className="text-sm text-gray-600">Active Members</div>
        </Card>
        <Card className="p-4 text-center">
          <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">3,456</div>
          <div className="text-sm text-gray-600">Posts This Month</div>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">89</div>
          <div className="text-sm text-gray-600">Active Challenges</div>
        </Card>
        <Card className="p-4 text-center">
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">1,234</div>
          <div className="text-sm text-gray-600">Success Stories</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search posts, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
              <option value="trending">Trending</option>
            </select>
            <Button onClick={() => setShowNewPost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Forum Content */}
        <div className="lg:col-span-2 space-y-4">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer"
                        onClick={() => setSelectedPost(post)}>
                      {post.title}
                    </h3>
                    {post.isPinned && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className={`font-medium ${getLevelColor(post.author.level)}`}>
                      {post.author.name} (Level {post.author.level})
                    </span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{getTimeAgo(post.createdAt)}</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{post.views} views</span>
                      <span>•</span>
                      <span>Last activity {getTimeAgo(post.lastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Active Challenges
            </h3>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{challenge.participants} participants</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {challenge.points} pts
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Contributors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-500" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              {MOCK_USERS.map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-sm">{user.name}</span>
                      {user.isVerified && <Shield className="w-3 h-3 text-blue-500" />}
                      {user.isModerator && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-gray-500">
                      Level {user.level} • {user.reputation} reputation
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-600">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or experiences..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="weight-loss, nutrition, motivation..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

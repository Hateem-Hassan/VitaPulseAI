'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  Dumbbell, 
  Clock, 
  Target, 
  Zap, 
  Heart, 
  Flame,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  Timer,
  Users,
  Award,
  Bookmark,
  Share2,
  Download,
  Upload,
  Settings,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  duration?: number;
  reps?: number;
  sets?: number;
  weight?: number;
  restTime?: number;
  calories?: number;
  isCustom: boolean;
  createdBy?: string;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga' | 'pilates' | 'crossfit' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Exercise[];
  totalCalories: number;
  targetMuscles: string[];
  equipment: string[];
  isPublic: boolean;
  isFavorite: boolean;
  rating: number;
  completedCount: number;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

const EXERCISE_DATABASE: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    category: 'Strength',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['Body Weight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep core tight throughout the movement'
    ],
    tips: [
      'Keep your body in a straight line',
      'Don\'t let your hips sag or pike up',
      'Breathe out on the way up, in on the way down'
    ],
    reps: 12,
    sets: 3,
    restTime: 60,
    calories: 8,
    isCustom: false
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['Body Weight'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Return to standing position'
    ],
    tips: [
      'Keep your weight on your heels',
      'Don\'t let your knees cave inward',
      'Go as low as comfortable'
    ],
    reps: 15,
    sets: 3,
    restTime: 60,
    calories: 12,
    isCustom: false
  },
  {
    id: '3',
    name: 'Plank',
    category: 'Strength',
    muscleGroups: ['Core', 'Shoulders', 'Glutes'],
    equipment: ['Body Weight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a push-up position',
      'Lower to your forearms',
      'Keep your body in a straight line',
      'Hold the position'
    ],
    tips: [
      'Engage your core throughout',
      'Don\'t let your hips sag',
      'Breathe normally'
    ],
    duration: 30,
    sets: 3,
    restTime: 60,
    calories: 5,
    isCustom: false
  }
];

export default function WorkoutPlanner() {
  const [exercises] = useState<Exercise[]>(EXERCISE_DATABASE);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(muscle => 
                           muscle.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = filterCategory === 'all' || exercise.category.toLowerCase() === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const calculateTotalDuration = () => {
    return selectedExercises.reduce((total, exercise) => {
      const exerciseTime = exercise.duration || (exercise.sets || 1) * ((exercise.reps || 1) * 2 + (exercise.restTime || 60));
      return total + exerciseTime;
    }, 0);
  };

  const calculateTotalCalories = () => {
    return selectedExercises.reduce((total, exercise) => {
      return total + (exercise.calories || 0) * (exercise.sets || 1);
    }, 0);
  };

  const createWorkout = () => {
    if (selectedExercises.length === 0 || !workoutName.trim()) {
      alert('Please add exercises and enter a workout name');
      return;
    }

    const uniqueMuscles = Array.from(new Set(selectedExercises.flatMap(e => e.muscleGroups)));
    const uniqueEquipment = Array.from(new Set(selectedExercises.flatMap(e => e.equipment)));

    const workout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      description: workoutDescription,
      category: 'custom',
      difficulty: 'beginner',
      duration: Math.ceil(calculateTotalDuration() / 60),
      exercises: selectedExercises,
      totalCalories: calculateTotalCalories(),
      targetMuscles: uniqueMuscles,
      equipment: uniqueEquipment,
      isPublic: false,
      isFavorite: false,
      rating: 0,
      completedCount: 0,
      createdBy: 'user',
      createdAt: new Date().toISOString(),
      tags: []
    };

    console.log('Created workout:', workout);
    alert('Workout created successfully!');
    
    // Reset form
    setSelectedExercises([]);
    setWorkoutName('');
    setWorkoutDescription('');
    setIsCreatingWorkout(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Workout Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create custom workouts by selecting exercises from our database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise Database */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Exercise Database</h2>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="hiit">HIIT</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gray-400" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {exercise.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {exercise.muscleGroups.map((muscle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {exercise.reps && (
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {exercise.reps} reps
                          </span>
                        )}
                        {exercise.sets && (
                          <span className="flex items-center">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            {exercise.sets} sets
                          </span>
                        )}
                        {exercise.duration && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {exercise.duration}s
                          </span>
                        )}
                        {exercise.calories && (
                          <span className="flex items-center">
                            <Flame className="h-3 w-3 mr-1" />
                            {exercise.calories} cal
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addExercise(exercise)}
                      disabled={selectedExercises.some(e => e.id === exercise.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workout Builder */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Workout Builder</h2>
              <Button
                size="sm"
                onClick={() => setIsCreatingWorkout(!isCreatingWorkout)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup
              </Button>
            </div>

            {isCreatingWorkout && (
              <div className="space-y-4 mb-6">
                <Input
                  placeholder="Workout name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
                <Input
                  placeholder="Description (optional)"
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                />
              </div>
            )}

            {/* Workout Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedExercises.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Exercises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.ceil(calculateTotalDuration() / 60)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {calculateTotalCalories()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Array.from(new Set(selectedExercises.flatMap(e => e.muscleGroups))).length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Muscles</div>
                </div>
              </div>
            </div>

            {/* Selected Exercises */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {selectedExercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{exercise.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {exercise.sets && exercise.reps ? `${exercise.sets} × ${exercise.reps}` : 
                       exercise.duration ? `${exercise.duration}s` : 'Custom'}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={createWorkout}
                disabled={selectedExercises.length === 0 || !workoutName.trim()}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Workout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedExercises([])}
                disabled={selectedExercises.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

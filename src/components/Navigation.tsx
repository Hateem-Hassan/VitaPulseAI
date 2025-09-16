import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Heart,
  Menu,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Home,
  Activity,
  Calculator,
  Utensils,
  BookOpen,
  Brain,
  Stethoscope,
  Crown,
  ChevronDown,
  Globe,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Health Calculators',
    href: '/health-calculators',
    icon: Calculator,
  },
  {
    name: 'Food Logger',
    href: '/food-logger',
    icon: Utensils,
  },
  {
    name: 'AI Symptom Checker',
    href: '/ai-symptom-checker',
    icon: Brain,
  },
];

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // In a real app, you'd persist this to localStorage and apply theme classes
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, mobile = false }: { item: NavigationItem; mobile?: boolean }) => {
    const isActive = isActiveRoute(item.href);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren && !mobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <Badge className="ml-1 px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  {item.badge}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {item.children.map((child) => (
              <DropdownMenuItem key={child.href} asChild>
                <Link
                  to={child.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 w-full',
                    isActiveRoute(child.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <child.icon className="h-4 w-4" />
                  <span>{child.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
          isActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800',
          mobile && 'w-full justify-start'
        )}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.name}</span>
        {item.badge && (
          <Badge className="ml-auto px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const MobileNavItem = ({ item }: { item: NavigationItem }) => {
    const isActive = isActiveRoute(item.href);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <div className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg',
            isActive
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600'
          )}>
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <Badge className="ml-auto px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                {item.badge}
              </Badge>
            )}
          </div>
          <div className="ml-6 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                  isActiveRoute(child.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.name}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return <NavItem item={item} mobile />;
  };

  return (
    <nav className={cn('bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              VitaPulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
                  <Languages className="h-4 w-4" />
                  <span className="text-sm">{currentLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      'flex items-center space-x-2',
                      language === lang.code && 'bg-blue-50 text-blue-700'
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </Button>

            {user ? (
              /* User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.firstName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Upgrade to Premium</span>
                    <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      Pro
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      VitaPulse
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Your AI-powered health companion
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-2">
                  {navigationItems.map((item) => (
                    <MobileNavItem key={item.href} item={item} />
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4 mr-2" />
                    ) : (
                      <Sun className="h-4 w-4 mr-2" />
                    )}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Languages className="h-4 w-4 mr-2" />
                        {currentLanguage.flag} {currentLanguage.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={cn(
                            'flex items-center space-x-2',
                            language === lang.code && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {!user && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <Button className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/auth/register">Sign Up</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
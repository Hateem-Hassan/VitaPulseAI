'use client';

import { ReactNode } from 'react';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrationPopup } from '@/hooks/use-registration-popup';
import toast from 'react-hot-toast';

interface ProFeatureGuardProps {
  children: ReactNode;
  featureName: string;
  description?: string;
  showUpgradePrompt?: boolean;
}

export function ProFeatureGuard({ 
  children, 
  featureName, 
  description = 'This feature requires registration to access AI-powered tools.',
  showUpgradePrompt = true 
}: ProFeatureGuardProps) {
  const { isProFeatureAllowed, showProUpgradePrompt } = useRegistrationPopup();

  const handleUpgradeClick = () => {
    const canAccess = showProUpgradePrompt();
    if (!canAccess) {
      toast.error('Please register to access AI-powered features!');
    }
  };

  // If user has access, render the children
  if (isProFeatureAllowed()) {
    return <>{children}</>;
  }

  // If showUpgradePrompt is false, just render nothing
  if (!showUpgradePrompt) {
    return null;
  }

  // Render upgrade prompt
  return (
    <div className="relative">
      {/* Blurred/Disabled Content */}
      <div className="pointer-events-none opacity-30 blur-sm">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Pro Feature: {featureName}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              AI-Powered Tool
            </span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          
          <Button
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            <Lock className="w-4 h-4 mr-2" />
            Register to Unlock
          </Button>
        </div>
      </div>
    </div>
  );
}

// Higher-order component version
export function withProFeatureGuard<T extends object>(
  Component: React.ComponentType<T>,
  featureName: string,
  description?: string
) {
  return function WrappedComponent(props: T) {
    return (
      <ProFeatureGuard featureName={featureName} description={description}>
        <Component {...props} />
      </ProFeatureGuard>
    );
  };
}
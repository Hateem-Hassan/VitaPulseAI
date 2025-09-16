'use client';

import { useState, useEffect } from 'react';

const POPUP_DISMISSED_KEY = 'vitapulse-registration-popup-dismissed';
const POPUP_DELAY = 2000; // 2 seconds delay before showing popup

export function useRegistrationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup or is registered
    const isDismissed = localStorage.getItem(POPUP_DISMISSED_KEY) === 'true';
    const userToken = localStorage.getItem('supabase.auth.token') || 
                     localStorage.getItem('vitapulse-user-token');
    
    if (userToken) {
      setIsUserRegistered(true);
      return;
    }

    if (!isDismissed && !userToken) {
      // Show popup after a delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, POPUP_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Mark as dismissed for this session
    localStorage.setItem(POPUP_DISMISSED_KEY, 'true');
  };

  const handleRegistration = async (email: string, password: string, name: string) => {
    // This would integrate with your actual auth system
    // For now, we'll simulate a registration
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user token (replace with actual auth implementation)
      localStorage.setItem('vitapulse-user-token', 'demo-token');
      localStorage.setItem('vitapulse-user-data', JSON.stringify({ email, name }));
      
      setIsUserRegistered(true);
      setIsOpen(false);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const isProFeatureAllowed = () => {
    return isUserRegistered || localStorage.getItem('vitapulse-user-token');
  };

  const showProUpgradePrompt = () => {
    if (!isProFeatureAllowed()) {
      setIsOpen(true);
      return false;
    }
    return true;
  };

  return {
    isOpen,
    isUserRegistered,
    closePopup,
    handleRegistration,
    isProFeatureAllowed,
    showProUpgradePrompt
  };
}
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  // Ensure we're client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update theme when user profile changes
  useEffect(() => {
    if (!mounted) return;
    
    const updateTheme = async () => {
      if (user) {
        try {
          // Fetch user profile to get theme preference
          const response = await fetch('/api/profile', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const profile = await response.json();
            const userTheme = profile.theme || 'dark';
            setThemeState(userTheme);
            
            // Apply theme to document
            applyTheme(userTheme);
          }
        } catch (error) {
          console.error('Failed to fetch user theme:', error);
          // Fallback to localStorage or system preference
          const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const defaultTheme = savedTheme || systemTheme;
          
          setThemeState(defaultTheme);
          applyTheme(defaultTheme);
        }
      } else {
        // For non-authenticated users, check localStorage or use system preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const defaultTheme = savedTheme || systemTheme;
        
        setThemeState(defaultTheme);
        applyTheme(defaultTheme);
      }
      
      setIsLoading(false);
    };

    updateTheme();
  }, [user, mounted]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    console.log('Applying theme:', newTheme);
    
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Add new theme class
    document.documentElement.classList.add(newTheme);
    
    console.log('Theme classes applied:', document.documentElement.classList.toString());
    
    // Update CSS custom properties using RGB space-separated values
    if (newTheme === 'dark') {
      // Dark theme - original colors
      document.documentElement.style.setProperty('--background', '15 23 42');
      document.documentElement.style.setProperty('--foreground', '241 245 249');
      document.documentElement.style.setProperty('--card', '30 41 59');
      document.documentElement.style.setProperty('--card-foreground', '241 245 249');
      document.documentElement.style.setProperty('--popover', '30 41 59');
      document.documentElement.style.setProperty('--popover-foreground', '241 245 249');
      document.documentElement.style.setProperty('--primary', '14 165 233');
      document.documentElement.style.setProperty('--primary-foreground', '248 250 252');
      document.documentElement.style.setProperty('--secondary', '51 65 85');
      document.documentElement.style.setProperty('--secondary-foreground', '241 245 249');
      document.documentElement.style.setProperty('--muted', '51 65 85');
      document.documentElement.style.setProperty('--muted-foreground', '148 163 184');
      document.documentElement.style.setProperty('--accent', '51 65 85');
      document.documentElement.style.setProperty('--accent-foreground', '241 245 249');
      document.documentElement.style.setProperty('--destructive', '239 68 68');
      document.documentElement.style.setProperty('--destructive-foreground', '248 250 252');
      document.documentElement.style.setProperty('--border', '51 65 85');
      document.documentElement.style.setProperty('--input', '51 65 85');
      document.documentElement.style.setProperty('--ring', '14 165 233');
    } else {
      // Light theme - realistic descending colors from light grays
      document.documentElement.style.setProperty('--background', '249 250 251');      // Very light gray
      document.documentElement.style.setProperty('--foreground', '17 24 39');         // Dark slate
      document.documentElement.style.setProperty('--card', '255 255 255');           // Pure white for cards
      document.documentElement.style.setProperty('--card-foreground', '17 24 39');   // Dark slate
      document.documentElement.style.setProperty('--popover', '255 255 255');        // Pure white
      document.documentElement.style.setProperty('--popover-foreground', '17 24 39'); // Dark slate
      document.documentElement.style.setProperty('--primary', '37 99 235');          // Blue
      document.documentElement.style.setProperty('--primary-foreground', '255 255 255'); // White
      document.documentElement.style.setProperty('--secondary', '241 245 249');      // Light gray
      document.documentElement.style.setProperty('--secondary-foreground', '51 65 85'); // Medium gray
      document.documentElement.style.setProperty('--muted', '243 244 246');          // Very light gray
      document.documentElement.style.setProperty('--muted-foreground', '107 114 128'); // Medium gray
      document.documentElement.style.setProperty('--accent', '236 254 255');         // Light cyan
      document.documentElement.style.setProperty('--accent-foreground', '22 78 99'); // Dark cyan
      document.documentElement.style.setProperty('--destructive', '220 38 38');      // Red
      document.documentElement.style.setProperty('--destructive-foreground', '255 255 255'); // White
      document.documentElement.style.setProperty('--border', '229 231 235');         // Light border
      document.documentElement.style.setProperty('--input', '229 231 235');          // Light input border
      document.documentElement.style.setProperty('--ring', '37 99 235');             // Blue ring
    }
    
    console.log('Theme variables set for:', newTheme);
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    if (user) {
      // Update user profile theme preference
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error('Failed to update user theme:', error);
      }
    } else {
      // For non-authenticated users, save to localStorage
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

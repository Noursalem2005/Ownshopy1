"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded-full ${getSizeClasses(size)} ${className}`} />
    );
  }

  const sizeClasses = getSizeClasses(size);
  const iconSize = getIconSize(size);

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-secondary hover:bg-secondary/80 
        text-secondary-foreground hover:text-foreground
        transition-all duration-200 
        border border-border
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${sizeClasses} ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="flex items-center justify-center transition-transform duration-200 hover:scale-110">
        {theme === 'light' ? (
          <Moon size={iconSize} />
        ) : (
          <Sun size={iconSize} />
        )}
      </div>
    </button>
  );
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8';
    case 'md':
      return 'w-10 h-10';
    case 'lg':
      return 'w-12 h-12';
    default:
      return 'w-10 h-10';
  }
}

function getIconSize(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm':
      return 16;
    case 'md':
      return 20;
    case 'lg':
      return 24;
    default:
      return 20;
  }
}

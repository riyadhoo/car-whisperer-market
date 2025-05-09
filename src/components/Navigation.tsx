
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import AuthNav from './AuthNav';

const Navigation = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/69914926-946e-47e7-b0e6-fe2b91025fc1.png" 
                alt="Torque Up" 
                className="w-12 h-15"
              />
            </div>
          </Link>
          
          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-carTheme-red transition-colors">
              Home
            </Link>
            <Link to="/cars" className="text-sm font-medium hover:text-carTheme-red transition-colors">
              Cars
            </Link>
            <Link to="/parts" className="text-sm font-medium hover:text-carTheme-red transition-colors">
              Parts
            </Link>
          </div>
          
          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            <AuthNav />
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 z-50 p-6">
          <div className="flex justify-end mb-8">
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="block text-lg font-medium hover:text-carTheme-red transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link 
              to="/cars" 
              className="block text-lg font-medium hover:text-carTheme-red transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Cars
            </Link>
            <Link 
              to="/parts" 
              className="block text-lg font-medium hover:text-carTheme-red transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Parts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;

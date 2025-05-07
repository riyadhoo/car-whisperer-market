
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart,
  User,
  Menu, 
  X
} from "lucide-react";
import LanguageSelector from './LanguageSelector';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, direction } = useSettings();
  const { t } = useTranslation(language);
  
  return (
    <nav className="bg-carTheme-navy text-white py-4 px-6 sticky top-0 z-50 shadow-md" dir={direction}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/dee0ea9f-2929-4373-9e12-da53bfe9e18f.png" 
            alt="TorqueUp Logo" 
            className="h-15 w-15"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative w-64">
            <Search className={`absolute ${direction === 'rtl' ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-carTheme-silver`} />
            <Input 
              type="search" 
              placeholder={t('search')}
              className={`${direction === 'rtl' ? 'pr-8' : 'pl-8'} bg-white/10 border-carTheme-silver/30 text-white placeholder:text-carTheme-silver/70`}
            />
          </div>
          <Link to="/" className="hover:text-carTheme-red transition-colors">{t('home')}</Link>
          <Link to="/cars" className="hover:text-carTheme-red transition-colors">{t('cars')}</Link>
          <Link to="/parts" className="hover:text-carTheme-red transition-colors">{t('parts')}</Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:text-carTheme-red">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="text-white hover:text-carTheme-red">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <LanguageSelector />
        </div>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-carTheme-navy border-t border-white/10 mt-4 py-4">
          <div className="container mx-auto space-y-4">
            <div className="relative">
              <Search className={`absolute ${direction === 'rtl' ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-carTheme-silver`} />
              <Input 
                type="search" 
                placeholder={t('search')}
                className={`${direction === 'rtl' ? 'pr-8' : 'pl-8'} bg-white/10 border-carTheme-silver/30 text-white placeholder:text-carTheme-silver/70 w-full`}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-white/10 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                to="/cars" 
                className="px-4 py-2 hover:bg-white/10 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('cars')}
              </Link>
              <Link 
                to="/parts" 
                className="px-4 py-2 hover:bg-white/10 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('parts')}
              </Link>
              <div className="flex space-x-4 px-4 py-2">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>{t('profile')}</span>
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t('cart')}</span>
                </Link>
                <div className="flex items-center">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

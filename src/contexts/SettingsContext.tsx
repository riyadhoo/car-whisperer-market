
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the available languages and currencies
export type Language = 'en' | 'fr' | 'ar';
export type Currency = 'USD' | 'DA';

interface SettingsContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  // Exchange rate (simplified): 1 USD = 135 DA
  exchangeRate: number;
  formatPrice: (price: number) => string;
  direction: 'ltr' | 'rtl';
}

// Create context with default values
const SettingsContext = createContext<SettingsContextType>({
  language: 'en',
  currency: 'USD',
  setLanguage: () => {},
  setCurrency: () => {},
  exchangeRate: 135,
  formatPrice: () => '',
  direction: 'ltr',
});

// Custom hook to use the settings
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  
  // Simplified exchange rate: 1 USD = 135 DA
  const exchangeRate = 135;
  
  // Format price based on current currency
  const formatPrice = (price: number): string => {
    if (currency === 'DA') {
      const daPrice = Math.round(price * exchangeRate);
      // Arabic numerals when language is Arabic
      return language === 'ar' 
        ? `${daPrice.toLocaleString('ar-DZ')} د.ج` 
        : `${daPrice.toLocaleString()} DA`;
    }
    return `$${price.toLocaleString()}`;
  };
  
  // Text direction based on language
  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';
  
  const value = {
    language,
    currency,
    setLanguage,
    setCurrency,
    exchangeRate,
    formatPrice,
    direction,
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;


import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, currency, setCurrency } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-carTheme-red">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2">
          <h4 className="font-medium mb-2">Language</h4>
          <div className="flex space-x-2">
            <Button 
              size="sm"
              variant={language === 'en' ? "default" : "outline"} 
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button 
              size="sm"
              variant={language === 'ar' ? "default" : "outline"} 
              onClick={() => setLanguage('ar')}
            >
              العربية
            </Button>
          </div>
        </div>
        <div className="p-2 border-t">
          <h4 className="font-medium mb-2">Currency</h4>
          <div className="flex space-x-2">
            <Button 
              size="sm"
              variant={currency === 'USD' ? "default" : "outline"} 
              onClick={() => setCurrency('USD')}
            >
              USD ($)
            </Button>
            <Button 
              size="sm"
              variant={currency === 'DA' ? "default" : "outline"} 
              onClick={() => setCurrency('DA')}
            >
              DA (د.ج)
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;


import React from 'react';
import { Button } from '@/components/ui/button';
import PartCard from '@/components/PartCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';

interface Part {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  condition: 'New' | 'Used' | 'Refurbished';
  seller: {
    id: string;
    type: 'Shop' | 'Individual';
    name: string;
  };
  compatibility: string[];
  inStock: number;
}

interface PartsGridProps {
  filteredParts: Part[];
  resetFilters: () => void;
}

const PartsGrid = ({ filteredParts, resetFilters }: PartsGridProps) => {
  const { language, direction } = useSettings();
  const { t } = useTranslation(language);
  
  return (
    <div className="md:col-span-3">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {filteredParts.length} {filteredParts.length === 1 ? t('partFound') : t('partsFound')}
          </h2>
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('featured')}</SelectItem>
              <SelectItem value="price-low">{t('priceLow')}</SelectItem>
              <SelectItem value="price-high">{t('priceHigh')}</SelectItem>
              <SelectItem value="newest">{t('newest')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.length > 0 ? (
          filteredParts.map(part => (
            <PartCard key={part.id} part={part} />
          ))
        ) : (
          <div className="col-span-3 py-16 text-center">
            <p className="text-xl text-muted-foreground">{t('noPartsMatch')}</p>
            <Button 
              onClick={resetFilters}
              className="mt-4"
            >
              {t('resetFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsGrid;


import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';
import ShippingInfo from './ShippingInfo';

interface PartsSidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCondition: string | null;
  setSelectedCondition: React.Dispatch<React.SetStateAction<string | null>>;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  sellerType: 'all' | 'shop' | 'individual';
  setSellerType: React.Dispatch<React.SetStateAction<'all' | 'shop' | 'individual'>>;
  inStockOnly: boolean;
  setInStockOnly: React.Dispatch<React.SetStateAction<boolean>>;
  categories: string[];
  resetFilters: () => void;
}

const PartsSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  sellerType,
  setSellerType,
  inStockOnly,
  setInStockOnly,
  categories,
  resetFilters,
}: PartsSidebarProps) => {
  const { language, direction } = useSettings();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-carTheme-red" />
          <h2 className="text-lg font-bold">{t('filters')}</h2>
        </div>
        
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('search')}</label>
            <Input
              type="text"
              placeholder={t('searchParts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('category')}</label>
            <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Condition filter */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('condition')}</label>
            <Select onValueChange={(value) => setSelectedCondition(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('anyCondition')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('anyCondition')}</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
                <SelectItem value="Refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Price range slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium">{t('priceRange')}</label>
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 500]}
              min={0}
              max={500}
              step={10}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
          
          {/* Seller type */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('sellerType')}</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="seller-all"
                  checked={sellerType === 'all'}
                  onChange={() => setSellerType('all')}
                  className="mr-2"
                />
                <label htmlFor="seller-all">{t('allSellers')}</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="seller-shop"
                  checked={sellerType === 'shop'}
                  onChange={() => setSellerType('shop')}
                  className="mr-2"
                />
                <label htmlFor="seller-shop">{t('shopsOnly')}</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="seller-individual"
                  checked={sellerType === 'individual'}
                  onChange={() => setSellerType('individual')}
                  className="mr-2"
                />
                <label htmlFor="seller-individual">{t('individualsOnly')}</label>
              </div>
            </div>
          </div>
          
          {/* In stock filter */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock" 
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <label htmlFor="in-stock">{t('inStockOnly')}</label>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={resetFilters}
          >
            {t('resetFilters')}
          </Button>
        </div>
      </div>
      
      {/* Shipping/Services Info */}
      <ShippingInfo />
    </div>
  );
};

export default PartsSidebar;

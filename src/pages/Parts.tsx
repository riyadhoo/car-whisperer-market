
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { parts } from '@/data/mockData';
import { useSettings } from '@/contexts/SettingsContext';
import PartsHeader from '@/components/parts/PartsHeader';
import PartsSidebar from '@/components/parts/PartsSidebar';
import PartsGrid from '@/components/parts/PartsGrid';

const Parts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sellerType, setSellerType] = useState<'all' | 'shop' | 'individual'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const { direction } = useSettings();

  // Extract unique categories
  const categories = Array.from(new Set(parts.map(part => part.category)));
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedCondition(null);
    setPriceRange([0, 500]);
    setSellerType('all');
    setInStockOnly(false);
  };
  
  // Filter parts based on criteria
  const filteredParts = parts.filter(part => {
    const matchesSearch = searchTerm === '' || 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || part.category === selectedCategory;
    
    const matchesCondition = selectedCondition === null || part.condition === selectedCondition;
    
    const matchesPrice = part.price >= priceRange[0] && part.price <= priceRange[1];
    
    const matchesSeller = sellerType === 'all' || 
      (sellerType === 'shop' && part.seller.type === 'Shop') ||
      (sellerType === 'individual' && part.seller.type === 'Individual');
    
    const matchesStock = !inStockOnly || part.inStock > 0;
    
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesSeller && matchesStock;
  });

  return (
    <div className="flex flex-col min-h-screen" dir={direction}>
      <Navigation />
      
      <main className="flex-grow">
        {/* Header */}
        <PartsHeader />
        
        {/* Filters and Parts Listings */}
        <section className="py-8 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <PartsSidebar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCondition={selectedCondition}
                setSelectedCondition={setSelectedCondition}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sellerType={sellerType}
                setSellerType={setSellerType}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                categories={categories}
                resetFilters={resetFilters}
              />
              
              {/* Parts Grid */}
              <PartsGrid 
                filteredParts={filteredParts}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Parts;

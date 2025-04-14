
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PartCard from '@/components/PartCard';
import { parts } from '@/data/mockData';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal, Truck } from 'lucide-react';

const Parts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sellerType, setSellerType] = useState<'all' | 'shop' | 'individual'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(parts.map(part => part.category)));
  
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
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-carTheme-navy text-white py-10">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Car Parts Marketplace</h1>
            <p className="text-lg opacity-80">
              Find new, used, and refurbished parts from trusted sellers and individuals.
            </p>
          </div>
        </section>
        
        {/* Filters and Parts Listings */}
        <section className="py-8 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <Filter className="h-5 w-5 mr-2 text-carTheme-red" />
                    <h2 className="text-lg font-bold">Filters</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Search</label>
                      <Input
                        type="text"
                        placeholder="Search parts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Category filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Condition filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Condition</label>
                      <Select onValueChange={(value) => setSelectedCondition(value === 'all' ? null : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Condition</SelectItem>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Used">Used</SelectItem>
                          <SelectItem value="Refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Price range slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium">Price Range</label>
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
                      <label className="block text-sm font-medium mb-2">Seller Type</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="seller-all"
                            checked={sellerType === 'all'}
                            onChange={() => setSellerType('all')}
                            className="mr-2"
                          />
                          <label htmlFor="seller-all">All Sellers</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="seller-shop"
                            checked={sellerType === 'shop'}
                            onChange={() => setSellerType('shop')}
                            className="mr-2"
                          />
                          <label htmlFor="seller-shop">Shops Only</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="seller-individual"
                            checked={sellerType === 'individual'}
                            onChange={() => setSellerType('individual')}
                            className="mr-2"
                          />
                          <label htmlFor="seller-individual">Individuals Only</label>
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
                      <label htmlFor="in-stock">In Stock Only</label>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                        setSelectedCondition(null);
                        setPriceRange([0, 500]);
                        setSellerType('all');
                        setInStockOnly(false);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
                
                {/* Shipping/Services Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-3">Shipping & Services</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-carTheme-red mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Free Shipping</p>
                        <p className="text-sm text-muted-foreground">On orders over $75</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <SlidersHorizontal className="h-5 w-5 text-carTheme-red mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Compatibility Check</p>
                        <p className="text-sm text-muted-foreground">Parts verified to fit your vehicle</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Parts Grid */}
              <div className="md:col-span-3">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                      {filteredParts.length} {filteredParts.length === 1 ? 'part' : 'parts'} found
                    </h2>
                    <Select defaultValue="featured">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
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
                      <p className="text-xl text-muted-foreground">No parts match your search criteria</p>
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory(null);
                          setSelectedCondition(null);
                          setPriceRange([0, 500]);
                          setSellerType('all');
                          setInStockOnly(false);
                        }}
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Parts;

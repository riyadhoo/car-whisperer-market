
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { cars } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CheckCircle2, Filter } from 'lucide-react';

const Cars = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Generate unique list of car makes
  const makes = Array.from(new Set(cars.map(car => car.make)));

  // Car body types (in a real app, these would be part of the car data)
  const carTypes = ['Sedan', 'SUV', 'Truck', 'Sports', 'Luxury', 'Electric'];

  // Filter cars based on search and filters
  const filteredCars = cars.filter(car => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Make filter
    const matchesMake = selectedMake === null || car.make === selectedMake;
    
    // Type filter (mock implementation since we don't have type in our data)
    const matchesType = selectedType === null || true; // Replace with actual type matching
    
    // Price filter
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    
    // Rating filter
    const matchesRating = ratingFilter === null || car.rating >= ratingFilter;
    
    return matchesSearch && matchesMake && matchesType && matchesPrice && matchesRating;
  });

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-carTheme-navy text-white py-10">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Car Reviews & Ratings</h1>
            <p className="text-lg opacity-80">
              Browse honest reviews from real drivers to help find your perfect car.
            </p>
          </div>
        </section>
        
        {/* Filters and Car Listings */}
        <section className="py-8 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 mr-2 text-carTheme-red" />
                <h2 className="text-xl font-bold">Search & Filter Cars</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search by make or model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Make filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Make</label>
                  <Select onValueChange={(value) => setSelectedMake(value === 'all' ? null : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      {makes.map((make) => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Car type filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select onValueChange={(value) => setSelectedType(value === 'all' ? null : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {carTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Rating filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <Select onValueChange={(value) => setRatingFilter(value === 'all' ? null : Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Price range slider */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <Slider
                  defaultValue={[0, 100000]}
                  min={0}
                  max={100000}
                  step={5000}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
            </div>
            
            {/* Car view options */}
            <Tabs defaultValue="grid" className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
                </h2>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.length > 0 ? (
                    filteredCars.map(car => (
                      <CarCard key={car.id} car={car} />
                    ))
                  ) : (
                    <div className="col-span-3 py-16 text-center">
                      <p className="text-xl text-muted-foreground">No cars match your search criteria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <div className="space-y-4">
                  {filteredCars.length > 0 ? (
                    filteredCars.map(car => (
                      <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img 
                              src={car.image} 
                              alt={`${car.year} ${car.make} ${car.model}`}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{car.year} {car.make} {car.model}</h3>
                              <div className="flex items-center mb-4">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-lg ${i < Math.round(car.rating) ? 'text-carTheme-red' : 'text-gray-300'}`}>★</span>
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {car.rating.toFixed(1)} ({car.reviewCount} reviews)
                                </span>
                              </div>
                              <p className="text-muted-foreground line-clamp-2">
                                {car.description.substring(0, 150)}...
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-xl font-semibold">${car.price.toLocaleString()}</span>
                              <a href={`/cars/${car.id}`} className="text-carTheme-navy hover:text-carTheme-red transition-colors">
                                View Details →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center">
                      <p className="text-xl text-muted-foreground">No cars match your search criteria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Testimonials/Trust indicators */}
            {filteredCars.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm">All reviews are from verified car owners</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm">Updated ratings based on long-term ownership</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm">Unbiased reviews with pros and cons</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cars;

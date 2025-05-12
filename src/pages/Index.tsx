import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Car, ShoppingBag, Star, Users } from 'lucide-react';
import CarCard from '@/components/CarCard';
import PartCard from '@/components/PartCard';
import { cars, parts } from '@/data/mockData';
const Index = () => {
  // Show only top-rated cars and featured parts
  const featuredCars = [...cars].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const featuredParts = parts.slice(0, 3);
  return <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-carTheme-navy text-white">
          <div className="container mx-auto px-6 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Find Your Perfect Car With Confidence
                </h1>
                <p className="text-lg md:text-xl opacity-80">
                  Real reviews from real drivers. Get honest opinions, ratings, and find the best car parts - all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/cars">
                    <Button size="lg" className="bg-carTheme-red hover:bg-carTheme-red/80 w-full sm:w-auto">
                      Browse Car Reviews
                    </Button>
                  </Link>
                  <Link to="/parts">
                    <Button size="lg" variant="outline" className="border-white w-full sm:w-auto text-gray-50 bg-carTheme-navy rounded-sm">
                      Shop Car Parts
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="bg-carTheme-red rounded-full h-72 w-72 absolute -top-10 -right-10 opacity-30"></div>
                <img alt="Featured Car" className="rounded-lg relative" src="/lovable-uploads/d948b3bb-790d-458f-9f6d-6130ac990f38.png" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Car Enthusiasts Trust Us</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">TorqueUp provides honest reviews, ratings, and a marketplace for all your automotive needs.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-carTheme-lightGray p-8 rounded-lg text-center">
                <div className="h-14 w-14 bg-carTheme-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-7 w-7 text-carTheme-red" />
                </div>
                <h3 className="text-xl font-bold mb-3">Honest Reviews</h3>
                <p className="text-muted-foreground">
                  Real feedback from verified car owners. No sponsored or fake reviews.
                </p>
              </div>
              
              <div className="bg-carTheme-lightGray p-8 rounded-lg text-center">
                <div className="h-14 w-14 bg-carTheme-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-7 w-7 text-carTheme-red" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                <p className="text-muted-foreground">
                  Join thousands of car enthusiasts helping each other make informed decisions.
                </p>
              </div>
              
              <div className="bg-carTheme-lightGray p-8 rounded-lg text-center">
                <div className="h-14 w-14 bg-carTheme-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-7 w-7 text-carTheme-red" />
                </div>
                <h3 className="text-xl font-bold mb-3">Parts Marketplace</h3>
                <p className="text-muted-foreground">
                  Find new, used, and refurbished parts from trusted sellers and individuals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-16 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Top-Rated Cars</h2>
              <Link to="/cars" className="text-carTheme-red hover:underline flex items-center">
                View All Cars
                <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </section>

        {/* Featured Parts Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Popular Parts</h2>
              <Link to="/parts" className="text-carTheme-red hover:underline flex items-center">
                Browse All Parts
                <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredParts.map(part => <PartCard key={part.id} part={part} />)}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-carTheme-navy text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Car?</h2>
              <p className="text-lg mb-8 opacity-80">
                Join our community of car enthusiasts and get access to thousands of honest reviews and the best parts marketplace.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/cars">
                  <Button size="lg" className="bg-carTheme-red hover:bg-carTheme-red/80 w-full sm:w-auto">
                    <Car className="mr-2 h-5 w-5" />
                    Browse Cars
                  </Button>
                </Link>
                <Link to="/parts">
                  <Button size="lg" variant="outline" className="border-white w-full sm:w-auto text-slate-50 bg-carTheme-navy">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Parts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;
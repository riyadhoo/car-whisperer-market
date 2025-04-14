
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Car, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow bg-carTheme-lightGray">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-carTheme-navy mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been removed, 
              had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/">
                <Button size="lg" className="bg-carTheme-navy hover:bg-carTheme-navy/80 w-full sm:w-auto">
                  <Car className="mr-2 h-5 w-5" />
                  Browse Car Reviews
                </Button>
              </Link>
              <Link to="/parts">
                <Button size="lg" variant="outline" className="border-carTheme-navy text-carTheme-navy hover:bg-carTheme-navy/10 w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Parts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;

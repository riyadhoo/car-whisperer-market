
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-carTheme-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <img 
                src="/lovable-uploads/dee0ea9f-2929-4373-9e12-da53bfe9e18f.png" 
                alt="TorqueUp Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-carTheme-silver">
              Helping car enthusiasts and newcomers find their perfect vehicle and parts since 2025.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-carTheme-silver hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-carTheme-silver hover:text-white transition-colors">
                  Car Reviews
                </Link>
              </li>
              <li>
                <Link to="/parts" className="text-carTheme-silver hover:text-white transition-colors">
                  Parts Marketplace
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-carTheme-silver hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars?type=sedan" className="text-carTheme-silver hover:text-white transition-colors">
                  Sedans
                </Link>
              </li>
              <li>
                <Link to="/cars?type=suv" className="text-carTheme-silver hover:text-white transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link to="/cars?type=truck" className="text-carTheme-silver hover:text-white transition-colors">
                  Trucks
                </Link>
              </li>
              <li>
                <Link to="/cars?type=luxury" className="text-carTheme-silver hover:text-white transition-colors">
                  Luxury
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-carTheme-red" />
                <span className="text-carTheme-silver">1234 Car Street, Auto City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-carTheme-red" />
                <span className="text-carTheme-silver">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-carTheme-red" />
                <span className="text-carTheme-silver">info@torqueup.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-carTheme-silver">
          <p>&copy; {new Date().getFullYear()} TorqueUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

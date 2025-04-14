
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import StarRating from './StarRating';
import { useSettings } from '@/contexts/SettingsContext';

interface CarCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
  };
}

const CarCard = ({ car }: CarCardProps) => {
  const { formatPrice, direction } = useSettings();
  
  return (
    <Link to={`/cars/${car.id}`}>
      <Card className="car-rating-card overflow-hidden h-full" dir={direction}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={car.image} 
            alt={`${car.year} ${car.make} ${car.model}`} 
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-lg">{car.year} {car.make} {car.model}</h3>
            <StarRating rating={car.rating} className="mt-1" />
            <span className="text-sm text-muted-foreground ml-2">
              ({car.reviewCount} reviews)
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-carTheme-navy">
              {formatPrice(car.price)}
            </span>
            <span className="text-sm bg-carTheme-navy text-white px-2 py-1 rounded-md">
              View Details
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CarCard;

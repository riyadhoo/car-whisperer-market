
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

const StarRating = ({ rating, size = 18, className = "" }: StarRatingProps) => {
  // Convert rating to array representation
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Star 
              key={`star-${index}`} 
              className="text-carTheme-red fill-current" 
              size={size} 
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <StarHalf 
              key={`star-${index}`} 
              className="text-carTheme-red fill-current" 
              size={size} 
            />
          );
        } else {
          return (
            <Star 
              key={`star-${index}`} 
              className="text-gray-300" 
              size={size} 
            />
          );
        }
      })}
      <span className="ml-1 text-sm font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;

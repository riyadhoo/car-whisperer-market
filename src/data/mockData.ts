
import { cars } from './mockCars';
import { carComments } from './mockComments';
import { parts } from './mockParts';
import { Car, CarComment, Comment, Part } from './types';

// Re-export all mock data for backward compatibility
export { cars, carComments, parts };
export type { Car, CarComment, Comment, Part };

// Function to get comments for a specific car
export const getCommentsForCar = (carId: string): Comment[] => {
  return carComments.filter(comment => comment.carId === carId);
};


import { parts } from './mockParts';
import { cars } from './mockCars';
import { carComments } from './mockComments';
import { users } from './mockUsers';
import { Car, CarComment, Comment } from './types';

// Function to get comments for a specific car
const getCommentsForCar = (carId: string): CarComment[] => {
  return carComments.filter(comment => comment.carId === carId);
};

export { cars, parts, carComments, users, getCommentsForCar, Comment };

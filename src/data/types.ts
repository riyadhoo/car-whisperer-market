
// Common types used across the application
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  rating: number;
  reviewCount: number;
  price?: number;
  description: string;
  features: string[];
  specs: {
    engine: string;
    transmission: string;
    fuelEconomy: string;
    horsepower: number;
    torque: string;
  };
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  date: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
}

export interface CarComment extends Comment {
  carId: string;
}

export interface Part {
  id: string;
  name: string;
  image: string;
  price: number;
  condition: 'New' | 'Used' | 'Refurbished';
  seller: {
    id: string;
    type: 'Shop' | 'Individual';
    name: string;
  };
  compatibility: string[];
  description: string;
  category: string;
  inStock: number;
}

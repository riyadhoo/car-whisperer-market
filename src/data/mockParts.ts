
import { Part } from './types';

// Mock parts data
export const parts: Part[] = [
  {
    id: "part-1",
    name: "Bosch Spark Plugs (Set of 4)",
    image: "https://images.unsplash.com/photo-1620393551612-a21e622f9c02?auto=format&fit=crop&q=80",
    price: 32.99,
    condition: "New",
    seller: {
      id: "seller-1",
      type: "Shop",
      name: "AutoZone"
    },
    compatibility: ["Toyota Camry 2018-2023", "Toyota Corolla 2017-2023", "Honda Accord 2018-2023"],
    description: "Bosch Platinum Spark Plugs deliver optimum fit and function for reliable starting, smooth acceleration, and efficient fuel consumption. Designed for long life and durability.",
    category: "Engine",
    inStock: 24
  },
  {
    id: "part-2",
    name: "K&N High-Flow Air Filter",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80",
    price: 54.99,
    condition: "New",
    seller: {
      id: "seller-2",
      type: "Shop",
      name: "Performance Auto Parts"
    },
    compatibility: ["Multiple vehicles - see description", "Ford F-150 2015-2023", "Chevrolet Silverado 2014-2023"],
    description: "K&N washable and reusable high-flow air filter designed to provide increased horsepower while offering excellent filtration. Million mile limited warranty.",
    category: "Air Intake",
    inStock: 15
  },
  {
    id: "part-3",
    name: "ACDelco Brake Pads (Front)",
    image: "https://images.unsplash.com/photo-1600893386168-dec9ee8e3963?auto=format&fit=crop&q=80",
    price: 69.95,
    condition: "New",
    seller: {
      id: "seller-1",
      type: "Shop",
      name: "AutoZone"
    },
    compatibility: ["Honda Civic 2016-2023", "Honda Accord 2018-2023", "Acura ILX 2017-2023"],
    description: "ACDelco Professional brake pads are premium aftermarket pads designed to effectively control noise and provide consistent braking in various conditions. Includes wear indicators and premium hardware.",
    category: "Brakes",
    inStock: 8
  },
  {
    id: "part-4",
    name: "Toyota OEM Headlight Assembly (Driver Side)",
    image: "https://images.unsplash.com/photo-1493883401828-5bfa70170e41?auto=format&fit=crop&q=80",
    price: 225.00,
    condition: "Used",
    seller: {
      id: "seller-3",
      type: "Individual",
      name: "CarPartsDude"
    },
    compatibility: ["Toyota Camry 2018-2020"],
    description: "OEM driver side headlight assembly for Toyota Camry. In excellent condition with no cracks or damage. Removed from a 2019 Camry with only 15,000 miles.",
    category: "Exterior",
    inStock: 1
  },
  {
    id: "part-5",
    name: "Michelin Defender All-Season Tire",
    image: "https://images.unsplash.com/photo-1572932759882-bb34c848d1b3?auto=format&fit=crop&q=80",
    price: 189.99,
    condition: "New",
    seller: {
      id: "seller-4",
      type: "Shop",
      name: "Tire Kingdom"
    },
    compatibility: ["Multiple vehicles - 205/55R16"],
    description: "Michelin Defender all-season tire combines Michelin's most advanced safety technologies and excellent tread life. Designed for passenger cars, minivans and small SUVs.",
    category: "Tires",
    inStock: 12
  },
  {
    id: "part-6",
    name: "Ford F-150 Side Mirror (2018, Passenger)",
    image: "https://images.unsplash.com/photo-1472712739516-7ad2b786e1f7?auto=format&fit=crop&q=80",
    price: 85.00,
    condition: "Used",
    seller: {
      id: "seller-5",
      type: "Individual",
      name: "TruckParts4Less"
    },
    compatibility: ["Ford F-150 2015-2020"],
    description: "Passenger side mirror from a 2018 Ford F-150 XLT. Power adjustable with blind spot monitoring. Minor scratches but fully functional. Removed when upgrading to tow mirrors.",
    category: "Exterior",
    inStock: 1
  },
  {
    id: "part-7",
    name: "Vision Alloy Wheels (16-inch)",
    image: "/lovable-uploads/582b3092-6ae7-430e-a7e8-05649df81216.png",
    price: 129.99,
    condition: "New",
    seller: {
      id: "seller-6",
      type: "Shop",
      name: "Wheel Specialists"
    },
    compatibility: ["Fiat 500 2017-2023", "Chevrolet Aveo 2016-2023", "Renault Clio 2018-2023"],
    description: "Premium black alloy wheels with chrome accents. These durable wheels feature a unique design that combines style with performance. Perfect for upgrading your vehicle's appearance without sacrificing quality.",
    category: "Wheels",
    inStock: 8
  },
  {
    id: "part-8",
    name: "Starter Motor for Compact Cars",
    image: "/lovable-uploads/d8738a95-6b14-4582-9735-8893a01a85e9.png",
    price: 89.50,
    condition: "New",
    seller: {
      id: "seller-1",
      type: "Shop",
      name: "AutoZone"
    },
    compatibility: ["Dacia Logan 2016-2023", "Fiat 500 2015-2022", "Lada Granta 2018-2023"],
    description: "High-quality replacement starter motor for compact cars. Provides reliable starting in all weather conditions. Direct fit replacement for multiple small car models with no modifications required.",
    category: "Electrical",
    inStock: 6
  },
  {
    id: "part-9",
    name: "Carburetor Assembly",
    image: "/lovable-uploads/f3431978-b2fa-4246-9bba-b4bdb80cfbff.png",
    price: 165.75,
    condition: "Refurbished",
    seller: {
      id: "seller-7",
      type: "Shop",
      name: "Classic Car Parts"
    },
    compatibility: ["Lada Granta 2015-2020", "Older Fiat models", "Classic Chevrolet models"],
    description: "Professionally refurbished carburetor assembly for classic and older economy cars. Each unit is thoroughly cleaned, inspected, and calibrated to ensure proper fuel delivery and optimal engine performance.",
    category: "Engine",
    inStock: 3
  }
];

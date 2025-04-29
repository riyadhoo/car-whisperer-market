
import { Car } from './types';

// Mock car data - simple car models
export const cars: Car[] = [
  {
    id: "car-1",
    make: "Fiat",
    model: "500",
    year: 2019,
    image: "https://images.unsplash.com/photo-1548545818-8aaa84dd1309?auto=format&fit=crop&q=80",
    rating: 4.2,
    reviewCount: 87,
    description: "The Fiat 500 is a compact city car known for its distinctive retro styling and nimble handling. It's perfect for urban driving with its small footprint and easy parkability.",
    features: [
      "7-inch touchscreen display",
      "Apple CarPlay and Android Auto compatibility",
      "Rear parking sensors",
      "Climate control",
      "Cruise control"
    ],
    specs: {
      engine: "1.2L 4-cylinder",
      transmission: "5-speed manual",
      fuelEconomy: "6.1L/100km combined",
      horsepower: 69,
      torque: "102 Nm",
    },
  },
  {
    id: "car-2",
    make: "Chevrolet",
    model: "Aveo",
    year: 2018,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80",
    rating: 4.0,
    reviewCount: 105,
    description: "The Chevrolet Aveo is an economical subcompact car that offers good fuel efficiency and a comfortable ride. It's a practical choice for budget-conscious drivers seeking reliability.",
    features: [
      "Basic infotainment system",
      "Air conditioning",
      "Power windows",
      "ABS braking system",
      "Front airbags"
    ],
    specs: {
      engine: "1.4L 4-cylinder",
      transmission: "5-speed manual",
      fuelEconomy: "7.2L/100km combined",
      horsepower: 98,
      torque: "130 Nm",
    },
  },
  {
    id: "car-3",
    make: "Dacia",
    model: "Logan",
    year: 2020,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80",
    rating: 3.8,
    reviewCount: 92,
    description: "The Dacia Logan is a no-frills, affordable family sedan that focuses on practicality and value. With its spacious interior and low running costs, it's ideal for budget-conscious families.",
    features: [
      "Media Nav Evolution system",
      "Manual air conditioning",
      "Electric front windows",
      "Bluetooth connectivity",
      "Rear parking sensors"
    ],
    specs: {
      engine: "1.0L 3-cylinder",
      transmission: "5-speed manual",
      fuelEconomy: "5.7L/100km combined",
      horsepower: 75,
      torque: "95 Nm",
    },
  },
  {
    id: "car-4",
    make: "Renault",
    model: "Clio",
    year: 2019,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 120,
    description: "The Renault Clio is a popular supermini known for its stylish design and comfortable ride. It offers good fuel economy and a pleasant cabin, making it a favorite choice in the small car segment.",
    features: [
      "7-inch touchscreen",
      "Climate control",
      "Cruise control",
      "Lane departure warning",
      "Autonomous emergency braking"
    ],
    specs: {
      engine: "1.0L turbo 3-cylinder",
      transmission: "6-speed manual",
      fuelEconomy: "5.2L/100km combined",
      horsepower: 100,
      torque: "160 Nm",
    },
  },
  {
    id: "car-5",
    make: "Lada",
    model: "Granta",
    year: 2020,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80",
    rating: 3.5,
    reviewCount: 68,
    description: "The Lada Granta is a budget-friendly compact car known for its affordability and simplicity. With its basic features and robust design, it's focused on providing reliable transportation at a low cost.",
    features: [
      "Basic audio system",
      "Manual windows",
      "Heating system",
      "Driver airbag",
      "Power steering"
    ],
    specs: {
      engine: "1.6L 4-cylinder",
      transmission: "5-speed manual",
      fuelEconomy: "6.8L/100km combined",
      horsepower: 87,
      torque: "140 Nm",
    },
  },
  {
    id: "car-6",
    make: "Škoda",
    model: "Fabia",
    year: 2019,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 97,
    description: "The Škoda Fabia is a practical small car known for its generous interior space and sensible design. It offers solid build quality and efficient engines, making it a rational choice in the supermini segment.",
    features: [
      "6.5-inch infotainment display",
      "Smartphone connectivity",
      "Air conditioning",
      "Rear parking sensors",
      "Front fog lights"
    ],
    specs: {
      engine: "1.0L 3-cylinder",
      transmission: "5-speed manual",
      fuelEconomy: "5.0L/100km combined",
      horsepower: 95,
      torque: "160 Nm",
    },
  },
];

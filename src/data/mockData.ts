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

// Mock car data - updated with simpler car models
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

// Mock car comments
export const carComments: CarComment[] = [
  {
    id: "comment-1",
    carId: "car-1",
    user: {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    date: "March 15, 2023",
    rating: 4.5,
    content: "I've had my Camry for 6 months now and I'm very impressed with the fuel economy and smooth ride. The interior is comfortable for long trips and the tech features are intuitive. My only complaint is that the base audio system is just okay.",
    likes: 24,
    dislikes: 2
  },
  {
    id: "comment-2",
    carId: "car-1",
    user: {
      name: "Sarah Johnson"
    },
    date: "February 3, 2023",
    rating: 5.0,
    content: "Best car I've ever owned! Incredibly reliable, great on gas, and plenty of room for my family. The safety features give me peace of mind when driving with my kids. Highly recommend the Camry to anyone looking for a sensible, quality sedan.",
    likes: 36,
    dislikes: 0
  },
  {
    id: "comment-3",
    carId: "car-2",
    user: {
      name: "Mike Anderson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    date: "April 7, 2023",
    rating: 4.8,
    content: "The new Civic has really grown up! Feels much more premium than previous generations. The handling is sporty and fun, and I'm averaging about 38 MPG in mixed driving. The tech features are great, especially the wireless CarPlay.",
    likes: 18,
    dislikes: 1
  },
  {
    id: "comment-4",
    carId: "car-3",
    user: {
      name: "Robert Chen"
    },
    date: "January 22, 2023",
    rating: 4.0,
    content: "I use my F-150 for work and it hasn't let me down yet. The Pro Power Onboard system is a game changer for my job site. Towing capacity is excellent. My only issue is the fuel economy could be better, but that's expected with a truck this capable.",
    likes: 29,
    dislikes: 3
  }
];

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
  }
];

// Function to get comments for a specific car
export const getCommentsForCar = (carId: string): Comment[] => {
  return carComments.filter(comment => comment.carId === carId);
};


export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
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

// Mock car data
export const cars: Car[] = [
  {
    id: "car-1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 128,
    price: 28999,
    description: "The Toyota Camry has been America's best-selling sedan for many years, and for good reason. With a comfortable interior, solid performance, and excellent reliability, the Camry provides a well-rounded package for everyday drivers.",
    features: [
      "Apple CarPlay and Android Auto integration",
      "Toyota Safety Sense 2.5+",
      "8-inch touchscreen infotainment system",
      "Dual-zone automatic climate control",
      "LED headlights"
    ],
    specs: {
      engine: "2.5L 4-cylinder",
      transmission: "8-speed automatic",
      fuelEconomy: "28 city / 39 highway",
      horsepower: 203,
      torque: "184 lb-ft",
    },
  },
  {
    id: "car-2",
    make: "Honda",
    model: "Civic",
    year: 2023,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 156,
    price: 24799,
    description: "The Honda Civic is a compact car with a sporty attitude. Known for its fuel efficiency, reliability, and engaging driving dynamics, the Civic has been a favorite among buyers for decades.",
    features: [
      "Honda Sensing safety suite",
      "9-inch touchscreen with wireless Apple CarPlay and Android Auto",
      "Digital instrument cluster",
      "Wireless smartphone charging pad",
      "Multi-angle rearview camera"
    ],
    specs: {
      engine: "2.0L 4-cylinder",
      transmission: "CVT automatic",
      fuelEconomy: "31 city / 40 highway",
      horsepower: 158,
      torque: "138 lb-ft",
    },
  },
  {
    id: "car-3",
    make: "Ford",
    model: "F-150",
    year: 2023,
    image: "https://images.unsplash.com/photo-1605893477799-b99e5a7394e5?auto=format&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 203,
    price: 35999,
    description: "The Ford F-150 is America's best-selling vehicle, known for its powerful engines, advanced technology, and impressive capability. Whether you need it for work or play, the F-150 delivers.",
    features: [
      "Pro Power Onboard generator system",
      "SYNC 4 infotainment with 12-inch touchscreen",
      "Trailer Reverse Guidance system",
      "360-degree camera system",
      "Adjustable bed tie-down cleats"
    ],
    specs: {
      engine: "3.5L EcoBoost V6",
      transmission: "10-speed automatic",
      fuelEconomy: "20 city / 24 highway",
      horsepower: 400,
      torque: "500 lb-ft",
    },
  },
  {
    id: "car-4",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    image: "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 187,
    price: 42990,
    description: "The Tesla Model 3 is an all-electric sedan that combines cutting-edge technology with impressive performance. With its minimalistic interior, autopilot capabilities, and long driving range, the Model 3 represents the future of driving.",
    features: [
      "15-inch central touchscreen",
      "Autopilot driver assistance",
      "Glass roof",
      "Vegan leather interior",
      "Over-the-air software updates"
    ],
    specs: {
      engine: "Electric motor",
      transmission: "Single-speed",
      fuelEconomy: "138 MPGe combined",
      horsepower: 283,
      torque: "330 lb-ft",
    },
  },
  {
    id: "car-5",
    make: "BMW",
    model: "3 Series",
    year: 2023,
    image: "https://images.unsplash.com/photo-1661510019906-1e8bd001558e?auto=format&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 94,
    price: 45999,
    description: "The BMW 3 Series is the benchmark for luxury sport sedans, offering a perfect balance of performance, comfort, and technology. With its dynamic handling and upscale interior, the 3 Series continues to set the standard in its class.",
    features: [
      "10.25-inch infotainment display",
      "12.3-inch digital instrument cluster",
      "Ambient interior lighting",
      "Harman Kardon premium audio system",
      "BMW Intelligent Personal Assistant"
    ],
    specs: {
      engine: "2.0L turbocharged 4-cylinder",
      transmission: "8-speed automatic",
      fuelEconomy: "26 city / 36 highway",
      horsepower: 255,
      torque: "295 lb-ft",
    },
  },
  {
    id: "car-6",
    make: "Jeep",
    model: "Wrangler",
    year: 2023,
    image: "https://images.unsplash.com/photo-1619726578880-2b6bf9edab34?auto=format&fit=crop&q=80",
    rating: 4.2,
    reviewCount: 118,
    price: 33995,
    description: "The iconic Jeep Wrangler is the ultimate off-road vehicle, built to conquer any terrain. With its removable top and doors, rugged 4x4 capability, and retro styling, the Wrangler offers an open-air adventure unlike any other SUV on the market.",
    features: [
      "Removable doors and roof panels",
      "Uconnect 4C infotainment system",
      "Off-road camera system",
      "Heavy-duty suspension",
      "Water fording capability"
    ],
    specs: {
      engine: "3.6L Pentastar V6",
      transmission: "8-speed automatic",
      fuelEconomy: "17 city / 25 highway",
      horsepower: 285,
      torque: "260 lb-ft",
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

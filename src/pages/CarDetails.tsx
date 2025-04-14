
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import CommentSection from '@/components/CommentSection';
import { cars, getCommentsForCar, Comment } from '@/data/mockData';
import { 
  CalendarDays,
  Car as CarIcon, 
  Gauge, 
  MessageSquare,
  Share2,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState(cars.find(c => c.id === id));
  const [comments, setComments] = useState<Comment[]>([]);
  
  useEffect(() => {
    if (id) {
      const carData = cars.find(c => c.id === id);
      setCar(carData);
      
      if (carData) {
        const carComments = getCommentsForCar(carData.id);
        setComments(carComments);
      }
    }
  }, [id]);
  
  const handleAddComment = (rating: number, content: string) => {
    if (!car) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        name: "You", // In a real app, this would be the logged-in user
      },
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      rating,
      content,
      likes: 0,
      dislikes: 0
    };
    
    setComments(prev => [newComment, ...prev]);
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your experience!",
    });
  };
  
  if (!car) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
            <p className="text-muted-foreground mb-6">The car you're looking for doesn't exist.</p>
            <Link to="/cars">
              <Button>Browse All Cars</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Car Hero */}
        <section className="bg-carTheme-navy text-white py-6">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Link to="/cars" className="text-carTheme-silver hover:text-white mr-2">
                    Cars
                  </Link>
                  <span>&gt;</span>
                  <span className="ml-2">{car.make} {car.model}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mt-2">{car.year} {car.make} {car.model}</h1>
              </div>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </section>
        
        {/* Car Details */}
        <section className="py-8 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Car Images and Quick Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={`${car.year} ${car.make} ${car.model}`} 
                    className="w-full h-[400px] object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-center mb-6">
                      <div className="mb-3 lg:mb-0">
                        <StarRating rating={car.rating} size={24} />
                        <span className="text-sm text-muted-foreground ml-2">
                          Based on {car.reviewCount} reviews
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-carTheme-navy">
                        ${car.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      {car.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 bg-carTheme-lightGray rounded-lg">
                        <CarIcon className="h-8 w-8 text-carTheme-red mb-2" />
                        <span className="text-sm text-center">{car.make}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-carTheme-lightGray rounded-lg">
                        <CalendarDays className="h-8 w-8 text-carTheme-red mb-2" />
                        <span className="text-sm text-center">{car.year}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-carTheme-lightGray rounded-lg">
                        <Gauge className="h-8 w-8 text-carTheme-red mb-2" />
                        <span className="text-sm text-center">{car.specs.engine}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-carTheme-lightGray rounded-lg">
                        <Zap className="h-8 w-8 text-carTheme-red mb-2" />
                        <span className="text-sm text-center">{car.specs.horsepower} hp</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Info Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Tabs defaultValue="specs">
                    <TabsList className="mb-4">
                      <TabsTrigger value="specs">Specifications</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                    </TabsList>
                    <TabsContent value="specs" className="space-y-4">
                      <h3 className="text-xl font-bold mb-3">Technical Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Engine</span>
                          <span>{car.specs.engine}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Transmission</span>
                          <span>{car.specs.transmission}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Horsepower</span>
                          <span>{car.specs.horsepower} hp</span>
                        </div>
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Torque</span>
                          <span>{car.specs.torque}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Fuel Economy</span>
                          <span>{car.specs.fuelEconomy}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                          <span className="font-medium">Year</span>
                          <span>{car.year}</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="features" className="space-y-4">
                      <h3 className="text-xl font-bold mb-3">Key Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {car.features.map((feature, index) => (
                          <li key={index} className="flex items-start p-2">
                            <div className="h-5 w-5 bg-carTheme-red rounded-full flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <MessageSquare className="h-5 w-5 text-carTheme-red mr-2" />
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  </div>
                  
                  <CommentSection 
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Car Summary Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall Rating</span>
                      <StarRating rating={car.rating} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold">${car.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reviews</span>
                      <span>{car.reviewCount} reviews</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engine</span>
                      <span>{car.specs.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MPG</span>
                      <span>{car.specs.fuelEconomy}</span>
                    </div>
                  </div>
                </div>
                
                {/* Similar Cars */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Similar Cars</h3>
                  <div className="space-y-4">
                    {cars
                      .filter(c => c.id !== car.id)
                      .slice(0, 3)
                      .map(similarCar => (
                        <Link key={similarCar.id} to={`/cars/${similarCar.id}`}>
                          <div className="flex items-center space-x-3 p-2 hover:bg-carTheme-lightGray rounded transition-colors">
                            <img 
                              src={similarCar.image} 
                              alt={similarCar.model} 
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{similarCar.year} {similarCar.make} {similarCar.model}</h4>
                              <StarRating rating={similarCar.rating} size={14} />
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
                
                {/* Related Parts (teaser for the parts marketplace) */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Find Parts for This Car</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse our marketplace for parts compatible with {car.year} {car.make} {car.model}.
                  </p>
                  <Link to="/parts">
                    <Button className="w-full bg-carTheme-red hover:bg-carTheme-red/80">
                      Browse Compatible Parts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetails;

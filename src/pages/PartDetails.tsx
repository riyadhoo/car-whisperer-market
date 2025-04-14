
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { parts } from '@/data/mockData';
import { 
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus, 
  Share2,
  ShoppingCart,
  Store, 
  Truck,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const PartDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState(parts.find(p => p.id === id));
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (id) {
      const partData = parts.find(p => p.id === id);
      setPart(partData);
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (part) {
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${part.name} added to your cart`,
      });
    }
  };
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-amber-100 text-amber-800';
      case 'Refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!part) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Part Not Found</h1>
            <p className="text-muted-foreground mb-6">The part you're looking for doesn't exist.</p>
            <Link to="/parts">
              <Button>Browse All Parts</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Similar parts (simplified implementation)
  const similarParts = parts
    .filter(p => p.id !== part.id && p.category === part.category)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <section className="bg-white py-4 border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center text-sm">
              <Link to="/parts" className="text-muted-foreground hover:text-carTheme-navy">
                Parts
              </Link>
              <span className="mx-2">›</span>
              <Link to={`/parts?category=${part.category}`} className="text-muted-foreground hover:text-carTheme-navy">
                {part.category}
              </Link>
              <span className="mx-2">›</span>
              <span className="text-carTheme-navy">{part.name}</span>
            </div>
          </div>
        </section>
        
        {/* Part Details */}
        <section className="py-8 bg-carTheme-lightGray">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Part Image */}
                <div className="relative">
                  <div className={`aspect-square bg-white rounded-lg overflow-hidden ${!imageLoaded ? 'bg-gray-100 animate-pulse' : ''}`}>
                    <img 
                      src={part.image} 
                      alt={part.name} 
                      className="w-full h-full object-contain"
                      onLoad={() => setImageLoaded(true)}
                    />
                    <Badge className={`absolute top-4 right-4 ${getConditionColor(part.condition)}`}>
                      {part.condition}
                    </Badge>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Part Info */}
                <div className="space-y-6">
                  <h1 className="text-2xl md:text-3xl font-bold">{part.name}</h1>
                  
                  <div className="flex items-center">
                    {part.seller.type === 'Shop' ? (
                      <Store className="h-5 w-5 text-carTheme-navy mr-2" />
                    ) : (
                      <User className="h-5 w-5 text-carTheme-navy mr-2" />
                    )}
                    <span className="text-muted-foreground">
                      Sold by {part.seller.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-carTheme-navy">
                      ${part.price.toFixed(2)}
                    </span>
                    {part.condition === 'New' && (
                      <Badge className="ml-3 bg-green-100 text-green-800">New</Badge>
                    )}
                  </div>
                  
                  <div className="border-t border-b py-4 my-4">
                    <p className="text-gray-700">
                      {part.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      {part.inStock > 0 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">
                            In Stock ({part.inStock} available)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-amber-700 font-medium">Out of Stock</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-carTheme-navy mr-2" />
                      <span className="text-muted-foreground">
                        Free shipping on orders over $75
                      </span>
                    </div>
                  </div>
                  
                  {part.inStock > 0 && (
                    <div className="flex space-x-4 items-center">
                      <div className="flex border rounded-md">
                        <Button 
                          variant="ghost" 
                          className="p-0 w-10 h-10"
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center justify-center w-10 h-10">
                          {quantity}
                        </div>
                        <Button 
                          variant="ghost" 
                          className="p-0 w-10 h-10"
                          onClick={() => quantity < part.inStock && setQuantity(quantity + 1)}
                          disabled={quantity >= part.inStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        className="bg-carTheme-red hover:bg-carTheme-red/80 flex-1"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="border-t">
                <Tabs defaultValue="compatibility" className="p-6">
                  <TabsList>
                    <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                  </TabsList>
                  <TabsContent value="compatibility" className="mt-4 space-y-4">
                    <h3 className="font-bold text-lg">Compatible Vehicles</h3>
                    <div className="bg-carTheme-lightGray rounded-lg p-4">
                      <ul className="space-y-2">
                        {part.compatibility.map((vehicle, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>{vehicle}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm text-muted-foreground">
                        For a complete list of compatible vehicles, please refer to the manufacturer's documentation.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-4 space-y-4">
                    <h3 className="font-bold text-lg">Part Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                        <span className="font-medium">Condition</span>
                        <span>{part.condition}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                        <span className="font-medium">Category</span>
                        <span>{part.category}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                        <span className="font-medium">Brand</span>
                        <span>{part.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-carTheme-lightGray rounded">
                        <span className="font-medium">Seller Type</span>
                        <span>{part.seller.type}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="shipping" className="mt-4 space-y-4">
                    <h3 className="font-bold text-lg">Shipping Information</h3>
                    <div className="space-y-4">
                      <div className="bg-carTheme-lightGray rounded-lg p-4">
                        <h4 className="font-medium mb-2">Shipping Options</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Standard Shipping (3-5 business days)</span>
                            <span className="font-medium">$5.99</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Express Shipping (1-2 business days)</span>
                            <span className="font-medium">$12.99</span>
                          </li>
                          <li className="flex justify-between text-green-700">
                            <span>Free Shipping on orders over $75</span>
                            <span className="font-medium">$0.00</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-carTheme-lightGray rounded-lg p-4">
                        <h4 className="font-medium mb-2">Return Policy</h4>
                        <p>
                          Returns accepted within 30 days of delivery for new and unused items. 
                          Used or installed parts cannot be returned unless defective.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Similar Parts Recommendations */}
            {similarParts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Similar Parts</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {similarParts.map(similarPart => (
                    <Link key={similarPart.id} to={`/parts/${similarPart.id}`} className="block">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={similarPart.image} 
                            alt={similarPart.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg line-clamp-2">{similarPart.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-carTheme-navy">
                              ${similarPart.price.toFixed(2)}
                            </span>
                            <Badge className={getConditionColor(similarPart.condition)}>
                              {similarPart.condition}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartDetails;

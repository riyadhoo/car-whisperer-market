
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PartCardProps {
  part: {
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
  };
}

const PartCard = ({ part }: PartCardProps) => {
  const { formatPrice, language, direction } = useSettings();
  const { t } = useTranslation(language);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-amber-100 text-amber-800';
      case 'Refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }
    
    // Add to cart functionality here
    toast({
      title: "Added to Cart",
      description: `${part.name} has been added to your cart.`
    });
  };

  return (
    <Card className="car-part-card h-full flex flex-col" dir={direction}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={part.image} 
          alt={part.name} 
          className="object-cover w-full h-full"
        />
        <Badge className={`absolute top-2 ${direction === 'rtl' ? 'left-2' : 'right-2'} ${getConditionColor(part.condition)}`}>
          {part.condition}
        </Badge>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1">{part.name}</h3>
        
        <div className="flex items-center mt-2">
          {part.seller.type === 'Shop' ? (
            <Store className="h-4 w-4 text-carTheme-navy mr-1" />
          ) : (
            <User className="h-4 w-4 text-carTheme-navy mr-1" />
          )}
          <Link to={`/profile/${part.seller.id}`} className="text-sm text-muted-foreground hover:text-carTheme-navy hover:underline">
            {part.seller.name}
          </Link>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          <span>{t('fits')} </span>
          {part.compatibility.slice(0, 2).join(', ')}
          {part.compatibility.length > 2 && '...'}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <span className="font-bold text-lg text-carTheme-navy">
            {formatPrice(part.price)}
          </span>
          <div className="flex space-x-2">
            <Link to={`/parts/${part.id}`}>
              <Button variant="outline" size="sm">
                {t('details')}
              </Button>
            </Link>
            <Button 
              className="bg-carTheme-red hover:bg-carTheme-red/80" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {t('add')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartCard;

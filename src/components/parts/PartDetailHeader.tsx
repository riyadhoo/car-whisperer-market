
import { Link } from "react-router-dom";
import { Star, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/components/parts/utils/partDataFormat";

interface PartDetailHeaderProps {
  part: {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    compatible_cars: string[];
    image_url: string;
    created_at: string;
    seller: {
      id: string;
      username: string;
      avatar_url: string;
      phone_number: string | null;
    };
  };
  averageRating: number;
  ratingsCount: number;
}

export function PartDetailHeader({ part, averageRating, ratingsCount }: PartDetailHeaderProps) {
  const sellerAvatarUrl = getAvatarUrl(part?.seller?.avatar_url);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/parts" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to parts
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Image */}
        <div className="rounded-lg overflow-hidden border bg-card">
          {part?.image_url ? (
            <img 
              src={part.image_url} 
              alt={part.title} 
              className="w-full h-auto object-cover aspect-video"
            />
          ) : (
            <div className="w-full h-64 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>

        {/* Right column - Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{part?.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= Math.round(averageRating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({ratingsCount} {ratingsCount === 1 ? "review" : "reviews"})
            </span>
          </div>
          
          <div className="text-2xl font-bold mb-4">${part?.price?.toFixed(2)}</div>
          
          {part?.condition && <Badge className="mb-4">{part.condition}</Badge>}
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{part?.description || "No description provided."}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Compatible with</h3>
            <div className="flex flex-wrap gap-2">
              {part?.compatible_cars && part.compatible_cars.length > 0 ? (
                part.compatible_cars.map((car, index) => (
                  <Badge key={index} variant="outline">{car}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Compatibility information not available</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Seller</h3>
            <div className="flex items-center">
              <Link to={`/profile/${part.seller.id}`} className="w-10 h-10 rounded-full bg-muted overflow-hidden mr-3 hover:opacity-80 transition-opacity">
                {sellerAvatarUrl ? (
                  <img
                    src={sellerAvatarUrl}
                    alt={part.seller.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    {part?.seller?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </Link>
              <div>
                <Link to={`/profile/${part.seller.id}`} className="font-medium hover:underline">
                  {part?.seller?.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Listed on {part && new Date(part.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact seller section with phone number and message option */}
          <div className="space-y-3">
            <Button className="w-full flex items-center justify-center gap-2" asChild>
              <Link to={`/messages?user=${part?.seller?.id}`}>
                <MessageCircle size={16} />
                Message Seller
              </Link>
            </Button>
            
            {part?.seller?.phone_number ? (
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
                <a href={`tel:${part.seller.phone_number}`}>
                  <Phone size={16} />
                  Call: {part.seller.phone_number}
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                No phone number available
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

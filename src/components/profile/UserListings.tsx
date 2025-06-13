
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  created_at: string;
}

interface UserListingsProps {
  listings: PartListing[];
}

export function UserListings({ listings }: UserListingsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listings ({listings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/parts/${listing.id}`)}>
                <div className="aspect-video relative overflow-hidden">
                  {listing.image_url ? (
                    <img 
                      src={listing.image_url} 
                      alt={listing.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{listing.condition}</Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{listing.title}</h3>
                  <p className="text-2xl font-bold mb-2">${listing.price.toFixed(2)}</p>
                  <div className="text-xs text-muted-foreground">
                    Listed on {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No listings found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

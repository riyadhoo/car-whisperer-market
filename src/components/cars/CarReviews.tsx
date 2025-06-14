
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "@/components/parts/utils/partDataFormat";
import { CarReviewProps } from "@/types/car";

interface CarReviewsProps {
  reviews?: CarReviewProps[];
}

export function CarReviews({ reviews = [] }: CarReviewsProps) {
  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">out of 5</span>
              <span className="text-muted-foreground ml-2">({reviews.length} reviews)</span>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${review.user_id}`} className="hover:opacity-80 transition-opacity">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={review.user.avatar_url ? getAvatarUrl(review.user.avatar_url) as string : undefined} 
                          alt={review.user.username} 
                        />
                        <AvatarFallback>{review.user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link to={`/profile/${review.user_id}`} className="font-medium hover:underline">
                        {review.user.username}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Badge>{review.rating} / 5</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No reviews yet</p>
            <Button>Add the First Review</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

interface ReviewsListProps {
  ratings: Rating[];
}

export function ReviewsList({ ratings }: ReviewsListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this part!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden mr-3">
                  {rating.user.avatar_url ? (
                    <img
                      src={rating.user.avatar_url}
                      alt={rating.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      {rating.user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{rating.user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= rating.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            
            {rating.comment && <p className="text-muted-foreground">{rating.comment}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, User, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { UserRatingForm } from "@/components/profile/UserRatingForm";
import { UserRatingDisplay } from "@/components/profile/UserRatingDisplay";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
}

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  created_at: string;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<PartListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!userId) {
      navigate("/");
      return;
    }

    fetchUserProfile();
    fetchUserRating();
    fetchUserStats();
  }, [userId, isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile"
        });
        return;
      }

      setProfile(profileData);

      // Get avatar URL if exists
      if (profileData.avatar_url) {
        try {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(profileData.avatar_url);
          
          if (publicUrlData) {
            setAvatarUrl(publicUrlData.publicUrl);
          }
        } catch (err) {
          console.error("Error getting avatar URL:", err);
        }
      }

      // Fetch user's approved listings
      const { data: listingsData, error: listingsError } = await supabase
        .from("parts")
        .select("id, title, price, condition, image_url, created_at")
        .eq("seller_id", userId)
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });

      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
      } else {
        // Convert image URLs to public URLs
        const enhancedListings = listingsData?.map(listing => {
          let publicImageUrl = listing.image_url;
          
          if (listing.image_url && !listing.image_url.startsWith('http')) {
            try {
              const { data: urlData } = supabase.storage
                .from("parts")
                .getPublicUrl(listing.image_url);
                
              if (urlData) {
                publicImageUrl = urlData.publicUrl;
              }
            } catch (err) {
              console.error(`Error getting URL for image ${listing.image_url}:`, err);
            }
          }
          
          return {
            ...listing,
            image_url: publicImageUrl
          };
        }) || [];

        setListings(enhancedListings);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRating = async () => {
    if (!user?.id || !userId || user.id === userId) return;

    try {
      const { data, error } = await supabase
        .from("user_ratings")
        .select("id, rating, comment")
        .eq("rated_user_id", userId)
        .eq("rater_user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user rating:", error);
        return;
      }

      setExistingRating(data);
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("user_rating_stats")
        .select("*")
        .eq("rated_user_id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user stats:", error);
        return;
      }

      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleRatingSubmitted = () => {
    setShowRatingForm(false);
    fetchUserRating();
    fetchUserStats();
  };

  const handleSendMessage = () => {
    if (!userId) return;
    navigate(`/messages?user=${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl py-10 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              Go back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Don't show message button if viewing own profile
  const isOwnProfile = user?.id === userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10 pt-24">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
                <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                  {profile.username ? profile.username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">
                    {profile.username || "Anonymous User"}
                  </CardTitle>
                  {userStats && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {userStats.average_rating}/5
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({userStats.total_ratings} {userStats.total_ratings === 1 ? 'rating' : 'ratings'})
                      </span>
                    </div>
                  )}
                </div>
                
                {profile.bio && (
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                  
                  {profile.phone_number && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      {profile.phone_number}
                    </div>
                  )}
                </div>
                
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      Send Message
                    </Button>
                    
                    <Button 
                      onClick={() => setShowRatingForm(!showRatingForm)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Star size={16} />
                      {existingRating ? "Update Rating" : "Rate User"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {!isOwnProfile && showRatingForm && (
          <div className="mb-8">
            <UserRatingForm
              ratedUserId={userId!}
              onRatingSubmitted={handleRatingSubmitted}
              existingRating={existingRating}
            />
          </div>
        )}

        <div className="mb-8">
          <UserRatingDisplay userId={userId!} />
        </div>

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
      </div>
    </div>
  );
}

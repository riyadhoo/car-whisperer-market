
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { UserRatingForm } from "@/components/profile/UserRatingForm";
import { UserRatingDisplay } from "@/components/profile/UserRatingDisplay";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { UserListings } from "@/components/profile/UserListings";

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

  const handleToggleRatingForm = () => {
    setShowRatingForm(!showRatingForm);
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
            <ProfileActions 
              isOwnProfile={false}
              existingRating={null}
              onSendMessage={() => navigate("/")}
              onToggleRatingForm={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10 pt-24">
        <Card className="mb-8">
          <ProfileHeader 
            profile={profile}
            avatarUrl={avatarUrl}
            userStats={userStats}
          />
          <CardContent className="pt-0">
            <ProfileActions
              isOwnProfile={isOwnProfile}
              existingRating={existingRating}
              onSendMessage={handleSendMessage}
              onToggleRatingForm={handleToggleRatingForm}
            />
          </CardContent>
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

        <UserListings listings={listings} />
      </div>
    </div>
  );
}

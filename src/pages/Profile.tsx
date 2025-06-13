
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { UserListings } from "@/components/profile/UserListings";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  approval_status: string;
  created_at: string;
  image_url: string | null;
  description: string | null;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<PartListing[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch user listings
  useEffect(() => {
    async function fetchListings() {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user listings with approval status (all statuses for user's own view)
        const { data: listingsData, error: listingsError } = await supabase
          .from("parts")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });
          
        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          return;
        }
        
        if (listingsData) {
          // Convert image_url paths to public URLs
          const enhancedListings = listingsData.map(listing => {
            let publicImageUrl = listing.image_url;
            
            // If the image_url exists and appears to be a storage path rather than full URL
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
          });
          
          setListings(enhancedListings);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (user?.id) {
      fetchListings();
    }
  }, [user]);

  // Show loading state while checking authentication or loading profile
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10 pt-24">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="listings" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              My Listings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileInfo />
          </TabsContent>
          
          <TabsContent value="listings">
            <UserListings listings={listings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

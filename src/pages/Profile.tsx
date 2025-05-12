
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { users } from '@/data/mockUsers';
import { parts } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar, 
  Star, 
  Package,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PartCard from '@/components/PartCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // If there's a specific ID, fetch that profile
        if (id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setProfile({
              id: data.id,
              name: data.name,
              email: data.email,
              avatar: data.avatar_url,
              type: data.is_dealer ? 'Shop' : 'Individual',
              bio: data.bio,
              location: data.location,
              website: data.website,
              phone: data.phone,
              joinDate: data.join_date,
              ratingsGiven: data.ratings_given || 0,
              partsListed: data.parts_listed || 0
            });
          }
        } 
        // If no ID but we have a currentUser, use that
        else if (currentUser) {
          setProfile(currentUser);
        }
        // Fallback to mock data if neither is available (temporary)
        else if (!authLoading) {
          setProfile(users[0]);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data."
        });
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when auth is no longer loading
    if (!authLoading) {
      fetchProfile();
    }
  }, [id, currentUser, authLoading, toast]);
  
  // Get parts listed by this user
  const userParts = parts.filter(part => part.seller.id === profile?.id);
  
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Show loading state while auth is initializing or profile is loading
  if (authLoading || (loading && !profile)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Show not found state if profile doesn't exist
  if (!loading && !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow bg-carTheme-lightGray py-8">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-carTheme-navy to-carTheme-navy/70"></div>
              <div className="absolute -bottom-16 left-8">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-carTheme-navy text-white text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="pt-20 pb-6 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-2xl font-bold mr-3">{profile.name}</h1>
                    <Badge variant="outline" className="font-normal">
                      {profile.type === 'Shop' ? (
                        <><Store className="h-3 w-3 mr-1" /> Shop</>
                      ) : (
                        <><User className="h-3 w-3 mr-1" /> Individual</>
                      )}
                    </Badge>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground max-w-2xl mb-4">{profile.bio}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                    {profile.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                    
                    {profile.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center text-muted-foreground">
                        <Globe className="h-4 w-4 mr-2" />
                        <a href={`https://${profile.website}`} target="_blank" rel="noopener" 
                           className="text-carTheme-navy hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {(!id || (currentUser && id === currentUser.id)) && (
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-start space-x-12 mt-6">
                <div className="flex items-center text-muted-foreground">
                  <Star className="h-5 w-5 mr-2 text-amber-500" />
                  <span><b>{profile.ratingsGiven}</b> Ratings Given</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-5 w-5 mr-2 text-carTheme-navy" />
                  <span><b>{profile.partsListed}</b> Parts Listed</span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="parts" className="px-8 pb-8">
              <TabsList>
                <TabsTrigger value="parts">Listed Parts</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parts" className="mt-6">
                {userParts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userParts.map(part => (
                      <PartCard key={part.id} part={part} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No Parts Listed Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {(!id || (currentUser && id === currentUser.id)) ? 
                        "You haven't listed any parts for sale yet." :
                        "This user hasn't listed any parts for sale yet."}
                    </p>
                    {(!id || (currentUser && id === currentUser.id)) && (
                      <Button className="bg-carTheme-red hover:bg-carTheme-red/80" onClick={() => navigate('/sell-parts')}>
                        List Your First Part
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ratings" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Rating History</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature is coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;

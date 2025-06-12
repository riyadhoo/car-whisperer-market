
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

interface ProfileData {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
}

export function ProfileInfo() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    bio: "",
    avatar_url: null,
    phone_number: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Check if profile exists
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data"
          });
          return;
        }
        
        // If profile doesn't exist, create one
        if (!data) {
          console.log("Profile not found, creating one...");
          const { error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              username: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (createError) {
            console.error("Failed to create profile:", createError);
            toast({
              title: "Error",
              description: "Failed to create profile"
            });
            return;
          }
          
          // Set default values
          setProfileData({
            username: "",
            bio: "",
            avatar_url: null,
            phone_number: null
          });
        } else {
          // Set profile data
          setProfileData({
            username: data.username || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url,
            phone_number: data.phone_number || ""
          });
          
          // Set avatar preview if exists
          if (data.avatar_url) {
            try {
              const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(data.avatar_url);
                
              if (publicUrlData) {
                setAvatarPreview(publicUrlData.publicUrl);
              }
            } catch (err) {
              console.error("Error getting avatar URL:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if a new one is selected
      let avatarPath = profileData.avatar_url;
      
      if (avatarFile) {
        const fileName = `${user.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
          });
          
        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }
        
        if (uploadData) {
          avatarPath = fileName;
        }
      }
      
      // Update profile data including phone number
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: profileData.username,
          bio: profileData.bio,
          avatar_url: avatarPath,
          phone_number: profileData.phone_number,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        console.error("Profile update error:", error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading profile...</div>;
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={avatarPreview || undefined} alt="Profile picture" />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {profileData.username ? profileData.username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              id="avatar"
              accept="image/*" 
              onChange={handleFileChange}
              className="w-56 bg-background border-input"
            />
          </div>
        </div>
      
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={profileData.username || ""}
              onChange={handleChange}
              placeholder="Choose a username"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone size={16} />
              Phone Number
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={profileData.phone_number || ""}
              onChange={handleChange}
              placeholder="Add your phone number"
              type="tel"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Your phone number will be visible to users interested in your listings
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={profileData.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted border-input text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}

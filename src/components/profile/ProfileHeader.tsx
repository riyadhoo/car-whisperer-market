
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone } from "lucide-react";
import { ProfileStats } from "./ProfileStats";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
}

interface UserStats {
  total_ratings: number;
  average_rating: number;
}

interface ProfileHeaderProps {
  profile: UserProfile;
  avatarUrl: string | null;
  userStats: UserStats | null;
}

export function ProfileHeader({ profile, avatarUrl, userStats }: ProfileHeaderProps) {
  return (
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
            <ProfileStats userStats={userStats} />
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
        </div>
      </div>
    </CardHeader>
  );
}

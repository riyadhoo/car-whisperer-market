
import { UserProfile } from './types';

export const users: UserProfile[] = [
  {
    id: "user-1",
    name: "AutoZone Shop",
    email: "contact@autozone.com",
    avatar: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?auto=format&fit=crop&q=80",
    type: "Shop",
    bio: "Official AutoZone store. We provide quality auto parts and accessories for all vehicle makes and models.",
    location: "Multiple locations nationwide",
    website: "www.autozone.com",
    phone: "555-123-4567",
    joinDate: "2021-03-15",
    ratingsGiven: 52,
    partsListed: 327
  },
  {
    id: "user-2",
    name: "Performance Auto Parts",
    email: "sales@performanceauto.com",
    avatar: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80",
    type: "Shop",
    bio: "Specializing in high-performance parts for sport and racing applications.",
    location: "Los Angeles, CA",
    website: "www.performanceauto.com",
    phone: "555-987-6543",
    joinDate: "2022-01-10",
    ratingsGiven: 31,
    partsListed: 145
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80",
    type: "Individual",
    bio: "Car enthusiast and part-time mechanic. I sell quality used parts from my personal collection.",
    location: "Austin, TX",
    joinDate: "2022-04-22",
    ratingsGiven: 14,
    partsListed: 26
  },
  {
    id: "user-4",
    name: "Classic Car Parts",
    email: "info@classiccarparts.com",
    avatar: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=80",
    type: "Shop",
    bio: "Specializing in hard-to-find parts for classic and vintage vehicles from the 1950s-1990s.",
    location: "Detroit, MI",
    website: "www.classiccarparts.com",
    phone: "555-432-1098",
    joinDate: "2021-08-05",
    ratingsGiven: 27,
    partsListed: 89
  }
];

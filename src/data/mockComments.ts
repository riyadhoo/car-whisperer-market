
import { CarComment } from './types';

// Mock car comments
export const carComments: CarComment[] = [
  {
    id: "comment-1",
    carId: "car-1",
    user: {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    date: "March 15, 2023",
    rating: 4.5,
    content: "I've had my Camry for 6 months now and I'm very impressed with the fuel economy and smooth ride. The interior is comfortable for long trips and the tech features are intuitive. My only complaint is that the base audio system is just okay.",
    likes: 24,
    dislikes: 2
  },
  {
    id: "comment-2",
    carId: "car-1",
    user: {
      name: "Sarah Johnson"
    },
    date: "February 3, 2023",
    rating: 5.0,
    content: "Best car I've ever owned! Incredibly reliable, great on gas, and plenty of room for my family. The safety features give me peace of mind when driving with my kids. Highly recommend the Camry to anyone looking for a sensible, quality sedan.",
    likes: 36,
    dislikes: 0
  },
  {
    id: "comment-3",
    carId: "car-2",
    user: {
      name: "Mike Anderson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    date: "April 7, 2023",
    rating: 4.8,
    content: "The new Civic has really grown up! Feels much more premium than previous generations. The handling is sporty and fun, and I'm averaging about 38 MPG in mixed driving. The tech features are great, especially the wireless CarPlay.",
    likes: 18,
    dislikes: 1
  },
  {
    id: "comment-4",
    carId: "car-3",
    user: {
      name: "Robert Chen"
    },
    date: "January 22, 2023",
    rating: 4.0,
    content: "I use my F-150 for work and it hasn't let me down yet. The Pro Power Onboard system is a game changer for my job site. Towing capacity is excellent. My only issue is the fuel economy could be better, but that's expected with a truck this capable.",
    likes: 29,
    dislikes: 3
  }
];

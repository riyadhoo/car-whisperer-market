
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from './StarRating';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  date: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment?: (rating: number, content: string) => void;
}

const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(userRating, newComment);
      setNewComment('');
      setShowForm(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews & Comments</h2>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-carTheme-navy hover:bg-carTheme-navy/80"
          >
            Write a Review
          </Button>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-3">Share Your Experience</h3>
          
          <div className="flex items-center mb-4">
            <span className="mr-2">Your Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setUserRating(rating)}
                  className={`p-1 ${userRating >= rating ? 'text-carTheme-red' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this car..."
            className="min-h-32 mb-4"
            required
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-carTheme-navy hover:bg-carTheme-navy/80"
            >
              Submit Review
            </Button>
          </div>
        </form>
      )}
      
      <div className="space-y-6 mt-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{comment.user.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{comment.date}</span>
                      <StarRating rating={comment.rating} size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-700">{comment.content}</p>
                
                <div className="flex items-center space-x-4 mt-4">
                  <button className="flex items-center text-sm text-muted-foreground hover:text-black">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center text-sm text-muted-foreground hover:text-black">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span>{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface UserListingsProps {
  listings: PartListing[];
  setListings: React.Dispatch<React.SetStateAction<PartListing[]>>;
}

export function UserListings({ listings, setListings }: UserListingsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeletePart = async () => {
    if (!partToDelete) return;
    
    try {
      setIsDeleteLoading(true);
      
      // Delete part
      const { error } = await supabase
        .from("parts")
        .delete()
        .eq("id", partToDelete);
        
      if (error) throw error;
      
      // Update listings state
      setListings(listings.filter(listing => listing.id !== partToDelete));
      
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete listing"
      });
    } finally {
      setIsDeleteLoading(false);
      setPartToDelete(null);
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock size={12} className="mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle size={12} className="mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link to="/parts/create">Create New Listing</Link>
        </Button>
      </div>
      
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden bg-card border-border">
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
                  <Badge className="bg-automotive-blue text-white">{listing.condition}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  {getApprovalStatusBadge(listing.approval_status)}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-1 text-card-foreground">{listing.title}</h3>
                <p className="text-2xl font-bold mb-2 text-card-foreground">${listing.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {listing.description || "No description"}
                </p>
                <div className="text-xs text-muted-foreground">
                  Listed on {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </CardContent>
              
              <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                {listing.approval_status === 'approved' ? (
                  <Button variant="outline" asChild>
                    <Link to={`/parts/${listing.id}`} className="flex items-center gap-2">
                      View Listing
                    </Link>
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {listing.approval_status === 'pending' ? 'Awaiting approval' : 'Not visible to public'}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    asChild
                  >
                    <Link to={`/parts/edit/${listing.id}`}>
                      <Edit size={16} />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      setPartToDelete(listing.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/10 border-border">
          <h3 className="text-xl font-medium mb-2 text-foreground">No listings yet</h3>
          <p className="text-muted-foreground mb-6">You haven't created any listings yet.</p>
          <Button asChild>
            <Link to="/parts/create">Create Your First Listing</Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePart}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

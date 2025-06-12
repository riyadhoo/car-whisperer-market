
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { validatePartInput } from "../utils/enhancedPartValidation";
import { uploadPartImage } from "../utils/securePartImageUpload";
import { insertPartData } from "../utils/partDataAccess";

interface UsePartSubmitProps {
  user: User | null;
  title: string;
  description: string;
  price: string;
  condition: string;
  compatibleCars: string[];
  image: File | null;
}

export default function usePartSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Main submit handler function
  const handleSubmit = async ({
    user,
    title,
    description,
    price,
    condition,
    compatibleCars,
    image
  }: UsePartSubmitProps) => {
    // Enhanced validation with all required parameters
    const validation = validatePartInput(user, title, description, price, condition, compatibleCars, image);
    
    if (!validation.isValid) {
      console.error("Validation failed:", validation.errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Starting part submission process");
      
      // Upload image if one is selected
      let imageUrl = null;
      if (image) {
        console.log("Processing image upload:", image.name, image.type, image.size);
        imageUrl = await uploadPartImage(image);
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }
      
      // Use sanitized data from validation
      const sanitizedData = validation.sanitizedData!;
      
      // Insert part data into database with sanitized values
      const partData = await insertPartData(
        sanitizedData.title,
        sanitizedData.description || "",
        sanitizedData.price,
        sanitizedData.condition,
        sanitizedData.compatibleCars,
        imageUrl,
        user!.id
      );
      
      // Show success message
      toast({
        title: "Success",
        description: "Your part has been listed"
      });
      
      // Navigate to the newly created part page
      navigate(`/parts/${partData.id}`);
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create listing"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}

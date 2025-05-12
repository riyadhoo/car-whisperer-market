
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["Shop", "Individual"], {
    message: "Please select a profile type.",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const useProfileForm = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Individual",
      bio: "",
      location: "",
      website: "",
      phone: ""
    },
  });

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to edit your profile.",
      });
      navigate('/login');
      return;
    }

    if (currentUser) {
      form.reset({
        name: currentUser.name || "",
        type: currentUser.type || "Individual",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        website: currentUser.website || "",
        phone: currentUser.phone || ""
      });

      if (currentUser.avatar) {
        setImagePreview(currentUser.avatar);
      }
    }
  }, [currentUser, isAuthenticated, isLoading, navigate, form, toast]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!imageFile || !currentUser?.id) return null;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${currentUser.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!currentUser?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload image if a new one was selected
      let avatarUrl = currentUser.avatar;
      if (imageFile) {
        const uploadedUrl = await uploadProfileImage();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          is_dealer: data.type === 'Shop',
          bio: data.bio,
          location: data.location,
          website: data.website,
          phone: data.phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
      
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    imagePreview,
    handleImageChange,
    onSubmit,
    navigate
  };
};


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  ImagePlus, 
  Loader2, 
  Store,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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

const EditProfile = () => {
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow bg-carTheme-lightGray py-8">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <h1 className="text-2xl font-bold mb-2">Edit Your Profile</h1>
            <p className="text-muted-foreground mb-6">
              Update your profile information and settings.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profile type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Individual">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Individual
                            </div>
                          </SelectItem>
                          <SelectItem value="Shop">
                            <div className="flex items-center">
                              <Store className="h-4 w-4 mr-2" />
                              Business/Shop
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === 'Shop' 
                          ? "For auto part stores, repair shops, and other businesses."
                          : "For individual sellers and car enthusiasts."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Profile Image */}
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed rounded-md border-gray-300 p-6 flex flex-col items-center justify-center">
                      {imagePreview ? (
                        <div className="mb-3">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={imagePreview} alt="Profile preview" />
                            <AvatarFallback className="bg-carTheme-navy text-white text-lg">
                              {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                          {form.watch('type') === 'Shop' ? (
                            <Store className="h-8 w-8 text-gray-400" />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      )}
                      <div className="relative">
                        <Button type="button" variant="outline" size="sm" className="relative z-10">
                          <ImagePlus className="h-4 w-4 mr-2" />
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max file size: 5MB. Supported formats: JPEG, PNG
                      </p>
                    </div>
                  </FormControl>
                </FormItem>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch('type') === 'Shop' ? "Business Name*" : "Full Name*"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={form.watch('type') === 'Shop' ? "Your shop name" : "Your name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={form.watch('type') === 'Shop' 
                            ? "Tell customers about your business..." 
                            : "Tell us about yourself and your automotive interests..."}
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="flex justify-end pt-4 gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-carTheme-navy hover:bg-carTheme-navy/80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditProfile;

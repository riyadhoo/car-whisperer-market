import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  ImagePlus, 
  Loader2, 
  PlusCircle, 
  Trash,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Part name must be at least 3 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  condition: z.enum(["New", "Used", "Refurbished"], {
    message: "Please select a valid condition.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  compatibility: z.array(z.string()).min(1, {
    message: "Add at least one compatible vehicle.",
  }),
  inStock: z.coerce.number().int().positive({
    message: "Quantity must be a positive integer.",
  }),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SellParts = () => {
  const [compatibilityInput, setCompatibilityInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined,
      condition: "New",
      category: "",
      description: "",
      compatibility: [],
      inStock: 1,
      image: undefined,
    },
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  
  const compatibility = watch('compatibility');
  
  const addCompatibility = () => {
    if (compatibilityInput.trim() && !compatibility.includes(compatibilityInput.trim())) {
      setValue('compatibility', [...compatibility, compatibilityInput.trim()]);
      setCompatibilityInput('');
    }
  };
  
  const removeCompatibility = (item: string) => {
    setValue('compatibility', compatibility.filter(c => c !== item));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, and WebP formats are supported",
        variant: "destructive"
      });
      return;
    }
    
    // Set the file and create a preview
    setImageFile(file);
    setValue('image', file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue('image', undefined);
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file || !currentUser) return null;
    
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `parts/${currentUser.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('parts')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('parts')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Upload image if available
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          setIsSubmitting(false);
          return; // Stop if image upload failed
        }
      }
      
      // Mock API call (replace with actual submission to your backend)
      console.log({
        ...data,
        image: imageUrl
      });
      
      toast({
        title: "Part Successfully Listed!",
        description: `Your part "${data.name}" has been listed for sale.`
      });
      
      // Reset form
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categories = [
    "Engine", "Brakes", "Suspension", "Exhaust", "Electrical", 
    "Exterior", "Interior", "Tires", "Wheels", "Air Intake", 
    "Cooling", "Transmission", "Steering", "Lighting", "Accessories"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow bg-carTheme-lightGray py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <h1 className="text-2xl font-bold mb-2">List a Part for Sale</h1>
            <p className="text-muted-foreground mb-6">Complete the form below to list your auto part for sale.</p>
            
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Part Name */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bosch Spark Plugs (Set of 4)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Price */}
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">$</span>
                            <Input type="number" step="0.01" min="0.01" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Condition */}
                  <FormField
                    control={control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Used">Used</SelectItem>
                            <SelectItem value="Refurbished">Refurbished</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Category */}
                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.sort().map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Quantity */}
                  <FormField
                    control={control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available*</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image Upload */}
                  <FormField
                    control={control}
                    name="image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Part Image</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed rounded-md border-gray-300 p-4">
                            {imagePreview ? (
                              <div className="relative">
                                <AspectRatio ratio={16/9} className="bg-muted overflow-hidden rounded-md">
                                  <img 
                                    src={imagePreview} 
                                    alt="Part preview" 
                                    className="object-cover w-full h-full"
                                  />
                                </AspectRatio>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                  onClick={removeImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-[102px]">
                                <label htmlFor="image-upload" className="cursor-pointer">
                                  <div className="flex items-center justify-center">
                                    <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                                      <ImagePlus className="h-4 w-4 mr-2" />
                                      Upload Image
                                    </Button>
                                  </div>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    {...field}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Max file size: 5MB. Supported formats: JPEG, PNG, WebP
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about the part, including brand, model, specifications, and condition..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Compatible Vehicles */}
                <FormField
                  control={control}
                  name="compatibility"
                  render={() => (
                    <FormItem>
                      <FormLabel>Compatible Vehicles*</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="e.g. Toyota Camry 2018-2023" 
                              value={compatibilityInput}
                              onChange={(e) => setCompatibilityInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompatibility())}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={addCompatibility}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                          
                          {compatibility.length > 0 && (
                            <div className="bg-carTheme-lightGray p-3 rounded-md">
                              <p className="text-sm font-medium mb-2">Compatible with:</p>
                              <ul className="space-y-1">
                                {compatibility.map((item, index) => (
                                  <li key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                                    <span>{item}</span>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeCompatibility(item)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-carTheme-navy hover:bg-carTheme-navy/80"
                    disabled={isSubmitting || isUploading}
                  >
                    {isSubmitting || isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Uploading..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        List Part for Sale
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

export default SellParts;

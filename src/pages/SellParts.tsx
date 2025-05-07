
import React from 'react';
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
  Trash 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
});

type FormValues = z.infer<typeof formSchema>;

const SellParts = () => {
  const [compatibilityInput, setCompatibilityInput] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined,
      condition: "New",
      category: "",
      description: "",
      compatibility: [],
      inStock: 1
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
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);
      
      toast({
        title: "Part Successfully Listed!",
        description: `Your part "${data.name}" has been listed for sale.`
      });
      
      // Reset form
      form.reset();
    }, 1500);
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
                  <FormItem>
                    <FormLabel>Part Image</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md border-gray-300 p-4 flex flex-col items-center justify-center h-[102px]">
                        <Button type="button" variant="outline" size="sm">
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Max file size: 5MB. Supported formats: JPEG, PNG
                    </FormDescription>
                  </FormItem>
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
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

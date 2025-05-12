
import React from 'react';
import { User, Store } from 'lucide-react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface ProfileTypeSelectorProps {
  form: UseFormReturn<any>;
}

const ProfileTypeSelector = ({ form }: ProfileTypeSelectorProps) => {
  return (
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
  );
};

export default ProfileTypeSelector;

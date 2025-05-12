
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface ProfileBioFieldProps {
  form: UseFormReturn<any>;
}

const ProfileBioField = ({ form }: ProfileBioFieldProps) => {
  return (
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
  );
};

export default ProfileBioField;

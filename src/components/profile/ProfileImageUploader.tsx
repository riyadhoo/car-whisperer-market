
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePlus, User, Store } from 'lucide-react';

interface ProfileImageUploaderProps {
  imagePreview: string | null;
  profileType: string;
  userName?: string;
  onImageChange: (file: File | null) => void;
}

const ProfileImageUploader = ({
  imagePreview,
  profileType,
  userName,
  onImageChange,
}: ProfileImageUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onImageChange(file);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <FormItem>
      <FormLabel>Profile Image</FormLabel>
      <FormControl>
        <div className="border-2 border-dashed rounded-md border-gray-300 p-6 flex flex-col items-center justify-center">
          {imagePreview ? (
            <div className="mb-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview} alt="Profile preview" />
                <AvatarFallback className="bg-carTheme-navy text-white text-lg">
                  {userName ? getInitials(userName) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-full p-4 mb-3">
              {profileType === 'Shop' ? (
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
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Max file size: 5MB. Supported formats: JPEG, PNG
          </p>
        </div>
      </FormControl>
    </FormItem>
  );
};

export default ProfileImageUploader;

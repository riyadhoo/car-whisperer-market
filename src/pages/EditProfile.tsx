
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useProfileForm } from '@/hooks/useProfileForm';
import ProfileTypeSelector from '@/components/profile/ProfileTypeSelector';
import ProfileImageUploader from '@/components/profile/ProfileImageUploader';
import ProfileBasicInfoFields from '@/components/profile/ProfileBasicInfoFields';
import ProfileBioField from '@/components/profile/ProfileBioField';
import ProfileActionButtons from '@/components/profile/ProfileActionButtons';

const EditProfile = () => {
  const { 
    form, 
    isSubmitting, 
    imagePreview, 
    handleImageChange, 
    onSubmit, 
    navigate 
  } = useProfileForm();
  
  if (form.formState.isLoading) {
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
                <ProfileTypeSelector form={form} />
                
                <ProfileImageUploader 
                  imagePreview={imagePreview}
                  profileType={form.watch('type')}
                  userName={form.watch('name')}
                  onImageChange={handleImageChange}
                />
                
                <ProfileBasicInfoFields form={form} />
                
                <ProfileBioField form={form} />
                
                <ProfileActionButtons 
                  isSubmitting={isSubmitting}
                  onCancel={() => navigate('/profile')}
                />
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

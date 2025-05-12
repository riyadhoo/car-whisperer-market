
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ProfileActionButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProfileActionButtons = ({ isSubmitting, onCancel }: ProfileActionButtonsProps) => {
  return (
    <div className="flex justify-end pt-4 gap-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={onCancel}
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
  );
};

export default ProfileActionButtons;

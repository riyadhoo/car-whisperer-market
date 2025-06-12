
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { messageValidationSchema } from "@/lib/validation";

interface SecureMessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SecureMessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: SecureMessageInputProps) {
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize message
    try {
      const validatedMessage = messageValidationSchema.parse({ content: message });
      
      if (validatedMessage.content.trim()) {
        onSendMessage(validatedMessage.content);
        setMessage("");
        setValidationError(null);
      }
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Invalid message";
      setValidationError(errorMessage);
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Real-time validation
    try {
      messageValidationSchema.parse({ content: value });
      setValidationError(null);
    } catch (error: any) {
      if (value.length > 0) {
        const errorMessage = error.errors?.[0]?.message || "Invalid message";
        setValidationError(errorMessage);
      } else {
        setValidationError(null);
      }
    }
  };

  const canSend = message.trim().length > 0 && !validationError && !disabled;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 resize-none ${validationError ? 'border-red-500' : ''}`}
          rows={2}
          disabled={disabled}
          maxLength={1000}
        />
        <Button 
          type="submit" 
          disabled={!canSend}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{message.length}/1000 characters</span>
        {message.length > 900 && (
          <span className="text-orange-500">Character limit approaching</span>
        )}
      </div>
    </form>
  );
}

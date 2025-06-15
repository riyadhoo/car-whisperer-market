
import { useState } from "react";
import { useEnhancedAuth } from "@/lib/securityAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { profileValidationSchema } from "@/lib/validation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "login" | "register" | "forgot-password";

export default function EnhancedAuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { signIn, signUp } = useEnhancedAuth();

  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (value.length < 8) {
          errors.password = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = "Password must contain uppercase, lowercase, and number";
        } else {
          delete errors.password;
        }
        break;
      case 'username':
        if (mode === 'register') {
          try {
            profileValidationSchema.shape.username.parse(value);
            delete errors.username;
          } catch (err: any) {
            errors.username = err.errors?.[0]?.message || "Invalid username";
          }
        }
        break;
      case 'phone':
        if (value && mode === 'register') {
          try {
            profileValidationSchema.shape.phone_number.parse(value);
            delete errors.phone;
          } catch (err: any) {
            errors.phone = err.errors?.[0]?.message || "Invalid phone number";
          }
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode !== "forgot-password") {
      // Final validation
      validateField('email', email);
      validateField('password', password);
      if (mode === 'register') {
        validateField('username', username);
        validateField('phone', phoneNumber);
      }
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else if (mode === "register") {
        if (!username) {
          throw new Error("Username is required");
        }
        await signUp(email, password, username, phoneNumber);
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Reset email sent",
          description: "Please check your email for password reset instructions.",
        });
        setMode("login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
    setValidationErrors({});
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Secure Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Enter your credentials to access your account";
      case "register":
        return "Create a new secure account to get started";
      case "forgot-password":
        return "Enter your email to receive reset instructions";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {getTitle()}
        </CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="yourusername"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateField('username', e.target.value);
                }}
                className={validationErrors.username ? "border-red-500" : ""}
                required
              />
              {validationErrors.username && (
                <p className="text-sm text-red-500">{validationErrors.username}</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (mode !== "forgot-password") {
                  validateField('email', e.target.value);
                }
              }}
              className={validationErrors.email ? "border-red-500" : ""}
              required
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>
          
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validateField('phone', e.target.value);
                }}
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>
          )}
          
          {mode !== "forgot-password" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                  }}
                  className={validationErrors.password ? "border-red-500" : ""}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
              {mode === "register" && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || (mode !== "forgot-password" && Object.keys(validationErrors).length > 0)}
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Email"}
          </Button>
          
          {mode === "login" && (
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => setMode("forgot-password")}
            >
              Forgot your password?
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={toggleMode}
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

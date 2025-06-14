
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FloatingAssistant } from "@/components/chat/FloatingAssistant";
import { useFloatingAssistant } from "@/hooks/useFloatingAssistant";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Index from "./pages/Index";
import PartsPage from "./pages/PartsPage";
import PartDetail from "./pages/PartDetail";
import CreatePart from "./pages/CreatePart";
import EditPart from "./pages/EditPart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import CarsPage from "./pages/CarsPage";
import CarDetail from "./pages/CarDetail";
import ChatPage from "./pages/ChatPage";
import Contact from "./pages/Contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const { cars } = useFloatingAssistant();
  
  // Don't show floating assistant on chat page
  const showFloatingAssistant = location.pathname !== '/chat';

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/parts/:id" element={<PartDetail />} />
        <Route path="/parts/create" element={<CreatePart />} />
        <Route path="/parts/edit/:id" element={<EditPart />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {showFloatingAssistant && <FloatingAssistant cars={cars} />}
    </ErrorBoundary>
  );
};

const AppWithProviders = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default AppWithProviders;

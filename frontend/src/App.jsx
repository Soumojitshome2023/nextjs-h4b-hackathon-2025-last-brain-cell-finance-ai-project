
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ExpenseTracker from "./pages/ExpenseTracker";
import { AuthProvider } from "./contexts/AuthContext";
import { CivicAuthProvider, UserButton } from "@civic/auth/react";

const queryClient = new QueryClient();

const App = () => (
  <CivicAuthProvider
    clientId="53dc2d0f-9b95-47fb-890c-0b46686d16f2"
    displayMode="redirect"
    redirectUrl={`${import.meta.env.VITE_BaseUrl}/profile`}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/expenses" element={<ExpenseTracker />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </CivicAuthProvider>
);

export default App;

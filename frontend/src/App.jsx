
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
import { CivicAuthProvider, UserButton } from "@civic/auth/react";
import { AuthUserProvider } from "./helper/auth";
import ChatButton from "./components/ChatButton";

const queryClient = new QueryClient();

const App = () => (
  <AuthUserProvider>
    <CivicAuthProvider
      clientId={import.meta.env.VITE_CivicClientID}
    >
      <QueryClientProvider client={queryClient}>
        <ChatButton />
        <TooltipProvider>
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
        </TooltipProvider>
      </QueryClientProvider>
    </CivicAuthProvider>

  </AuthUserProvider>
);

export default App;

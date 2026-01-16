import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Jessica from "./pages/Jessica";
import Communities from "./pages/Communities";
import Challenge from "./pages/Challenge";
import GamesHub from "./pages/GamesHub";
import MemoryGarden from "./pages/MemoryGarden";
import ColorMatching from "./pages/ColorMatching";
import CalmDot from "./pages/CalmDot";
import WordUnscramble from "./pages/WordUnscramble";
import Articles from "./pages/Articles";
import Emergency from "./pages/Emergency";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jessica" element={<Jessica />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/games/memory-garden" element={<MemoryGarden />} />
            <Route path="/games/color-matching" element={<ColorMatching />} />
            <Route path="/games/calm-dot" element={<CalmDot />} />
            <Route path="/games/word-unscramble" element={<WordUnscramble />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

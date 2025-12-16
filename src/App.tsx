import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Footer } from "@/components/layout/Footer";
import Index from "./pages/Index";
import WorkersDashboard from "./pages/WorkersDashboard";
import ShareProject from "./pages/ShareProject";
import PostGeneration from "./pages/PostGeneration";
import CursorMoments from "./pages/CursorMoments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<WorkersDashboard />} />
                <Route path="/projects" element={<ShareProject />} />
                <Route path="/post-gen" element={<PostGeneration />} />
                <Route path="/moments" element={<CursorMoments />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

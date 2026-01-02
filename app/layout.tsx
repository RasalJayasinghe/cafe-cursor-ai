"use client";

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/src/context/AppContext";
import { Footer } from "@/src/components/layout/Footer";
import "../src/index.css";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cafe Cursor Colombo</title>
        <meta name="description" content="Where developers, builders and creators gather as a community to share, network and build in Colombo, Sri Lanka" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
            </TooltipProvider>
          </AppProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

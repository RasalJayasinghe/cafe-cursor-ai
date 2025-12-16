"use client";

import { Hero } from "@/src/components/sections/Hero";
import { AboutEvent } from "@/src/components/sections/AboutEvent";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="scroll-snap-y h-screen overflow-y-auto">
      <Hero />
      <AboutEvent />

      {/* Small worker dashboard link */}
      <Link
        href="/dashboard"
        className="fixed bottom-4 right-4 z-50 p-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-full transition-all font-mono text-xs flex items-center gap-2 backdrop-blur-sm"
        title="Workers Dashboard"
      >
        <LayoutDashboard className="w-4 h-4" />
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/src/context/AppContext";
import { Check, Coffee, UtensilsCrossed, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

type Filter = "pending" | "completed" | "all";

// Sample static data for preview
const SAMPLE_TOKENS = [
  {
    id: "1",
    token: "CC-7842",
    name: "John Doe",
    email: "john@example.com",
    food: "rice-bowl",
    drink: "cafe-latte",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    used: false,
  },
  {
    id: "2",
    token: "CC-3156",
    name: "Jane Smith",
    email: "jane@example.com",
    food: "signature-noodles",
    drink: "ceylon-tea",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    used: false,
  },
  {
    id: "3",
    token: "CC-9284",
    name: "Mike Chen",
    email: "mike@example.com",
    food: "artisan-sandwich",
    drink: "espresso",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    used: true,
  },
  {
    id: "4",
    token: "CC-4721",
    name: "Sarah Lee",
    email: "sarah@example.com",
    food: "garden-salad",
    drink: "fresh-juice",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    used: false,
  },
  {
    id: "5",
    token: "CC-6038",
    name: "Alex Kumar",
    email: "alex@example.com",
    food: "rice-bowl",
    drink: "ceylon-tea",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    used: true,
  },
];

export default function WorkersDashboard() {
  const { tokens: realTokens, markTokenUsed } = useApp();
  const [filter, setFilter] = useState<Filter>("pending");

  // Use sample data if no real tokens exist
  const tokens = realTokens.length > 0 ? realTokens : SAMPLE_TOKENS;

  const filteredTokens = tokens.filter((token) => {
    if (filter === "pending") return !token.used;
    if (filter === "completed") return token.used;
    return true;
  });

  const pendingCount = tokens.filter((t) => !t.used).length;
  const completedCount = tokens.filter((t) => t.used).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-foreground/5">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Title row - at the top */}
          <div className="mb-3 sm:mb-4">
            <h1 className="font-mono text-base sm:text-lg font-bold">
              Workers Dashboard
            </h1>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              Cafe Cursor • Colombo
            </p>
          </div>

          {/* Bottom row - back button and stats */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-xs px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            {/* Stats */}
            <div className="flex gap-3 sm:gap-4 font-mono text-xs">
              <div className="text-center">
                <div className="text-yellow-400 text-base sm:text-lg font-bold">
                  {pendingCount}
                </div>
                <div className="text-muted-foreground/60 text-[10px] sm:text-xs">
                  pending
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-base sm:text-lg font-bold">
                  {completedCount}
                </div>
                <div className="text-muted-foreground/60 text-[10px] sm:text-xs">
                  done
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs overflow-x-auto pb-1">
          {(["pending", "completed", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                filter === f
                  ? "bg-foreground/10 border border-foreground/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {f === "pending" && `pending (${pendingCount})`}
              {f === "completed" && `completed (${completedCount})`}
              {f === "all" && `all (${tokens.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List - Partial implementation for brevity */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-8">
        <AnimatePresence mode="popLayout">
          {filteredTokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-mono text-sm text-muted-foreground">
                No orders {filter !== "all" && filter}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <motion.div
                  key={token.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    token.used
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-foreground/5 border-foreground/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm sm:text-base font-bold">
                          {token.token}
                        </span>
                        {token.used && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {token.name}
                      </p>
                      <div className="flex gap-2 mt-2 text-xs font-mono">
                        <span className="flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3" />
                          {token.food}
                        </span>
                        <span className="flex items-center gap-1">
                          <Coffee className="w-3 h-3" />
                          {token.drink}
                        </span>
                      </div>
                    </div>
                    {!token.used && (
                      <Button
                        size="sm"
                        onClick={() => markTokenUsed(token.id)}
                        className="font-mono text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

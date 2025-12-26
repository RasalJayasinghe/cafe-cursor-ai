"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Coffee,
  UtensilsCrossed,
  Clock,
  ArrowLeft,
  RefreshCw,
  ChefHat,
  Bell,
  Utensils,
  CheckCircle2,
  Timer,
  Zap,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface Order {
  id: string;
  token: string;
  customerName: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  createdAt: string;
  claimed: boolean;
}

type Filter = "pending" | "completed" | "all";

export default function KitchenQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("pending");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch orders from API
  const fetchOrders = useCallback(async (showToast = false) => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/tokens/claim");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.claims || []);
        setLastRefresh(new Date());
        if (showToast) toast.success("Orders refreshed");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(), 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Mark order as completed
  const handleComplete = async (email: string, orderId: string) => {
    setCompletingId(orderId);
    try {
      const res = await fetch("/api/tokens/claim", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: "completed" }),
      });

      if (res.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "completed" } : o
          )
        );
        toast.success("Order completed!", {
          description: `Order ready for pickup`,
        });
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Failed to complete order");
    } finally {
      setCompletingId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === "pending") return order.status !== "completed";
    if (filter === "completed") return order.status === "completed";
    return true;
  });

  const pendingCount = orders.filter((o) => o.status !== "completed").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  // Get time since order
  const getTimeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  // Get urgency based on time
  const getUrgency = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins > 15) return "urgent";
    if (mins > 8) return "warning";
    return "normal";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <ChefHat className="w-12 h-12 text-foreground/20 mx-auto" />
          </motion.div>
          <p className="font-mono text-sm text-muted-foreground">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="font-mono text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="font-mono text-xs"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Kitchen Queue</h1>
              <p className="font-mono text-xs text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 overflow-hidden"
            >
              {pendingCount > 0 && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"
                />
              )}
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <span className="text-2xl font-bold text-amber-400">{pendingCount}</span>
              </div>
              <p className="font-mono text-[10px] text-amber-400/70 mt-1">In Queue</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{completedCount}</span>
              </div>
              <p className="font-mono text-[10px] text-green-400/70 mt-1">Completed</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-3 rounded-xl bg-foreground/5 border border-foreground/10"
            >
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-foreground/50" />
                <span className="text-2xl font-bold">{orders.length}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">Total</p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex gap-2 font-mono text-xs">
          {(["pending", "completed", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                filter === f
                  ? f === "pending"
                    ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                    : f === "completed"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-foreground/10 border border-foreground/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {f === "pending" && `🔥 Queue (${pendingCount})`}
              {f === "completed" && `✓ Done (${completedCount})`}
              {f === "all" && `All (${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                {filter === "pending" ? (
                  <Coffee className="w-10 h-10 text-muted-foreground/30" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-green-400/30" />
                )}
              </div>
              <p className="font-mono text-lg text-muted-foreground">
                {filter === "pending" ? "No orders in queue" : "No completed orders"}
              </p>
              <p className="font-mono text-xs text-muted-foreground/50 mt-2">
                {filter === "pending" ? "Waiting for new orders..." : "Complete some orders first"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order, index) => {
                const urgency = getUrgency(order.createdAt);
                const isCompleted = order.status === "completed";

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative rounded-2xl border overflow-hidden transition-all ${
                      isCompleted
                        ? "bg-green-500/5 border-green-500/20"
                        : urgency === "urgent"
                        ? "bg-red-500/5 border-red-500/30 ring-1 ring-red-500/20"
                        : urgency === "warning"
                        ? "bg-amber-500/5 border-amber-500/30"
                        : "bg-card/60 border-border/50"
                    }`}
                  >
                    {/* Urgency indicator */}
                    {!isCompleted && urgency !== "normal" && (
                      <div className={`absolute top-0 left-0 right-0 h-1 ${
                        urgency === "urgent" ? "bg-red-500" : "bg-amber-500"
                      }`} />
                    )}

                    <div className="p-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Token badge */}
                          <div className={`px-3 py-2 rounded-xl font-mono text-lg font-bold ${
                            isCompleted
                              ? "bg-green-500/20 text-green-400"
                              : urgency === "urgent"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-foreground/10 text-foreground"
                          }`}>
                            {order.token}
                          </div>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <div className={`flex items-center gap-1 text-xs font-mono ${
                              urgency === "urgent" && !isCompleted
                                ? "text-red-400"
                                : urgency === "warning" && !isCompleted
                                ? "text-amber-400"
                                : "text-muted-foreground"
                            }`}>
                              <Clock className="w-3 h-3" />
                              {getTimeSince(order.createdAt)}
                              {!isCompleted && urgency === "urgent" && (
                                <span className="ml-1 text-red-400">• URGENT</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            Done
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleComplete(order.email, order.id)}
                            disabled={completingId === order.id}
                            className={`font-mono text-sm ${
                              urgency === "urgent"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            } text-white`}
                          >
                            {completingId === order.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Ready
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Order items */}
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono ${
                              isCompleted ? "bg-green-500/10" : "bg-foreground/5"
                            }`}
                          >
                            {idx === 0 ? (
                              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Coffee className="w-4 h-4 text-cyan-400" />
                            )}
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating notification for new orders */}
      {pendingCount > 0 && filter !== "pending" && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={() => setFilter("pending")}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-full bg-amber-500 text-black font-mono text-sm shadow-lg shadow-amber-500/30"
        >
          <Bell className="w-4 h-4" />
          {pendingCount} orders waiting
        </motion.button>
      )}
    </div>
  );
}

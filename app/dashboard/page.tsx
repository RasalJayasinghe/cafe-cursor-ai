"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Coffee,
  UtensilsCrossed,
  Clock,
  ArrowLeft,
  RefreshCw,
  ChefHat,
  CheckCircle2,
  Timer,
  Circle,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
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

// Generate notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant two-tone notification
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    // Pleasant ascending two-tone chime
    playTone(587.33, now, 0.15); // D5
    playTone(880, now + 0.12, 0.2); // A5
    
  } catch (error) {
    console.log("Audio not supported");
  }
};

export default function KitchenQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  
  // Track previous order IDs to detect new ones
  const previousOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/tokens/claim");
      if (res.ok) {
        const data = await res.json();
        const fetchedOrders: Order[] = data.claims || [];
        
        // Detect new orders (not on first load)
        if (!isFirstLoad.current) {
          const currentIds = new Set(fetchedOrders.map(o => o.id));
          const newIds: string[] = [];
          
          fetchedOrders.forEach(order => {
            if (!previousOrderIds.current.has(order.id) && order.status !== "completed") {
              newIds.push(order.id);
            }
          });
          
          if (newIds.length > 0) {
            // Play sound for new orders
            if (soundEnabled) {
              playNotificationSound();
            }
            
            // Mark as new for visual highlight
            setNewOrderIds(new Set(newIds));
            
            // Show toast notification
            toast.success(
              newIds.length === 1 ? "New order received" : `${newIds.length} new orders received`,
              { 
                description: "Check the queue",
                duration: 5000,
              }
            );
            
            // Clear highlight after 5 seconds
            setTimeout(() => {
              setNewOrderIds(new Set());
            }, 5000);
          }
          
          // Update previous IDs
          previousOrderIds.current = currentIds;
        } else {
          // First load - just set the IDs without notification
          previousOrderIds.current = new Set(fetchedOrders.map(o => o.id));
          isFirstLoad.current = false;
        }
        
        setOrders(fetchedOrders);
        setLastRefresh(new Date());
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [soundEnabled]);

  // Real-time polling every 3 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "completed" } : o
          )
        );
        toast.success("Order marked as ready", {
          description: "Customer can now pick up their order",
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
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
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
            className="mb-6"
          >
            <ChefHat className="w-16 h-16 text-foreground/20 mx-auto" />
          </motion.div>
          <p className="text-xl text-muted-foreground">Connecting to kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-base px-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border/50 flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Kitchen Queue</h1>
                  <div className="flex items-center gap-3 mt-0.5">
                    {/* Live indicator */}
                    <div className="flex items-center gap-1.5">
                      {isConnected ? (
                        <>
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-green-500"
                          />
                          <span className="text-sm text-green-500 font-medium">Live</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm text-red-500 font-medium">Disconnected</span>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      · Synced {lastRefresh.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sound toggle */}
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) {
                    playNotificationSound();
                  }
                }}
                className={`px-4 ${
                  soundEnabled 
                    ? "text-foreground hover:bg-foreground/5" 
                    : "text-muted-foreground hover:bg-foreground/5"
                }`}
                title={soundEnabled ? "Sound on" : "Sound off"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>

              {/* Connection status */}
              <div 
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isConnected 
                    ? "bg-foreground/5 text-foreground" 
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? "Connected" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-border/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Pending Orders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative p-6 rounded-2xl border transition-all ${
                pendingCount > 0
                  ? "bg-foreground/5 border-foreground/20"
                  : "bg-card/40 border-border/50"
              }`}
            >
              {pendingCount > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-5 right-5 w-3 h-3 rounded-full bg-foreground"
                />
              )}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <Timer className="w-7 h-7 text-foreground" />
                </div>
                <div>
                  <span className="text-5xl font-bold text-foreground tabular-nums">
                    {pendingCount}
                  </span>
                  <p className="text-base text-muted-foreground mt-1">In Queue</p>
                </div>
              </div>
            </motion.div>

            {/* Completed Orders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card/40 border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-5xl font-bold text-muted-foreground tabular-nums">
                    {completedCount}
                  </span>
                  <p className="text-base text-muted-foreground mt-1">Completed</p>
                </div>
              </div>
            </motion.div>

            {/* Total Orders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card/40 border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <UtensilsCrossed className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-5xl font-bold text-muted-foreground tabular-nums">
                    {orders.length}
                  </span>
                  <p className="text-base text-muted-foreground mt-1">Total Today</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3">
          {(["pending", "completed", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-4 rounded-xl text-lg font-medium transition-all ${
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-border/50"
              }`}
            >
              {f === "pending" && `Queue (${pendingCount})`}
              {f === "completed" && `Completed (${completedCount})`}
              {f === "all" && `All Orders (${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-foreground/5 border border-border/50 flex items-center justify-center">
                {filter === "pending" ? (
                  <Coffee className="w-14 h-14 text-foreground/20" />
                ) : (
                  <CheckCircle2 className="w-14 h-14 text-foreground/20" />
                )}
              </div>
              <p className="text-2xl text-muted-foreground mb-2">
                {filter === "pending" ? "No orders waiting" : "No completed orders"}
              </p>
              <p className="text-base text-muted-foreground/60">
                {filter === "pending"
                  ? "New orders will appear automatically with a sound alert"
                  : "Completed orders will show up here"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredOrders.map((order, index) => {
                const urgency = getUrgency(order.createdAt);
                const isCompleted = order.status === "completed";
                const isNew = newOrderIds.has(order.id);

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: isNew ? 1.02 : 1 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                    className={`relative rounded-2xl overflow-hidden transition-all ${
                      isNew
                        ? "bg-foreground/10 border-2 border-foreground ring-4 ring-foreground/20"
                        : isCompleted
                        ? "bg-card/30 border border-border/30"
                        : urgency === "urgent"
                        ? "bg-foreground/[0.08] border-2 border-foreground/30"
                        : urgency === "warning"
                        ? "bg-foreground/[0.04] border border-foreground/20"
                        : "bg-card/60 border border-border/50"
                    }`}
                  >
                    {/* New order indicator */}
                    {isNew && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 left-0 right-0 h-1 bg-foreground"
                      />
                    )}

                    {/* Urgency indicator bar */}
                    {!isNew && !isCompleted && urgency !== "normal" && (
                      <div
                        className={`h-1.5 ${
                          urgency === "urgent"
                            ? "bg-foreground"
                            : "bg-foreground/50"
                        }`}
                      />
                    )}

                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-5">
                          {/* Token Badge */}
                          <div
                            className={`relative px-5 py-4 rounded-xl text-2xl font-bold tracking-wider ${
                              isNew
                                ? "bg-foreground text-background"
                                : isCompleted
                                ? "bg-foreground/5 text-muted-foreground border border-border/50"
                                : urgency === "urgent"
                                ? "bg-foreground text-background"
                                : "bg-foreground/10 text-foreground border border-foreground/20"
                            }`}
                          >
                            {isNew && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-foreground text-background text-xs font-bold border-2 border-background"
                              >
                                NEW
                              </motion.span>
                            )}
                            {order.token}
                          </div>

                          <div>
                            <p className="text-xl font-semibold text-foreground mb-1">
                              {order.customerName}
                            </p>
                            <div
                              className={`flex items-center gap-2 text-base ${
                                isNew
                                  ? "text-foreground"
                                  : urgency === "urgent" && !isCompleted
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              <span>{getTimeSince(order.createdAt)}</span>
                              {!isCompleted && urgency === "urgent" && !isNew && (
                                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-foreground text-background text-sm font-medium">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {isCompleted ? (
                          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-foreground/5 text-muted-foreground border border-border/50">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-lg font-medium">Done</span>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleComplete(order.email, order.id)}
                            disabled={completingId === order.id}
                            size="lg"
                            className={`h-auto px-8 py-5 rounded-xl text-lg font-semibold transition-all active:scale-95 ${
                              isNew || urgency === "urgent"
                                ? "bg-foreground hover:bg-foreground/90 text-background"
                                : "bg-foreground/90 hover:bg-foreground text-background"
                            }`}
                          >
                            {completingId === order.id ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-5 h-5 mr-3" />
                                Mark Ready
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base ${
                              isNew
                                ? "bg-foreground/10 text-foreground"
                                : isCompleted
                                ? "bg-foreground/[0.03] text-muted-foreground"
                                : "bg-foreground/5 text-foreground"
                            }`}
                          >
                            {idx === 0 ? (
                              <UtensilsCrossed className="w-5 h-5 text-foreground/50" />
                            ) : (
                              <Coffee className="w-5 h-5 text-foreground/50" />
                            )}
                            <span className="font-medium">{item.name}</span>
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

      {/* Floating notification */}
      <AnimatePresence>
        {pendingCount > 0 && filter !== "pending" && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setFilter("pending")}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-5 rounded-full bg-foreground text-background text-lg font-semibold shadow-2xl hover:bg-foreground/90 transition-colors active:scale-95"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Circle className="w-3 h-3 fill-current" />
            </motion.div>
            {pendingCount} order{pendingCount !== 1 ? "s" : ""} waiting
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

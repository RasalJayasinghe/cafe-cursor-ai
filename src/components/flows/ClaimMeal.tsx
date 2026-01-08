"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import { Check, X, Loader2, Coffee, UtensilsCrossed } from "lucide-react";

const FOODS = [
  { id: "rice-bowl", name: "🍚 Rice Bowl" },
  { id: "noodles", name: "🍜 Noodles" },
  { id: "sandwich", name: "🥪 Sandwich" },
  { id: "salad", name: "🥗 Salad" },
  { id: "pasta", name: "🍝 Pasta" },
];

const DRINKS = [
  { id: "latte", name: "☕ Latte" },
  { id: "cappuccino", name: "☕ Cappuccino" },
  { id: "iced-coffee", name: "🧊 Iced Coffee" },
  { id: "tea", name: "🍵 Tea" },
  { id: "juice", name: "🧃 Fresh Juice" },
];

type Step = "verify" | "select" | "success" | "already-claimed";

export function ClaimMeal() {
  const [step, setStep] = useState<Step>("verify");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [food, setFood] = useState("");
  const [drink, setDrink] = useState("");
  const [orderToken, setOrderToken] = useState<string | null>(null);
  const [existingOrder, setExistingOrder] = useState<any>(null);

  const handleVerify = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setVerifying(true);
    try {
      // Call verification API to check if email is registered
      const response = await fetch("/api/attendees/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.registered && !data.alreadyClaimed) {
        // Email is registered and hasn't claimed yet - proceed to menu
        setAttendeeName(data.attendee.name);
        setStep("select");
        toast.success(`Welcome, ${data.attendee.name}!`, {
          description: "Please select your meal",
        });
      } else if (response.status === 403) {
        // Email not registered in CSV
        toast.error("Email not registered", {
          description: "This email is not registered for the event. Please check your email address.",
        });
      } else if (response.status === 409) {
        // Already claimed
        setExistingOrder(data.existingOrder);
        setStep("already-claimed");
        toast.error("Already claimed", {
          description: "You have already bought your meal. You can't buy again.",
        });
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmClaim = async () => {
    if (!email || !food || !drink) {
      toast.error("Please select both food and drink");
      return;
    }

    setClaiming(true);
    try {
      const response = await fetch("/api/tokens/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          foodItem: food,
          drinkItem: drink,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderToken(data.token);
        setAttendeeName(data.order.customerName);
        setStep("success");
        toast.success("Meal claimed successfully!", {
          description: `Your token: ${data.token}`,
        });
      } else if (response.status === 409 && data.alreadyClaimed) {
        // Already claimed (double-check at claim time)
        setExistingOrder(data.existingOrder);
        setStep("already-claimed");
        toast.error("You've already bought your meal", {
          description: "You can't buy again. Your previous order is shown below.",
        });
      } else if (response.status === 403) {
        // Email not registered (shouldn't happen if verify worked, but safety check)
        toast.error("Email not registered", {
          description: "This email is not registered for the event.",
        });
        setStep("verify");
      } else {
        toast.error(data.error || "Failed to claim meal");
        setStep("verify");
      }
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Failed to claim meal. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const resetForm = () => {
    setStep("verify");
    setEmail("");
    setAttendeeName("");
    setFood("");
    setDrink("");
    setOrderToken(null);
    setExistingOrder(null);
  };

  return (
    <div className="space-y-6" aria-live="polite">
      <AnimatePresence mode="wait">
        {/* Step 1: Email Verification */}
        {step === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <Coffee className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Claim Your Free Meal</h3>
              <p className="text-sm text-muted-foreground">
                Enter the email you used to register for the event
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
                disabled={verifying}
                autoComplete="email"
                className="text-lg"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!email || verifying}
              className="w-full"
              size="lg"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Step 2: Meal Selection */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Check className="w-8 h-8 mx-auto text-green-600" />
              <h3 className="font-semibold">Select Your Meal</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  Choose Your Food
                </Label>
                <Select value={food} onValueChange={setFood}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select a food item" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOODS.map((f) => (
                      <SelectItem key={f.id} value={f.name} className="text-lg">
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Choose Your Drink
                </Label>
                <Select value={drink} onValueChange={setDrink}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select a drink" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRINKS.map((d) => (
                      <SelectItem key={d.id} value={d.name} className="text-lg">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConfirmClaim}
                disabled={!food || !drink || claiming}
                className="flex-1"
                size="lg"
              >
                {claiming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Claim Meal
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={claiming}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === "success" && orderToken && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 text-center"
          >
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-2xl space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Check className="w-16 h-16 mx-auto text-green-600" />
              </motion.div>

              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Meal Claimed Successfully!
              </h3>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Token</p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400 tracking-widest">
                  {orderToken}
                </p>
              </div>

              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium">Your Order:</p>
                <p>✓ {food}</p>
                <p>✓ {drink}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Show this token at the counter to collect your meal
            </p>

            <Button variant="outline" onClick={resetForm} size="lg">
              Done
            </Button>
          </motion.div>
        )}

        {/* Step 4: Already Claimed */}
        {step === "already-claimed" && existingOrder && (
          <motion.div
            key="already-claimed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 text-center"
          >
            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl space-y-4">
              <X className="w-16 h-16 mx-auto text-orange-600" />

              <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                You've Already Bought Your Meal
              </h3>

              <p className="text-sm text-muted-foreground">
                You already claimed your meal on{" "}
                {new Date(existingOrder.claimedAt).toLocaleDateString()} at{" "}
                {new Date(existingOrder.claimedAt).toLocaleTimeString()}
              </p>

              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  ⚠️ You can't buy again
                </p>
                <p className="text-xs text-orange-800 dark:text-orange-200">
                  Each email can only claim one meal. Your previous order details are shown below.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Token</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-400 tracking-widest">
                  {existingOrder.token}
                </p>
              </div>

              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium">Your Previous Order:</p>
                {existingOrder.items.map((item: any, idx: number) => (
                  <p key={idx}>✓ {item.name}</p>
                ))}
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                If you haven't collected your meal yet, show this token at the counter.
              </p>
            </div>

            <Button variant="outline" onClick={resetForm} size="lg">
              Back to Start
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


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
import { verifyClaim, confirmClaim } from "@/lib/claim-actions";

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

type Step = "verify" | "select" | "success";

export function ClaimMealNew() {
  const [step, setStep] = useState<Step>("verify");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [attendeeInfo, setAttendeeInfo] = useState<{
    name: string;
    email: string;
    token: string;
  } | null>(null);
  const [food, setFood] = useState("");
  const [drink, setDrink] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setVerifying(true);
    try {
      const result = await verifyClaim({ email: email.trim() });

      if (result.status === "valid") {
        setAttendeeInfo(result.attendee);
        setStep("select");
        toast.success(result.message);
      } else if (result.status === "already_claimed") {
        const claimedDate = new Date(result.claimedAt).toLocaleString();
        toast.error(result.message, {
          description: `Claimed on ${claimedDate}`,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmClaim = async () => {
    if (!attendeeInfo || !food || !drink) {
      toast.error("Please select both food and drink");
      return;
    }

    setClaiming(true);
    try {
      const result = await confirmClaim({
        email: attendeeInfo.email,
        name: attendeeInfo.name,
        foodItem: food,
        drinkItem: drink,
      });

      if (result.status === "success") {
        setOrderId(result.orderId);
        setStep("success");
        toast.success("Meal claimed successfully!", {
          description: "Show your order number to collect your meal",
        });
      } else if (result.status === "already_claimed") {
        toast.error("This email has already been used to claim a meal");
        setStep("verify");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to claim meal. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const resetForm = () => {
    setStep("verify");
    setEmail("");
    setAttendeeInfo(null);
    setFood("");
    setDrink("");
    setOrderId(null);
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
              <h3 className="text-xl font-semibold">Claim Your Meal</h3>
              <p className="text-sm text-muted-foreground">
                Enter the email you used to register
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
                  Verify Email
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Step 2: Meal Selection */}
        {step === "select" && attendeeInfo && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Check className="w-8 h-8 mx-auto text-green-600" />
              <h3 className="font-semibold">Welcome, {attendeeInfo.name}!</h3>
              <p className="text-sm text-muted-foreground">
                {attendeeInfo.email}
              </p>
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
                      <SelectItem key={f.id} value={f.id} className="text-lg">
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
                      <SelectItem key={d.id} value={d.id} className="text-lg">
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
                    Confirm Order
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
        {step === "success" && orderId && (
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
                Order Confirmed!
              </h3>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your Order Number
                </p>
                <p className="text-4xl font-mono font-bold text-green-700 dark:text-green-400 tracking-wider">
                  #{orderId.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p>✓ {FOODS.find((f) => f.id === food)?.name}</p>
                <p>✓ {DRINKS.find((d) => d.id === drink)?.name}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Show this number at the counter to collect your meal
            </p>

            <Button variant="outline" onClick={resetForm} size="lg">
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

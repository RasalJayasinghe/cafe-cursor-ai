"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Mail, Check, ArrowRight, Sparkles, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

const MEALS = [
  {
    id: "rice-bowl",
    name: "rice-bowl",
    description: "Jasmine rice with seasonal vegetables",
  },
  {
    id: "noodles",
    name: "signature-noodles",
    description: "Hand-pulled noodles in rich broth",
  },
  {
    id: "sandwich",
    name: "artisan-sandwich",
    description: "Fresh baked bread with premium fillings",
  },
  {
    id: "salad",
    name: "garden-salad",
    description: "Organic greens with house dressing",
  },
];

const DRINKS = [
  { id: "espresso", name: "espresso", description: "Double shot, rich & bold" },
  {
    id: "latte",
    name: "cafe-latte",
    description: "Smooth espresso with steamed milk",
  },
  {
    id: "ceylon-tea",
    name: "ceylon-tea",
    description: "Premium Sri Lankan black tea",
  },
  {
    id: "fresh-juice",
    name: "fresh-juice",
    description: "Seasonal fruit blend",
  },
];

interface ClaimMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "verify" | "menu" | "complete" | "already-claimed" | "not-registered";

interface CodeLineProps {
  lineNumber: number;
  children: React.ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

function CodeLine({
  lineNumber,
  children,
  selectable,
  selected,
  onClick,
}: CodeLineProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        selectable ? { backgroundColor: "rgba(255,255,255,0.05)" } : undefined
      }
      className={`flex items-start gap-4 py-1.5 px-2 rounded-md transition-all relative ${
        selectable ? "cursor-pointer" : ""
      } ${selected ? "bg-foreground/15" : ""}`}
    >
      {/* Selection glow effect */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="absolute inset-0 rounded-md border border-foreground/30 shadow-[0_0_15px_rgba(255,255,255,0.15),inset_0_0_20px_rgba(255,255,255,0.05)]"
        />
      )}

      {/* Line number - highlighted when selected */}
      <span
        className={`font-mono text-sm w-6 text-right select-none relative z-10 ${
          selected ? "text-foreground/80" : "text-muted-foreground/50"
        }`}
      >
        {lineNumber}
      </span>

      <div className="flex-1 font-mono text-sm relative z-10">{children}</div>

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex items-center gap-1"
        >
          <span className="text-green-400 text-xs font-mono">selected</span>
          <span className="text-green-400">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ClaimMealDialog({ open, onOpenChange }: ClaimMealDialogProps) {
  const [step, setStep] = useState<Step>("verify");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [orderToken, setOrderToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    
    setIsVerifying(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/attendees/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.registered && !data.alreadyClaimed) {
        // Email is registered and hasn't claimed yet
        setAttendeeName(data.attendee.name);
        setVerified(true);
        toast.success(`Welcome, ${data.attendee.name}!`);
        setTimeout(() => setStep("menu"), 800);
      } else if (response.status === 403) {
        // Email not registered
        setErrorMessage("This email is not registered for the event.");
        setStep("not-registered");
        toast.error("Email not registered");
      } else if (response.status === 409) {
        // Already claimed
        setExistingOrder(data.existingOrder);
        setErrorMessage("You have already claimed your meal. You can't buy again.");
        setStep("already-claimed");
        toast.error("Already claimed");
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedMeal || !selectedDrink) {
      toast.error("Please select both meal and drink");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/tokens/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          foodItem: selectedMeal,
          drinkItem: selectedDrink,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderToken(data.token);
        setStep("complete");
        toast.success("Order confirmed!", {
          description: `Your token: ${data.token}`,
        });
      } else if (response.status === 409) {
        // Already claimed (race condition safety)
        setExistingOrder(data.existingOrder);
        setStep("already-claimed");
        toast.error("You've already claimed your meal");
      } else if (response.status === 403) {
        setStep("not-registered");
        toast.error("Email not registered");
      } else {
        toast.error(data.error || "Failed to claim meal");
      }
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Failed to claim meal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("verify");
      setEmail("");
      setVerified(false);
      setSelectedMeal(null);
      setSelectedDrink(null);
      setAttendeeName("");
      setErrorMessage("");
      setExistingOrder(null);
      setOrderToken(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-[calc(100%-2rem)] sm:w-full p-0 bg-transparent border-0 overflow-hidden max-h-[90vh] sm:max-h-[85vh]">
        <div className="relative">
          {/* Animated glow border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20 rounded-2xl blur-sm animate-pulse" />
          <div className="absolute -inset-[2px] bg-gradient-to-b from-foreground/10 via-transparent to-foreground/10 rounded-2xl" />

          {/* Glowing corner accents */}
          <div className="absolute -top-1 -left-1 w-20 h-20 bg-foreground/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-foreground/20 rounded-full blur-2xl" />

          <motion.div
            layout
            className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-foreground/10 overflow-hidden"
          >
            {/* Animated line decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
              />
              <motion.div
                animate={{ x: ["200%", "-100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
              />
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-foreground/40 to-transparent"
              />
              <motion.div
                animate={{ y: ["200%", "-100%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-foreground/30 to-transparent"
              />
            </div>

            <AnimatePresence mode="wait">
              {step === "verify" && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 sm:p-8 md:p-12"
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-foreground/5 border border-foreground/20 flex items-center justify-center"
                    >
                      <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-foreground/70" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Verify Your Identity
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Enter your email to claim your meal
                    </p>
                  </div>

                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isVerifying || verified}
                        className="h-12 sm:h-14 pl-10 sm:pl-12 bg-foreground/5 border-foreground/20 text-foreground placeholder:text-muted-foreground focus:border-foreground/40 transition-all text-sm sm:text-base"
                      />
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />

                      <AnimatePresence>
                        {verified && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-4 inset-y-0 flex items-center justify-center"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-500" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      onClick={handleVerify}
                      disabled={!email || isVerifying || verified}
                      className="w-full h-11 sm:h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold text-sm sm:text-base"
                    >
                      {isVerifying ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                        />
                      ) : verified ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-5 h-5" /> Verified
                        </span>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="overflow-hidden"
                >
                  {/* Code editor header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      </div>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      ~/cafe-cursor/menu.yml
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/50">
                      yml
                    </span>
                  </div>

                  {/* Code content */}
                  <div className="p-2 sm:p-4 font-mono text-xs sm:text-sm max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                    {/* Command line */}
                    <div className="text-muted-foreground/60 text-[10px] sm:text-xs mb-3 sm:mb-4 px-2">
                      # Select one meal and one drink to complete your order
                    </div>

                    {/* Meals section */}
                    <CodeLine lineNumber={1}>
                      <span className="text-purple-400">meals</span>
                      <span className="text-foreground/60">:</span>
                      <span className="text-muted-foreground/50 ml-4 text-xs">
                        # 4 options
                      </span>
                    </CodeLine>
                    <CodeLine lineNumber={2}>
                      <span className="text-muted-foreground/60 ml-4">
                        type
                      </span>
                      <span className="text-foreground/60">: </span>
                      <span className="text-green-400">"main-course"</span>
                    </CodeLine>
                    <CodeLine lineNumber={3}>
                      <span className="text-muted-foreground/60 ml-4">
                        options
                      </span>
                      <span className="text-foreground/60">:</span>
                    </CodeLine>

                    {MEALS.map((meal, index) => (
                      <CodeLine
                        key={meal.id}
                        lineNumber={4 + index}
                        selectable
                        selected={selectedMeal === meal.id}
                        onClick={() => setSelectedMeal(meal.id)}
                      >
                        <span className="text-foreground/60 ml-6">- </span>
                        <span className="text-yellow-400">{meal.name}</span>
                        <span className="text-foreground/60">:new</span>
                        <span className="text-foreground/40"> | </span>
                        <span className="text-foreground/70">
                          {meal.description}
                        </span>
                      </CodeLine>
                    ))}

                    {/* Spacer */}
                    <CodeLine lineNumber={8}>
                      <span></span>
                    </CodeLine>

                    {/* Drinks section */}
                    <CodeLine lineNumber={9}>
                      <span className="text-purple-400">drinks</span>
                      <span className="text-foreground/60">:</span>
                      <span className="text-muted-foreground/50 ml-4 text-xs">
                        # 4 options
                      </span>
                    </CodeLine>
                    <CodeLine lineNumber={10}>
                      <span className="text-muted-foreground/60 ml-4">
                        size
                      </span>
                      <span className="text-foreground/60">: </span>
                      <span className="text-green-400">"12oz"</span>
                    </CodeLine>
                    <CodeLine lineNumber={11}>
                      <span className="text-muted-foreground/60 ml-4">
                        options
                      </span>
                      <span className="text-foreground/60">:</span>
                    </CodeLine>

                    {DRINKS.map((drink, index) => (
                      <CodeLine
                        key={drink.id}
                        lineNumber={12 + index}
                        selectable
                        selected={selectedDrink === drink.id}
                        onClick={() => setSelectedDrink(drink.id)}
                      >
                        <span className="text-foreground/60 ml-6">- </span>
                        <span className="text-cyan-400">{drink.name}</span>
                        <span className="text-foreground/60">:hot</span>
                        <span className="text-foreground/40"> | </span>
                        <span className="text-foreground/70">
                          {drink.description}
                        </span>
                      </CodeLine>
                    ))}

                    {/* Footer */}
                    <CodeLine lineNumber={16}>
                      <span></span>
                    </CodeLine>
                    <CodeLine lineNumber={17}>
                      <span className="text-muted-foreground/50">
                        # cafe-cursor:colombo
                      </span>
                      <span className="text-muted-foreground/30 ml-8">
                        ✓ Ready to serve
                      </span>
                    </CodeLine>
                  </div>

                  {/* Confirm button */}
                  <div className="p-4 border-t border-foreground/10 bg-foreground/5">
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={!selectedMeal || !selectedDrink || isSubmitting}
                      className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-mono font-semibold disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block"
                            >
                              ⟳
                            </motion.span>
                            Processing...
                          </>
                        ) : (
                          <>
                            $ confirm --order <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 md:p-10"
                >
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-6"
                  >
                    <span className="font-mono text-xs text-muted-foreground/60 tracking-widest uppercase">
                      Cafe Cursor • Colombo
                    </span>
                  </motion.div>

                  {/* Main Token Card */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                    className="relative"
                  >
                    {/* Animated glow behind token */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -inset-4 bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent rounded-3xl blur-xl"
                    />

                    {/* Token container */}
                    <div className="relative bg-gradient-to-b from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/20 overflow-hidden">
                      {/* Dotted edge decoration (like a ticket) */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />

                      {/* Horizontal dashed line */}
                      <div className="absolute left-6 right-6 top-1/2 border-t border-dashed border-foreground/20" />

                      {/* Top section - Token */}
                      <div className="p-6 pb-10 text-center">
                        <span className="font-mono text-xs text-muted-foreground/50 tracking-wider">
                          YOUR TOKEN
                        </span>

                        {/* Big Token Display */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.4,
                            type: "spring",
                            stiffness: 300,
                          }}
                          className="mt-4 mb-2"
                        >
                          <div className="relative inline-block">
                            {/* Token glow */}
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute inset-0 bg-foreground/20 blur-2xl rounded-full"
                            />
                            <span className="relative font-mono text-4xl md:text-5xl font-bold tracking-[0.2em] text-foreground">
                              {orderToken || "CC-0000"}
                            </span>
                          </div>
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-muted-foreground/60 text-sm font-mono"
                        >
                          Show this token to claim your meal
                        </motion.p>
                      </div>

                      {/* Bottom section - Order details */}
                      <div className="p-6 pt-10 bg-foreground/5">
                        <div className="font-mono text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground/50">
                              MEAL
                            </span>
                            <span className="text-yellow-400">
                              {MEALS.find((m) => m.id === selectedMeal)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground/50">
                              DRINK
                            </span>
                            <span className="text-cyan-400">
                              {DRINKS.find((d) => d.id === selectedDrink)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                            <span className="text-muted-foreground/50">
                              STATUS
                            </span>
                            <span className="text-green-400 flex items-center gap-1">
                              <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-green-400"
                              />
                              READY TO CLAIM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Scanlines effect overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.03 }}
                    transition={{ delay: 0.5 }}
                    className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"
                  />

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="border-foreground/20 hover:bg-foreground/10 font-mono text-xs tracking-wider"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      DONE
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Not Registered Error */}
              {step === "not-registered" && (
                <motion.div
                  key="not-registered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 sm:p-6 md:p-10"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div 
                      className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center"
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <span className="text-3xl sm:text-4xl">🤔</span>
                    </motion.div>
                    
                    <motion.h3 
                      className="font-mono text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2 sm:mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      bestie who dis??
                    </motion.h3>
                    
                    <motion.p 
                      className="text-foreground/60 text-sm font-mono mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {email}
                    </motion.p>
                    
                    <motion.div
                      className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 mb-6 max-w-sm mx-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-muted-foreground/70 text-sm font-mono leading-relaxed">
                        ngl we don't have you on the list 💀
                      </p>
                      <p className="text-muted-foreground/50 text-xs font-mono mt-2">
                        double check that email or slide into registration first
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={() => {
                          setStep("verify");
                          setEmail("");
                          setErrorMessage("");
                        }}
                        className="bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-wider"
                      >
                        <span className="mr-2">🔄</span> lemme try again
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {/* Already Claimed Error */}
              {step === "already-claimed" && existingOrder && (
                <motion.div
                  key="already-claimed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 sm:p-6 md:p-10"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div 
                      className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <span className="text-3xl sm:text-4xl">😏</span>
                    </motion.div>
                    
                    <motion.h3 
                      className="font-mono text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      round two huh? 👀
                    </motion.h3>
                    
                    <motion.p 
                      className="text-foreground/60 text-sm font-mono mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      caught you tryna double dip 🍽️
                    </motion.p>
                    
                    <motion.p 
                      className="text-muted-foreground/50 text-xs font-mono mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      you claimed on {new Date(existingOrder.claimedAt).toLocaleDateString()} at {new Date(existingOrder.claimedAt).toLocaleTimeString()}
                    </motion.p>

                    {/* Existing Order Token */}
                    <motion.div 
                      className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="font-mono text-xs text-orange-400/70 tracking-wider uppercase">
                        your token still valid tho
                      </span>
                      <motion.div 
                        className="font-mono text-3xl font-bold tracking-[0.15em] text-orange-400 mt-2"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {existingOrder.token}
                      </motion.div>
                      
                      <div className="mt-4 space-y-1.5 text-left">
                        <p className="font-mono text-xs text-muted-foreground/50 uppercase tracking-wider">what u ordered:</p>
                        {existingOrder.items.map((item: any, idx: number) => (
                          <p key={idx} className="font-mono text-sm text-foreground/70 flex items-center gap-2">
                            <span className="text-green-400">✓</span> {item.name}
                          </p>
                        ))}
                      </div>
                    </motion.div>

                    <motion.p 
                      className="text-muted-foreground/50 text-xs font-mono mb-4 max-w-sm mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      haven't grabbed your food yet? just show this token at the counter and you're golden ✨
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        onClick={handleClose}
                        className="bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-wider"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        bet, i'm out
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

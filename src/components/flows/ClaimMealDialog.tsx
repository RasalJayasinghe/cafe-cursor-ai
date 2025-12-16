import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check, Coffee, UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

const MEALS = [
  { id: 'rice-bowl', name: 'Rice Bowl', description: 'Jasmine rice with seasonal vegetables' },
  { id: 'noodles', name: 'Signature Noodles', description: 'Hand-pulled noodles in rich broth' },
  { id: 'sandwich', name: 'Artisan Sandwich', description: 'Fresh baked bread with premium fillings' },
  { id: 'salad', name: 'Garden Salad', description: 'Organic greens with house dressing' },
];

const DRINKS = [
  { id: 'coffee', name: 'Espresso', description: 'Double shot, rich & bold' },
  { id: 'latte', name: 'Café Latte', description: 'Smooth espresso with steamed milk' },
  { id: 'tea', name: 'Ceylon Tea', description: 'Premium Sri Lankan black tea' },
  { id: 'juice', name: 'Fresh Juice', description: 'Seasonal fruit blend' },
];

interface ClaimMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'verify' | 'menu' | 'complete';

export function ClaimMealDialog({ open, onOpenChange }: ClaimMealDialogProps) {
  const [step, setStep] = useState<Step>('verify');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!email) return;
    setIsVerifying(true);
    // Simulate verification delay (frontend only)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setVerified(true);
    setTimeout(() => setStep('menu'), 800);
  };

  const handleConfirmOrder = () => {
    if (selectedMeal && selectedDrink) {
      setStep('complete');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep('verify');
      setEmail('');
      setVerified(false);
      setSelectedMeal(null);
      setSelectedDrink(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 bg-transparent border-0 overflow-hidden">
        {/* Glowing container */}
        <div className="relative">
          {/* Animated glow border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20 rounded-2xl blur-sm animate-pulse" />
          <div className="absolute -inset-[2px] bg-gradient-to-b from-foreground/10 via-transparent to-foreground/10 rounded-2xl" />
          
          {/* Glowing corner accents */}
          <div className="absolute -top-1 -left-1 w-20 h-20 bg-foreground/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-foreground/20 rounded-full blur-2xl" />
          
          {/* Main content */}
          <motion.div
            layout
            className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-foreground/10 overflow-hidden"
          >
            {/* Animated line decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
              />
              <motion.div
                animate={{ x: ['200%', '-100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
              />
              <motion.div
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-foreground/40 to-transparent"
              />
              <motion.div
                animate={{ y: ['200%', '-100%'] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 right-0 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-foreground/30 to-transparent"
              />
            </div>

            <AnimatePresence mode="wait">
              {step === 'verify' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 md:p-12"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/5 border border-foreground/20 flex items-center justify-center"
                    >
                      <Mail className="w-8 h-8 text-foreground/70" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Verify Your Identity
                    </h2>
                    <p className="text-muted-foreground">
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
                        className="h-14 pl-12 bg-foreground/5 border-foreground/20 text-foreground placeholder:text-muted-foreground focus:border-foreground/40 transition-all"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      
                      {/* Verification success indicator */}
                      <AnimatePresence>
                        {verified && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
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
                      className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                    >
                      {isVerifying ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                        />
                      ) : verified ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-5 h-5" /> Verified
                        </span>
                      ) : (
                        'Verify Email'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 md:p-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Select Your Order
                    </h2>
                    <p className="text-muted-foreground">
                      Choose one meal and one drink
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Meals */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <UtensilsCrossed className="w-5 h-5 text-foreground/70" />
                        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                          Meals
                        </span>
                      </div>
                      <div className="space-y-2">
                        {MEALS.map((meal) => (
                          <motion.button
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              selectedMeal === meal.id
                                ? 'bg-foreground/10 border-foreground/40'
                                : 'bg-foreground/5 border-foreground/10 hover:border-foreground/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{meal.name}</p>
                                <p className="text-sm text-muted-foreground">{meal.description}</p>
                              </div>
                              {selectedMeal === meal.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center"
                                >
                                  <Check className="w-4 h-4 text-background" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Drinks */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Coffee className="w-5 h-5 text-foreground/70" />
                        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                          Drinks
                        </span>
                      </div>
                      <div className="space-y-2">
                        {DRINKS.map((drink) => (
                          <motion.button
                            key={drink.id}
                            onClick={() => setSelectedDrink(drink.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              selectedDrink === drink.id
                                ? 'bg-foreground/10 border-foreground/40'
                                : 'bg-foreground/5 border-foreground/10 hover:border-foreground/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{drink.name}</p>
                                <p className="text-sm text-muted-foreground">{drink.description}</p>
                              </div>
                              {selectedDrink === drink.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center"
                                >
                                  <Check className="w-4 h-4 text-background" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={!selectedMeal || !selectedDrink}
                      className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        Confirm Order <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {step === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 md:p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-foreground" />
                  </motion.div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Your meal will be ready shortly. Show this screen to collect your order.
                  </p>

                  <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Your Order</p>
                    <p className="text-lg font-medium text-foreground">
                      {MEALS.find(m => m.id === selectedMeal)?.name} + {DRINKS.find(d => d.id === selectedDrink)?.name}
                    </p>
                  </div>

                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="border-foreground/20 hover:bg-foreground/10"
                  >
                    Done
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

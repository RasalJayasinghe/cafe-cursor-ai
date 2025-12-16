import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';

const MEALS = [
  { id: 'rice-bowl', name: 'rice-bowl', description: 'Jasmine rice with seasonal vegetables' },
  { id: 'noodles', name: 'signature-noodles', description: 'Hand-pulled noodles in rich broth' },
  { id: 'sandwich', name: 'artisan-sandwich', description: 'Fresh baked bread with premium fillings' },
  { id: 'salad', name: 'garden-salad', description: 'Organic greens with house dressing' },
];

const DRINKS = [
  { id: 'espresso', name: 'espresso', description: 'Double shot, rich & bold' },
  { id: 'latte', name: 'cafe-latte', description: 'Smooth espresso with steamed milk' },
  { id: 'ceylon-tea', name: 'ceylon-tea', description: 'Premium Sri Lankan black tea' },
  { id: 'fresh-juice', name: 'fresh-juice', description: 'Seasonal fruit blend' },
];

interface ClaimMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'verify' | 'menu' | 'complete';

interface CodeLineProps {
  lineNumber: number;
  children: React.ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

function CodeLine({ lineNumber, children, selectable, selected, onClick }: CodeLineProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={selectable ? { backgroundColor: 'rgba(255,255,255,0.05)' } : undefined}
      className={`flex items-start gap-4 py-1.5 px-2 rounded-md transition-all relative ${
        selectable ? 'cursor-pointer' : ''
      } ${selected ? 'bg-foreground/15' : ''}`}
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
      <span className={`font-mono text-sm w-6 text-right select-none relative z-10 ${
        selected ? 'text-foreground/80' : 'text-muted-foreground/50'
      }`}>
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
  const [step, setStep] = useState<Step>('verify');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!email) return;
    setIsVerifying(true);
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
      <DialogContent className="max-w-2xl p-0 bg-transparent border-0 overflow-hidden max-h-[90vh] sm:max-h-[85vh]">
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
                      <span className="text-muted-foreground/50 ml-4 text-xs"># 4 options</span>
                    </CodeLine>
                    <CodeLine lineNumber={2}>
                      <span className="text-muted-foreground/60 ml-4">type</span>
                      <span className="text-foreground/60">: </span>
                      <span className="text-green-400">"main-course"</span>
                    </CodeLine>
                    <CodeLine lineNumber={3}>
                      <span className="text-muted-foreground/60 ml-4">options</span>
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
                        <span className="text-foreground/70">{meal.description}</span>
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
                      <span className="text-muted-foreground/50 ml-4 text-xs"># 4 options</span>
                    </CodeLine>
                    <CodeLine lineNumber={10}>
                      <span className="text-muted-foreground/60 ml-4">size</span>
                      <span className="text-foreground/60">: </span>
                      <span className="text-green-400">"12oz"</span>
                    </CodeLine>
                    <CodeLine lineNumber={11}>
                      <span className="text-muted-foreground/60 ml-4">options</span>
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
                        <span className="text-foreground/70">{drink.description}</span>
                      </CodeLine>
                    ))}

                    {/* Footer */}
                    <CodeLine lineNumber={16}>
                      <span></span>
                    </CodeLine>
                    <CodeLine lineNumber={17}>
                      <span className="text-muted-foreground/50"># cafe-cursor:colombo</span>
                      <span className="text-muted-foreground/30 ml-8">✓ Ready to serve</span>
                    </CodeLine>
                  </div>

                  {/* Confirm button */}
                  <div className="p-4 border-t border-foreground/10 bg-foreground/5">
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={!selectedMeal || !selectedDrink}
                      className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-mono font-semibold disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        $ confirm --order <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'complete' && (
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
                    transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                    className="relative"
                  >
                    {/* Animated glow behind token */}
                    <motion.div
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
                          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
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
                              CC-7842
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
                            <span className="text-muted-foreground/50">MEAL</span>
                            <span className="text-yellow-400">{MEALS.find(m => m.id === selectedMeal)?.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground/50">DRINK</span>
                            <span className="text-cyan-400">{DRINKS.find(d => d.id === selectedDrink)?.name}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                            <span className="text-muted-foreground/50">STATUS</span>
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
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

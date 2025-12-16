import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Check, Coffee, UtensilsCrossed, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type Filter = 'pending' | 'completed' | 'all';

// Sample static data for preview
const SAMPLE_TOKENS = [
  { id: '1', token: 'CC-7842', name: 'John Doe', email: 'john@example.com', food: 'rice-bowl', drink: 'cafe-latte', createdAt: new Date(Date.now() - 5 * 60000).toISOString(), used: false },
  { id: '2', token: 'CC-3156', name: 'Jane Smith', email: 'jane@example.com', food: 'signature-noodles', drink: 'ceylon-tea', createdAt: new Date(Date.now() - 12 * 60000).toISOString(), used: false },
  { id: '3', token: 'CC-9284', name: 'Mike Chen', email: 'mike@example.com', food: 'artisan-sandwich', drink: 'espresso', createdAt: new Date(Date.now() - 25 * 60000).toISOString(), used: true },
  { id: '4', token: 'CC-4721', name: 'Sarah Lee', email: 'sarah@example.com', food: 'garden-salad', drink: 'fresh-juice', createdAt: new Date(Date.now() - 45 * 60000).toISOString(), used: false },
  { id: '5', token: 'CC-6038', name: 'Alex Kumar', email: 'alex@example.com', food: 'rice-bowl', drink: 'ceylon-tea', createdAt: new Date(Date.now() - 60 * 60000).toISOString(), used: true },
];

export default function WorkersDashboard() {
  const { tokens: realTokens, markTokenUsed } = useApp();
  const [filter, setFilter] = useState<Filter>('pending');
  
  // Use sample data if no real tokens exist
  const tokens = realTokens.length > 0 ? realTokens : SAMPLE_TOKENS;

  const filteredTokens = tokens.filter(token => {
    if (filter === 'pending') return !token.used;
    if (filter === 'completed') return token.used;
    return true;
  });

  const pendingCount = tokens.filter(t => !t.used).length;
  const completedCount = tokens.filter(t => t.used).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-foreground/5">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Top row - back button and stats */}
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <Link to="/">
              <Button variant="ghost" size="sm" className="font-mono text-xs px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            
            {/* Stats */}
            <div className="flex gap-3 sm:gap-4 font-mono text-xs">
              <div className="text-center">
                <div className="text-yellow-400 text-base sm:text-lg font-bold">{pendingCount}</div>
                <div className="text-muted-foreground/60 text-[10px] sm:text-xs">pending</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-base sm:text-lg font-bold">{completedCount}</div>
                <div className="text-muted-foreground/60 text-[10px] sm:text-xs">done</div>
              </div>
            </div>
          </div>
          
          {/* Title row */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 relative">
            <h1 className="font-mono text-base sm:text-lg font-bold">Workers Dashboard</h1>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">Cafe Cursor • Colombo</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs overflow-x-auto pb-1">
          {(['pending', 'completed', 'all'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                filter === f
                  ? 'bg-foreground/10 border border-foreground/20 text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {f === 'pending' && `pending (${pendingCount})`}
              {f === 'completed' && `completed (${completedCount})`}
              {f === 'all' && `all (${tokens.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-8">
        <AnimatePresence mode="popLayout">
          {filteredTokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-mono text-muted-foreground/60">No {filter} orders</p>
            </motion.div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredTokens.map((token, index) => (
                <motion.div
                  key={token.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative group ${token.used ? 'opacity-60' : ''}`}
                >
                  {/* Card */}
                  <div className={`
                    relative bg-foreground/5 border rounded-xl overflow-hidden transition-all
                    ${token.used ? 'border-foreground/10' : 'border-foreground/20 hover:border-foreground/30'}
                  `}>
                    {/* Glow effect for pending */}
                    {!token.used && (
                      <div className="absolute -inset-px bg-gradient-to-r from-yellow-500/10 via-transparent to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <div className="relative p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Top row on mobile: checkbox + token + status */}
                      <div className="flex items-center justify-between sm:contents">
                        {/* Checkbox */}
                        <button
                          onClick={() => !token.used && markTokenUsed(token.id)}
                          disabled={token.used}
                          className={`
                            w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
                            ${token.used 
                              ? 'bg-green-500/20 border-green-500/50 cursor-default' 
                              : 'border-foreground/30 hover:border-foreground/50 hover:bg-foreground/10 cursor-pointer'
                            }
                          `}
                        >
                          {token.used && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                            </motion.div>
                          )}
                        </button>

                        {/* Token Number */}
                        <div className="flex-shrink-0">
                          <div className="font-mono text-lg sm:text-2xl font-bold tracking-wider">
                            {token.token}
                          </div>
                        </div>

                        {/* Status - visible on mobile in top row */}
                        <div className="sm:hidden text-right font-mono text-[10px]">
                          <div className={`${token.used ? 'text-green-400' : 'text-yellow-400'}`}>
                            {token.used ? '✓ done' : '● pending'}
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 font-mono text-xs sm:text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400">{token.food}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400">{token.drink}</span>
                        </div>
                      </div>

                      {/* Time & Status - hidden on mobile, shown on desktop */}
                      <div className="hidden sm:block text-right font-mono text-xs flex-shrink-0">
                        <div className="flex items-center gap-1 text-muted-foreground/60 mb-1">
                          <Clock className="w-3 h-3" />
                          {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`${token.used ? 'text-green-400' : 'text-yellow-400'}`}>
                          {token.used ? '✓ done' : '● pending'}
                        </div>
                      </div>

                      {/* Time on mobile - bottom row */}
                      <div className="sm:hidden flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
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

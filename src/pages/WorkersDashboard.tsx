import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Check, Coffee, UtensilsCrossed, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type Filter = 'pending' | 'completed' | 'all';

export default function WorkersDashboard() {
  const { tokens, markTokenUsed } = useApp();
  const [filter, setFilter] = useState<Filter>('pending');

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="font-mono text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-mono text-lg font-bold">Workers Dashboard</h1>
              <p className="font-mono text-xs text-muted-foreground">Cafe Cursor • Colombo</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 font-mono text-xs">
            <div className="text-center">
              <div className="text-yellow-400 text-lg font-bold">{pendingCount}</div>
              <div className="text-muted-foreground/60">pending</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">{completedCount}</div>
              <div className="text-muted-foreground/60">done</div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 font-mono text-xs">
          {(['pending', 'completed', 'all'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
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
      <div className="max-w-4xl mx-auto px-4 pb-8">
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
            <div className="space-y-3">
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
                    
                    <div className="relative p-4 flex items-center gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => !token.used && markTokenUsed(token.id)}
                        disabled={token.used}
                        className={`
                          w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
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
                            <Check className="w-5 h-5 text-green-400" />
                          </motion.div>
                        )}
                      </button>

                      {/* Token Number */}
                      <div className="flex-shrink-0">
                        <div className="font-mono text-2xl font-bold tracking-wider">
                          {token.token}
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 font-mono text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400">{token.food}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400">{token.drink}</span>
                        </div>
                      </div>

                      {/* Time & Status */}
                      <div className="text-right font-mono text-xs flex-shrink-0">
                        <div className="flex items-center gap-1 text-muted-foreground/60 mb-1">
                          <Clock className="w-3 h-3" />
                          {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`${token.used ? 'text-green-400' : 'text-yellow-400'}`}>
                          {token.used ? '✓ done' : '● pending'}
                        </div>
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

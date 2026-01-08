"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Button } from '@/src/components/ui/button';
import { Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { tokens, markTokenUsed, deleteToken } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');

  const filteredTokens = tokens.filter((token) => {
    if (filter === 'active') return !token.used;
    if (filter === 'used') return token.used;
    return true;
  });

  const handleSend = (id: string) => {
    markTokenUsed(id);
    toast.success('Token marked as used!');
  };

  const handleDelete = (id: string) => {
    deleteToken(id);
    toast.success('Token deleted');
  };

  return (
    <section id="dashboard" ref={ref} className="min-h-screen snap-section flex items-center bg-background">
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage your meal tokens
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'active', 'used'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Token list */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {filteredTokens.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No tokens found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create tokens using the Claim Meal flow
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredTokens.map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="p-4 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Token</p>
                        <p className="font-semibold text-foreground">{token.token}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Name</p>
                        <p className="text-foreground">{token.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Order</p>
                        <p className="text-foreground">{token.food} + {token.drink}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Created</p>
                        <p className="text-foreground">
                          {new Date(token.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Status</p>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            token.used
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {token.used ? 'Used' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!token.used && (
                        <Button
                          size="sm"
                          onClick={() => handleSend(token.id)}
                          className="gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(token.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

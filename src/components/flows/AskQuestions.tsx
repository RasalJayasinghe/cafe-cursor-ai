"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { useApp } from "@/src/context/AppContext";
import { toast } from "sonner";
import { Send, CheckCircle, Circle } from "lucide-react";

export function AskQuestions() {
  const { questions, addQuestion, toggleQuestionAnswered } = useApp();
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    addQuestion({
      id: crypto.randomUUID(),
      question: question.trim(),
      createdAt: new Date().toISOString(),
      answered: false,
    });

    toast.success("Question submitted!");
    setQuestion("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Question Input */}
      <div className="space-y-2">
        <Label htmlFor="question">Ask a Question</Label>
        <Textarea
          id="question"
          placeholder="What would you like to know?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">Press ⌘+Enter to submit</p>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full gap-2"
        disabled={!question.trim()}
      >
        <Send className="w-4 h-4" />
        Submit Question
      </Button>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Recent Questions
            </h4>
            <span className="text-xs text-muted-foreground">
              {questions.filter((q) => !q.answered).length} unanswered
            </span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    q.answered
                      ? "bg-muted/50 border-border"
                      : "bg-card border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        toggleQuestionAnswered(q.id);
                        toast.success(
                          q.answered
                            ? "Marked as unanswered"
                            : "Marked as answered"
                        );
                      }}
                      className="flex-shrink-0 mt-0.5"
                      aria-label={
                        q.answered ? "Mark as unanswered" : "Mark as answered"
                      }
                    >
                      {q.answered ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          q.answered
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {q.question}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(q.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

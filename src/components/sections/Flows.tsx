import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Utensils, FileText, Share2, MessageCircle } from "lucide-react";
import { ClaimMealNew } from "@/src/components/flows/ClaimMealNew";
import { PostGeneration } from "@/src/components/flows/PostGeneration";
import { ShareProject } from "@/src/components/flows/ShareProject";
import { AskQuestions } from "@/src/components/flows/AskQuestions";

const flows = [
  { id: "claim", icon: Utensils, label: "Claim Meal", component: ClaimMealNew },
  {
    id: "post",
    icon: FileText,
    label: "Post Generation",
    component: PostGeneration,
  },
  {
    id: "share",
    icon: Share2,
    label: "Share Project",
    component: ShareProject,
  },
  {
    id: "ask",
    icon: MessageCircle,
    label: "Ask Questions",
    component: AskQuestions,
  },
];

export function Flows() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  return (
    <section
      id="flows"
      ref={ref}
      className="min-h-screen snap-section flex items-center bg-surface"
    >
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Interactive Flows
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Click a card to expand and try each flow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {flows.map((flow, index) => {
            const isExpanded = expandedFlow === flow.id;
            const FlowComponent = flow.component;

            return (
              <motion.div
                key={flow.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                layout
                className={`bg-card border border-border rounded-2xl overflow-hidden transition-shadow ${
                  isExpanded ? "md:col-span-2 shadow-xl" : "hover:shadow-lg"
                }`}
              >
                <motion.button
                  layout="position"
                  onClick={() => setExpandedFlow(isExpanded ? null : flow.id)}
                  className="w-full p-6 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <flow.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {flow.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isExpanded ? "Click to collapse" : "Click to expand"}
                    </p>
                  </div>
                </motion.button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border p-6"
                  >
                    <FlowComponent />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

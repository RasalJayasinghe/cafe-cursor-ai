import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Check, Upload, Twitter, Linkedin, Info } from "lucide-react";

type Platform = "x" | "linkedin";

const generateTemplate = (
  caption: string,
  platform: Platform,
  imageName: string | null
) => {
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (platform === "x") {
    return `${caption}

${imageName ? `[📸 ${imageName}]\n\n` : ""}#CafeCursor #TechCommunity #Colombo

— vibing at Cafe Cursor ☕️✨ • ${date}`;
  }

  return `${caption}

${imageName ? `📸 [${imageName}]\n\n` : ""}---

💭 thoughts? drop 'em below
🔄 found this interesting? pass it on

#CafeCursor #TechCommunity #Colombo #BuildInPublic

— made at Cafe Cursor ☕️ • ${date}`;
};

export function PostGeneration() {
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [imageName, setImageName] = useState<string | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      toast.success(`Image selected: ${file.name}`);
    }
  };

  const handleGenerate = () => {
    if (!caption.trim()) {
      toast.error("Please enter a caption");
      return;
    }
    const template = generateTemplate(caption, platform, imageName);
    setGeneratedTemplate(template);
    toast.success("Template generated!");
  };

  const handleCopy = async () => {
    if (generatedTemplate) {
      await navigator.clipboard.writeText(generatedTemplate);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCaption("");
    setImageName(null);
    setGeneratedTemplate(null);
    setCopied(false);
  };

  const handleShareToTwitter = () => {
    if (!generatedTemplate) return;

    // Twitter/X share URL with pre-filled text
    const tweetText = encodeURIComponent(generatedTemplate);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    // Open in new window
    window.open(twitterUrl, "_blank", "width=550,height=420");
    toast.success("Opening Twitter...");
  };

  const handleShareToLinkedIn = async () => {
    if (!generatedTemplate) return;

    // LinkedIn removed pre-filled text support for security reasons
    // Best UX: Copy to clipboard, then open LinkedIn's post creation page directly
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(generatedTemplate);

      // Open LinkedIn's actual "Create a post" page (not share dialog)
      // This opens in a new tab where they can paste
      const linkedInUrl = "https://www.linkedin.com/feed/?shareActive=true";
      window.open(linkedInUrl, "_blank");

      toast.success("✅ Content copied to clipboard!", {
        description: "Press Ctrl+V (or Cmd+V) to paste in LinkedIn",
        duration: 5000,
      });
    } catch (error) {
      // Fallback: Try legacy method
      try {
        const textArea = document.createElement("textarea");
        textArea.value = generatedTemplate;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          const linkedInUrl = "https://www.linkedin.com/feed/?shareActive=true";
          window.open(linkedInUrl, "_blank");

          toast.success("✅ Content copied to clipboard!", {
            description: "Press Ctrl+V (or Cmd+V) to paste in LinkedIn",
            duration: 5000,
          });
        } else {
          throw new Error("Copy command failed");
        }
      } catch (fallbackError) {
        toast.error("Failed to copy content", {
          description: "Please copy manually and paste in LinkedIn",
        });
      }
    }
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Platform Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">where you posting? 📱</Label>
        <Select
          value={platform}
          onValueChange={(v) => setPlatform(v as Platform)}
        >
          <SelectTrigger className="bg-foreground/5 border-foreground/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />X (Twitter)
              </div>
            </SelectItem>
            <SelectItem value="linkedin">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Caption Input */}
      <div className="space-y-2">
        <Label htmlFor="caption" className="text-xs font-mono text-muted-foreground uppercase tracking-wider">drop your thoughts ✍️</Label>
        <Textarea
          id="caption"
          placeholder="what's on your mind? spill the tea..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="min-h-[100px] bg-foreground/5 border-foreground/20"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">add a pic (optional) 📸</Label>
        <label className="block">
          <div className="flex items-center gap-2 px-4 py-3 border border-foreground/20 bg-foreground/5 rounded-lg cursor-pointer hover:bg-foreground/10 transition-colors">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-mono">
              {imageName || "tap to upload something fire 🔥"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {imageName && (
          <button
            onClick={() => setImageName(null)}
            className="text-sm text-muted-foreground hover:text-foreground font-mono"
          >
            ❌ remove
          </button>
        )}
      </div>

      {/* Generate Button */}
      {!generatedTemplate && (
        <Button
          onClick={handleGenerate}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-mono"
          disabled={!caption.trim()}
        >
          ✨ make it happen
        </Button>
      )}

      {/* Generated Template */}
      <AnimatePresence>
        {generatedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-foreground/70 flex items-center gap-2 uppercase tracking-wider">
                  {platform === "x" ? (
                    <Twitter className="w-4 h-4" />
                  ) : (
                    <Linkedin className="w-4 h-4" />
                  )}
                  preview looks fire 🔥
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                {generatedTemplate}
              </pre>
            </div>

            {/* LinkedIn Helper Info */}
            {platform === "linkedin" && (
              <div className="flex gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-100/80">
                  <p className="font-mono font-medium mb-1 text-blue-400">quick linkedin hack:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-200/70 font-mono text-xs">
                    <li>hit "share to linkedin" below</li>
                    <li>we'll copy it for you automatically 😎</li>
                    <li>
                      just{" "}
                      <kbd className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs font-mono">
                        Ctrl+V
                      </kbd>{" "}
                      or{" "}
                      <kbd className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs font-mono">
                        ⌘+V
                      </kbd>{" "}
                      to paste
                    </li>
                  </ol>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 gap-2 border-foreground/20 hover:bg-foreground/10 font-mono text-xs"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "copied! ✨" : "copy"}
              </Button>

              {platform === "x" ? (
                <Button
                  onClick={handleShareToTwitter}
                  className="flex-1 gap-2 bg-black hover:bg-black/90 font-mono text-xs"
                >
                  <Twitter className="w-4 h-4" />
                  post to X
                </Button>
              ) : (
                <Button
                  onClick={handleShareToLinkedIn}
                  className="flex-1 gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 font-mono text-xs"
                >
                  <Linkedin className="w-4 h-4" />
                  share to linkedin
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={handleReset}
                className="border-foreground/20 hover:bg-foreground/10 font-mono text-xs"
              >
                🔄 new
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

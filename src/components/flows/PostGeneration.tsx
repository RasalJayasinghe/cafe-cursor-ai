import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, Check, Upload, Twitter, Linkedin } from 'lucide-react';

type Platform = 'x' | 'linkedin';

const generateTemplate = (caption: string, platform: Platform, imageName: string | null) => {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  if (platform === 'x') {
    return `🚀 ${caption}

${imageName ? `[Image: ${imageName}]\n\n` : ''}#AI #Tech #Innovation

— Posted via Cafe Cursor • ${date}`;
  }
  
  return `${caption}

${imageName ? `📸 [Image: ${imageName}]\n\n` : ''}---

🔹 What do you think? Drop your thoughts in the comments!
🔹 If this resonates, consider sharing with your network.

#AI #Technology #Innovation #Community

Posted via Cafe Cursor • ${date}`;
};

export function PostGeneration() {
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<Platform>('x');
  const [imageName, setImageName] = useState<string | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<string | null>(null);
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
      toast.error('Please enter a caption');
      return;
    }
    const template = generateTemplate(caption, platform, imageName);
    setGeneratedTemplate(template);
    toast.success('Template generated!');
  };

  const handleCopy = async () => {
    if (generatedTemplate) {
      await navigator.clipboard.writeText(generatedTemplate);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCaption('');
    setImageName(null);
    setGeneratedTemplate(null);
    setCopied(false);
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Platform Selection */}
      <div className="space-y-2">
        <Label>Platform</Label>
        <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                X (Twitter)
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
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          placeholder="Write your post content here..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Image (Optional)</Label>
        <label className="block">
          <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {imageName || 'Upload an image'}
            </span>
          </div>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
        {imageName && (
          <button
            onClick={() => setImageName(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Remove image
          </button>
        )}
      </div>

      {/* Generate Button */}
      {!generatedTemplate && (
        <Button onClick={handleGenerate} className="w-full" disabled={!caption.trim()}>
          Generate Template
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
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {platform === 'x' ? <Twitter className="w-4 h-4" /> : <Linkedin className="w-4 h-4" />}
                  Preview
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                {generatedTemplate}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex-1 gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Create New
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

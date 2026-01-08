"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useApp } from "@/src/context/AppContext";
import { toast } from "sonner";
import { Copy, ExternalLink, Check } from "lucide-react";

export function ShareProject() {
  const { sharedProjects, addSharedProject } = useApp();
  const [projectName, setProjectName] = useState("");
  const [personName, setPersonName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = () => {
    if (!projectName.trim() || !personName.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    const id = Math.random().toString(36).substring(2, 8);
    const shortLink = `https://app.cafecursor/demo/${id}`;

    addSharedProject({
      id: crypto.randomUUID(),
      projectName,
      personName,
      linkedinUrl,
      githubUrl,
      description,
      shortLink,
      createdAt: new Date().toISOString(),
    });

    toast.success("Project shared!", { description: shortLink });

    // Reset form
    setProjectName("");
    setPersonName("");
    setLinkedinUrl("");
    setGithubUrl("");
    setDescription("");
  };

  const handleCopy = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpen = (link: string) => {
    toast.info("Demo link opened (simulated)");
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Form */}
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              placeholder="My AI App"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person-name">Your Name *</Label>
            <Input
              id="person-name"
              placeholder="John Doe"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            placeholder="A brief description of your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20"
          />
        </div>
      </div>

      <Button
        onClick={handleShare}
        className="w-full"
        disabled={!projectName.trim() || !personName.trim()}
      >
        Share Project
      </Button>

      {/* Shared Projects List */}
      {sharedProjects.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Shared Projects
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {sharedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {project.projectName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.personName}
                      </p>
                      <p className="text-xs text-primary truncate mt-1">
                        {project.shortLink}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopy(project.shortLink, project.id)
                        }
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === project.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpen(project.shortLink)}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
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

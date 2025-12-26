"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  User,
  FolderGit2,
  X,
  RefreshCw,
  Heart,
  Loader2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  githubUrl?: string;
  liveUrl?: string;
  linkedinUrl?: string;
  tags: string[];
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    githubUrl: "",
    linkedinUrl: "",
    liveUrl: "",
    description: "",
    tags: "",
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Submit new project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.githubUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl || undefined,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
        }),
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects((prev) => [newProject, ...prev]);
        toast.success("Project shared successfully!");
        setFormData({
          title: "",
          author: "",
          githubUrl: "",
          linkedinUrl: "",
          liveUrl: "",
          description: "",
          tags: "",
        });
        setShowForm(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to share project");
      }
    } catch (error) {
      console.error("Error sharing project:", error);
      toast.error("Failed to share project");
    } finally {
      setSubmitting(false);
    }
  };

  // Like a project
  const handleLike = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updated : p))
        );
      }
    } catch (error) {
      console.error("Error liking project:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-muted-foreground" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-foreground/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-xs px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="font-mono text-sm sm:text-lg font-bold truncate">
                Project Gallery
              </h1>
              <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                {projects.length} projects shared • Cafe Cursor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchProjects()}
              className="font-mono text-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="font-mono text-[10px] sm:text-xs bg-foreground text-background hover:bg-foreground/90 px-2 sm:px-3 h-8 sm:h-9 flex-shrink-0"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Share Project</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {projects.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden hover:border-foreground/20 transition-all">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Code editor header */}
                    <div className="relative flex items-center gap-2 px-4 py-2 border-b border-foreground/10 bg-foreground/5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground/60 ml-2 truncate">
                        ~/{project.title.toLowerCase().replace(/\s+/g, "-")}
                        /README.md
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative p-4 space-y-3">
                      {/* Project name */}
                      <div className="font-mono">
                        <span className="text-purple-400 text-xs"># </span>
                        <span className="text-lg font-bold">{project.title}</span>
                      </div>

                      {/* Description */}
                      <p className="font-mono text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {project.description || "No description provided"}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-xs font-mono bg-foreground/10 text-foreground/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author info */}
                      <div className="pt-3 border-t border-foreground/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <User className="w-3 h-3 text-muted-foreground/60" />
                            <span className="text-foreground/80">
                              {project.author}
                            </span>
                          </div>
                          <button
                            onClick={() => handleLike(project.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-3 h-3" />
                            <span>{project.likes}</span>
                          </button>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <Github className="w-3 h-3" />
                              <span>GitHub</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 font-mono text-xs text-green-400 hover:text-green-300 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live</span>
                            </a>
                          )}
                        </div>

                        {/* Time */}
                        <p className="font-mono text-[10px] text-muted-foreground/40">
                          Shared{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <FolderGit2 className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-muted-foreground/60">
              No projects shared yet
            </p>
            <p className="font-mono text-xs text-muted-foreground/40 mt-1">
              Be the first to share your project!
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 font-mono"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Project
            </Button>
          </div>
        )}
      </div>

      {/* Share Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] sm:max-h-none overflow-y-auto"
            >
              {/* Glow border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20 rounded-t-2xl sm:rounded-2xl blur-sm" />

              <div className="relative bg-background border border-foreground/10 rounded-t-2xl sm:rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground ml-2">
                      ~/share-project.sh
                    </span>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1 hover:bg-foreground/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="font-mono text-xs text-muted-foreground/60 mb-4">
                    # Fill in your project details
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-purple-400">
                      project_title<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="My Awesome Project"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-purple-400">
                      your_name<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="John Doe"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-cyan-400">
                      github_url<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/project"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-green-400">
                      live_url
                    </label>
                    <Input
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, liveUrl: e.target.value })
                      }
                      placeholder="https://myproject.vercel.app"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-yellow-400">
                      tags
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="react, ai, nextjs (comma separated)"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-green-400">
                      description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Tell us about your project..."
                      rows={3}
                      className="font-mono bg-foreground/5 border-foreground/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-mono bg-foreground text-background hover:bg-foreground/90"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      "$ git push --project"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

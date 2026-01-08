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
  Sparkles,
  Code2,
  Rocket,
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
          linkedinUrl: formData.linkedinUrl || undefined,
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

      const data = await res.json();

      if (res.status === 400 && data.alreadyLiked) {
        toast.info("You already liked this! ❤️");
        return;
      }

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? data : p))
        );
        toast.success("Liked! ❤️");
      }
    } catch (error) {
      console.error("Error liking project:", error);
      toast.error("Failed to like project");
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
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Epic Header */}
      <header className="relative overflow-hidden border-b border-foreground/10">
        {/* Animated background with subtle gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/10" />
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating code symbols - hidden on mobile */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-foreground/5 text-4xl"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {["</>", "{}", "=>", "**", "//", "[]"][i]}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-8">
          {/* Back button */}
          <Link href="/" className="inline-block mb-2 sm:mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-7 sm:h-8 px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-[10px] sm:text-xs">back to cafe</span>
            </Button>
          </Link>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start sm:items-end justify-between gap-2">
              <div className="flex-1">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-foreground/10 border border-foreground/20 mb-1.5 sm:mb-4"
                >
                  <Code2 className="w-2 h-2 sm:w-3 sm:h-3 text-foreground/70" />
                  <span className="text-[9px] sm:text-xs text-foreground/70">community showcase</span>
                </motion.div>

                {/* Title */}
                <motion.h1 
                  className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-3 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                    ship it. share it.
                  </span>
                  <br />
                  <span className="text-foreground/80 text-base sm:text-xl md:text-3xl">inspire others.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                  className="text-[10px] sm:text-sm text-muted-foreground max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-foreground font-bold">{projects.length}</span> projects from the community
                </motion.p>
              </div>

              {/* Refresh button - only on desktop */}
              <motion.div 
                className="hidden sm:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchProjects()}
                  className="text-xs border border-foreground/10 h-8 w-8 p-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            </div>

            {/* Action button - full width on mobile, centered */}
            <motion.div 
              className="flex justify-center sm:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto text-xs sm:text-sm bg-foreground text-background hover:bg-foreground/90 border border-foreground shadow-lg shadow-foreground/25 h-9 sm:h-10 px-6 sm:px-8 gap-2"
              >
                <Rocket className="w-4 h-4" />
                drop your project
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {projects.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="relative h-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl overflow-hidden hover:border-foreground/30 hover:bg-foreground/[0.05] transition-all duration-300">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-px bg-gradient-to-br from-foreground/20 via-transparent to-foreground/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Code editor header */}
                    <div className="relative flex items-center gap-2 px-4 py-2.5 border-b border-foreground/10 bg-foreground/5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 ml-2 truncate">
                        ~/{project.title.toLowerCase().replace(/\s+/g, "-")}/README.md
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative p-5 space-y-4">
                      {/* Project name */}
                      <div className="">
                        <span className="text-foreground/40 text-xs"># </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{project.title}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                        {project.description || "no description yet... mystery project"}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-foreground/10 text-foreground/60 border border-foreground/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-foreground/5 text-muted-foreground/50">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Author info */}
                      <div className="pt-4 border-t border-foreground/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-foreground/30 to-foreground/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-foreground/60" />
                            </div>
                            <span className="text-foreground/70">
                              {project.author}
                            </span>
                          </div>
                          <motion.button
                            onClick={() => handleLike(project.id)}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors group/like"
                          >
                            <Heart className="w-4 h-4 group-hover/like:fill-foreground" />
                            <span>{project.likes}</span>
                          </motion.button>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-foreground/5"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>code</span>
                            </a>
                          )}

                          {project.linkedinUrl && (
                            <a
                              href={project.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-foreground/10"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                              <span>profile</span>
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-foreground/10"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>live</span>
                            </a>
                          )}
                        </div>

                        {/* Time */}
                        <p className="text-[10px] text-muted-foreground/30">
                          shipped {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/5 border border-foreground/10 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FolderGit2 className="w-10 h-10 text-foreground/50" />
            </motion.div>
            <h3 className="text-xl text-foreground/80 mb-2">
              no projects yet...
            </h3>
            <p className="text-sm text-muted-foreground/50 mb-6 max-w-sm mx-auto">
              be the first to flex what you built at cafe cursor
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-foreground text-background hover:bg-foreground/90 border border-foreground"
            >
              <Rocket className="w-4 h-4 mr-2" />
              drop your project
            </Button>
          </motion.div>
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
                    <span className="text-xs text-muted-foreground ml-2">
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
                  <div className="text-xs text-muted-foreground/60 mb-4">
                    # time to show off what you built
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/70">
                      project_title<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="My Awesome Project"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/70">
                      your_name<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="John Doe"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/60">
                      github_url<span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/project"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50">
                      linkedin_url
                    </label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedinUrl: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/your-profile"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50">
                      live_url
                    </label>
                    <Input
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, liveUrl: e.target.value })
                      }
                      placeholder="https://myproject.vercel.app"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50">
                      tags
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="react, ai, nextjs (comma separated)"
                      className="bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50">
                      description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Tell us about your project..."
                      rows={3}
                      className="bg-foreground/5 border-foreground/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 border border-foreground"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        shipping it...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        ship it
                      </>
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

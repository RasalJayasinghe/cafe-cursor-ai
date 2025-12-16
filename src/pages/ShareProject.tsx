import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, ExternalLink, Github, Linkedin, User, FolderGit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Sample projects for preview
const SAMPLE_PROJECTS = [
  {
    id: '1',
    projectName: 'AI Task Manager',
    personName: 'Ashan Fernando',
    linkedinUrl: 'https://linkedin.com/in/ashanfernando',
    githubUrl: 'https://github.com/ashan/ai-task-manager',
    description: 'An intelligent task management app that uses AI to prioritize and categorize your daily tasks automatically.',
    shortLink: 'ai-task',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: '2',
    projectName: 'Ceylon Weather',
    personName: 'Nimali Perera',
    linkedinUrl: 'https://linkedin.com/in/nimaliperera',
    githubUrl: 'https://github.com/nimali/ceylon-weather',
    description: 'Real-time weather tracking for all districts in Sri Lanka with beautiful visualizations.',
    shortLink: 'ceylon-weather',
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
  },
  {
    id: '3',
    projectName: 'Code Snippet Hub',
    personName: 'Ravindu Silva',
    linkedinUrl: 'https://linkedin.com/in/ravindusilva',
    githubUrl: 'https://github.com/ravindu/snippet-hub',
    description: 'A collaborative platform for developers to share and discover useful code snippets.',
    shortLink: 'snippet-hub',
    createdAt: new Date(Date.now() - 12 * 60 * 60000).toISOString(),
  },
];

export default function ShareProject() {
  const { sharedProjects: realProjects, addSharedProject } = useApp();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    personName: '',
    linkedinUrl: '',
    githubUrl: '',
    description: '',
  });

  // Use sample data if no real projects exist
  const projects = realProjects.length > 0 ? realProjects : SAMPLE_PROJECTS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName || !formData.personName || !formData.githubUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addSharedProject({
      id: Date.now().toString(),
      ...formData,
      shortLink: formData.projectName.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Project shared!",
      description: "Your project has been added to the gallery.",
    });

    setFormData({ projectName: '', personName: '', linkedinUrl: '', githubUrl: '', description: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-foreground/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="font-mono text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-mono text-lg font-bold">Project Gallery</h1>
              <p className="font-mono text-xs text-muted-foreground">Cafe Cursor • Colombo</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="font-mono text-xs bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Share Project
          </Button>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
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
                    <span className="font-mono text-xs text-muted-foreground/60 ml-2">
                      ~/{project.shortLink}/README.md
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative p-4 space-y-3">
                    {/* Project name */}
                    <div className="font-mono">
                      <span className="text-purple-400 text-xs"># </span>
                      <span className="text-lg font-bold">{project.projectName}</span>
                    </div>

                    {/* Description */}
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Author info */}
                    <div className="pt-3 border-t border-foreground/10 space-y-2">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <User className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-foreground/80">{project.personName}</span>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-3">
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
                        
                        {project.linkedinUrl && (
                          <a
                            href={project.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Linkedin className="w-3 h-3" />
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <FolderGit2 className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-muted-foreground/60">No projects shared yet</p>
            <p className="font-mono text-xs text-muted-foreground/40 mt-1">Be the first to share!</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg"
            >
              {/* Glow border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20 rounded-2xl blur-sm" />
              
              <div className="relative bg-background border border-foreground/10 rounded-2xl overflow-hidden">
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
                    <label className="font-mono text-xs text-purple-400">project_name<span className="text-red-400">*</span></label>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="My Awesome Project"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-purple-400">your_name<span className="text-red-400">*</span></label>
                    <Input
                      value={formData.personName}
                      onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                      placeholder="John Doe"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-cyan-400">github_url<span className="text-red-400">*</span></label>
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username/project"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-blue-400">linkedin_url</label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="font-mono bg-foreground/5 border-foreground/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-green-400">description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your project..."
                      rows={3}
                      className="font-mono bg-foreground/5 border-foreground/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-mono bg-foreground text-background hover:bg-foreground/90"
                  >
                    $ git push --project
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

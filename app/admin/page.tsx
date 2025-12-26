"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Coffee,
  UtensilsCrossed,
  Download,
  Clock,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Eye,
  FolderGit2,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Heart,
  ExternalLink,
} from "lucide-react";

// ==================== TYPES ====================
interface Claim {
  id: string;
  email: string;
  customerName: string;
  token: string;
  items: { name: string; quantity: number; price: number }[];
  claimedAt: string;
  status: string;
}

interface Attendee {
  name: string;
  email: string;
  hasClaimed: boolean;
  claim?: Claim;
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  status: "pending" | "approved" | "rejected";
}

interface Project {
  id: string;
  title: string;
  author: string;
  description?: string;
  githubUrl?: string;
  likes: number;
  createdAt: string;
}

type Section = "overview" | "meals" | "photos" | "projects";

// ==================== MAIN COMPONENT ====================
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  
  // Data state
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  // ==================== DATA FETCHING ====================
  const fetchAllData = async (showToast = false) => {
    setRefreshing(true);
    try {
      const [claimsRes, attendeesRes, photosRes, projectsRes] = await Promise.all([
        fetch("/api/tokens/claim"),
        fetch("/api/admin/attendees"),
        fetch("/api/photos?all=true"),
        fetch("/api/projects"),
      ]);

      const claimsData = await claimsRes.json();
      const claimsList: Claim[] = claimsData.claims || [];
      setClaims(claimsList);

      const attendeesData = await attendeesRes.json();
      if (attendeesData.attendees) {
        const merged: Attendee[] = attendeesData.attendees.map((att: any) => ({
          name: att.name,
          email: att.email,
          hasClaimed: !!claimsList.find((c) => c.email.toLowerCase() === att.email.toLowerCase()),
          claim: claimsList.find((c) => c.email.toLowerCase() === att.email.toLowerCase()),
        }));
        setAttendees(merged);
      }

      if (photosRes.ok) setPhotos(await photosRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());

      if (showToast) toast.success("Data refreshed");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ==================== ACTIONS ====================
  const handleDeleteClaim = async (email: string) => {
    if (!confirm(`Reset claim for ${email}?`)) return;
    setDeletingId(email);
    try {
      const res = await fetch(`/api/tokens/claim?email=${encodeURIComponent(email)}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Claim reset");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to reset claim");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePhotoAction = async (id: string, status: "approved" | "rejected") => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Photo ${status}`);
        setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      }
    } catch (error) {
      toast.error("Failed to update photo");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/photos/${id}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo deleted");
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCsv = () => {
    const headers = ["Name", "Email", "Status", "Token", "Food", "Drink", "Time"];
    const rows = attendees.map((a) => [
      a.name, a.email, a.hasClaimed ? "Claimed" : "Pending",
      a.claim?.token || "", a.claim?.items[0]?.name || "", a.claim?.items[1]?.name || "",
      a.claim ? new Date(a.claim.claimedAt).toLocaleString() : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cafe-cursor-claims-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exported");
  };

  // ==================== COMPUTED ====================
  const stats = {
    totalAttendees: attendees.length,
    claimedMeals: attendees.filter((a) => a.hasClaimed).length,
    pendingMeals: attendees.filter((a) => !a.hasClaimed).length,
    claimRate: attendees.length > 0 ? Math.round((attendees.filter((a) => a.hasClaimed).length / attendees.length) * 100) : 0,
    totalPhotos: photos.length,
    pendingPhotos: photos.filter((p) => p.status === "pending").length,
    approvedPhotos: photos.filter((p) => p.status === "approved").length,
    totalProjects: projects.length,
    totalLikes: projects.reduce((sum, p) => sum + p.likes, 0),
  };

  const filteredAttendees = attendees.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const pendingPhotos = photos.filter((p) => p.status === "pending");

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Shield className="w-12 h-12 text-foreground/20 mx-auto" />
          </motion.div>
          <p className="font-mono text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card/40 backdrop-blur-2xl border-r border-border/50 p-6 flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-foreground/10 border border-foreground/20 flex items-center justify-center group-hover:bg-foreground/15 transition-all">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin</h1>
                <p className="text-[10px] text-muted-foreground font-mono">Cafe Cursor</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "meals", icon: UtensilsCrossed, label: "Meal Claims", badge: stats.pendingMeals },
              { id: "photos", icon: Camera, label: "Photos", badge: stats.pendingPhotos, highlight: stats.pendingPhotos > 0 },
              { id: "projects", icon: FolderGit2, label: "Projects" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-all ${
                  activeSection === item.id
                    ? "bg-foreground/10 text-foreground border border-foreground/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.highlight ? "bg-amber-500 text-black" : "bg-foreground/10"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="pt-6 border-t border-border/50 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllData(true)}
              disabled={refreshing}
              className="w-full font-mono text-xs justify-start"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="w-full font-mono text-xs justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full font-mono text-xs justify-start text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <AnimatePresence mode="wait">
            {/* ==================== OVERVIEW ==================== */}
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                  <p className="text-muted-foreground font-mono text-sm">Real-time event statistics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Registered", value: stats.totalAttendees, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Meals Claimed", value: stats.claimedMeals, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
                    { label: "Claim Rate", value: `${stats.claimRate}%`, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Pending Photos", value: stats.pendingPhotos, icon: Camera, color: stats.pendingPhotos > 0 ? "text-amber-400" : "text-muted-foreground", bg: stats.pendingPhotos > 0 ? "bg-amber-500/10" : "bg-foreground/5" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-px bg-gradient-to-br from-foreground/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                      <div className="relative p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 hover:border-foreground/20 transition-all">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-sm text-muted-foreground font-mono mt-1">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-card/40 border border-border/50">
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-xl font-bold">{stats.totalProjects}</p>
                        <p className="text-xs text-muted-foreground font-mono">Projects Shared</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-card/40 border border-border/50">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-xl font-bold">{stats.approvedPhotos}</p>
                        <p className="text-xs text-muted-foreground font-mono">Photos Live</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-card/40 border border-border/50">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-xl font-bold">{stats.totalLikes}</p>
                        <p className="text-xs text-muted-foreground font-mono">Total Likes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Photos Alert */}
                {stats.pendingPhotos > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-400">{stats.pendingPhotos} photos awaiting review</p>
                        <p className="text-sm text-amber-400/70 font-mono">Click to moderate</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveSection("photos")}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-mono"
                    >
                      Review Now
                    </Button>
                  </motion.div>
                )}

                {/* Recent Activity */}
                <div className="rounded-2xl bg-card/40 border border-border/50 overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-mono text-sm">Recent Claims</h3>
                  </div>
                  <div className="divide-y divide-border/30 max-h-64 overflow-y-auto">
                    {claims.slice(0, 5).map((claim) => (
                      <div key={claim.id} className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                            {claim.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{claim.customerName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{claim.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-primary font-bold">{claim.token}</p>
                          <p className="text-xs text-muted-foreground">{new Date(claim.claimedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {claims.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <p className="font-mono text-sm">No claims yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== MEALS ==================== */}
            {activeSection === "meals" && (
              <motion.div
                key="meals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Meal Claims</h2>
                    <p className="text-muted-foreground font-mono text-sm">
                      {stats.claimedMeals} of {stats.totalAttendees} claimed ({stats.claimRate}%)
                    </p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search attendees..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 font-mono text-sm bg-card/60 border-border/50"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.claimRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>

                {/* Attendees List */}
                <div className="rounded-2xl bg-card/40 border border-border/50 overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 font-mono text-xs text-muted-foreground">
                    <div className="col-span-3">Attendee</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Token</div>
                    <div className="col-span-2">Order</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
                    {filteredAttendees.map((attendee) => (
                      <motion.div
                        key={attendee.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-foreground/5 transition-colors ${
                          attendee.hasClaimed ? "bg-green-500/5" : ""
                        }`}
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            attendee.hasClaimed ? "bg-green-500/20 text-green-400" : "bg-foreground/10 text-muted-foreground"
                          }`}>
                            {attendee.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm truncate">{attendee.name}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="font-mono text-xs text-muted-foreground truncate block">{attendee.email}</span>
                        </div>
                        <div className="col-span-1">
                          {attendee.hasClaimed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-green-500/10 text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/10 text-orange-400">
                              <Clock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="col-span-1">
                          <span className="font-mono text-xs font-bold text-primary">
                            {attendee.claim?.token || "—"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          {attendee.claim?.items ? (
                            <div className="flex gap-1">
                              {attendee.claim.items.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-foreground/5 text-[10px]">
                                  {idx === 0 ? <UtensilsCrossed className="w-3 h-3 text-yellow-400" /> : <Coffee className="w-3 h-3 text-cyan-400" />}
                                </span>
                              ))}
                            </div>
                          ) : "—"}
                        </div>
                        <div className="col-span-2 flex justify-end">
                          {attendee.hasClaimed && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClaim(attendee.email)}
                              disabled={deletingId === attendee.email}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              {deletingId === attendee.email ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== PHOTOS ==================== */}
            {activeSection === "photos" && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Photo Moderation</h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    {stats.pendingPhotos} pending • {stats.approvedPhotos} approved • {photos.length} total
                  </p>
                </div>

                {/* Pending Photos Section */}
                {pendingPhotos.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="font-mono text-sm text-amber-400">Pending Review ({pendingPhotos.length})</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pendingPhotos.map((photo) => (
                        <motion.div
                          key={photo.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-card/60"
                        >
                          <div className="aspect-square">
                            <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="font-mono text-xs text-white mb-1">{photo.uploadedBy}</p>
                              {photo.caption && <p className="text-[10px] text-white/70 truncate">{photo.caption}</p>}
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handlePhotoAction(photo.id, "approved")}
                                  disabled={deletingId === photo.id}
                                  className="flex-1 h-8 bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handlePhotoAction(photo.id, "rejected")}
                                  disabled={deletingId === photo.id}
                                  className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setPreviewPhoto(photo)}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Photos */}
                <div className="space-y-4">
                  <h3 className="font-mono text-sm text-muted-foreground">All Photos</h3>
                  {photos.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/50">
                      <Camera className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="font-mono text-sm text-muted-foreground">No photos uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {photos.filter(p => p.status !== "pending").map((photo) => (
                        <div
                          key={photo.id}
                          className={`relative group rounded-xl overflow-hidden border ${
                            photo.status === "approved" ? "border-green-500/30" : "border-red-500/30 opacity-50"
                          }`}
                        >
                          <div className="aspect-square">
                            <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="absolute top-1 left-1">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                              photo.status === "approved" ? "bg-green-500 text-black" : "bg-red-500 text-white"
                            }`}>
                              {photo.status.toUpperCase()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="absolute top-1 right-1 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ==================== PROJECTS ==================== */}
            {activeSection === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Shared Projects</h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    {stats.totalProjects} projects • {stats.totalLikes} total likes
                  </p>
                </div>

                {projects.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/50">
                    <FolderGit2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="font-mono text-sm text-muted-foreground">No projects shared yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative group rounded-2xl bg-card/60 border border-border/50 overflow-hidden hover:border-foreground/20 transition-all"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-lg">{project.title}</h4>
                              <p className="text-sm text-muted-foreground font-mono">by {project.author}</p>
                            </div>
                            <div className="flex items-center gap-1 text-red-400">
                              <Heart className="w-4 h-4" />
                              <span className="font-mono text-sm">{project.likes}</span>
                            </div>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                              >
                                <ExternalLink className="w-3 h-3" />
                                GitHub
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={deletingId === project.id}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              {deletingId === project.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setPreviewPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20"
              onClick={() => setPreviewPhoto(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewPhoto.url}
                alt=""
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent rounded-b-lg">
                <p className="font-mono text-white font-medium mb-1">{previewPhoto.uploadedBy}</p>
                {previewPhoto.caption && <p className="text-sm text-white/70 mb-4">{previewPhoto.caption}</p>}
                {previewPhoto.status === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        handlePhotoAction(previewPhoto.id, "approved");
                        setPreviewPhoto(null);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        handlePhotoAction(previewPhoto.id, "rejected");
                        setPreviewPhoto(null);
                      }}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

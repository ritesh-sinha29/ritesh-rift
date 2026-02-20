"use client";
import React from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  GitCommit,
  GitPullRequest,
  AlertTriangle,
  ExternalLink,
  Activity,
  Bot,
  User,
  Github,
  FileText,
  UserCheck,
} from "lucide-react";
import { Doc, Id } from "../../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../../convex/_generated/api";
import { LuActivity, LuGitGraph, LuGitPullRequest, LuLayers3 } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Review = Doc<"reviews">;
type Issue = Doc<"issues">;
type Project = Doc<"projects">;

// ─── Issue Status Config ────────────────────────────────────────────────────
const issueStatusConfig = {
  pending: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    dot: "bg-amber-500",
    icon: <Clock className="w-3 h-3" />,
  },
  assigned: {
    border: "border-l-blue-500",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    dot: "bg-blue-500",
    icon: <UserCheck className="w-3 h-3" />,
  },
  resolved: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  ignored: {
    border: "border-l-zinc-400",
    bg: "bg-zinc-500/5",
    badge: "bg-zinc-500/10 text-zinc-500 border-zinc-500/30",
    dot: "bg-zinc-400",
    icon: <AlertCircle className="w-3 h-3" />,
  },
} as const;

const issueTypeConfig = {
  by_user: {
    label: "User",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/30",
    icon: <User className="w-3 h-3" />,
  },
  by_agent: {
    label: "Agent",
    badge: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
    icon: <Bot className="w-3 h-3" />,
  },
  from_github: {
    label: "GitHub",
    badge: "bg-gray-500/10 text-gray-600 border-gray-500/30",
    icon: <Github className="w-3 h-3" />,
  },
} as const;

// ─── IssueCard Component ─────────────────────────────────────────────────────
const IssueCard = ({
  issue,
  projectId,
  isProcessing = false,
}: {
  issue: Issue;
  projectId: Id<"projects">;
  isProcessing?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [showAssignees, setShowAssignees] = React.useState(false);

  const members = useQuery(api.projects.getProjectMembers, { projectId });
  const assignMutation = useMutation(api.repos.assignIssue);
  const updateAssigneeMutation = useMutation(api.repos.updateIssueAssignedTo);

  const status = (issue.issueStatus ??
    "pending") as keyof typeof issueStatusConfig;
  const type = (issue.issueType ?? "by_agent") as keyof typeof issueTypeConfig;

  const statusCfg = issueStatusConfig[status] ?? issueStatusConfig.pending;
  const typeCfg = issueTypeConfig[type] ?? issueTypeConfig.by_agent;

  const descriptionSnippet =
    issue.issueDescription?.length > 100
      ? issue.issueDescription.slice(0, 100) + "…"
      : issue.issueDescription;

  const handleAssign = async (userId: Id<"users">) => {
    try {
      if (issue.issueAssignedTo) {
        await updateAssigneeMutation({
          issueId: issue._id,
          userId: userId,
        });
        toast.success("Assignee updated successfully");
      } else {
        await assignMutation({
          issueId: issue._id,
          userId: userId,
        });
        toast.success("Issue assigned successfully");
      }
      setShowAssignees(false);
    } catch (error) {
      toast.error("Failed to assign issue");
    }
  };

  return (
    <>
      {/* ── Compact Card ── */}
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex flex-col gap-2 p-3.5 rounded-lg cursor-pointer",
          "border border-border border-l-[3px]",
          "bg-card/60 backdrop-blur-sm",
          "hover:shadow-md hover:border-border/70 hover:bg-card/90",
          "transition-all duration-200",
          statusCfg.border,
          statusCfg.bg,
        )}
      >
        {/* Row 1: Title + Type badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-1 flex-1">
            {issue.issueTitle}
          </h3>
          {/* Issue Type badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0",
              typeCfg.badge,
            )}
          >
            {typeCfg.icon}
            {typeCfg.label}
          </span>
        </div>

        {/* Row 2: Description snippet */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {descriptionSnippet}
        </p>

        {/* Row 3: Status + Created At + Assigned */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            {/* Status badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border capitalize",
                statusCfg.badge,
              )}
            >
              {statusCfg.icon}
              {status}
            </span>

            {/* Created At */}
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Clock className="w-2.5 h-2.5" />
              {format(issue.issueCreatedAt, "MMM d, HH:mm")}
            </span>
          </div>

          {/* Assigned To Avatar / Assign Button */}
          <div className="flex items-center gap-1.5">
            {isProcessing ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/5 border border-primary/20 animate-pulse">
                <Bot className="w-3.5 h-3.5 text-primary animate-bounce" />
                <span className="text-[10px] font-medium text-primary uppercase tracking-tighter">Analyzing...</span>
              </div>
            ) : issue.issueAssignedTo ? (
              <div 
                className="flex items-center gap-1.5 cursor-pointer hover:bg-primary/5 p-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssignees(!showAssignees);
                }}
              >
                <span className="text-[10px] text-muted-foreground/60 leading-none">
                  {showAssignees ? "Changing..." : "Assigned"}
                </span>
                <Avatar className="w-5 h-5 ring-1 ring-border/50">
                  <AvatarImage
                    src={
                      members?.find((m) => m.userId === issue.issueAssignedTo)
                        ?.userImage
                    }
                  />
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    {members
                      ?.find((m) => m.userId === issue.issueAssignedTo)
                      ?.userName?.substring(0, 1) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-7 px-3 text-[11px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssignees(!showAssignees);
                }}
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Assign
              </Button>
            )}
          </div>
        </div>

        {/* Teammate Selection UI */}
        <AnimatePresence>
          {showAssignees && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="pt-2 border-t border-border/20 mt-1"
            >
              <div className="flex flex-wrap gap-2">
                {members?.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => handleAssign(member.userId)}
                    className="flex flex-col items-center gap-1 group/avatar transition-transform hover:scale-110"
                    title={member.userName}
                  >
                    <Avatar className="w-7 h-7 ring-2 ring-transparent group-hover/avatar:ring-primary/50 transition-all">
                      <AvatarImage src={member.userImage} />
                      <AvatarFallback className="text-[10px]">
                        {member.userName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[8px] text-muted-foreground truncate w-7 text-center">
                      {member.userName?.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
          <FileText className="w-3 h-3 text-muted-foreground" />
        </div>
      </motion.div>

      {/* ── Detail Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className={cn("w-1 self-stretch rounded-full min-h-[24px]", statusCfg.dot.replace("bg-", "bg-"))} />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-bold leading-snug">
                  {issue.issueTitle}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Type */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                      typeCfg.badge,
                    )}
                  >
                    {typeCfg.icon}
                    {typeCfg.label}
                  </span>
                  {/* Status */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border capitalize",
                      statusCfg.badge,
                    )}
                  >
                    {statusCfg.icon}
                    {status}
                  </span>
                  {/* Created At */}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(issue.issueCreatedAt, "MMM d, yyyy 'at' HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Files banner */}
          {issue.issueFiles && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-border/40 text-xs text-muted-foreground mt-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono truncate">{issue.issueFiles}</span>
            </div>
          )}

          {/* Full description */}
          <div className="mt-2">
            <Message from="assistant">
              <MessageContent className="text-sm bg-muted/30 rounded-lg">
                <MessageResponse className="prose dark:prose-invert prose-sm max-w-none">
                  {issue.issueDescription}
                </MessageResponse>
              </MessageContent>
            </Message>
          </div>

          {/* Assigned To */}
          <div className="flex items-center justify-start gap-10 border-t border-border/30 pt-3 mt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Assigned To
            </span>
            {issue.issueAssignedTo ? (
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 ring-1 ring-border/50">
                  <AvatarImage
                    src={
                      members?.find((m) => m.userId === issue.issueAssignedTo)
                        ?.userImage
                    }
                  />
                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                    {members
                      ?.find((m) => m.userId === issue.issueAssignedTo)
                      ?.userName?.substring(0, 1) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">
                  {members?.find((m) => m.userId === issue.issueAssignedTo)
                    ?.userName || "Team Member"}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground/50 italic">Not assigned yet</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ReviewItem = ({ review }: { review: Review }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="mb-6 overflow-hidden border-border/40 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-500 group/card p-0">
      <div className="p-5 flex flex-col gap-5">
        {/* 1. Top: Push Event with Icon */}
        <div className="flex items-center gap-3 pb-2 border-b border-border/10">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover/card:scale-110 transition-transform">
            {review.reviewType === "commit" ? (
              <GitCommit className="w-5 h-5" />
            ) : (
              <GitPullRequest className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground/80 uppercase">
              {review.reviewType === "commit" ? "Push Event" : "Pull Request"}
            </span>
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
              {review.commitHash || review.pushTitle}
            </span>
          </div>
        </div>

        {/* 2. Below: Action done by image and author name */}
        <div className="flex items-center justify-between px-6 gap-4">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 ring-2 ring-border/50 ring-offset-2 ring-offset-background group-hover/card:ring-primary/30 transition-all">
              <AvatarImage
                src={review.authorAvatar}
                alt={review.authorUserName}
              />
              <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {review.authorUserName?.substring(0, 2).toUpperCase() || "AI"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Action done by
              </span>
              <span className="text-base font-medium tracking-tight whitespace-nowrap truncate max-w-[160px] text-foreground group-hover/card:text-primary transition-colors">
                {review.authorUserName || "System Agent"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {review.reviewStatus === "completed" ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/5 text-green-600 border border-green-500/20 text-xs  animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Review Completed</span>
              </div>
            ) : review.reviewStatus === "failed" ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Review Failed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-sm font-medium">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Analysis in Progress</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Issue found? Interactive UI */}
        {review.ctiticalIssueFound && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-2 rounded-xl bg-destructive/5 border border-destructive/20 cursor-help"
          >
            <div className=" text-destructive animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-destructive">
                Critical Issue Found
              </span>
              <span className="text-xs text-muted-foreground">
                Potential bug or security risk detected in this push.
              </span>
            </div>
          </motion.div>
        )}

        {/* 6. Toggle button to show the review! with interactive ui */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant={isOpen ? "outline" : "default"}
            className={cn(
              "flex-1 justify-between h-11 transition-all duration-300 shadow-md",
              !isOpen &&
                "bg-primary hover:bg-primary/90 hover:translate-y-[-2px] hover:shadow-primary/20",
              isOpen && "bg-background border-primary/20",
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              <LuActivity
                className={cn("w-4 h-4", isOpen && "animate-pulse")}
              />
              {isOpen ? "Collapse Deep Analysis" : "View AI Review Report"}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>

          {review.pushUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-md hover:bg-primary/10 hover:border-primary/30"
              asChild
              title="View on GitHub"
            >
              <a
                href={review.pushUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="View on GitHub"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="overflow-hidden bg-zinc-50 dark:bg-zinc-950/50 border-t border-border/10"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                  AI Analysis Report
                </h4>
              </div>
              <Message from="assistant" className="max-w-full">
                <MessageContent className="bg-transparent text-sm leading-relaxed p-0">
                  <MessageResponse className="prose dark:prose-invert prose-sm">
                    {review.review}
                  </MessageResponse>
                </MessageContent>
              </Message>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const ActivityFeed = () => {
  const { id } = useParams(); // this contains the id of the project
  const projectId = id as Id<"projects">;
  const project = useQuery(api.projects.getProjectById, {
    projectId: projectId,
  });

  const reviews = useQuery(api.repos.getReviewsByRepoId, {
    repoId: project?.repositoryId!,
  });

  const issues = useQuery(api.repos.getIssuesByRepoId, {
    repoId: project?.repositoryId!,
  });

  const [processingIssues, setProcessingIssues] = React.useState<Set<Id<"issues">>>(new Set());
  const processingRef = React.useRef(new Set<Id<"issues">>());

  // Auto-assign logic
  React.useEffect(() => {
    const pendingIssues = issues?.filter(i => i.issueStatus === "pending") || [];
    
    pendingIssues.forEach(async (issue) => {
      if (processingRef.current.has(issue._id)) return;

      processingRef.current.add(issue._id);
      setProcessingIssues(prev => new Set(prev).add(issue._id));
      
      const toastId = toast.loading(`Agent: New Issue Detected`, {
        description: `Analyzing skills for "${issue.issueTitle.slice(0, 20)}..."`,
        icon: <Bot className="w-4 h-4 text-primary" />,
      });

      try {
        const response = await fetch("/api/agent/auto-assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            issueId: issue._id,
            messages: [
              {
                role: "user",
                content: `Please assign this issue: "${issue.issueTitle}". Description: ${issue.issueDescription}`,
              },
            ],
          }),
        });

        if (!response.ok) throw new Error("Failed to reach assignment agent");

        await response.text(); 
        
        toast.success(`Autonomous Assignment`, {
          id: toastId,
          description: `Issue has been successfully delegated to the best match.`,
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        });
      } catch (error) {
        console.error("Auto-assign error:", error);
        toast.error("Agent Offline", { 
          id: toastId,
          description: "Manual assignment required for this issue.",
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        });
        processingRef.current.delete(issue._id);
      } finally {
        setProcessingIssues(prev => {
          const next = new Set(prev);
          next.delete(issue._id);
          return next;
        });
      }
    });
  }, [issues, projectId]);

  // Loading state
  if (reviews === undefined || issues === undefined) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Repository Activity</h1>
          <p className="text-gray-600">Syncing latest events...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-accent/50 rounded-xl"></div>
          <div className="h-32 bg-accent/50 rounded-xl"></div>
          <div className="h-32 bg-accent/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full h-full bg-slate-50/50 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-2">
        <div className="">
          <div className="flex gap-3 items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Review & Automation
            </h1>
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 shadow-sm border border-blue-600/20">
              <LuActivity className="w-5 h-5 inline" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Monitor Project workflows in form of commits/Pr/issues for{" "}
            <span className="text-foreground font-medium">
              {project?.projectName}
            </span>
          </p>
        </div>

        <div className="flex gap-10">
          <Button size='sm' className="cursor-pointer">View Repo Tree <LuGitGraph className="inline ml-1.5" /></Button>
          <Button size='sm' className="cursor-pointer">Visit workspace<LuLayers3 className="inline ml-1.5" /></Button>
        </div>
      </div>

      {/* <Separator className="" /> */}

      {/* Main Grid: Reviews on Left, Issues on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* LEFT SIDE: REVIEWS */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <LuGitPullRequest className="inline mr-1.5" /> Reviews
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0 h-5 text-xs"
              >
                {reviews?.length || 0}
              </Badge>
            </h2>
          </div>

          <div className="flex flex-col">
            {reviews?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/30">
                <GitCommit className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No reviews yet
                </p>
                <p className="text-sm text-muted-foreground/60 text-center">
                  New activity will appear here automatically.
                </p>
              </div>
            ) : (
              reviews?.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE: ISSUES */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              System Issues
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0 h-5 text-xs"
              >
                {issues?.length || 0}
              </Badge>
            </h2>
            <span className="text-xs text-muted-foreground/60">Click card for details</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {issues?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/30">
                <AlertCircle className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Clean slate!
                </p>
                <p className="text-sm text-muted-foreground/60 text-center">
                  No critical issues detected in recent activity.
                </p>
              </div>
            ) : (
              issues?.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  projectId={projectId}
                  isProcessing={processingIssues.has(issue._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;


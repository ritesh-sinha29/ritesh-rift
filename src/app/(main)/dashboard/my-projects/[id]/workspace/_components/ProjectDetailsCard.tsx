"use client";

import React, { useState, useMemo } from "react";
import {
  GitPullRequestArrow,
  ShieldCheck,
  TriangleAlert,
  EyeOff,
  CalendarDays,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bot,
  User,
  Github,
  RefreshCw,
} from "lucide-react";
import { LuClock3 } from "react-icons/lu";

// ─── Types ──────────────────────────────────────────────────────────────────
interface WorkspaceStats {
  totalReviews: number;
  passedReviews: number;
  assignedIssues: number;
  ignoredIssues: number;
}

interface Issue {
  _id: string;
  issueTitle: string;
  issueDescription: string;
  issueType?: "by_user" | "by_agent" | "from_github";
  issueFiles?: string;
  issueStatus?: "assigned" | "ignored" | "pending" | "resolved";
  issueCreatedByName?: string;
  assignedUserName?: string;
  assignedUserImage?: string;
  issueCreatedAt: number;
  issueUpdatedAt: number;
}

interface Review {
  _id: string;
  pushTitle: string;
  authorUserName?: string;
  authorAvatar?: string;
  reviewType: "pr" | "commit";
  reviewStatus?: "pending" | "completed" | "failed";
  ctiticalIssueFound?: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ProjectDetailsCardProps {
  projectTimeline?: string | null;
  stats: WorkspaceStats | null;
  issues: Issue[];
  reviews: Review[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseTimelineDates(timeline: string | null | undefined): {
  start: Date | null;
  end: Date | null;
  label: string;
} {
  if (!timeline) return { start: null, end: null, label: "No timeline set" };
  const normalised = timeline.replace(/[–—]/g, "-").trim();
  const parts = normalised
    .split(/\s+to\s+|\s+-\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    const s = new Date(parts[0]);
    const e = new Date(parts[1]);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      return { start: s, end: e, label: `${fmt(s)} → ${fmt(e)}` };
    }
  }
  return { start: null, end: null, label: timeline };
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcProgress(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  const now = Date.now();
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100;
  const elapsed = now - start.getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  resolved: {
    label: "Passed",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  assigned: {
    label: "Running",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  pending: {
    label: "Queued",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  ignored: {
    label: "Skipped",
    color: "text-slate-500",
    bg: "bg-slate-400/10",
    border: "border-slate-400/30",
    dot: "bg-slate-400",
  },
} as const;

type FilterTab = "all" | "resolved" | "assigned" | "pending" | "ignored";

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatBox({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
      <div className="flex items-center gap-1.5">
        <Icon className={`size-3.5 ${color}`} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </span>
      </div>
      <span className="text-xl font-bold tabular-nums leading-none">{value}</span>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </div>
  );
}

function IssueSourceIcon({ type }: { type?: string }) {
  if (type === "by_agent") return <Bot className="size-3 text-violet-500" />;
  if (type === "from_github") return <Github className="size-3 text-foreground/60" />;
  return <User className="size-3 text-blue-500" />;
}

function IssueSourceLabel({ type }: { type?: string }) {
  if (type === "by_agent") return "Agent";
  if (type === "from_github") return "GitHub";
  return "User";
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProjectDetailsCard({
  projectTimeline,
  stats,
  issues,
  reviews,
}: ProjectDetailsCardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { start, end } = parseTimelineDates(projectTimeline);
  const progress = calcProgress(start, end);

  const totalReviews = stats?.totalReviews ?? 0;
  const passedReviews = stats?.passedReviews ?? 0;
  const passRate = totalReviews > 0 ? Math.round((passedReviews / totalReviews) * 100) : 0;
  const assignedIssues = stats?.assignedIssues ?? 0;
  const ignoredIssues = stats?.ignoredIssues ?? 0;

  // Segment widths for multi-color bar
  const totalItems = issues.length || 1;
  const resolvedCount = issues.filter((i) => i.issueStatus === "resolved").length;
  const assignedCount = issues.filter((i) => i.issueStatus === "assigned").length;
  const pendingCount = issues.filter((i) => i.issueStatus === "pending").length;
  const ignoredCount = issues.filter((i) => i.issueStatus === "ignored").length;

  const segments = [
    { pct: (resolvedCount / totalItems) * 100, color: "bg-emerald-500" },
    { pct: (assignedCount / totalItems) * 100, color: "bg-amber-400" },
    { pct: (pendingCount / totalItems) * 100, color: "bg-blue-500" },
    { pct: (ignoredCount / totalItems) * 100, color: "bg-slate-400" },
  ];

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: issues.length,
      resolved: resolvedCount,
      assigned: assignedCount,
      pending: pendingCount,
      ignored: ignoredCount,
    };
  }, [issues.length, resolvedCount, assignedCount, pendingCount, ignoredCount]);

  // Filtered list
  const filteredIssues = useMemo(() => {
    if (activeTab === "all") return issues;
    return issues.filter((i) => i.issueStatus === activeTab);
  }, [issues, activeTab]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "resolved", label: "Passed" },
    { key: "assigned", label: "Running" },
    { key: "pending", label: "Queued" },
    { key: "ignored", label: "Skipped" },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl border bg-linear-to-br from-muted to-transparent shadow-sm">
      {/* ── Header ── */}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          Recents Contributions & Issues
          <RefreshCw className="size-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </h2>
        <p className="text-xs text-muted-foreground">Contributions & Issues resolution timeline</p>
      </div>

      {/* ── 4 Stat Boxes ── */}
      <div className="flex gap-4 flex-wrap">
        <StatBox
          icon={GitPullRequestArrow}
          label="Iterations"
          value={`${passedReviews}/${totalReviews}`}
          sub="review cycles"
          color="text-blue-500"
        />
        <StatBox
          icon={ShieldCheck}
          label="Pass Rate"
          value={`${passRate}%`}
          sub={`${passedReviews} resolved`}
          color="text-emerald-500"
        />
        <StatBox
          icon={TriangleAlert}
          label="In Progress"
          value={assignedIssues}
          sub="active issues"
          color="text-amber-500"
        />
        <StatBox
          icon={EyeOff}
          label="Skipped"
          value={ignoredIssues}
          sub="ignored"
          color="text-slate-400"
        />
      </div>

      {/* ── Multi-segment Progress Bar ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full h-2 rounded-full overflow-hidden bg-muted">
          {segments.map((seg, i) =>
            seg.pct > 0 ? (
              <div
                key={i}
                className={`h-full ${seg.color} transition-all duration-500`}
                style={{ width: `${seg.pct}%` }}
              />
            ) : null
          )}
        </div>
        {/* Timeline dates under bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CalendarDays className="size-3" />
            <span>{start ? fmt(start) : "Start"}</span>
          </div>
          <span className="text-[9px] tabular-nums text-muted-foreground font-medium">
            {progress > 0 ? `${progress}% elapsed` : ""}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>{end ? fmt(end) : "End"}</span>
            <CalendarDays className="size-3" />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-border/50 pb-0 bg-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors relative ${
              activeTab === tab.key
                ? "text-foreground bg-background border border-b-0 border-border/60 -mb-[1px]"
                : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            {tab.label}{" "}
            <span className="text-[10px] opacity-60">{tabCounts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Issue List ── */}
      <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filteredIssues.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6 italic">
            No issues found.
          </p>
        )}
        {filteredIssues.map((issue, idx) => {
          const cfg =
            STATUS_CONFIG[issue.issueStatus as keyof typeof STATUS_CONFIG] ??
            STATUS_CONFIG.pending;
          return (
            <div
              key={issue._id}
              className="flex items-center gap-3 p-3 rounded-xl border bg-background/60 hover:bg-background transition-colors group"
            >
              {/* Status dot */}
              <span className="flex items-center justify-center shrink-0">
                {issue.issueStatus === "resolved" ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : issue.issueStatus === "assigned" ? (
                  <Clock className="size-4 text-amber-500" />
                ) : (
                  <span className={`size-2.5 rounded-full ${cfg.dot}`} />
                )}
              </span>

              {/* Content */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-medium truncate leading-tight">
                  {issue.issueTitle}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <IssueSourceIcon type={issue.issueType} />
                    {IssueSourceLabel({ type: issue.issueType })}
                  </span>
                  {issue.issueFiles && (
                    <>
                      <span className="opacity-30">•</span>
                      <span className="truncate max-w-[160px] font-mono opacity-70">
                        {issue.issueFiles}
                      </span>
                    </>
                  )}
                  <span className="opacity-30">•</span>
                  <span>{timeAgo(issue.issueCreatedAt)}</span>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${cfg.bg} ${cfg.color} ${cfg.border} border shrink-0`}
              >
                {cfg.label}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import {
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  ChevronsLeftRight,
  ChevronsRight,
  ChevronsUpDown,
  Compass,
  CreditCard,
  FileText,
  Folder,
  FolderCode,
  Gift,
  GitBranch,
  Github,
  GithubIcon,
  LayoutDashboard,
  Link2,
  LogOutIcon,
  LucideGitBranch,
  LucideGithub,
  LucideGrip,
  LucideLayoutDashboard,
  LucideListTodo,
  LucideRocket,
  LucideWandSparkles,
  Mic,
  Moon,
  Palette,
  Play,
  Plus,
  Settings2,
  SparklesIcon,
  Star,
  Stars,
  Store,
  Sun,
  User,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeButtons } from "./ThemeButton";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Exact TS type of a user row (auto-generated from schema)
  // Fetch Current User
  const user: Doc<"users"> | undefined | null = useQuery(
    api.users.getCurrentUser,
  );

  const projects = useQuery(api.projects.getProjects);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/dashbaord");
  };

  return (
    <Sidebar collapsible="icon" className="cursor-move">
      <SidebarHeader className="border-b ">
        <div className="flex items-center justify-between px-3 py-3">
          <Image
            src="/logo1.svg"
            alt="Logo"
            width={30}
            height={30}
            className="cursor-pointer"
          />
          <h1 className="font-bold text-xl tracking-wide group-data-[collapsible=icon]:hidden">
            Gitpilot
          </h1>
          {/* DROPDOWN ICON TO CHOOSE AMON USER CREATED PROJECTS  */}
          <Popover>
            {/* Trigger */}
            <PopoverTrigger asChild>
              <Button
                size="icon-sm"
                variant="outline"
                className="cursor-pointer group-data-[collapsible=icon]:hidden"
              >
                <ChevronsUpDown className="h-5 w-5" />
              </Button>
            </PopoverTrigger>

            {/* Content */}
            <PopoverContent
              side="bottom"
              align="start"
              className="w-56 p-2  border-2 "
            >
              <p className="text-sm text-center font-semibold text-muted-foreground mb-2">
                Your Projects
              </p>
              <Separator className="-my-2" />
              <div className="flex flex-col gap-1">
                {projects?.length ? (
                  projects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/dashboard/my-projects/${project._id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent transition"
                    >
                      <FolderCode className="h-4 w-4 shrink-0" />
                      <span className="truncate">{project.projectName}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground px-2">
                    No projects found
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* SHOWING GITHUB CONNECTED ACCOUNT */}
        {user === undefined ? (
          <div className="flex items-center gap-4 my-1 mx-auto border px-6 py-2 bg-sidebar-accent/30 rounded-md w-full">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col space-y-2 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 my-0.5 mx-auto border px-6 py-2 bg-sidebar-accent/30 rounded-md group-data-[collapsible=icon]:hidden">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-0.5 group-data-[collapsible=icon]:hidden">
              <h2 className="flex gap-2 text-sm items-center truncate">
                <Github className="h-4 w-4" /> {user?.githubUsername}
              </h2>
              <p className="text-xs text-muted-foreground ml-3">
                Account Synced
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-3 py-3 relative overflow-y-scroll scroll-smooth">
        <SidebarMenu className="flex flex-col gap-2.5">
          <SidebarMenuButton
            asChild
            data-active={isActive("/dashboard")}
            className="group relative overflow-hidden"
          >
            <Link
              href="/dashboard"
              className="relative z-10 flex items-center gap-3 px-3 py-2 dark:data-[active=true]:text-white data-[active=true]:text-gray-700"
            >
              <LucideLayoutDashboard className="h-5 w-5" />
              <span className="text-base">Dashboard</span>

              {/* Gradient Active Indicator */}
              <span
                className="
        pointer-events-none absolute inset-0 -z-10
        opacity-0 transition-opacity
        group-data-[active=true]:opacity-100
        bg-linear-to-l from-blue-600/80 dark:from-blue-600/50 via-blue-600/10  to-transparent
      "
              />
            </Link>
          </SidebarMenuButton>

        
        
          {/* MY PROJECTS WITH 2 TABS  MY CREATION | Team PROJECT*/}
          <div className="px-1 my-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-center gap-2">
              <span className="w-10 h-px bg-muted-foreground/30"></span>
              <h3 className="mb-2 text-base font-semibold text-muted-foreground capitalize text-center">
                My Projects
              </h3>
              <span className="w-10 h-px bg-muted-foreground/30"></span>
            </div>

            <Tabs defaultValue="my" className="w-full">
              <TabsList className="grid grid-cols-2 h-8 mx-auto w-full">
                <TabsTrigger value="my" className="text-xs">
                  My Creations
                </TabsTrigger>
                <TabsTrigger value="team" className="text-xs">
                  Team Projects
                </TabsTrigger>
              </TabsList>

              {/* FIXED HEIGHT + SCROLL */}
              <div className="mt-2 p-1 h-[156px] overflow-y-auto rounded-md border bg-sidebar-accent/30">
                {/* MY CREATIONS */}
                <TabsContent value="my" className="m-0 p-2">
                  {projects && projects.length === 0 ? (
                    <div className="">
                      <p>No projects found!</p>
                      <div className="flex items-center justify-center">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Create Project
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 ">
                      {projects?.map((project) => (
                        <div key={project._id}>
                          <div className="flex items-center text-xs tracking-tight hover:bg-accent p-1 rounded-md transition-all duration-150">
                            <Link
                              className="flex items-center gap-2 truncate w-full max-w-[160px]"
                              href={`/dashboard/my-projects/${project._id}`}
                            >
                              <FolderCode className="h-4 w-4 mr-1" />
                              <p>{project.projectName}</p>
                            </Link>
                          </div>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Project
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* TEAM PROJECTS */}
                <TabsContent value="team" className="m-0 p-2">
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      No team projects
                    </p>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Collab Now
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          {/* QUICK ACCESS */}
          <div className="">
            <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="w-10 h-px bg-muted-foreground/30"></span>
              <h3 className="mb-2 text-base font-semibold text-muted-foreground capitalize text-center">
                Quick Access
              </h3>
              <span className="w-10 h-px bg-muted-foreground/30"></span>
            </div>

            <div className="space-y-3">
              {/* FAVORITES */}
              <SidebarMenuButton
                asChild
                data-active={isActive("/dashboard/favorites")}
                className="group relative overflow-hidden"
              >
                <Link
                  href="/dashboard/favorites"
                  className="relative z-10 flex items-center gap-3 px-3 py-2 data-[active=true]:text-white text-muted-foreground"
                >
                  <Star className="h-5 w-5" />
                  <span className="text-base">Favorites</span>

                  <span
                    className="
        pointer-events-none absolute inset-0 -z-10
        opacity-0 transition-opacity
        group-data-[active=true]:opacity-100
        bg-linear-to-l from-blue-600/50 via-transparent  to-transparent
      "
                  />
                </Link>
              </SidebarMenuButton>

              {/* NOTIFICATIONS */}
              <SidebarMenuButton
                asChild
                data-active={isActive("/dashboard/notifications")}
                className="group relative overflow-hidden"
              >
                <Link
                  href="/dashboard/notifications"
                  className="relative z-10 flex items-center gap-3 px-3 py-2 data-[active=true]:text-white text-muted-foreground"
                >
                  <Bell className="h-5 w-5" />
                  <span className="text-base">Notifications</span>

                  <span
                    className="
        pointer-events-none absolute inset-0 -z-10
        opacity-0 transition-opacity
        group-data-[active=true]:opacity-100
        bg-linear-to-l from-blue-600/50 via-transparent  to-transparent
      "
                  />
                </Link>
              </SidebarMenuButton>

              {/* PROFILE */}
              <SidebarMenuButton
                asChild
                data-active={isActive("/dashboard/profile")}
                className="group relative overflow-hidden"
              >
                <Link
                  href="/dashboard/profile"
                  className="relative z-10 flex items-center gap-3 px-3 py-2 data-[active=true]:text-white text-muted-foreground"
                >
                  <User className="h-5 w-5" />
                  <span className="text-base">Profile</span>

                  <span
                    className="
        pointer-events-none absolute inset-0 -z-10
        opacity-0 transition-opacity
        group-data-[active=true]:opacity-100
        bg-linear-to-l from-blue-600/50 via-transparent  to-transparent
      "
                  />
                </Link>
              </SidebarMenuButton>

              {/* THEME SWITCHER */}
              <Popover>
                <SidebarMenuButton
                  asChild
                  className="group relative overflow-hidden"
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="relative z-10 flex w-full items-center gap-3 px-3 py-2 text-muted-foreground data-[active=true]:text-white"
                    >
                      <Palette className="h-5 w-5" />
                      <span className="text-base">Theme</span>

                      {/* Active gradient */}
                      <span
                        className="
            pointer-events-none absolute inset-0 -z-10
            opacity-0 transition-opacity
            group-data-[active=true]:opacity-100
            bg-linear-to-l from-blue-600/50 via-transparent to-transparent
          "
                      />
                    </button>
                  </PopoverTrigger>
                </SidebarMenuButton>

                <PopoverContent
                  align="start"
                  side="right"
                  className="w-48 rounded-lg p-2"
                >
                  <ThemeButtons />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t px-2 py-2 group-data-[collapsible=icon]:hidden">
        <div className="rounded-md bg-linear-to-br from-blue-600/30 via-indigo-400/30 to-transparent px-3 py-3 space-y-3 ">
          {/* TOP MESSAGE (only if NOT elite) */}
          {user?.type !== "elite" && (
            <div className="flex items-start gap-2">
              <SparklesIcon className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm leading-snug">
                <p className="font-medium text-foreground">
                  Boost productivity with AI
                </p>
                {/* <p className="text-muted-foreground text-sm italic">
                  Understand projects much faster with Elite.
                </p> */}
              </div>
            </div>
          )}

          {/* USAGE */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="capitalize">{user?.type} tier</span>
              <span>1 / {user?.limit}</span>
            </div>

            <Progress
              value={Math.min((1 / (user?.limit ?? 1)) * 100, 100)}
              className="h-1.5"
            />
          </div>

          {/* CTA */}
          {user?.type !== "elite" && (
            <Button size="sm" variant="default" className="w-full text-xs h-8">
              Upgrade now
            </Button>
          )}

          {/* ELITE STATE */}
          {user?.type === "elite" && (
            <p className="text-xs text-muted-foreground text-center">
              You’re on{" "}
              <span className="font-medium text-foreground">Elite</span> 🚀
            </p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

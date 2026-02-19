"use client";

import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { useStoreUser } from "@/hooks/use-user-store";
import { Loader2 } from "lucide-react";
import { getGithubAccessToken, getUserTopLanguages } from "@/modules/github/action";
import { toast } from "sonner";


const AuthCallback = () => {
  const { isAuthenticated, isLoading: isStoreLoading } = useStoreUser();
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  const updateUserSkills = useMutation(api.users.updateUserSkills);

  useEffect(() => {

    if (isStoreLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user === undefined) return;
    
    const handleRedirect = async () => {
      // await syncGithubToken(); 

      // IF USER SKILLS ARE ALREADY PRESENT, JUST REDIRECT
      if (user && user.skills && user.skills.length > 0) {
        console.log("✅ User skills already present, redirecting...");
        if (user.hasCompletedOnboarding) {
          router.push("/dashboard");
        } else {
          router.push(`/onboard/${user._id}`);
        }
        return;
      }

      // OTHERWISE, FETCH TOP LANGUAGES AND UPDATE
      try {
        if (user && user.githubUsername) {
          console.log("🔍 Fetching top languages for user...");
          const topLanguages = await getUserTopLanguages(user.githubUsername);
          if (topLanguages && topLanguages.length > 0) {
            await updateUserSkills({ skills: topLanguages });
            console.log("✅ Top languages updated as skills.");
            toast.success("Github User Profile Synced Successfully.");
          }
        }
      } catch (error) {
        console.error("❌ Failed to update user skills:", error);
        toast.error("Failed to update user skills");
      }

      if (user && user.hasCompletedOnboarding) {
        router.push("/dashboard");
      } else if (user) {
        router.push(`/onboard/${user._id}`);
      }
    };

    handleRedirect();

  }, [isAuthenticated, isStoreLoading, user, router, updateUserSkills]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-9 w-9 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Connecting to Github...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

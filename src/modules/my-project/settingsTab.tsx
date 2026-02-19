"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  X,
  Plus,
  Save,
  Loader2,
  Search,
  Trash2,
  Users,
  LucideSettings2,
  LucideSettings,
  Tag,
  LucideType,
  LucideActivity,
  LucideBriefcase,
  LucideBrain,
  LucideInfo,
  LucideExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_TAGS, roles } from "@/components/Universal-static-storage";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

interface LookingForMember {
  role: string;
  type: "casual" | "part-time" | "serious";
}

interface ProjectData {
  _id: Id<"projects">;
  projectName: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  lookingForMembers?: LookingForMember[];
}

const SettingTab = ({ project, isPro }: { project: ProjectData; isPro: boolean }) => {
  const updateProject = useMutation(api.projects.updateProject);

  // Local state for form fields
  const [description, setDescription] = useState(project.description);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    project.tags || []
  );
  const [isPublic, setIsPublic] = useState(project.isPublic);


  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [tagSearch, setTagSearch] = useState("");


  const [roleQuery, setRoleQuery] = useState("");

  // Handlers
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        toast.error("You can select a maximum of 5 tags.");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

 
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProject({
        projectId: project._id,
        description,
        tags: selectedTags,
        isPublic
      });
      toast.success("Project settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTags = AVAILABLE_TAGS.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <h2 className="text-xl font-semibold">
        Configure your project{" "}
        <LucideSettings2 className="w-5 h-5 inline ml-2" />
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            <LucideSettings className="w-4 h-4 inline mr-2" />
            Project Details
          </CardTitle>
          <CardDescription>
            Update the core details of your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div
            className={`flex items-center justify-between rounded-lg border p-4  ${
              isPublic ? "bg-emerald-300/20" : "bg-muted/40"
            }`}
          >
            <div className="space-y-0.5">
              <Label className="text-base">Public Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Make your project visible to everyone. Public projects can be
                discovered by the community.
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              aria-label="Toggle public visibility"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Tag className="w-4 h-4 inline mr-2" /> Tags
          </CardTitle>
          <CardDescription>
            Select up to 5 tags that best describe your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.length === 0 && (
              <p className="text-sm text-muted-foreground italic py-2">
                No tags selected
              </p>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="pl-2 pr-1 py-1 gap-1"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Search & Selection */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      className={`cursor-pointer transition-all hover:scale-105 active:scale-95 text-[11px] px-4 py-3 ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tags found matching "{tagSearch}"
                </p>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <div className={` ${isPublic ? "hidden opacity-0" : "opacity-100 "}`}>
        <p className="text-center text-lg tracking-tight font-semibold">
          <LucideInfo className="inline w-4 h-4 mr-2" /> Kindly make your
          project public to allow Others, discover & find Team members
        </p>
      </div>

    
      {/* Save Action */}
      <div className="flex justify-end sticky bottom-6 z-10">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto min-w-[150px] shadow-lg hover:shadow-xl transition-all text-xs cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving
              Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingTab;

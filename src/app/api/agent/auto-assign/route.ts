import { ConvexHttpClient } from "convex/browser";
import { streamText, tool, stepCountIs } from "ai";
import {
  type ToolSet,
} from "ai";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { google } from "@ai-sdk/google";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    console.log("Auto-Assign Agent Route Hit");
    const body = await req.json();
    const { messages, projectId, issueId } = body;
    
    console.log("DEBUG: Body received:", JSON.stringify({ projectId, issueId, messagesCount: messages?.length }));

    if (!projectId || !issueId || !messages) {
      console.error("MISSING PARAMETERS:", { projectId, issueId, hasMessages: !!messages });
      return new Response("Missing parameters", { status: 400 });
    }

    // Resolve project details
    const project = await convex.query(api.projects.getProjectById, {
      projectId: projectId as Id<"projects">,
    });

    if (!project) {
      console.error("PROJECT NOT FOUND:", projectId);
      return new Response("Project not found", { status: 404 });
    }

    const repoId = project.repositoryId;
    const projectName = project.projectName;
    const projectOwnerId = project.ownerId;

    const LocalTools = {
      getProjectTeamSkills: tool({
        description: "Get the skills and names of all team members associated with this project.",
        parameters: z.object({}),
        // @ts-ignore
        execute: async () => {
          console.log("Tool: getProjectTeamSkills calling for project:", projectId);
          try {
            const members = await convex.query(api.projects.getProjectTeamSkills, {
              projectId: projectId as Id<"projects">,
            });
            console.log("Tool: getProjectTeamSkills success, count:", members?.length);
            return { success: true, teamMembers: members };
          } catch (error) {
            console.error("❌ Tool: getProjectTeamSkills failed:", error);
            return { success: false, error: String(error) };
          }
        },
      }),

      assignIssue: tool({
        description: "Assign the issue to a specific team member or the owner.",
        parameters: z.object({
          issueId: z.string().describe("The ID of the issue to assign"),
          userId: z.string().describe("The ID of the user to assign the issue to"),
        }),
        // @ts-ignore
        execute: async ({ issueId, userId }: { issueId: string; userId: string }) => {
          console.log(`Tool: assignIssue calling for issue ${issueId} to user ${userId}`);
          try {
            await convex.mutation(api.repos.assignIssue, {
              issueId: issueId as Id<"issues">,
              userId: userId as Id<"users">,
            });
            console.log("Tool: assignIssue success");
            return { success: true };
          } catch (error) {
            console.error("❌ Tool: assignIssue failed:", error);
            return { success: false, error: String(error) };
          }
        },
      }),
    } satisfies ToolSet;

    const systemPrompt = `You are an autonomous project management agent for the project "${projectName}".
Your task is to automatically assign a new issue to the most suitable team member based on their skills.

## CONTEXT:
- Project ID: ${projectId}
- Repo ID: ${repoId}
- Issue ID: ${issueId}
- Project Owner ID: ${projectOwnerId}

## WORKFLOW:
1. Call "getProjectTeamSkills" to see all available teammates and their skills.
2. Analyze the issue description provided in the messages.
3. Decide who to assign the issue to:
   - Priority 1: A teammate whose skills match the issue requirements.
   - Priority 2: Any available teammate if no perfect match.
   - Priority 3: If no teammates are found (beyond the owner), assign it to the project owner (${projectOwnerId}).
4. Call "assignIssue" with the chosen userId.
5. Provide a brief, professional confirmation message about who was assigned and why.

## RULES:
- Be concise and professional.
- Always prefer teammates over the owner if teammates exist.
- If the team skills list is empty or only contains the owner, assign to the owner.
- Use the actual User IDs for the tools.
- just use the tools and assign to user. No need to explain anything`;

    // Map messages to a simpler format to avoid SDK mapping issues
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : (m.parts?.[0]?.text || ""),
    }));

    const result = streamText({
      model: google("gemini-2.5-flash"), 
      system: systemPrompt,
      messages: coreMessages,
      tools: LocalTools,
      toolChoice: "auto",
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in auto-assign route:", error);
    return new Response(JSON.stringify({ error: String(error) }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

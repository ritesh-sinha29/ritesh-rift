import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // USERS TABLE
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    clerkUserId: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    hasCompletedOnboarding: v.boolean(),
    githubUsername: v.optional(v.string()),
    githubAccessToken: v.optional(v.string()), 
    type: v.union(v.literal("free"), v.literal("pro"), v.literal("elite")),
    skills: v.optional(v.array(v.string())),
    lastUpdatedSkillsAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),
  
});
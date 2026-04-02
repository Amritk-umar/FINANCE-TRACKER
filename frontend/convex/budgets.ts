import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// 1. Fetch budgets for the current user
export const getBudgets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("budgets")
      .withIndex("by_user_month", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// 2. Add or Update a budget
export const setBudget = mutation({
  args: {
    month: v.string(), // e.g., "2026-04"
    category: v.string(), // e.g., "Food"
    limitAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not logged in");

    // Check if a budget already exists for this category in this month
    const existingBudget = await ctx.db
      .query("budgets")
      .withIndex("by_user_month", (q) => 
        q.eq("userId", userId).eq("month", args.month)
      )
      .filter((q) => q.eq(q.field("category"), args.category))
      .first();

    if (existingBudget) {
      // If it exists, update it
      await ctx.db.patch(existingBudget._id, {
        limitAmount: args.limitAmount,
      });
    } else {
      // If it doesn't exist, create a new one
      await ctx.db.insert("budgets", {
        userId,
        month: args.month,
        category: args.category,
        limitAmount: args.limitAmount,
      });
    }
  },
});
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server"; // <-- 1. Import this

export default defineSchema({
  ...authTables, // <-- 2. This automatically creates the "users" table for you!

  expenses: defineTable({
    userId: v.string(),
    amount: v.number(),
    category: v.string(),
    date: v.string(), 
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_month", ["userId", "date"]),

  budgets: defineTable({
    userId: v.string(),
    month: v.string(), 
    category: v.string(),
    limitAmount: v.number(),
  }).index("by_user_month", ["userId", "month"]),
});
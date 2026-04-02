import { query } from "./_generated/server";
import { auth } from "./auth";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    // 1. Get the userId from the auth helper
    const userId = await auth.getUserId(ctx);
    
    if (userId === null) {
      return null;
    }

    // 2. Fetch the user record from the automatically created "users" table
    return await ctx.db.get(userId);
  },
});
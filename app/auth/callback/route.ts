import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const email = data.session.user.email;
      const supabaseUserId = data.session.user.id;
      
      if (email) {
        try {
          // Check if user exists by supabaseUserId first (most reliable)
          let user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUserId),
          });

          // If not found by supabaseUserId, check by email (for legacy migration)
          if (!user) {
            user = await db.query.users.findFirst({
              where: eq(users.email, email),
            });
          }
          
          if (user) {
            // Update supabaseUserId if it's not set (legacy migration)
            if (!user.supabaseUserId) {
              await db
                .update(users)
                .set({ supabaseUserId })
                .where(eq(users.email, email));
            }
            
            // Update user metadata with username
            await supabase.auth.updateUser({
              data: { username: user.username }
            });
          }
        } catch (dbError) {
          console.error("Error linking user:", dbError);
        }
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}

import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      // Try to link the Supabase user ID to the local user record
      const email = data.session.user.email;
      const supabaseUserId = data.session.user.id;
      
      if (email) {
        try {
          // Check if user exists in our database
          const [user] = await db
            .select({ 
              username: users.username, 
              supabaseUserId: users.supabaseUserId 
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
          
          if (user) {
            // Only update supabase_user_id if it's not set (first login after migration)
            if (!user.supabaseUserId) {
              await db
                .update(users)
                .set({ supabaseUserId })
                .where(eq(users.email, email));
            }
            
            // Update user metadata with username from our database
            await supabase.auth.updateUser({
              data: { username: user.username }
            });
          }
        } catch (dbError) {
          console.error("Error linking Supabase user ID:", dbError);
          // Don't fail the auth flow if DB update fails
        }
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}

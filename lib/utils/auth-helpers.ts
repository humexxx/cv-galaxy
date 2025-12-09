import { NextResponse } from "next/server";
import { Session } from "@supabase/supabase-js";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }
  
  return { error: null, session };
}

export async function getUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
      user: null,
    };
  }

  return { error: null, user };
}

export async function getUserBySupabaseId(supabaseUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.supabaseUserId, supabaseUserId),
  });

  return user;
}

export async function requireOwnership(username: string, session: Session) {
  const { error: userError, user } = await getUserByUsername(username);
  
  if (userError) {
    return { error: userError, user: null };
  }

  if (user!.supabaseUserId !== session.user.id) {
    return {
      error: NextResponse.json(
        { error: "Forbidden: You can only modify your own data" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}

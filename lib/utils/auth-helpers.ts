import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// getUser() revalidates the JWT against the Supabase auth server. getSession()
// only decodes the cookie, which the client can forge.
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const authUser = await getAuthUser();

  if (!authUser) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      authUser: null,
    };
  }

  return { error: null, authUser };
}

export async function getUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
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

export async function requireOwnership(username: string, authUser: User) {
  const { error: userError, user } = await getUserByUsername(username);

  if (userError) {
    return { error: userError, user: null };
  }

  if (user!.supabaseUserId !== authUser.id) {
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

import { NextResponse } from "next/server";
import { getUserBySupabaseId } from "@/lib/utils/auth-helpers";
import { getSession } from "@/lib/utils/auth-helpers";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ username: null });
    }

    const user = await getUserBySupabaseId(session.user.id);

    return NextResponse.json({ username: user?.username || null });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

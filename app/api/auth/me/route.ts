import { NextResponse } from "next/server";
import { getAuthUser, getUserBySupabaseId } from "@/lib/utils/auth-helpers";

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ username: null });
    }

    const user = await getUserBySupabaseId(authUser.id);

    return NextResponse.json({ username: user?.username || null });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAuthUser, getUserBySupabaseId } from "@/lib/utils/auth-helpers";

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ exists: false, username: null });
    }

    const user = await getUserBySupabaseId(authUser.id);

    return NextResponse.json({
      exists: !!user,
      username: user?.username ?? null,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}

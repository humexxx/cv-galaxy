import { NextRequest, NextResponse } from "next/server";
import { getUserBySupabaseId, getSession } from "@/lib/utils/auth-helpers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "email parameter is required" },
      { status: 400 }
    );
  }

  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ exists: false, username: null });
    }

    const user = await getUserBySupabaseId(session.user.id);

    return NextResponse.json({ 
      exists: !!user, 
      username: user?.username ?? null 
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}

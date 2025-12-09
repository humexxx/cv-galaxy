import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userPreferencesSchema } from "@/schemas/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
      with: {
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const preferences = user.preferences || { showContractors: true };

    return NextResponse.json({
      showContractors: preferences.showContractors,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();

    const validated = userPreferencesSchema.partial().parse(body);

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingPrefs = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, user.id),
    });

    if (existingPrefs) {
      await db
        .update(userPreferences)
        .set({
          ...validated,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, user.id));
    } else {
      await db.insert(userPreferences).values({
        userId: user.id,
        showContractors: validated.showContractors ?? true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

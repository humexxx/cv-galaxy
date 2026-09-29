import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userPreferencesSchema } from "@/schemas/auth";
import { requireAuth, requireOwnership } from "@/lib/utils/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
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

    const { error: authError, authUser } = await requireAuth();
    if (authError) return authError;

    const { error: ownerError, user } = await requireOwnership(
      username,
      authUser!
    );
    if (ownerError) return ownerError;

    const body = await request.json();

    const validationResult = userPreferencesSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    await db
      .insert(userPreferences)
      .values({
        userId: user!.id,
        showContractors: validationResult.data.showContractors ?? true,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { ...validationResult.data, updatedAt: new Date() },
      });

    // Invalidar la caché del CV para reflejar el cambio
    revalidatePath(`/${username}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

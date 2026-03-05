import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { technologies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { technologiesUpdateSchema } from "@/schemas/cv";
import { requireAuth, requireOwnership } from "@/lib/utils/auth-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();

    const validationResult = technologiesUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { error: authError, session } = await requireAuth();
    if (authError) return authError;

    const { error: ownerError, user } = await requireOwnership(username, session!);
    if (ownerError) return ownerError;

    await db.delete(technologies).where(eq(technologies.userId, user!.id));

    if (validationResult.data.technologies.length > 0) {
      await db.insert(technologies).values(
        validationResult.data.technologies.map((name, sortOrder) => ({
          userId: user!.id,
          name,
          sortOrder,
        }))
      );
    }

    revalidatePath(`/${username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating technologies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

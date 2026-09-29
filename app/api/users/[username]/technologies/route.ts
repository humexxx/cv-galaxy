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

    const { error: authError, authUser } = await requireAuth();
    if (authError) return authError;

    const { error: ownerError, user } = await requireOwnership(
      username,
      authUser!
    );
    if (ownerError) return ownerError;

    const body = await request.json();

    const validationResult = technologiesUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      await tx.delete(technologies).where(eq(technologies.userId, user!.id));

      if (validationResult.data.technologies.length > 0) {
        await tx.insert(technologies).values(
          validationResult.data.technologies.map((name, sortOrder) => ({
            userId: user!.id,
            name,
            sortOrder,
          }))
        );
      }
    });

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

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { workExperience } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { workExperienceUpdateSchema } from "@/schemas/cv";
import { requireAuth, requireOwnership } from "@/lib/utils/auth-helpers";

const ALLOWED_TAGS = ["ul", "ol", "li", "strong", "em", "a", "h2", "h3", "p", "br"];
const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; id: string }> }
) {
  try {
    const { username, id } = await params;
    const body = await request.json();

    const validationResult = workExperienceUpdateSchema.safeParse(body);
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

    const existing = await db.query.workExperience.findFirst({
      where: and(
        eq(workExperience.id, id),
        eq(workExperience.userId, user!.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    const { title, description, responsibilitiesHtml } = validationResult.data;
    const sanitized = sanitizeHtml(responsibilitiesHtml, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
    });

    await db
      .update(workExperience)
      .set({ title, description, responsibilitiesHtml: sanitized })
      .where(eq(workExperience.id, id));

    revalidatePath(`/${username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

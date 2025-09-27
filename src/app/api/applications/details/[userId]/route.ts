import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, qualificationTable, experienceTable } from "@/lib/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = Number(params.userId);
    if (isNaN(userId))
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );

    // Fetch qualifications
    const qualifications = await db
      .select()
      .from(qualificationTable)
      .where(eq(qualificationTable.user_id, userId.toString()));

    // Fetch experiences
    const experiences = await db
      .select()
      .from(experienceTable)
      .where(eq(experienceTable.user_id, userId.toString()));

    return NextResponse.json({
      success: true,
      data: { qualifications, experiences }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch details" },
      { status: 500 }
    );
  }
}

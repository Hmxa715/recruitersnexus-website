import { NextRequest, NextResponse } from "next/server";
import {
  db,
  applicationsTable,
  userTable2,
  skillTable,
  qualificationTable,
  verifyTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { user_id, job_id } = await req.json();

    if (!user_id || !job_id) {
      return NextResponse.json(
        { success: false, message: "user_id and job_id are required" },
        { status: 400 }
      );
    }

    // 1. Get user basic info
    const user = await db
      .select()
      .from(userTable2)
      .where(eq(userTable2.id, user_id));

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Check skills
    const skills = await db
      .select()
      .from(skillTable)
      .where(eq(skillTable.user_id, user_id));

    // 3. Check qualifications
    const qualifications = await db
      .select()
      .from(qualificationTable)
      .where(eq(qualificationTable.user_id, user_id));

    // 4. Check verification
    const verify = await db
      .select()
      .from(verifyTable)
      .where(eq(verifyTable.user_id, user_id));

    const isVerified = verify.length && verify[0].verified === "verified";

    // ---- Profile completeness rules ----
    if (
      !user[0].username ||
      !user[0].email ||
      !skills.length ||
      !qualifications.length ||
      !isVerified
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete your profile before applying." },
        { status: 400 }
      );
    }

    // 5. Insert into applications table
    const newApp = await db
      .insert(applicationsTable)
      .values({ user_id, job_id })
      .returning();

    return NextResponse.json(
      { success: true, message: "Application submitted", data: newApp[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in /api/apply:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  db,
  applicationsTable,
  userTable2,
  hrTableNew,
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
     // 4. Check HR profile completeness
    const userProfile = await db
      .select()
      .from(hrTableNew)
      .where(eq(hrTableNew.user_id, user_id));

    if (!userProfile.length) {
      return NextResponse.json(
        { success: false, message: "User profile not found. Please complete your profile." },
        { status: 400 }
      );
    }

    const hr = userProfile[0];

    // Required fields in hrTableNew
    const requiredFields: (keyof typeof hr)[] = [
      "fname",
      "lname",
      "about",
      "father_name",
      "dob",
      "gender",
      "martial_status",
      "nic",
      "nationality",
      "religion",
      "phone",
      "designation",
    ];

    for (const field of requiredFields) {
      if (!hr[field] || hr[field]?.toString().trim() === "") {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 2. Check skills
    const skills = await db
      .select()
      .from(skillTable)
      .where(eq(skillTable.user_id, user_id));

    if (!skills.length) {
      return NextResponse.json(
        { success: false, message: "At least one skill is required before applying." },
        { status: 400 }
      );
    }

    // 3. Check qualifications
    const qualifications = await db
      .select()
      .from(qualificationTable)
      .where(eq(qualificationTable.user_id, user_id));

    if (!qualifications.length) {
      return NextResponse.json(
        { success: false, message: "At least one qualification is required before applying." },
        { status: 400 }
      );
    }

    // 4. Check verification
    const verify = await db
      .select()
      .from(verifyTable)
      .where(eq(verifyTable.user_id, user_id));

    const isVerified = verify.length && verify[0].verified === "verified";

    if (!isVerified) {
      return NextResponse.json(
        { success: false, message: "Your account must be verified before applying." },
        { status: 400 }
      );
    }

    // 5. Insert into applications table
    const newApp = await db
      .insert(applicationsTable)
      .values({ user_id, job_id })
      .returning();

    return NextResponse.json(
      { success: true, message: "Application submitted successfully", data: newApp[0] },
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

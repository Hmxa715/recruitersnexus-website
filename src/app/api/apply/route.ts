import { NextRequest, NextResponse } from "next/server";
import {
  db,
  applicationsTable,
  userTable2,
  hrTableNew,
  skillTable,
  qualificationTable,
  verifyTable,
  JobSkillTable,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { user_id, job_id } = await req.json();

    if (!user_id || !job_id) {
      return NextResponse.json(
        { success: false, message: "user_id and job_id are required" },
        { status: 400 }
      );
    }

    // 1. Check user exists
    const user = await db.select().from(userTable2).where(eq(userTable2.id, user_id));
    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Check HR profile completeness
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
          { success: false, message: `Please complete your profile. The required field "${field}" is missing.` },
          { status: 400 }
        );
      }
    }

    // 3. Check verification
    const verify = await db.select().from(verifyTable).where(eq(verifyTable.user_id, user_id));
    const isVerified = verify.length && verify[0].verified === "verified";
    if (!isVerified) {
      return NextResponse.json(
        { success: false, message: "Your account must be verified before applying." },
        { status: 400 }
      );
    }

    // 4. Fetch candidate skills
    const skills = await db.select().from(skillTable).where(eq(skillTable.user_id, user_id));
    if (!skills.length) {
      return NextResponse.json(
        { success: false, message: "At least one skill is required before applying." },
        { status: 400 }
      );
    }

    // 5. Fetch job required skills
    const jobSkills = await db
      .select()
      .from(JobSkillTable)
      .where(eq(JobSkillTable.user_id, job_id)); // here `user_id` in JobSkillTable = job_id

    let matchedSkills: string[] = [];

    if (jobSkills.length) {
      const userSkillSet = new Set(
        skills
            .map((s) => s.skill?.toLowerCase().trim())
            .filter((s): s is string => !!s) // remove undefined
        );

        const jobSkillSet = new Set(
        jobSkills
            .map((s) => s.skill?.toLowerCase().trim())
            .filter((s): s is string => !!s)
        );

        matchedSkills = [...userSkillSet].filter((skill) => jobSkillSet.has(skill));

      if (!matchedSkills.length) {
        return NextResponse.json(
          {
            success: false,
            message: "Your skills do not match the job requirements.",
            requiredSkills: [...jobSkillSet],
          },
          { status: 400 }
        );
      }
    }
    // else → no job skills → skip skill check

    // 6. Check qualifications
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
    // 7. Check if user already applied for this job
const existingApp = await db
  .select()
  .from(applicationsTable)
  .where(and(eq(applicationsTable.user_id, user_id), eq(applicationsTable.job_id, job_id)));
    if (existingApp.length) {
    return NextResponse.json(
        { success: false, message: "You have already applied for this job." },
        { status: 400 }
    );
    }
    // 8. Insert into applications table
    const newApp = await db
      .insert(applicationsTable)
      .values({ user_id, job_id })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: newApp[0],
        matchedSkills, // return empty [] if job had no skill requirements
      },
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

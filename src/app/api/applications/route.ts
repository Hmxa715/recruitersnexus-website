import { NextResponse } from "next/server";
import { db, applicationsTable, jobTable, userTable2 } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const applications = await db
      .select({
        id: applicationsTable.id,
        job_id: applicationsTable.job_id,
        job_title: jobTable.title,
        job_location: jobTable.location,
        job_description: jobTable.description,
        user_id: applicationsTable.user_id,
        applied_at: applicationsTable.applied_at,
        status: applicationsTable.status,
        username: userTable2.username,
        email: userTable2.email,
      })
      .from(applicationsTable)
      .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
      .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id));

    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

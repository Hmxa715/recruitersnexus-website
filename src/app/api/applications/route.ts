import { db, applicationsTable, jobTable, userTable2 } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Perform the join query
    const results = await db
      .select({
        id: applicationsTable.id,
        job_id: applicationsTable.job_id,
        user_id: applicationsTable.user_id,
        applied_at: applicationsTable.applied_at,
        status: applicationsTable.status,

        // From jobTable
        job_title: jobTable.title,
        job_location: jobTable.location,
        job_description: jobTable.description,

        // From userTable2
        username: userTable2.username,
        email: userTable2.email,
      })
      .from(applicationsTable)
      .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
      .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id))
      .orderBy(desc(applicationsTable.applied_at));

    console.log("Fetched Applications:", results.length);

    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error("Error fetching applications:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

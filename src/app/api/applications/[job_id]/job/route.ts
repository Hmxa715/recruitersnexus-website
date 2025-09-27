// /app/api/applications/[job_id]/route.ts
import { db, applicationsTable, userTable2, hrTableNew } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const job_id = parseInt(params.job_id);

    const applications = await db
      .select({
        application_id: applicationsTable.id,
        status: applicationsTable.status,
        user: userTable2, // whole user row
        profile: hrTableNew, // hr details
      })
      .from(applicationsTable)
      .leftJoin(userTable2, eq(userTable2.id, applicationsTable.user_id))
      .leftJoin(hrTableNew, eq(hrTableNew.user_id, applicationsTable.user_id))
      .where(eq(applicationsTable.job_id, job_id));

    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, applicationsTable, userTable2, hrTableNew } from "@/lib/db/schema";
import { transporter, info } from "@/data/mailer";

// ✅ GET -> Applications by job_id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job_id = parseInt(params.id);

    const applications = await db
      .select({
        application_id: applicationsTable.id,
        status: applicationsTable.status,
        user: userTable2, // full user row
        profile: hrTableNew, // hr details
      })
      .from(applicationsTable)
      .leftJoin(userTable2, eq(userTable2.id, applicationsTable.user_id))
      .leftJoin(hrTableNew, eq(hrTableNew.user_id, applicationsTable.user_id))
      .where(eq(applicationsTable.job_id, job_id));

    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error("Error fetching applications by job_id:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH -> Update status of an application by application_id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    if (!["shortlisted", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const applicationId = parseInt(params.id);

    // update application status
    const updated = await db
      .update(applicationsTable)
      .set({ status })
      .where(eq(applicationsTable.id, applicationId))
      .returning();

    if (status === "shortlisted" && updated[0]) {
      const user = await db
        .select()
        .from(userTable2)
        .where(eq(userTable2.id, updated[0].user_id));

      if (user.length) {
        const userEmail = user[0].email;

        const message = `
          <p>Dear ${user[0].username || "Candidate"},</p>
          <p>Congratulations 🎉 You have been <b>shortlisted</b> for the job you applied for!</p>
          <p>Our team will contact you soon with further details.</p>
          <p>Regards,<br/>HR Team</p>
        `;

        await transporter.sendMail({
          ...info,
          to: userEmail,
          subject: "You’ve Been Shortlisted!",
          text: "Congratulations! You have been shortlisted for the job.",
          html: message,
        });
      }
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (err: any) {
    console.error("Error in PATCH /applications/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

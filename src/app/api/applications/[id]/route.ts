import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, applicationsTable, userTable2 } from "@/lib/db/schema";// adjust path
import { transporter, info } from "@/data/mailer";

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

    // update application status
    const updated = await db
      .update(applicationsTable)
      .set({ status })
      .where(eq(applicationsTable.id, parseInt(params.id)))
      .returning();

    if (status === "shortlisted" && updated[0]) {
      // fetch applicant details
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
    console.error("Error in PATCH /applications:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

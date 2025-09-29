// app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, applicationsTable, userTable2, hrTableNew, jobTable } from "@/lib/db/schema";
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
       // get candidate info
      const user = await db
        .select()
        .from(userTable2)
        .where(eq(userTable2.id, updated[0].user_id));

      // get job title
      const job = await db
        .select()
        .from(jobTable)
        .where(eq(jobTable.id, updated[0].job_id));

      if (user.length && job) {
        const userEmail = "hamzaaslam715@gmail.com";
        // const userEmail = user[0].email || "hamzaaslam715@gmail.com";
        const userName = user[0].username || "Candidate";
        const jobTitle = job[0].title || "the job";

        // ✅ Use your HTML template with injected values
        const message = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Shortlisted Notification</title>
</head>
<body style="background-color:#f7f7f7;margin:0;padding:0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" bgcolor="#f7f7f7" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="700" bgcolor="#201f42" style="color:#fff;padding:35px 25px;">
          <tr>
            <td align="center">
              <img alt="logo" style="width: 100%;height: 60px;object-fit:contain;" fetchpriority="high" decoding="async" data-nimg="1" class="" style="color:transparent" srcset="https://www.recruitersnexus.com/_next/image?url=%2FRN-new-white.png&w=384&q=75" src="https://www.recruitersnexus.com/_next/image?url=%2FRN-new-white.png&w=384&q=75">
              <h2 style="font-size:30px;margin:0;color:#dcdef1;font-family:'Work Sans',Arial,sans-serif;">
                Congratulations, ${userName}!
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0;color:#ffffff;font-size:16px;line-height:1.6;">
              <p>We are excited to inform you that you’ve been <b>shortlisted</b> for the position of <b>${jobTitle}</b>.</p>
              <p>Our HR team will contact you soon with the next steps in the recruitment process.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 0;">
              <a href="https://www.recruitersnexus.com" target="_blank" 
                style="background:#ffffff;color:#201f42;text-decoration:none;
                        font-size:18px;padding:10px 20px;border-radius:4px;
                        display:inline-block;">
                Visit Recruiters Nexus
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#ccc;padding-top:20px;line-height:1.4;">
              <p>Best regards,<br/>Recruiters Nexus HR Team</p>
              <p style="margin-top:15px;">Recruiters Nexus<br/>
              Village Kanate, Distt. & Tehsil Mansehra, KPK, Pakistan</p>
              <p>If you have any questions, <a href="https://www.recruitersnexus.com/contact" target="_blank" style="color:#fff;">Contact us</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await transporter.sendMail({
          ...info,
          to: userEmail,
          subject: `Shortlisted for ${jobTitle} at Recruiters Nexus`,
          text: `Hi ${userName}, Congratulations! You’ve been shortlisted for the role of ${jobTitle}.`,
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

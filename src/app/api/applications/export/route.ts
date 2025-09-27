// app/api/admin/applications/route.ts

import { NextResponse } from "next/server";
import { db, applicationsTable, jobTable, userTable2, qualificationTable, experienceTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "all" | "shortlisted"

    let applications;

    if (type === "shortlisted") {
      applications = await db
        .select({
          id: applicationsTable.id,
          job_title: jobTable.title,
          username: userTable2.username,
          email: userTable2.email,
          applied_at: applicationsTable.applied_at,
          status: applicationsTable.status,
          degree: qualificationTable.degree,
          speciallization: qualificationTable.speciallization,
          cgpa: qualificationTable.cgpa,
          passing_year: qualificationTable.passing_year,
          institute: qualificationTable.institute,
          designation: experienceTable.designation,
          from_date: experienceTable.from_date,
          to_date: experienceTable.to_date,
          organization: experienceTable.organization,
          total_experience: experienceTable.total_experience,
          address: experienceTable.address,
        })
        .from(applicationsTable)
        .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
        .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id))
        .leftJoin(qualificationTable, eq(applicationsTable.user_id, qualificationTable.user_id))
        .leftJoin(experienceTable, eq(applicationsTable.user_id, experienceTable.user_id))
        .where(eq(applicationsTable.status, "shortlisted"));
    } else {
      applications = await db
        .select({
          id: applicationsTable.id,
          job_title: jobTable.title,
          username: userTable2.username,
          email: userTable2.email,
          applied_at: applicationsTable.applied_at,
          status: applicationsTable.status,
          degree: qualificationTable.degree,
          speciallization: qualificationTable.speciallization,
          cgpa: qualificationTable.cgpa,
          passing_year: qualificationTable.passing_year,
          institute: qualificationTable.institute,
          designation: experienceTable.designation,
          from_date: experienceTable.from_date,
          to_date: experienceTable.to_date,
          organization: experienceTable.organization,
          total_experience: experienceTable.total_experience,
          address: experienceTable.address,
        })
        .from(applicationsTable)
        .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
        .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id))
        .leftJoin(qualificationTable, eq(applicationsTable.user_id, qualificationTable.user_id))
        .leftJoin(experienceTable, eq(applicationsTable.user_id, experienceTable.user_id));
    }

    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Download Excel (backup or shortlisted reports)
export async function POST(req: Request) {
  try {
    const { type } = await req.json(); // expects { type: "all" | "shortlisted" }

    let applications;

    if (type === "shortlisted") {
      applications = await db
        .select({
          id: applicationsTable.id,
          job_title: jobTable.title,
          username: userTable2.username,
          email: userTable2.email,
          applied_at: applicationsTable.applied_at,
          status: applicationsTable.status,
          degree: qualificationTable.degree,
          speciallization: qualificationTable.speciallization,
          cgpa: qualificationTable.cgpa,
          passing_year: qualificationTable.passing_year,
          institute: qualificationTable.institute,
          designation: experienceTable.designation,
          from_date: experienceTable.from_date,
          to_date: experienceTable.to_date,
          organization: experienceTable.organization,
          total_experience: experienceTable.total_experience,
          address: experienceTable.address,
        })
        .from(applicationsTable)
        .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
        .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id))
        .leftJoin(qualificationTable, eq(applicationsTable.user_id, qualificationTable.user_id))
        .leftJoin(experienceTable, eq(applicationsTable.user_id, experienceTable.user_id))
        .where(eq(applicationsTable.status, "shortlisted"));
    } else {
      applications = await db
        .select({
          id: applicationsTable.id,
          job_title: jobTable.title,
          username: userTable2.username,
          email: userTable2.email,
          applied_at: applicationsTable.applied_at,
          status: applicationsTable.status,
          degree: qualificationTable.degree,
          speciallization: qualificationTable.speciallization,
          cgpa: qualificationTable.cgpa,
          passing_year: qualificationTable.passing_year,
          institute: qualificationTable.institute,
          designation: experienceTable.designation,
          from_date: experienceTable.from_date,
          to_date: experienceTable.to_date,
          organization: experienceTable.organization,
          total_experience: experienceTable.total_experience,
          address: experienceTable.address,
        })
        .from(applicationsTable)
        .leftJoin(userTable2, eq(applicationsTable.user_id, userTable2.id))
        .leftJoin(jobTable, eq(applicationsTable.job_id, jobTable.id))
        .leftJoin(qualificationTable, eq(applicationsTable.user_id, qualificationTable.user_id))
        .leftJoin(experienceTable, eq(applicationsTable.user_id, experienceTable.user_id));
    }

    // Generate Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Job Title", key: "job_title", width: 25 },
      { header: "Name", key: "username", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Applied At", key: "applied_at", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Degree", key: "degree", width: 20 },
      { header: "Specialization", key: "speciallization", width: 20 },
      { header: "CGPA", key: "cgpa", width: 10 },
      { header: "Passing Year", key: "passing_year", width: 15 },
      { header: "Institute", key: "institute", width: 25 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "From Date", key: "from_date", width: 15 },
      { header: "To Date", key: "to_date", width: 15 },
      { header: "Organization", key: "organization", width: 25 },
      { header: "Total Experience", key: "total_experience", width: 20 },
      { header: "Address", key: "address", width: 25 },
    ];

    applications.forEach((app) => {
      worksheet.addRow({
        ...app,
        applied_at: app.applied_at ? new Date(app.applied_at).toLocaleString() : "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="applications_${type}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (err: any) {
    console.error("Error exporting applications:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db, interviewTable, transactions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import moment from "moment-timezone";

export async function GET(req: NextRequest) {
  const interview = await db.select().from(interviewTable);

  return NextResponse.json(interview);
}

export async function POST(req: NextRequest) {
  // const data = await req.json();
  // await db.insert(interviewTable).values({id:data.id,slot:data.slot,hr_id:data.hr_id,user_id:data.user_id});
  // return NextResponse.json(data);
try {
    const data = await req.json();

    // 1. Get the latest transaction for this user
    const userTxn = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, data.user_id))
      .orderBy(transactions.createdAt) // latest first
    .limit(1);

    if (!userTxn.length) {
    return NextResponse.json(
        {
        success: false,
        message: "Please purchase a plan before scheduling an interview."
        },
        { status: 400 }
    );
    }

    const txn = userTxn[0];
    const txnStatus = txn.status?.toLowerCase();
    // 2. Check status
    if (txnStatus === "pending") {
    return NextResponse.json(
        {
        success: false,
        message: "Your payment is still pending. Please complete it first."
        },
        { status: 400 }
    );
    }

    if (txnStatus === "failed") {
    return NextResponse.json(
        {
        success: false,
        message: "Your payment has failed. Please try again."
        },
        { status: 400 }
    );
    }

    if (txnStatus !== "success") {
    return NextResponse.json(
        {
        success: false,
        message: "Please pay the fee from our pricing plans to schedule your interview."
        },
        { status: 400 }
    );
    }

    // 3. If success, allow scheduling interview
    await db.insert(interviewTable).values({
    id: data.id,
    slot: data.slot,
    hr_id: data.hr_id,
    user_id: data.user_id
    });

    return NextResponse.json({
    success: true,
    message: "Interview scheduled successfully"
    });
} catch (err: any) {
    console.error("Error scheduling interview:", err);
    return NextResponse.json(
    { success: false, message: "Something went wrong" },
    { status: 500 }
    );
}
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  // const {id} = data;
  const { slot } = data;
  // const formattedSlot = moment(slot).format();
  const formattedSlot = slot;
  const formattedSlotUTC = moment.utc(slot).format();

  const interview = await db
    .select()
    .from(interviewTable)
    .where(
      and(
        eq(interviewTable.hr_id, data.hr_id),
        eq(interviewTable.user_id, data.user_id),
        eq(interviewTable.slot, formattedSlotUTC)
      )
    );

  // return NextResponse.json(interview);
  // const filteredInterview = interview.filter((item) => item.slot === data.slot);
  // return NextResponse.json(filteredInterview);
  try {
    if (
      data.is_confirmed === "confirmed" &&
      interview[0]?.is_confirmed === "unConfirmed"
    ) {
      const updateResult = await db
        .update(interviewTable)
        .set({ is_confirmed: data.is_confirmed })
        .where(
          and(
            eq(interviewTable.hr_id, data.hr_id),
            eq(interviewTable.user_id, data.user_id),
            eq(interviewTable.slot, formattedSlot),
            eq(interviewTable.id, data.id)
          )
        );
      return NextResponse.json({ is_confirmed: updateResult.rows });
    } else if (
      data.is_conducted === "conducted" &&
      interview[0]?.is_conducted === "notConducted"
    ) {
      const updateResult = await db
        .update(interviewTable)
        .set({ is_conducted: data.is_conducted })
        .where(
          and(
            eq(interviewTable.hr_id, data.hr_id),
            eq(interviewTable.user_id, data.user_id),
            eq(interviewTable.slot, formattedSlot)
          )
        );
      return NextResponse.json({ is_confirmed: updateResult.rows });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      is_confirmed: interview[0]?.is_confirmed,
      is_conducted: interview[0]?.is_conducted,
      slot: interview[0]?.slot
    });
  }

  return NextResponse.json({
    is_confirmed: interview[0]?.is_confirmed,
    is_conducted: interview[0]?.is_conducted,
    slot: interview[0]?.slot
  });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { slot } = data;

  // const formattedSlot = moment(slot).format();
  const formattedSlot = slot;

  const interview = await db
    .delete(interviewTable)
    .where(
      and(
        eq(interviewTable.hr_id, data.hr_id),
        eq(interviewTable.user_id, data.user_id),
        eq(interviewTable.slot, formattedSlot),
        eq(interviewTable.is_confirmed, data.is_confirmed),
        eq(interviewTable.id, data.id)
      )
    );

  // await db.insert(hrTableNew).values(data)

  // //console.log(data);
  return NextResponse.json({
    message: "Successfully Deleted",
    data: interview.rows
  });
}

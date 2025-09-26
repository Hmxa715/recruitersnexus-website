import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  integer,
  bigint,
  decimal as pgDecimal,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { decimal } from "drizzle-orm/mysql-core";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);

export const verifyTable = pgTable("verify", {
  id: serial("id").primaryKey(),
  forgot_pass: varchar("forgot_pass").notNull(),
  reg_code: text("reg_code"),
  verified: varchar("verified").default("unverified"),
  user_id: text("user_id")
    .unique()
    .references(() => userTable2.id, { onDelete: "cascade" }),
});

export const qualificationTable = pgTable("qualification", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  speciallization: text("speciallization"),
  cgpa: text("cgpa"),
  passing_year: text("passing_year"),
  institute: text("institute"),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
});

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  designation: text("designation").notNull(),
  from_date: text("from_date"),
  to_date: text("to_date"),
  aoe: text("aoe"),
  organization: text("organization"),
  total_experience: text("total_experience"),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
  address: text("address"),
  image: text("image"),
});

export const serviceTable = pgTable("service", {
  id: serial("id").primaryKey(),
  service: varchar("service").notNull(),
  slot: text("slot").notNull(),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
  category: text("category")
});

export const interviewTable = pgTable("interview", {
  id: text("id").primaryKey(),
  slot: text("slot").notNull(),
  is_conducted: varchar("is_conducted").default("notConducted"),
  is_confirmed: varchar("is_confirmed").default("unConfirmed"),
  hr_id: text("hr_id").references(() => userTable2.id, { onDelete: "cascade" }),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  rating_one: pgDecimal("rating_one"),
  rating_two: pgDecimal("rating_two"),
  rating_three: pgDecimal("rating_three"),
  rating_four: pgDecimal("rating_four"),
  rating_five: pgDecimal("rating_five"),
  total_rating: pgDecimal("total_rating"),
  user_rating: pgDecimal("user_rating"),
  user_feedback: text("user_feedback"),
  candidate_name: text("candidate_name"),
  strength: text("strength"),
  weakness: text("weakness"),
  description: text("description"),
  slot: text("slot").notNull(),
  hr_id: text("hr_id").references(() => userTable2.id, { onDelete: "cascade" }),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
});

export const userTable2 = pgTable("users2", {
  id: varchar("id", { length: 50 }).notNull().unique(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password", { length: 256 }),
  image: varchar("image"), // Add the imageUrl field here
  role: varchar("role", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobTable = pgTable("job", {
  id: serial("id").primaryKey(),
  title: text("title"),
  salary_start: text("salary_start"),
  expiration_date: text("expiration_date"),
  description: text("description"),
  is_approved: text("is_approved").default("unapproved"),
  feature: text("feature").default("none"),
  created_at: timestamp("created_at").defaultNow(),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
  image: text("image"),
  organization: text("organization"),
  location: text("location"),
  
});

export const reportTable = pgTable("report", {
  id: serial("id").primaryKey(),
  reason: text("reason"),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
});

export const hrTableNew = pgTable("hr", {
  id: serial("id").primaryKey(),
  fname: text("fname"),
  lname: text("lname"),
  about: text("about"),
  father_name: text("father_name"),
  dob: text("dob"),
  gender: text("gender"),
  martial_status: text("martial_status"),
  nic: text("nic"),
  nationality: text("nationality"),
  religion: text("religion"),
  is_approve: text("is_approve").default("unapproved"),
  calculate_experience: text("calculate_experience").default("0 years, 0 months"),
  phone: text("phone"),
  user_id: text("user_id")
    .unique()
    .references(() => userTable2.id, { onDelete: "cascade" }),
    designation: text("designation"),
});

// export const hrTableNew = pgTable("hr",
//   {
//     id: serial('id').primaryKey(),
//     fname: text('fname'),
//     lname: text('lname'),
//     about: text('about'),
//     service: text('service'),
//     experience: text('experience'),
//     certif: text('certif'),
//     aoe: text('aoe'),
//   }
//   )

export const skillTable = pgTable("skills", {
  sid: serial("sid"),
  skill: text("skill"),
  user_id: text("user_id").references(() => userTable2.id, {
    onDelete: "cascade",
  }),
});

export const JobSkillTable = pgTable("job_skill", {
  sid: serial("sid"),
  skill: text("skill"),
  user_id: bigint("user_id", { mode: "number" }).references(() => jobTable.id),
});

// export const anotherUserTable = pgTable("users2", {
//   _id: serial("_id").primaryKey(),
//   username: varchar("username").notNull(),
//   email: varchar("email").notNull(),
//   // age: varchar("age").notNull(),
//   password: varchar("password", { length: 30 }),
// });

// export const getuserTable = async () => {
//   const selectResult = await db.select().from(userTable);
//   //console.log('Results', selectResult);
// };

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: text("user_id").notNull(),
    plan: text("plan").notNull(),
    txnRefNo: text('txn_ref_no').unique().notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // Allow decimal,
    currency: text('currency').default('PKR'),
    status: text('status').default('PENDING'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    requestBody: jsonb('request_body'),
    responseBody: jsonb('response_body')
});

export const transactionHistory = pgTable('transaction_history', {
  id: serial('id').primaryKey(),
  userId: text("user_id").notNull(),
  plan: text("plan").notNull(),
  txnRefNo: text('txn_ref_no').notNull().references(() => transactions.txnRefNo, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('PKR'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  changedAt: timestamp('changed_at').defaultNow(),
  requestBody: jsonb('request_body'),
  responseBody: jsonb('response_body')
});

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  job_id: integer("job_id").notNull(),
  applied_at: timestamp("applied_at").defaultNow(),
});
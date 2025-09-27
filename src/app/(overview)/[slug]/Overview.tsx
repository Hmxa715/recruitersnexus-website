"use client";
import React from "react";
import Experience from "@/app/Settings/Experience";
import Qualifications from "@/app/Settings/Qualifications";
import SettingBar from "@/app/Settings/SettingBar";
import UserInfo from "@/app/Settings/UserInfo";
import NavBar from "@/app/dashboard/components/NavBar";
import SideBar from "../SideBar";
import Dashboard from "@/app/dashboard/components/Dashboard";
import Explore from "@/app/explore/Explore";
import ServiceInput from "@/app/subServices/ServiceInput";
import { UnconductedHR } from "@/app/dashboard/components/UnconductedHR";
import Interviews from "@/app/dashboard/components/Interviews";
import Posting from "@/app/dashboard/components/Posting";
import Applications from "@/app/dashboard/components/Applications";
import Notifications from "@/app/dashboard/components/Notifications";
import Setting from "@/app/dashboard/components/Setting";
import JobUser from "@/app/dashboard/components/JobUser";
// import { useSearchParams } from 'next/navigation'
import { userData } from "@/data/page-data";
import Schedule from "@/app/schedule_interview/[id]/Schedule";
import ScheduleInterview from "@/app/dashboard/components/ScheduleInterview";
import Profile from "@/app/dashboard/components/Profile";
import useUserData from "@/lib/db/userData";
import { AllAccounts } from "@/app/dashboard/components/AllAccounts";
import { UnverifiedAccounts } from "@/app/dashboard/components/UnverifiedAccounts";
import { AccountsApproval } from "@/app/dashboard/components/AccountsApproval";
import { AccountReports } from "@/app/dashboard/components/AccountReports";
import { JobPostingAdmin } from "@/app/dashboard/components/JobPostingAdmin";
import InterviewProfile from "@/app/interview-report/Profile";
import TransactionsPage from "@/app/transactions/page";

const Overview = ({
  slug,
  id,
  filteredHr,
  filterServices,
  allInterviews
}: any) => {
  const { userData, status } = useUserData();
  return (
    <div
      className={`w-full flex md:flex-row flex-col pt-12 bg-[#F2F5F9] font-nunito`}
    >
      <div className={`${useUserData().userData ? "flex" : "hidden"}`}>
        <NavBar />
      </div>

      <div
        className={`w-full ${
          useUserData().userData ? "md:flex" : "hidden"
        }  md:min-w-[250px] md:w-1/5 hidden  flex-col p-6 h-full  md:h-auto bg-[#F2F5F9] border-r-2 border-[#A4AC7EB] space-y-6`}
      >
        <SideBar slug={slug} />
      </div>

      <div
        className={`w-full ${
          useUserData().userData ? "md:w-4/5" : "w-full"
        } h-full bg-[#F2F5F9] pb-32`}
      >
        {slug === "dashboards" ? (
          <Dashboard />
        ) : slug === "exploreExpert" ? (
          <Explore />
        ) : slug === "profile" ? (
          <Profile user_id={id} />
        ) : slug === "experience" ? (
          <Experience />
        ) : slug === "service" ? (
          <ServiceInput />
        ) : slug === "interviews" ? (
          <Interviews />
        ) : slug === "job" ? (
          <JobUser />
        ) : slug === "scheduleInterview" ? (
          <ScheduleInterview
            hr_id={id}
            filteredHr={filteredHr}
            filterServices={filterServices}
            allInterviews={allInterviews}
          />
        ) : slug === "posting" ? (
          <Posting />
        ) : slug === "transactions" ? (
          <TransactionsPage />
        ) : slug === "all-accounts" ? (
          <AllAccounts />
        ) : slug === "unverified" ? (
          <UnverifiedAccounts />
        ) : slug === "account-approval" ? (
          <AccountsApproval />
        ) : slug === "account-reports" ? (
          <AccountReports />
        ) : slug === "admin-posting" ? (
          <JobPostingAdmin />
        ) : slug === "applications" ? (
          <Applications />
        ) : slug === "interview-report" ? (
          <InterviewProfile user_id={id} />
        ) : slug === "setting" ? (
          <Setting />
        ) : slug === "notifications" ? (
          <Notifications />
        ) : (
          <div className="flex justify-center items-center h-screen">
            <h1>Not Found</h1>
          </div>
        )}
      </div>

      <div
        className={`w-full ${
          status === "404" ? "hidden" : "flex"
        } fixed bottom-0 z-20 md:min-w-[250px] border-t-2  md:w-1/5  md:hidden items-center justify-center flex-col py-0 h-24  md:h-auto bg-[#F2F5F9] border-r-2 border-[#A4AC7EB] space-y-6`}
      >
        <SideBar slug={slug} />
      </div>

      {/* <div>
        Hello World by {params.slug}
        </div> */}
    </div>
  );
};

export default Overview;

"use client";
import useUserData from "@/lib/db/userData";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { CreditCard, Home } from "lucide-react";
import { TfiMenuAlt } from "react-icons/tfi";
import { AiOutlineTag } from "react-icons/ai";
import { PiMedal } from "react-icons/pi";
import { Star } from "lucide-react";
import { IoBriefcaseOutline } from "react-icons/io5";
import MainUsers from "@/lib/db/mainUsers";
import { userData } from "@/data/page-data";
import Image from "next/image";
import { useState } from "react";
import { log } from "console";
import { User } from "lucide-react";
import { BadgeX } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { Flag } from "lucide-react";
import Rating from "../dashboard/components/Rating";
import SkeletonLoaderCustom from "@/components/SkeletonLoaderCustom";
import SkeletonLoaderResNavbar from "@/components/SkeletonLoaderResNavBar";
import HrData from "@/lib/db/hrData";
const SideBar = ({ slug }: { slug: string }) => {
  const { userData } = useUserData();
  const router = useRouter();
  const { users } = MainUsers();
  const { hrTable } = HrData();
  const fetchedData = users;

  const filteredInfo = hrTable?.filter(
    (item: any) => item?.user_id === userData?.id
  );

  const filteredData: userData[] = fetchedData?.filter(
    (item: any) => item?.id === userData?.id
  );

  async function onClick(path: any) {
    router.push(`/${path}`);
    return;
  }

  return (
    <div
      className={`flex flex-row md:flex-col  justify-center md:justify-stretch   md:border-t-0  gap-x-0 gap-y-0 md:gap-y-4 md:items-center items-end`}
    >
      {userData ? (
        <div>
          <div
            className={`w-full md:flex hidden   md:border-b-2 border-[#A4AC7EB] mb-4`}
          >
            <div className="w-full flex items-center py-8 justify-center  flex-col">
              <div className="w-[10%] h-[10%] md:w-1/2 md:h-1/2">
                <Image
                  priority
                  quality={100}
                  width={200}
                  height={200}
                  objectFit="cover"
                  src={`${filteredData[0]?.image || "/demoProfile.jpg"}`}
                  alt="Profile Picture"
                  aria-label="Profile Picture"
                  className="rounded-full"
                />
              </div>

              <div className="flex flex-col space-y-6 items-center">
                <div className=" flex flex-col items-center">
                  <h1 className="text-md md:text-2xl font-bold text-[#242E49] mt-6">
                    {userData?.username}
                  </h1>
                  <span>{userData?.email}</span>
                </div>

                <div className=" flex flex-col items-left">
                  {userData?.role === "hr" && (
                    <span className="flex flex-col items-left space-x-3">
                      {" "}
                      <span className="text-[#242E49] font-bold">
                        Profile Status:{" "}
                      </span>{" "}
                      <span className="flex self-start">
                        {filteredInfo[0]?.is_approve === "pending"
                          ? "Still in pending"
                          : filteredInfo[0]?.is_approve}
                      </span>
                    </span>
                  )}

                  <div className="items-center">
                    {userData?.role === "hr" && <Rating id={userData?.id} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex md:flex-col max-w-[250px] overflow-x-auto md:w-full flex-row justify-around gap-x-2 md:gap-x-0 md:gap-y-4 md:items-left items-end md:justify-center py-4">
            <button
              onClick={() => onClick("dashboards")}
              className={`md:w-full w-16 h-16 md:h-full  ${
                slug === "dashboards"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]   `}
            >
              <Home className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button
              onClick={() => onClick("interviews")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "interviews" || slug === "interview-report"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "hidden" : ""
              }  flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]   `}
            >
              <TfiMenuAlt className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Interviews</span>
            </button>
            <button
              onClick={() => onClick("exploreExpert")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "exploreExpert" || slug === "scheduleInterview"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "user" || userData?.role === "admin"
                  ? ""
                  : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]   `}
            >
              <AiOutlineTag className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Explore</span>
            </button>

            {/* Transaction tab start */}
            <button
              onClick={() => onClick("transactions")}
              className={`md:w-full w-16 h-16 md:h-full  ${
                slug === "transactions"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]   `}
            >
              <CreditCard className="mr-2" size={24} />
              <span className="hidden md:inline">Transactions</span>
            </button>
            {/* Transaction tab end */}

            <button
              onClick={() => onClick("service")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "service"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "hr" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              <Star className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Schedule Time</span>
            </button>
            <button
              onClick={() => onClick("job")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "job"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "user" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]   `}
            >
              <PiMedal className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Jobs</span>
            </button>
            <button
              onClick={() => onClick("posting")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "posting"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "hr" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <IoBriefcaseOutline className="mx-4" size={24} />{" "}
              <span className="hidden md:block">Jobs Posting</span>
            </button>
            <button
              onClick={() => onClick("all-accounts")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "all-accounts"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <User className="mx-4" size={24} />
              <span className="hidden md:block">All Accounts</span>
            </button>
            <button
              onClick={() => onClick("unverified")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "unverified"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <BadgeX className="mx-4" size={24} />
              <span className="hidden md:block"> Unverified Accounts</span>
            </button>
            <button
              onClick={() => onClick("account-approval")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "account-approval"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <BadgeCheck className="mx-4" size={24} />
              <span className="hidden md:block">Accounts Approval</span>
            </button>
            <button
              onClick={() => onClick("account-reports")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "account-reports"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <Flag className="mx-4" size={24} />
              <span className="hidden md:block">Account Reports</span>
            </button>
            <button
              onClick={() => onClick("admin-posting")}
              className={`md:w-full w-16 h-16 md:h-full ${
                slug === "admin-posting"
                  ? "bg-[#4765FF] rounded-md text-white"
                  : "bg-transparent hover:rounded-md hover:text-white text-black"
              } ${
                userData?.role === "admin" ? "" : "hidden"
              } flex items-center justify-center md:justify-stretch self-center  px-0 md:px-2 py-0  md:py-3 hover:bg-[#4765FF]  `}
            >
              {" "}
              <IoBriefcaseOutline className="mx-4" size={24} />
              <span className="hidden md:block">Jobs Posting</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full self-center flex items-center">
          <SkeletonLoaderResNavbar />
        </div>
      )}
    </div>
  );
};

export default SideBar;

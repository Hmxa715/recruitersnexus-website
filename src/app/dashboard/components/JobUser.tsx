"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/app/dashboard/components/date-range-picker";
import { MainNav } from "@/app/dashboard/components/main-nav";
import { Overview } from "@/app/dashboard/components/overview";
import { RecentSales } from "@/app/dashboard/components/recent-sales";
import { Search } from "@/app/dashboard/components/search";
import { UserNav } from "@/app/dashboard/components/user-nav";
import useUserData from "@/lib/db/userData";
import Link from "next/link";
import { format } from "date-fns";
import NavBar from "./NavBar";
import MainUsers from "@/lib/db/mainUsers";
import InterviewData from "@/lib/db/interviewData";
import { useRouter } from "next/navigation";
import HrData from "@/lib/db/hrData";
import FeedbackData from "@/lib/db/feedbackData";
import Rating from "./Rating";
import toast from "react-hot-toast";
import { Plus, Trash } from "lucide-react";
import JobData from "@/lib/db/jobData";
import SkillModal from "./SkillModal";
import jobSkillsData from "@/lib/db/jobSkillsData";
import { X } from "lucide-react";
import moment from "moment-timezone";
import SkeletonLoaderCustom from "@/components/SkeletonLoaderCustom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SpinnerLoader from "./SpinnerLoader";

const JobModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [salary_start, setSalary_start] = useState(0);
  const [salary_end, setSalary_end] = useState(0);
  const [description, setDescription] = useState("");
  const { userData } = useUserData();

  const salaryStartOptions = [
    { value: 0, label: "$0" },
    { value: 1000, label: "$1000" },
    { value: 5000, label: "$5000" },
    { value: 10000, label: "$10,000" },
    { value: 15000, label: "$15,000" },
    { value: 20000, label: "$20,000" },
    { value: 25000, label: "$25,000" },
    { value: 30000, label: "$30,000" },
    { value: 35000, label: "$35,000" },
    { value: 40000, label: "$40,000" },
    { value: 45000, label: "$45,000" },
    { value: 50000, label: "$50,000" },
    { value: 55000, label: "$55,000" },
    { value: 60000, label: "$60,000" },
    { value: 65000, label: "$65,000" },
    { value: 70000, label: "$70,000" },
    { value: 75000, label: "$75,000" },
    { value: 80000, label: "$80,000" },
    { value: 85000, label: "$85,000" },
    { value: 90000, label: "$90,000" },
    { value: 95000, label: "$95,000" },
    { value: 100000, label: "$100,000" },
    { value: 150000, label: "$150,000" },
    { value: 200000, label: "$200,000" },
    // Add more options as needed
  ];

  const salaryEndOptions = [
    { value: 2000, label: "$2000" },
    { value: 6000, label: "$6000" },
    { value: 12000, label: "$12,000" },
    { value: 15000, label: "$15,000" },
    { value: 20000, label: "$20,000" },
    { value: 25000, label: "$25,000" },
    { value: 30000, label: "$30,000" },
    { value: 35000, label: "$35,000" },
    { value: 40000, label: "$40,000" },
    { value: 45000, label: "$45,000" },
    { value: 50000, label: "$50,000" },
    { value: 55000, label: "$55,000" },
    { value: 60000, label: "$60,000" },
    { value: 65000, label: "$65,000" },
    { value: 70000, label: "$70,000" },
    { value: 75000, label: "$75,000" },
    { value: 80000, label: "$80,000" },
    { value: 85000, label: "$85,000" },
    { value: 90000, label: "$90,000" },
    { value: 95000, label: "$95,000" },
    { value: 100000, label: "$100,000" },
    { value: 150000, label: "$150,000" },
    { value: 200000, label: "$200,000" },
    // Add more options as needed
  ];

  const handleSalaryStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSalary_start(parseInt(e.target.value));
  };

  const handleSalaryEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSalary_end(parseInt(e.target.value));
  };

  const handleSubmit = async () => {
    try {
      const data = await fetch("/api/job", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          salary_start: salary_start,
          expiration_date: salary_end,
          description: description,
          user_id: userData?.id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      // alert("Mark as Conducted!");
      if (!data.ok) {
        toast.error("Error submitting job");
        return;
      }
      toast.success("Job has been posted and send for approval!");
      setTitle("");
      setSalary_start(0);
      setSalary_end(0);
      setDescription("");
      onClose();
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded-lg max-w-md relative z-20">
        <div className="flex justify-center items-center flex-col space-y-6">
          <h2 className="text-xl font-semibold mb-4">Add Job Posting</h2>
          <span className="font-bold self-start">Job Title: </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <span className="font-bold self-start">Starting Salary: </span>
          <select value={salary_start} onChange={handleSalaryStartChange}>
            {salaryStartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="font-bold self-start">Ending Salary: </span>
          <select value={salary_end} onChange={handleSalaryEndChange}>
            {salaryEndOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="font-bold self-start">Job Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobUser = () => {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { userData, status } = useUserData();
  const [reportUserId, setReportUserId] = useState("");
  const router = useRouter();
  const { interviews } = InterviewData();
  const { users } = MainUsers();
  const [loading, setLoading] = useState(false);
  const [reject, setReject] = useState(false);
  const { hrTable } = HrData();
  const { feedback } = FeedbackData();
  const [showJobModal, setShowJobModal] = useState(false);
  const { jobs } = JobData();
  const [skillId, setskillId] = useState(0);
  const { jobSkill } = jobSkillsData();
  const currentTime = new Date();
  const [active, setActive] = useState("online");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const openJobModal = () => {
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
  };

  const openSkillModal = (id: any) => {
    setShowSkillModal(true);
    setskillId(id);
  };
  const handleApply = async (jobId: number) => {
  if (!userData) {
    toast.error("You must be logged in to apply");
    return;
  }

  try {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.id, // from useUserData()
        job_id: jobId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      return;
    }

    toast.success("Application submitted!");
    router.push(`/scheduleInterview?id=${userData.id}`);
  } catch (err) {
    console.error(err);
    toast.error("Server error. Try again later.");
  }
};

  const formatDateTime = (dateTimeString: any) => {
    const optionsDate: any = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime: any = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
      hour12: true,
    };

    const date = new Date(dateTimeString);
    const formattedDate = format(date, "dd-MMMM-yyyy", optionsDate);
    const formattedTime = format(date, "hh:mm:ss a zzz", optionsTime);

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
    }, 2000);
  }, []);

  //   useEffect(() => {
  //     // Check if there is no user data (e.g., user logged out)
  //     if (status === "404") {
  //         //console.log("No user data found.");
  //         //console.log("Status: " + status);
  //         // alert("No User Found!");
  //         toast.error("No User Found!");
  //         //console.log("NO user Found!");
  //         router.push("/login");
  //     }

  //     if (userData && userData?.role !== 'user') {
  //         // alert("No User Found!");
  //         toast.error("Not Allowed!");
  //         router.push("/dashboards");
  //     }

  // }, [userData, status, router]);

  const filterExpiredJobs = jobs.filter((job: any) => {
    const condition1 = job.is_approved === "approved";
    const currentTime = new Date();
    const expireDate = new Date(job?.expiration_date);
    return condition1 && currentTime.getTime() <= expireDate.getTime();
  });

  const closeSkillModal = () => {
    setShowSkillModal(false);
  };

  function getTimeDifferenceInWords(
    timestamp: string,
    currentTime: Date
  ): string {
    const jobPostingTime = new Date(timestamp);
    const currentTimeUTC = currentTime.getTime();
    const jobPostingTimeUTC = jobPostingTime.getTime();
    const timeDifferenceInMilliseconds = currentTimeUTC - jobPostingTimeUTC;
    const timeDifferenceInMinutes = Math.floor(
      timeDifferenceInMilliseconds / (1000 * 60)
    );
    const timeDifferenceInHours = Math.floor(
      timeDifferenceInMilliseconds / (1000 * 60 * 60)
    );
    const timeDifferenceInDays = Math.floor(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (timeDifferenceInDays >= 1) {
      return `${timeDifferenceInDays} day${
        timeDifferenceInDays !== 1 ? "s" : ""
      } ago`;
    } else if (timeDifferenceInHours >= 1) {
      return `${timeDifferenceInHours} hour${
        timeDifferenceInHours !== 1 ? "s" : ""
      } ago`;
    } else {
      return `${timeDifferenceInMinutes} minute${
        timeDifferenceInMinutes !== 1 ? "s" : ""
      } ago`;
    }
  }

  async function onClickDeleteSkill(id: any) {
    try {
      // //console.log("Slot: ", slot);
      // alert("Slot: " + slot);

      const data = await fetch("/api/job_skill", {
        method: "DELETE",
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      toast.success("Skill Deleted");

      return data.json();
      // return {"message":"deleted"}
    } catch (error) {
      //console.log(error);
    }
  }

  async function onClickDeleteJob(id: any, user_id: any) {
    try {
      setReject(true);
      const data = await fetch("/api/job", {
        method: "DELETE",
        body: JSON.stringify({ id: id, user_id: user_id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      toast.success("Job Deleted!");
      return data.json();
    } catch (error) {
      //console.log(error);
    }
  }
  
  const featureCatgory = [
    { card: "bg-[#FFFFFF] text-[#333333] ", label: "none" },
    { card: "bg-[#242E49] text-[#FFFFFF]", label: "pro" },
  ];

  const featureSkillCategory = [
    { card: "bg-[#DEEBFF] text-[#333333]", label: "none" },
    { card: "bg-[#DEEBFF] text-[#333333]", label: "pro" },
  ];

  const featureTitleJob = [
    { card: "text-[#6D6D6D]", label: "none" },
    { card: "text-[#FFFFFFCC]", label: "pro" },
  ];

  const featureJobDescription = [
    { card: "text-[#333333]", label: "none" },
    { card: "text-[#FFFFFF]", label: "pro" },
  ];

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const approvedJobs = jobs
    .filter((job: any) => {
      const condition1 = job.is_approved === "approved";
      const currentTime = new Date();
      const expireDate = new Date(job?.expiration_date);
      return condition1 && currentTime.getTime() <= expireDate.getTime();
    }).reverse();



    const currentItems = jobs
    .filter((job: any) => {
      const condition1 = job.is_approved === "approved";
      const currentTime = new Date();
      const expireDate = new Date(job?.expiration_date);
      return condition1 && currentTime.getTime() <= expireDate.getTime();
    })
    .sort((a: any, b: any) => {
      if (a.feature === "pro" && b.feature === "none") {
        return -1; // Place 'pro' before 'none'
      } else if (a.feature === "none" && b.feature === "pro") {
        return 1; // Place 'none' after 'pro'
      } else {
        // If both jobs have the same feature status, sort by created_at time
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    })
    .slice(firstItemIndex, lastItemIndex);

  // const currentItems = [];
  // console.log("Current Items: ", currentItems);

  return (
    <div className="mt-12 px-4 ">
      {/* {userData ? ( */}
      {screenLoading ? (
        <SpinnerLoader />
      ) : (
        <>
          <div>
            <div className="w-full flex justify-between py-8">
              <h1 className="font-bold  mb-0 px-4 font-nunito text-3xl text-white">
                Jobs{" "}
              </h1>
             
            </div>

          

            {currentItems.length !== 0 ? (
              <div className="max-h-[500px] min-h-[500px] w-full font-be  overflow-y-auto overflow-x-hidden lg:px-4">
                {currentItems
                  .filter((job: any) => {
                    const condition1 = job.is_approved === "approved";
                    const currentTime = new Date();
                    const expireDate = new Date(job?.expiration_date);
                    return (
                      condition1 &&
                      currentTime.getTime() <= expireDate.getTime()
                    );
                  })
                  .sort((a: any, b: any) => {
                    if (a.feature === "pro" && b.feature === "none") {
                      return -1; // Place 'pro' before 'none'
                    } else if (a.feature === "none" && b.feature === "pro") {
                      return 1; // Place 'none' after 'pro'
                    } else {
                      return 0; // Leave the order unchanged
                    }
                  })
                  .map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className={` ${
                        featureCatgory.filter(
                          (feature: any) => feature.label === item?.feature
                        )[0]?.card
                      } flex my-8  w-full items-center space-y-4  justify-around rounded-lg p-3 lg:p-6 shadow-md `}
                    >
                      <div className="ml-4 space-y-4 w-full  lg:space-y-1 flex-grow">
                        <div className="flex flex-col space-y-4 w-full ">
                          <div className="flex flex-col lg:flex-row  w-full  justify-between">
                            <div className="flex flex-row  space-x-4 items-center">
                              <Avatar className="h-16 w-16">
                            
                                <AvatarImage
                                  src={`${item?.image}` || "/camera.png"}
                                />
                               
                                <AvatarFallback>OM</AvatarFallback>
                              </Avatar>

                              <div className="flex justify-center flex-col space-y-1">
                                <h1 className="font-bold text-2xl font-nunito">
                                  {item?.organization}
                                </h1>
                                <p
                                  className={`${
                                    featureJobDescription.filter(
                                      (feature: any) =>
                                        feature.label === item?.feature
                                    )[0]?.card
                                  } text-sm`}
                                >
                                  {item?.location}
                                </p>
                              </div>
                            </div>

                            <div className="flex mt-3 lg:mt-0 flex-row lg:flex-col lg:space-y-1 justify-start lg:justify-center">
                              <span
                                className={`${
                                  featureTitleJob.filter(
                                    (feature: any) =>
                                      feature.label === item?.feature
                                  )[0]?.card
                                }`}
                              >
                                Designation:
                              </span>
                              <p className="mt-0 ml-2 lg:ml-0">{item?.title}</p>
                            </div>

                            <div className="flex mt-1 lg:mt-0 flex-row lg:flex-col lg:space-y-1 justify-start lg:justify-center">
                              <span
                                className={`${
                                  featureTitleJob.filter(
                                    (feature: any) =>
                                      feature.label === item?.feature
                                  )[0]?.card
                                }`}
                              >
                                Stipend:
                              </span>
                              <p className="mt-0 ml-2 lg:ml-0">
                                {item.salary_start}
                              </p>
                            </div>

                            <div className="flex mt-1 lg:mt-0 flex-row lg:flex-col lg:space-y-1 justify-start lg:justify-center">
                              <span
                                className={`${
                                  featureTitleJob.filter(
                                    (feature: any) =>
                                      feature.label === item?.feature
                                  )[0]?.card
                                }`}
                              >
                                Posted:
                              </span>
                              <p className="mt-0 ml-2 lg:ml-0">
                                {getTimeDifferenceInWords(
                                  item?.created_at,
                                  currentTime
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1 w-full  ">
                            <span
                              className={`${
                                featureTitleJob.filter(
                                  (feature: any) =>
                                    feature.label === item?.feature
                                )[0]?.card
                              }  lg:ml-20`}
                            >
                              Skills:
                            </span>
                            <div className="flex flex-wrap space-x-1 lg:ml-20">
                              {jobSkill
                                ?.filter(
                                  (skill: any) => skill.user_id === item.id
                                )
                                .map((itemSkill: any) => (
                                  <div
                                    key={itemSkill?.sid}
                                    className="flex flex-row space-x-4  "
                                  >
                                    <div
                                      className={`text-sm ${
                                        featureSkillCategory.filter(
                                          (feature: any) =>
                                            feature.label === item?.feature
                                        )[0]?.card
                                      }  py-1 my-1 px-4 rounded-full flex w-full relative`}
                                    >
                                      <span>{itemSkill?.skill}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            <div className="lg:ml-20 flex flex-col space-y-1 w-full">
                              <span>Expiring On:</span>
                              <p
                                className={`text-sm ${
                                  featureJobDescription.filter(
                                    (feature: any) =>
                                      feature.label === item?.feature
                                  )[0]?.card
                                } w-full lg:w-[80%] `}
                              >
                                {formatDateTime(item?.expiration_date).date +
                                  " (" +
                                  formatDateTime(item?.expiration_date).time +
                                  ")"}
                              </p>
                            </div>
                          </div>

                          
                          <div className="flex flex-col space-y-1 w-full  ">
                            <span
                              className={`${
                                featureTitleJob.filter(
                                  (feature: any) =>
                                    feature.label === item?.feature
                                )[0]?.card
                              } lg:ml-20`}
                            >
                              Job Description:
                            </span>
                            <div className="flex flex-col lg:flex-row justify-between lg:ml-20">
                              <p
                                className={`text-sm ${
                                  featureJobDescription.filter(
                                    (feature: any) =>
                                      feature.label === item?.feature
                                  )[0]?.card
                                } w-full lg:w-[80%] `}
                              >
                                {item?.description}
                              </p>

                              <div className="flex lg:justify-end items-end my-2 lg:my-0">
                                <Button
                                  onClick={() => handleApply(item.id)}
                                  className="bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg "
                                >
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </div>
                          </div>

                      </div>
                      
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex w-full h-screen justify-center items-start">
                <div className="flex bg-white w-[400px] h-[200px] justify-center rounded-lg shadow-md items-center">
                  {" "}
                  <h1 className="font-nunito font-bold text-3xl">
                    loading...
                  </h1>
                </div>
              </div>
            )}

            {showJobModal && <JobModal onClose={closeJobModal} />}
          </div>

          <div className="my-16">
            <PaginationSection
              totalItems={approvedJobs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JobUser;

function PaginationSection({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems: any;
  itemsPerPage: any;
  currentPage: any;
  setCurrentPage: any;
}) {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer hover:bg-neutral-200"
            onClick={() => handlePrevPage()}
          />
        </PaginationItem>

        {pages.map((page, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              className={
                currentPage === page
                  ? "bg-[#4765FF] hover:bg-[#4765FF]  hover:text-white cursor-pointer rounded-md"
                  : "hover:bg-[#4765FF] hover:text-white cursor-pointer"
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer hover:bg-neutral-200"
            onClick={() => handleNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

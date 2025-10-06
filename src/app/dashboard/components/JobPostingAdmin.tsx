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
import VerificationData from "@/lib/db/vertificationData";
import toast from "react-hot-toast";
import ReportsData from "@/lib/db/reportsData";
import { Plus, Trash } from "lucide-react";
import JobData from "@/lib/db/jobData";
import SkillModal from "./SkillModal";
import jobSkillsData from "@/lib/db/jobSkillsData";
import { X } from "lucide-react";
import SkeletonLoaderCustom from "@/components/SkeletonLoaderCustom";
import { Item } from "@radix-ui/react-dropdown-menu";
import moment from "moment-timezone";
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

const FeatureModal = ({
  onClose,
  id,
  user_id,
}: {
  onClose: () => void;
  id: any;
  user_id: any;
}) => {
  const [feature, setFeature] = useState("");

  const { userData } = useUserData();

  const handleSubmit = async () => {
    try {
      if (feature.trim() === "") {
        toast.error("Please fill in all required fields");
        return;
      }

      const data = await fetch("/api/feature", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          user_id: user_id,
          feature: feature,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      // alert("Mark as Conducted!");
      if (!data.ok) {
        toast.error("Error submitting feature");
        return;
      }
      toast.success("Feature added successfully");
      setFeature("");
      window.location.reload();
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 text-black overflow-y-auto flex items-center justify-center font-nunito">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white mt-[100px] p-8 rounded-lg max-w-xl w-full relative z-20">
        <div className="flex justify-center items-center flex-col space-y-6">
          <h2 className="text-3xl text-start self-start text-[#242E49]  font-nunito font-bold mb-4">
            Add Feature
          </h2>

          <div className="flex flex-row space-x-4 items-center justify-start w-full">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="martial_status"
              >
                Select Feature <span className="text-red-500">*</span>
              </label>
              <select
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="input py-3.5 px-4 bg-black rounded-xl w-full outline-none"
                id="martial_status"
              >
                <option value="">Select Feature </option>
                <option value="none">None</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>

          <div className="flex self-end">
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

const JobModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [salary_start, setSalary_start] = useState("");
  const [expiration_date, setExpirationDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [image, setImage] = useState("");
  const { userData } = useUserData();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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

  const handleFileChange = async (e: any) => {
    const length = e.target.files.length;
    const file = e.target.files[length - 1];
    setSelectedImage(file);
    //console.log("Length: ", length);
    //console.log("File: ", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_upload_presets}` || ""
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      setUploadedImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      // setErrorMessage("Error uploading image. Please try again later.");
    }
  };

  const handleDateChange = (date: Date | null) => {
    setExpirationDate(date);
  };

  // const handleSalaryStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSalary_start(parseInt(e.target.value));
  // };

  // const handleSalaryEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSalary_end(parseInt(e.target.value));
  // };

  const handleSubmit = async () => {
    try {
      // if (!selectedImage) {
      //   console.error("No image selected.");
      //   return;
      // }

      if (organization.trim() === "") {
        toast.error("Please fill in the Company Name field");
        return;
      } else if (location.trim() === "") {
        toast.error("Please fill in the Company Location field");
        return;
      } else if (title.trim() === "") {
        toast.error("Please fill in the Job Title field");
        return;
      } else if (salary_start.trim() === "") {
        toast.error("Please fill in the Starting Salary field");
        return;
      } else if (expiration_date === null) {
        toast.error("Please fill in the Expiration Date field");
        return;
      } else if (description.trim() === "") {
        toast.error("Please fill in the Job Description field");
        return;
      }

      const formattedSlot = moment.utc(expiration_date).format();

      const data = await fetch("/api/job", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          salary_start: salary_start,
          expiration_date: formattedSlot,
          description: description,
          user_id: userData?.id,
          location: location,
          organization: organization,
          image: uploadedImageUrl,
          is_approved: "approved",
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
      setSalary_start("");
      setExpirationDate(null);
      setDescription("");
      setLocation("");
      setOrganization("");
      onClose();
      window.location.reload();
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto flex items-center justify-center font-nunito">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white mt-[600px] p-8 rounded-lg max-w-xl w-full relative z-20">
        <div className="flex justify-center items-center flex-col space-y-6">
          <h2 className="text-3xl text-start self-start text-[#242E49]  font-nunito font-bold mb-4">
            Add Job Posting
          </h2>

          <div className="flex flex-row space-x-4 items-center justify-start w-full">
            <div
              className={`relative flex self-start ${
                imageUrl ? "p-0" : "p-8"
              } border-black rounded-full bg-black border-1 border-solid`}
            >
              <Avatar
                className={`h-9 w-9 ${
                  imageUrl ? "md:h-32 md:w-32" : "md:h-16 md:w-16"
                }  outline-1 rounded-full border-1 outline-solid outline-black object-cover`}
              >
                <AvatarImage
                  className="w-full h-full"
                  src={imageUrl || "/camera.png"}
                />
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-1 right-2  mr-0 w-7 h-7 p-1 flex justify-center items-center cursor-pointer rounded-full text-white bg-[#4765FF]">
                <Plus size={24} color="white" />{" "}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <p className="text-[#AEAEAE]">
              Add your company Logo {"("}Optional{")"}
            </p>
          </div>

          <div className="flex flex-row space-x-4 w-full">
            <div className="w-full">
              <span className="font-bold self-start text-[#242E49]  font-nunito">
                Company Name <span className="text-red-500">*</span>
              </span>
              <input
                className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter Company Name..."
              />
            </div>

            <div className="w-full">
              <span className="font-bold self-start text-[#242E49]  font-nunito">
                Company Location <span className="text-red-500">*</span>
              </span>
              <input
                className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter Company Location..."
              />
            </div>
          </div>

          <span className="font-bold self-start text-[#242E49]  font-nunito">
            Job Title: <span className="text-red-500">*</span>
          </span>
          <input
            className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <span className="font-bold self-start text-[#242E49]  font-nunito">
            Salary: <span className="text-red-500">*</span>
          </span>
          {/* <select
            className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
            value={salary_start}
            onChange={handleSalaryStartChange}
          >
            {salaryStartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select> */}
          <input
            className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
            type="text"
            value={salary_start}
            onChange={(e) => setSalary_start(e.target.value)}
            placeholder="Enter Salary..."
          />

          <span className="font-bold self-start text-[#242E49]  font-nunito">
            Expiration Date: <span className="text-red-500">*</span>
          </span>
          {/* <select
            className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
            value={salary_end}
            onChange={handleSalaryEndChange}
          >
            {salaryEndOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select> */}
          <div className="w-full sm:w-[100%]">
            <CalendarDateRangePicker onDateChange={handleDateChange} />
          </div>
          <span className="font-bold self-start text-[#242E49]  font-nunito">
            Job Description <span className="text-red-500">*</span>
          </span>
          <textarea
            className="input py-3.5 px-4 bg-black h-44 w-full outline-none rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <div className="flex self-end">
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

export const JobPostingAdmin = () => {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [skillId, setskillId] = useState(0);
  const { userData, status } = useUserData();
  const router = useRouter();
  const { interviews } = InterviewData();
  const { users } = MainUsers();
  const [loading, setLoading] = useState(false);
  const [reject, setReject] = useState(false);
  const { hrTable } = HrData();
  const { feedback } = FeedbackData();
  const { verification } = VerificationData();
  const { reports } = ReportsData();
  const filteredFeedback = feedback?.filter(
    (item: any) => item.hr_id === userData?.id
  );
  // const [isReportsVisible, setIsReportsVisible] = useState<UserReportsVisibility>({});
  const { jobs } = JobData();
  const [showJobModal, setShowJobModal] = useState(false);
  const { jobSkill } = jobSkillsData();
  const currentTime = new Date();
  const [id, setid] = useState("");
  const [user_id, setUserId] = useState("");
  const [active, setActive] = useState("online");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //   const sortedJobs = jobs.sort((a, b) => {
  //     if (a.feature === "pro" && b.feature !== "pro") {
  //         return -1; // "a" comes before "b"
  //     } else if (a.feature !== "pro" && b.feature === "pro") {
  //         return 1; // "b" comes before "a"
  //     } else {
  //         return 0; // no change in order
  //     }
  // });

  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
    }, 2000);
  }, []);

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

  function compareFeatures(a: any, b: any) {
    if (a.feature === "pro" && b.feature === "none") {
      return -1; // Place 'pro' before 'none'
    } else if (a.feature === "none" && b.feature === "pro") {
      return 1; // Place 'none' after 'pro'
    } else {
      return 0; // Leave the order unchanged
    }
  }

  // jobs.sort(compareFeatures);
  console.log("Jobs Sorted: ", jobs);

  useEffect(() => {
    // Check if there is no user data (e.g., user logged out)
    if (status === "404") {
      //console.log("No user data found.");
      //console.log("Status: " + status);
      // alert("No User Found!");
      toast.error("No User Found!");
      //console.log("NO user Found!");
      router.push("/login");
    }

    if (userData && userData?.role !== "admin") {
      // alert("No User Found!");
      toast.error("Not Allowed!");
      router.push("/dashboards");
    }
  }, [userData, status, router]);

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

  async function onClickApproveJob(id: any, user_id: any, is_approved: string) {
    try {
      const res = await fetch("/api/job", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          is_approved: is_approved,
          user_id: user_id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (!res.ok) {
        // alert("Error submitting data")
        toast.error("Error submitting data");
        return;
      }

      if (is_approved === "approved") {
        toast.success("Job is approved");
        window.location.reload();
        return;
      } else if (is_approved === "unapproved") {
        toast.success("Job is not approved");
        window.location.reload();
        return;
      }
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
      window.location.reload();
      return data.json();
    } catch (error) {
      //console.log(error);
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

  const openSkillModal = (id: any) => {
    setShowSkillModal(true);
    setskillId(id);
  };

  const openJobModal = () => {
    setShowJobModal(true);
  };

  const openFeatureModal = (id: any, user_id: any) => {
    setShowFeatureModal(true);
    setid(id);
    setUserId(user_id);
  };

  const closeSkillModal = () => {
    setShowSkillModal(false);
  };

  const handleSkillSubmit = async (skill: string) => {
    try {
      const res = await fetch("/api/job_skill", {
        method: "POST",
        body: JSON.stringify({ skill: skill, user_id: skillId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!res.ok) {
        // alert("Error submitting skills");
        toast.error("Error submitting skills");
        return;
      }
      //   setTimestamp(Date.now());

      //   alert("Skill added successfully");
      toast.success("Skill Submitted");
      window.location.reload();
      return res;
    } catch (error) {
      //console.log(error);
    }
  };

  const closeJobModal = () => {
    setShowJobModal(false);
  };

  const closeFeatureModal = () => {
    setShowFeatureModal(false);
  };

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

  const expiredJobs = jobs.filter((job) => {
    const currentTime = new Date();
    const expireDate = new Date(job?.expiration_date);
    return currentTime.getTime() > expireDate.getTime();
  })

  const unapprovedJobs = jobs.filter((job) => {
    const currentTime = new Date();
    const expireDate = new Date(job?.expiration_date);
    return (
      currentTime.getTime() <= expireDate.getTime() &&
      job.is_approved === "unapproved"
    );
  })

  const activeJobs = jobs.filter((job) => {
    const currentTime = new Date();
    const expireDate = new Date(job?.expiration_date);
    return (
      currentTime.getTime() <= expireDate.getTime() &&
      job.is_approved === "approved"
    );
  })

  const currentItems = jobs
    .filter((job) => {
      const currentTime = new Date();
      const expireDate = new Date(job?.expiration_date);

      if (active === "online") {
        return (
          currentTime.getTime() <= expireDate.getTime() &&
          job.is_approved === "approved"
        );
      } else if (active === "expired") {
        return currentTime.getTime() > expireDate.getTime();
      } else if (active === "unapproved") {
        return (
          currentTime.getTime() <= expireDate.getTime() &&
          job.is_approved === "unapproved"
        );
      }

      return false;
    })
    .slice(firstItemIndex, lastItemIndex).reverse();
  // const currentItems = [];

  //   const filteredJobs = currentItems.filter(job => {
  //     const currentTime = new Date();
  //     const expireDate = new Date(job?.expiration_date);

  //     if (active === "online") {
  //         return currentTime.getTime() <= expireDate.getTime() && job.is_approved === "approved";
  //     } else if (active === "expired") {
  //         return currentTime.getTime() > expireDate.getTime();
  //     } else if (active === "unapproved") {
  //         return currentTime.getTime() <= expireDate.getTime() && job.is_approved === "unapproved";
  //     }

  //     return false;
  // });

  return (
    <div>
      {screenLoading ? (
        <SpinnerLoader />
      ) : (
        <>
          {userData && userData?.role === "admin" ? (
            <div className="px-[12px] md:px-8">
              <div className="w-full flex justify-between  ">
                <h1 className="font-bold text-2xl mt-8  mb-4">
                  Job Posting List:{" "}
                </h1>
                <button
                  className="hover:text-green-400 "
                  onClick={openJobModal}
                >
                  <Plus />
                </button>
              </div>

              <div className="flex flex-row my-4 space-x-4 items-center justify-start w-full">
                <div>
                  <select
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                    className="input py-3.5 px-4 bg-[#FFFFFF] shadow-md rounded-xl w-full outline-none"
                    id="active"
                  >
                    {/* <option value="">Select Status </option> */}
                    <option value="online">Active</option>
                    <option value="expired">Expired</option>
                    <option value="unapproved">Unapproved</option>
                  </select>
                </div>
              </div>

              {currentItems.length !== 0 ? (
                <div className="min-h-[500px] max-h-[500px] w-full overflow-y-auto">
                  <div className="">
                    {currentItems
                      .filter((job: any) => {
                        const currentTime = new Date();
                        const expireDate = new Date(job?.expiration_date);

                        if (active === "online") {
                          return (
                            currentTime.getTime() <= expireDate.getTime() &&
                            job.is_approved === "approved"
                          );
                        } else if (active === "expired") {
                          return currentTime.getTime() > expireDate.getTime();
                        } else if (active === "unapproved") {
                          return (
                            currentTime.getTime() <= expireDate.getTime() &&
                            job.is_approved === "unapproved"
                          );
                        }
                      })
                      .sort((a: any, b: any) => {
                        if (a.feature === "pro" && b.feature === "none") {
                          return -1; // Place 'pro' before 'none'
                        } else if (
                          a.feature === "none" &&
                          b.feature === "pro"
                        ) {
                          return 1; // Place 'none' after 'pro'
                        } else {
                          return 0; // Leave the order unchanged
                        }
                      })
                      .map((item: any, index: number) => (
                        <div
                          key={item.id}
                          className={`${
                            featureCatgory.filter(
                              (feature: any) => feature.label === item?.feature
                            )[0]?.card
                          } flex my-8 overflow-x-hidden items-center justify-around p-4 shadow-md rounded-lg `}
                        >
                          <div className="ml-4 space-y-4 w-full  md:space-y-1 flex-grow">
                            <div className="flex flex-col space-y-4 w-full ">
                              <div className="flex flex-col md:flex-row w-full  justify-between">
                                <div className="flex flex-row space-x-4 items-center">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={`${item?.image}` || "/camera.png"}
                                    />
                                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                    <AvatarFallback>OM</AvatarFallback>
                                  </Avatar>

                                  <div className="flex justify-center flex-col space-y-1">
                                    <h1 className="font-bold text-2xl font-nunito">
                                      {item?.organization}{" "}
                                      {"(" + item?.is_approved + ")"}
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

                                <div className="flex mt-3 md:mt-0 flex-row md:flex-col md:space-y-1 justify-start md:justify-center">
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
                                  <p className="mt-0 ml-2 md:ml-0">
                                    {item?.title}
                                  </p>
                                </div>

                                <div className="flex mt-1 md:mt-0 flex-row md:flex-col md:space-y-1 justify-start md:justify-center">
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
                                  <p className="mt-0 ml-2 md:ml-0">
                                    {item.salary_start}
                                  </p>
                                </div>

                                <div className="flex mt-1 md:mt-0 flex-row md:flex-col md:space-y-1 justify-start md:justify-center">
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
                                  <p className="mt-0 ml-2 md:ml-0">
                                    {getTimeDifferenceInWords(
                                      item?.created_at,
                                      currentTime
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-1 w-full">
                                <span
                                  className={`${
                                    featureTitleJob.filter(
                                      (feature: any) =>
                                        feature.label === item?.feature
                                    )[0]?.card
                                  }  md:ml-20`}
                                >
                                  Skills:
                                </span>
                                <div className="flex flex-wrap space-x-1 md:ml-20">
                                  {jobSkill
                                    ?.filter(
                                      (skill: any) => skill.user_id === item.id
                                    )
                                    .map((itemSkill: any) => (
                                      <div
                                        key={itemSkill?.sid}
                                        className="flex flex-row space-x-4 "
                                      >
                                        <div
                                          className={`text-sm ${
                                            featureSkillCategory.filter(
                                              (feature: any) =>
                                                feature.label === item?.feature
                                            )[0]?.card
                                          }  py-1 my-1 px-4 rounded-full flex w-full relative`}
                                        >
                                          <div className="flex w-full justify-end">
                                            <button
                                              onClick={() =>
                                                onClickDeleteSkill(
                                                  itemSkill.sid
                                                )
                                              }
                                            >
                                              <X className="w-2 cursor-pointer hover:text-red-500 h-2 flex absolute top-0 right-0  mr-1 mt-1 " />
                                            </button>
                                          </div>
                                          <div>
                                            <span>{itemSkill?.skill}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>

                                <div className="md:ml-20 flex flex-col space-y-1 w-full">
                                  <span>Expiring On:</span>
                                  <p
                                    className={`text-sm ${
                                      featureJobDescription.filter(
                                        (feature: any) =>
                                          feature.label === item?.feature
                                      )[0]?.card
                                    } w-full md:w-[80%] `}
                                  >
                                    {formatDateTime(item?.expiration_date)
                                      .date +
                                      " (" +
                                      formatDateTime(item?.expiration_date)
                                        .time +
                                      ")"}
                                  </p>
                                </div>
                              </div>

                              {/* <h1 className="text-lg font-bold leading-none">{item?.title}</h1> */}
                              <div className="flex flex-col space-y-1 w-full  ">
                                <span
                                  className={`${
                                    featureTitleJob.filter(
                                      (feature: any) =>
                                        feature.label === item?.feature
                                    )[0]?.card
                                  } md:ml-20`}
                                >
                                  Job Description:
                                </span>
                                <div className="flex flex-col md:flex-row justify-between md:ml-20">
                                  <p
                                    className={`text-sm ${
                                      featureJobDescription.filter(
                                        (feature: any) =>
                                          feature.label === item?.feature
                                      )[0]?.card
                                    } w-full md:w-[80%] `}
                                  >
                                    {item?.description}
                                  </p>
                                  <div className="flex md:justify-end space-y-3 justify-start  items-end my-2 md:my-0 flex-wrap w-full">
                                    <div className="flex space-x-3">
                                      <Button
                                        onClick={() =>
                                          openFeatureModal(
                                            item?.id,
                                            item?.user_id
                                          )
                                        }
                                        className={`bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg ${
                                          active === "expired" || active === "unapproved"
                                            ? "hidden"
                                            : "flex"
                                        } `}
                                      >
                                        Add Feature
                                      </Button>
                                      {showFeatureModal && (
                                        <FeatureModal
                                          onClose={closeFeatureModal}
                                          id={id}
                                          user_id={user_id}
                                        />
                                      )}
                                      <div>
                                        <Button
                                          className={`text-xs bg-[#06A561] hover:bg-[#06A561]/80  h-11 rounded-lg ${
                                            active === "expired" || active === "online"
                                              ? "hidden"
                                              : "flex"
                                          }  space-x-2`}
                                          onClick={() =>
                                            onClickApproveJob(
                                              item.id,
                                              item.user_id,
                                              "approved"
                                            )
                                          }
                                        >
                                          Approve Job
                                        </Button>
                                      </div>

                                      <div>
                                        <Button
                                          className={`text-xs bg-[#F43F5E] hover:bg-[#F43F5E]/80  h-11 rounded-lg ${
                                            active === "expired" || active === "unapproved"
                                              ? "hidden"
                                              : "flex"
                                          } space-x-2`}
                                          onClick={() =>
                                            onClickApproveJob(
                                              item.id,
                                              item.user_id,
                                              "unapproved"
                                            )
                                          }
                                        >
                                          Decline Job
                                        </Button>
                                      </div>
                                    </div>

                                    <div className=" md:ml-20  flex md:hidden justify-start flex-grow">
                                      {showSkillModal && (
                                        <SkillModal
                                          onClose={closeSkillModal}
                                          onSubmit={handleSkillSubmit}
                                        />
                                      )}
                                      <Button
                                        className={`bg-[#06A561] mx-3 ${
                                          active === "expired" || active === "unapproved"
                                            ? "hidden"
                                            : "flex"
                                        } hover:bg-[#06A561]/80  h-11 rounded-lg  space-x-2`}
                                        onClick={() => openSkillModal(item?.id)}
                                      >
                                        <Plus size={20} />{" "}
                                        <span>Add Skill</span>
                                      </Button>

                                      <Button
                                        className="bg-[#F43F5E]  hover:bg-[#F43F5E]/80  h-11 rounded-lg flex space-x-2"
                                        onClick={() =>
                                          onClickDeleteJob(
                                            item.id,
                                            item.user_id
                                          )
                                        }
                                      >
                                        <Trash size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Buttons  */}

                              <div className=" space-x-3 hidden md:flex md:ml-20  justify-start flex-grow">
                                {showSkillModal && (
                                  <SkillModal
                                    onClose={closeSkillModal}
                                    onSubmit={handleSkillSubmit}
                                  />
                                )}

                                {/* {users?.filter((info: any) => info.id === item.user_id).map((user: any) => ( */}
                                <Button
                                  className={`bg-[#F43F5E] hover:bg-[#F43F5E]/80  h-11 rounded-lg flex space-x-2 ${
                                    active === "online"
                                      ? "hidden"
                                      : "flex"
                                  }`}
                                  onClick={() =>
                                    onClickDeleteJob(item.id, item.user_id)
                                  }
                                >
                                  <Trash size={14} /> <span>Delete Job</span>
                                </Button>
                                {/* // ))} */}

                                <Button
                                  className={`bg-[#06A561] hover:bg-[#06A561]/80  h-11 rounded-lg ${
                                    active === "expired" || active === "unapproved" ? "hidden" : "flex"
                                  } space-x-2`}
                                  onClick={() => openSkillModal(item?.id)}
                                >
                                  <Plus size={20} /> <span>Add Skill</span>
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* <div className="font-medium hidden md:flex flex-col space-y-4">
                                  <p><span className='font-bold text-md'>Salary:</span> {item.salary_start}$ - {item.salary_end}$</p>
                                  <p><span className='font-bold text-md'>Job Status:</span> {item.is_approved}</p>
                              </div> */}

                          {/* Buttons */}
                          {/* <div className='space-y-3 flex-col hidden md:flex justify-end flex-grow'>
                                  <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                      <div >
                                          <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "approved")}>Approve Job</Button>
                                      </div>

                                      <div >
                                          <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "unapproved")}>Decline Job</Button>
                                      </div>

                                  </div>

                                  <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                      <div >
                                          <Button onClick={() => openSkillModal(item?.id)} className="text-xs">Add Skill</Button>
                                      </div>
                                      {showSkillModal && <SkillModal onClose={closeSkillModal} onSubmit={handleSkillSubmit} />}

                                      <div>
                                          <Button className='text-xs' onClick={() => onClickDeleteJob(item.id, item.user_id)}>Delete Job</Button>
                                      </div>
                                  </div>
                              </div> */}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex w-full h-screen justify-center items-start">
                  <div className="flex bg-white w-[400px] h-[200px] justify-center rounded-lg shadow-md items-center">
                    {" "}
                    <h1 className="font-nunito font-bold text-3xl text-[#242E49]">
                      No Jobs Found
                    </h1>
                  </div>
                </div>
              )}

              {showJobModal && <JobModal onClose={closeJobModal} />}
            </div>
          ) : (
            <SpinnerLoader />
          )}

          <div className="mt-16">
            <PaginationSection
              totalItems={active === "online" ? activeJobs?.length : active === "expired"? expiredJobs?.length : active === "unapproved" && unapprovedJobs?.length}
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
                  ? "bg-[#4765FF] hover:bg-[#4765FF] text-white hover:text-white cursor-pointer rounded-md"
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

"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/app/dashboard/components/overview";
import useUserData from '@/lib/db/userData';
import Link from 'next/link';
import { format } from 'date-fns';
import MainUsers from '@/lib/db/mainUsers';
import InterviewData from '@/lib/db/interviewData';
import { useRouter } from 'next/navigation';
import HrData from '@/lib/db/hrData';
import FeedbackData from '@/lib/db/feedbackData';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import JobData from '@/lib/db/jobData';
import SkillModal from './SkillModal';
import jobSkillsData from '@/lib/db/jobSkillsData';
import { X } from 'lucide-react';
import moment from 'moment-timezone';
import { Video } from 'lucide-react';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};
type Props = {
  params: {
    id: string;
  };
};



const JobModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [salary_start, setSalary_start] = useState(0);
  const [salary_end, setSalary_end] = useState(0);
  const [description, setDescription] = useState("");
  const { userData } = useUserData();

  const salaryStartOptions = [
    { value: 0, label: '$0' },
    { value: 1000, label: '$1000' },
    { value: 5000, label: '$5000' },
    { value: 10000, label: '$10,000' },
    { value: 15000, label: '$15,000' },
    { value: 20000, label: '$20,000' },
    { value: 25000, label: '$25,000' },
    { value: 30000, label: '$30,000' },
    { value: 35000, label: '$35,000' },
    { value: 40000, label: '$40,000' },
    { value: 45000, label: '$45,000' },
    { value: 50000, label: '$50,000' },
    { value: 55000, label: '$55,000' },
    { value: 60000, label: '$60,000' },
    { value: 65000, label: '$65,000' },
    { value: 70000, label: '$70,000' },
    { value: 75000, label: '$75,000' },
    { value: 80000, label: '$80,000' },
    { value: 85000, label: '$85,000' },
    { value: 90000, label: '$90,000' },
    { value: 95000, label: '$95,000' },
    { value: 100000, label: '$100,000' },
    { value: 150000, label: '$150,000' },
    { value: 200000, label: '$200,000' },
    // Add more options as needed
  ];

  const salaryEndOptions = [
    { value: 2000, label: '$2000' },
    { value: 6000, label: '$6000' },
    { value: 12000, label: '$12,000' },
    { value: 15000, label: '$15,000' },
    { value: 20000, label: '$20,000' },
    { value: 25000, label: '$25,000' },
    { value: 30000, label: '$30,000' },
    { value: 35000, label: '$35,000' },
    { value: 40000, label: '$40,000' },
    { value: 45000, label: '$45,000' },
    { value: 50000, label: '$50,000' },
    { value: 55000, label: '$55,000' },
    { value: 60000, label: '$60,000' },
    { value: 65000, label: '$65,000' },
    { value: 70000, label: '$70,000' },
    { value: 75000, label: '$75,000' },
    { value: 80000, label: '$80,000' },
    { value: 85000, label: '$85,000' },
    { value: 90000, label: '$90,000' },
    { value: 95000, label: '$95,000' },
    { value: 100000, label: '$100,000' },
    { value: 150000, label: '$150,000' },
    { value: 200000, label: '$200,000' },
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
        method: 'POST',
        body: JSON.stringify({ title: title, salary_start: salary_start, salary_end: salary_end, description: description, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
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
      // //console.log(error);
    }
  };


  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-lg max-w-md relative z-20">
        <div className='flex justify-center items-center flex-col space-y-6'>
          <h2 className="text-xl font-semibold mb-4">Add Job Posting</h2>
          <span className='font-bold self-start'>Job Title: </span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <span className='font-bold self-start'>Starting Salary: </span>
          <select value={salary_start} onChange={handleSalaryStartChange}>
            {salaryStartOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <span className='font-bold self-start'>Ending Salary: </span>
          <select value={salary_end} onChange={handleSalaryEndChange}>
            {salaryEndOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <span className='font-bold self-start'>Job Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};




const Modal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (reason: string) => void }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim() === "") {
      toast.error("Please enter a reason.");
      return;
    }
    onSubmit(reason);
    // toast.success("Report submitted")
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-lg max-w-md relative z-20"> {/* Set a higher z-index */}
        <h2 className="text-xl font-semibold mb-4">Report User</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full h-24 p-2 border rounded-md mb-4"
        ></textarea>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Submit</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  );
};



function DashboardHR() {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { userData } = useUserData();
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



  async function onClickDeleteSkill(id: any) {
    try {

      // //console.log("Slot: ", slot);
      // alert("Slot: " + slot);

      const data = await fetch("/api/job_skill", {
        method: 'DELETE',
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      });

      toast.success("Skill Deleted");

      return data.json();
      // return {"message":"deleted"}
    } catch (error) {
      // //console.log(error);
    }
  }


  const openJobModal = () => {
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
  };


  // Function to open the skill modal
  const openSkillModal = (id: any) => {
    setShowSkillModal(true);
    setskillId(id);

  };

  // Function to close the skill modal
  const closeSkillModal = () => {
    setShowSkillModal(false);
  };

  // Function to handle submission of skill data
  const handleSkillSubmit = async (skill: string) => {
    try {
      const res = await fetch("/api/job_skill", {
        method: 'POST',
        body: JSON.stringify({ skill: skill, user_id: skillId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      if (!res.ok) {
        // alert("Error submitting skills");
        toast.error("Error submitting skills");
        return;
      }
      //   setTimestamp(Date.now());

      //   alert("Skill added successfully");
      toast.success("Skill Submitted");
      return res;
    }
    catch (error) {
      // //console.log(error);
    }
  };

  const filteredFeedback = feedback?.filter((item: any) => item.hr_id === userData?.id);

  const formatDateTime = (dateTimeString: any) => {
    const optionsDate: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime: any = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    const date = new Date(dateTimeString);
    const formattedDate = format(date, 'dd-MMMM-yyyy', optionsDate);
    const formattedTime = format(date, 'HH:mm:ss zzz', optionsTime);

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };



  const handleReportSubmit = async (reason: string) => {

    try {
      setReject(true);
      const data = await fetch("/api/reports", {
        method: 'POST',
        body: JSON.stringify({ reason: reason, user_id: reportUserId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      });
      if (!data.ok) {
        toast.error("Error submitting report")
        return;
      }
      toast.success("Report submitted");
      return data.json();
    } catch (error) {
      // //console.log(error);
    }


  };

  const handleReportUser = (userId: string) => {
    setReportUserId(userId);
    setShowModal(true);
  };


  // //console.log("Time Slots: ", interviews);

  const filteredInterviews = interviews?.filter((item: any) => item.hr_id === userData?.id);
  // //console.log("Filtered Interviews at DashboardHR: ", filteredInterviews);
  const totalInterviews = filteredInterviews?.filter((item: any) => item.is_confirmed === "confirmed");
  // //console.log("Total Interviews: ", totalInterviews);
  const conductedInterviews = totalInterviews?.filter((item: any) => item.is_conducted === "conducted").reverse();
  // //console.log("Conducted Interviews: ", conductedInterviews);
  const upcomingInterviews = totalInterviews?.length - conductedInterviews?.length;
  // //console.log("Upcoming Interviews: ", upcomingInterviews);
  const upcomingSchedules = totalInterviews?.filter((item: any) => item.is_conducted === "notConducted").reverse();
  // //console.log("Upcoming Schedules: ", upcomingSchedules);
  const filteredHrData = hrTable?.filter((item: any) => item.user_id === userData?.id);

  const userNotification = users?.filter((item: any) =>
    filteredInterviews?.map((interview: any) => interview.user_id).includes(item.id));
  // //console.log("UserNotification: ", userNotification);


  async function onClickJoin(id: any, slot: any) {
    router.push(`/meeting/${id}`);
  }

  async function onClickMark(user_id: any, slot: any) {
    try {
      setLoading(true);
      const data = await fetch("/api/interview", {
        method: 'PUT',
        body: JSON.stringify({ hr_id: userData?.id, user_id: user_id, slot: slot, is_conducted: "conducted" }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      });
      // alert("Mark as Conducted!");
      toast.success("Interview is marked as Conducted");
      toast
    } catch (error) {
      // //console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function onClickDelete(user_id: any, slot: any) {
    try {
      setReject(true);
      const data = await fetch("/api/interview", {
        method: 'DELETE',
        body: JSON.stringify({ hr_id: userData?.id, user_id: user_id, slot: slot, is_confirmed: "confirmed" }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      });
      toast.success("Interview Deleted");
      return data.json();
    } catch (error) {
      // //console.log(error);
    } finally {
      setReject(false);

    }

  }


  async function onClickDeleteJob(id: any, user_id: any) {
    try {
      setReject(true);
      const data = await fetch("/api/job", {
        method: 'DELETE',
        body: JSON.stringify({ id: id, user_id: user_id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      });

      toast.success("Job Deleted!");
      return data.json();
    } catch (error) {
      // //console.log(error);
    }
  }


  async function onClickFeedback(user_id: any, slot: any) {
    // alert("Shifting to Feedback Page!");
    toast.success("Shifting to Feedback Page");
    router.push(`/feedback/hr/${user_id}?slot=${slot}`);
  }

  return (
    <div className='bg-[#F5F6FA] h-full font-nunito'>
      {/* <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div> */}
      {/*       
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}

      {/* <NavBar /> */}


      <div className="flex-1 space-y-4 py-8 md:px-8 px-[12px] pt-6 mt-12 ">
        <div className={`${userData ? "flex" : "hidden"} justify-between items-center`}>
          <h2 className="text-3xl font-bold tracking-tight text-[#242E49]">HR Dashboard</h2>
          <Link className='text-blue-500 hover:text-blue-900' href="https://www.youtube.com/watch?v=K14H00ErNQA" target="_blank">How to Use?</Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-8 md:space-y-4 bg-[#F5F6FA] ">
          <TabsList className='flex bg-[#F5F6FA] flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-between md:justify-start'>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics" disabled>
                    Analytics
                  </TabsTrigger> */}
            {/* <TabsTrigger value="reports" disabled>
                    Reports
                  </TabsTrigger> */}
            {/* <TabsTrigger value="notifications" >
              Notifications
            </TabsTrigger> */}
            {/* <TabsTrigger value="interviews" >
              Interviews
            </TabsTrigger> */}

            {/* <TabsTrigger value="job" >
              Job Posting
            </TabsTrigger> */}


          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">

              <Card className='rounded-b-none md:rounded-md md:rounded-r-none flex flex-row justify-around'>
                <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{totalInterviews?.length}</div>
                  </CardTitle>
                  
                </CardHeader>
                <CardContent className='flex flex-row w-full items-center '>
                  {/* <div className="text-2xl font-bold">{totalInterviews?.length}</div> */}
                    <div>Total Interviews</div>
                  
                  {/* <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>


              <Card className='rounded-none flex flex-row justify-around'>
              <div>
                <CardHeader className="flex flex-row  items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{conductedInterviews?.length}</div>

                  </CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <div>Completed Interviews</div>
                  {/* <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>


              <Card className='rounded-t-none md:rounded-tr-xl md:rounded-l-none flex flex-row justify-around'>
                <div>
                <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{upcomingSchedules?.filter((interview: any) => { 
                             
                              const currentTime = new Date();
                              const slotTime = new Date(interview.slot);
                              const condition2 = slotTime.getTime() > currentTime.getTime();

                              return condition2;
                            }).length}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>Upcoming Interviews</div>
                  {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>

              
              {/* <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card> */}

                    
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className='font-bold text-2xl px-2 py-2 font-nunito text-[#242E49]'>Upcoming Schedules</CardTitle>
                  {/* <CardDescription>
                          You made 265 sales this month.
                        </CardDescription> */}
                </CardHeader>

                <div className='max-h-[350px] overflow-y-auto' >

                  <CardContent>

                    <div className="space-y-8">
                    <div className={`lg:grid lg:grid-cols-4 w-full hidden  justify-around border-b-2 border-[#E6E9F4] pb-2  text-[#6D6D6D] `}>
                            <h2 className='text-base'>Name</h2>
                            <h2 className='text-base'>Email</h2>
                            <h2 className='text-base'>Date</h2>
                            <h2 className='text-base'>Time</h2>
                          </div>
                      {userNotification.map((user: any) => (

                        <div key={user.id} className="">
                          
                          {upcomingSchedules
                          .filter((interview: any) => { 
                              const condition1 = interview.user_id === user.id;

                              const currentTime = new Date();
                              const slotTime = new Date(interview.slot);
                              const condition2 = slotTime.getTime() > currentTime.getTime();

                              return condition1 && condition2;
                            })
                            .map((interview: any, index: number) => (
                              <div key={interview.id} className={`grid lg:grid-cols-4 grid-cols-1 lg:mt-8 lg:mb-8 items-center  lg:pt-0 pt-9 lg:border-t-0 border-t-2 lg:border-b-2 pb-6 border-solid border-[#E6E9F4]`}>




                                <div className='flex flex-row w-[300px] space-x-4 items-center'>

                                  <Avatar className="h-9 w-9 md:w-12 md:h-12">
                                    <AvatarImage src={user?.image} />
                                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                    <AvatarFallback>OM</AvatarFallback>
                                  </Avatar>


                                  <div className="ml-4 space-y-1">
                                    <p className="md:text-sm lg:text-base lg:font-normal font-bold leading-none">{user.username}</p>
                                    <p className="text-sm lg:hidden text-muted-foreground">{user.email}</p>

                                    <div className=' flex flex-col lg:hidden text-xs w-full'>
                                      <p className='text-xs  w-full'>
                                        Date: {formatDateTime(interview.slot).date}
                                        </p>
                                        <p className='text-xs w-full'>
                                        Time: {formatDateTime(interview.slot).time}
                                      </p>
                                    </div>
                                  </div>


                                </div>
                                

                                <div className='font-normal  w-full md:text-sm lg:text-base hidden lg:grid '><span className="md:text-sm  lg:text-base  font-normal">{user.email}</span></div>


                                <div className=" font-normal w-full  md:text-sm lg:text-base hidden lg:flex">{formatDateTime(interview.slot).date}
                                </div>

                                <div className="font-normal w-full md:text-sm lg:text-base hidden lg:flex">{formatDateTime(interview.slot).time}</div>


                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
                {/* <RecentSales upcomingInterviews={upcomingInterviews} userNotification={userNotification} /> */}
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Section */}

          <TabsContent value="notifications" className="bg-[#D7DBEC] h-full">
            <div className='bg-[#D7DBEC]'>
              <h1 className="font-bold text-2xl mb-4 text-blue-600">Notifications</h1>
              {userNotification.map((user: any) => (
                <div key={user.id} className="bg-black h-full">
                  {filteredInterviews
                    .filter((interview: any) => interview.user_id === user.id && interview.is_confirmed === "unConfirmed")
                    .map((interview: any, index: number) => (
                      <Link key={interview.id} className=' cursor-pointer ' href={`/Confirmation/${user.id}?slot=${interview.slot}`}>
                        <div key={interview.id} className={`flex my-8 items-center bg-white p-4 shadow-md rounded-lg hover:bg-gray-400/50`}>
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.image} />
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback>OM</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1 ">
                            <p className="text-sm font-medium leading-none">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>

                            <div className='ml-auto flex md:hidden text-xs'>
                              <p className='text-xs'>
                                Date: {formatDateTime(interview.slot).date}
                                <br />
                                Time: {formatDateTime(interview.slot).time}
                              </p>
                            </div>

                          </div>
                          <div className="ml-auto font-medium md:block hidden">Date: {formatDateTime(interview.slot).date}
                            <br />
                            Time: {formatDateTime(interview.slot).time}
                          </div>
                        </div>
                      </Link>))}
                </div>

              ))}
            </div>
          </TabsContent>

          {/* Interview Tab */}
          <TabsContent value="interviews" className="">
            <div className='bg-black'>
              <h1 className="font-bold text-2xl mb-4">Interviews</h1>
              <h2 className='font-bold'>Not Conducted Interviews</h2>
              <div>
                {/* NOT CONDUCTED INTERVIEWS */}
                {userNotification?.map((user: any) => (
                  <div className='' key={user.id}>
                    {upcomingSchedules?.filter((interview: any) => interview.user_id === user.id)
                      .map((item: any) => {
                        // Parse the slot string into a Date object
                        const slotDate = new Date(item.slot);
                        // Calculate the difference between the slot time and the current time in milliseconds
                        const timeDifference = slotDate.getTime() - Date.now();
                        // Check if the time difference is less than or equal to 5 minutes or if the slot time has passed
                        if (timeDifference <= 5 * 60 * 1000 || timeDifference <= 0) {
                          // If the condition is met, display the item
                          return (
                            <div key={item.id} className={`flex w-full justify-between bg-white p-4 shadow-md rounded-lg my-8 items-center  `}>


                              <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.image} />
                                <AvatarFallback>OM</AvatarFallback>
                              </Avatar>


                              <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                                <p className="text-sm font-medium leading-none">{user.username}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>

                                <div className='ml-auto flex md:hidden text-xs'>
                                  <p className='text-xs'>
                                    Date: {formatDateTime(item?.slot).date}
                                    <br />
                                    Time: {formatDateTime(item?.slot).time}
                                  </p>
                                </div>

                                <div className='flex flex-col  md:hidden flex-grow items-start space-y-6'>
                                  <div className='flex space-x-6'>
                                    <Button onClick={() => onClickJoin(item.id, item.slot)}>Join</Button>
                                    <Button onClick={() => onClickMark(item.user_id, moment.utc(item.slot).format())}>Mark as Conducted</Button>
                                    {showModal && (
                                      <Modal
                                        onClose={() => setShowModal(false)}
                                        onSubmit={(reason) => handleReportSubmit(reason)}
                                      />

                                    )}
                                  </div>
                                  <div className='flex space-x-6'>
                                    <Button onClick={() => handleReportUser(item.user_id)}>Report User</Button>
                                    <Button onClick={() => onClickDelete(item.user_id, moment.utc(item.slot).format())}>Delete</Button>
                                  </div>
                                </div>


                              </div>

                              <div className="font-medium text-sm self-center hidden md:block">
                                <span> Date: {formatDateTime(item.slot).date} </span>
                                <br />
                                <span> Time: {formatDateTime(item.slot).time}</span>
                              </div>

                              <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                <Button onClick={() => onClickJoin(item.id, item.slot)}>Join</Button>
                                <Button onClick={() => onClickMark(item.user_id, item.slot)}>Mark as Conducted</Button>
                                {showModal && (
                                  <Modal
                                    onClose={() => setShowModal(false)}
                                    onSubmit={(reason) => handleReportSubmit(reason)}
                                  />
                                )}
                                <Button onClick={() => handleReportUser(item.user_id)}>Report User</Button>
                                <Button onClick={() => onClickDelete(item.user_id, item.slot)}>Delete</Button>
                              </div>
                            </div>

                          );
                        }
                      })}
                  </div>
                ))}
              </div>
              <hr className="my-8 border-t border-gray-300" /> {/* Horizontal line separating the sections */}
              <h2 className='font-bold'>Conducted Interviews</h2>
              <div className='' style={{ maxHeight: "400px", overflowY: "auto" }}> {/* Set max height and allow scrolling */}
                {/* CONDUCTED INTERVIEWS */}
                {userNotification?.map((user: any) => (
                  <div key={user.id}>
                    {conductedInterviews?.filter((interview: any) => interview.user_id === user.id)
                      .map((item: any) => (
                        <div key={item.id} className={`flex w-full justify-between bg-white p-4 shadow-md rounded-lg my-8 items-center `}>
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.image} />
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback>OM</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                            <p className="text-sm font-medium leading-none">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>

                            <div className='ml-auto flex md:hidden text-xs'>
                              <p className='text-xs'>
                                Date: {formatDateTime(item?.slot).date}
                                <br />
                                Time: {formatDateTime(item?.slot).time}
                              </p>
                            </div>

                            <div className='flex space-x-6 flex-grow justify-start md:hidden'>
                              <Button onClick={() => onClickFeedback(item.user_id, item.slot)}>Feedback</Button>
                              {/* <Button>Edit Feedback</Button> */}
                              {/* <Button>Delete</Button> */}
                            </div>

                          </div>

                          <div className="ml-auto font-medium text-sm hidden md:block">
                            <span>Date: {formatDateTime(item.slot).date}</span>
                            <br />
                            <span>Time: {formatDateTime(item.slot).time}</span></div>


                          <div className='hidden space-x-6 flex-grow justify-end md:flex'>
                            <Button onClick={() => onClickFeedback(item.user_id, item.slot)}>Feedback</Button>
                            {/* <Button>Edit Feedback</Button> */}
                            {/* <Button>Delete</Button> */}
                          </div>

                        </div>


                      ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>


          {/* Job Posting */}

          <TabsContent value="job" className="">
            <div className=' bg-black'>
              <div className='w-full flex justify-between '>
                <h1 className="font-bold text-2xl mb-4">Job Posting List: </h1>
                <button className='hover:text-green-400 ' onClick={openJobModal}><Plus /></button>
              </div>
              <div className="">
                {jobs
                  .filter((job: any) => job.user_id === userData?.id)
                  .map((item: any, index: number) => (

                    <div key={item.id} className={`flex my-8 items-center space-y-4 justify-around bg-white rounded-lg p-6 shadow-md `}>

                      <div className="ml-4 space-y-4  md:space-y-1 flex-grow w-2/5">

                        <div className='flex flex-col space-y-4 '>
                          <h1 className="text-lg font-bold leading-none">{item?.title}</h1>
                          <p className="text-sm text-muted-foreground w-2/5 ">{item?.description}</p>
                          <div className='flex flex-row space-x-4'>
                            {jobSkill?.filter((skill: any) => skill.user_id === item.id).map((item: any) => (
                              <div key={item?.sid} className='flex flex-row space-x-4'>

                                <div className='text-sm bg-black py-1.5 px-2 rounded-lg flex w-full relative'>
                                  <div className='flex w-full justify-end'>
                                    <button onClick={() => onClickDeleteSkill(item.sid)}><X className="w-2 cursor-pointer hover:text-red-500 h-2 flex absolute top-0 right-0  mr-1 mt-1 " /></button>
                                  </div>
                                  <div>
                                    <span>{item?.skill}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>


                        <div className='flex text-sm md:hidden space-x-6'>
                          <p className='text-xs'><span className='font-bold'>Salary:</span> {item.salary_start}$ - {item.salary_end}$</p>
                          <p className='text-xs'><span className='font-bold'>Job Status:</span> {item.is_approved}</p>
                        </div>

                        <div className='flex flex-col space-y-6 justify-start md:hidden '>

                          <div className='flex space-x-6 flex-grow justify-start'>
                            <div >
                              <Button className='text-xs' >Add Feature</Button>
                            </div>

                            <div>
                              <Button onClick={() => openSkillModal(item?.id)} className="text-xs">Add Skill</Button>
                            </div>
                          </div>
                          {/* Render the skill modal if showSkillModal is true */}
                          {showSkillModal && <SkillModal onClose={closeSkillModal} onSubmit={handleSkillSubmit} />}

                          <div className='flex space-x-6 flex-grow justify-start'>
                            <Button className='text-xs' onClick={() => onClickDeleteJob(item.id, userData?.id)}>Delete Job</Button>
                          </div>
                        </div>


                      </div>
                      <div className=" font-medium hidden md:flex flex-col space-y-4">
                        <p><span className='font-bold text-md'>Salary:</span> {item.salary_start}$ - {item.salary_end}$</p>
                        <p><span className='font-bold text-md'>Job Status:</span> {item.is_approved}</p>
                      </div>

                      <div className=' space-x-3  hidden md:flex justify-end flex-grow'>
                        <Button className='text-xs'>Add Feature</Button>
                        <Button onClick={() => openSkillModal(item?.id)} className="text-xs">Add Skill</Button>

                        {showSkillModal && <SkillModal onClose={closeSkillModal} onSubmit={handleSkillSubmit} />}
                        <Button className='text-xs' onClick={() => onClickDeleteJob(item.id, userData?.id)}>Delete Job</Button>

                      </div>

                    </div>
                  ))}
              </div>


              {showJobModal && <JobModal onClose={closeJobModal} />}
            </div>
          </TabsContent>


        </Tabs>
      </div>

    </div>
  );
}

export default DashboardHR
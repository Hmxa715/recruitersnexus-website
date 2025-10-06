"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useState, useEffect } from 'react';

import useUserData from '@/lib/db/userData';
import { format } from 'date-fns';
import MainUsers from '@/lib/db/mainUsers';
import InterviewData from '@/lib/db/interviewData';
import { useRouter } from 'next/navigation';
import HrData from '@/lib/db/hrData';
import FeedbackData from '@/lib/db/feedbackData';
import toast from 'react-hot-toast';
import JobData from '@/lib/db/jobData';
import jobSkillsData from '@/lib/db/jobSkillsData';
import moment from 'moment-timezone';
import ConfirmationModal from '@/app/Confirmation/ConfirmationModal';
import SpinnerLoader from './SpinnerLoader';
const Modal = ({ onClose, id, slot, interview_id }: { onClose: () => void, id: string, slot: string, interview_id:string }) => {
  return (
    <div className="fixed  inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

      <div className=" p-8 rounded-3xl max-w-md relative z-20">
        <ConfirmationModal id={id} interview_id={interview_id} slot={slot} />
      </div>


    </div>
  );
};
const Notifications = () => {

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
  const [id, setid] = useState("");
  const [interview_id, setInterviewId] = useState("");
  const [slot, setSlot] = useState("");


  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    const deleteNotification = async () => {
      try {
        const response = await fetch("/api/notification", {
          method: 'DELETE',
          body: JSON.stringify(interviews.map(interview => ({
            ...interview,
            hr_id: userData?.id,
            formattedSlot: moment.utc(interview.slot).format(),
            is_confirmed: "unConfirmed",
          }))),
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
        });

        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("Error deleting notifications:", error);
      }
    };

    deleteNotification();

    setScreenLoading(true);
    const timer = setTimeout(() => {
      setScreenLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userData, interviews]);




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

  const filteredInterviews = interviews?.filter((item: any) => item.hr_id === userData?.id).reverse();
  //console.log("Filtered Interviews at DashboardHR: ", filteredInterviews);
  const totalInterviews = filteredInterviews?.filter((item: any) => item.is_confirmed === "confirmed");
  //console.log("Total Interviews: ", totalInterviews);
  const conductedInterviews = totalInterviews?.filter((item: any) => item.is_conducted === "conducted").reverse();
  //console.log("Conducted Interviews: ", conductedInterviews);
  const upcomingInterviews = totalInterviews?.length - conductedInterviews?.length;
  //console.log("Upcoming Interviews: ", upcomingInterviews);
  const upcomingSchedules = totalInterviews?.filter((item: any) => item.is_conducted === "notConducted").reverse();
  //console.log("Upcoming Schedules: ", upcomingSchedules);
  const filteredHrData = hrTable?.filter((item: any) => item.user_id === userData?.id);

  const userNotification = users?.filter((item: any) =>
    filteredInterviews?.map((interview: any) => interview.user_id).includes(item.id));


  function onOpen(id:any,slot:any,interview_id:any)
  {
    setid(id);
    setSlot(slot);
    setInterviewId(interview_id);

    if(showModal === true)
      {
        setShowModal(false);
      }
      else if(showModal === false)
        {
          setShowModal(true);
        }
  }

  useEffect(() => {
    // Check if there is no user data (e.g., user logged out)
    if (status === "404") {
        // //console.log("No user data found.");
        // //console.log("Status: " + status);
        // alert("No User Found!");
        toast.error("No User Found!");
        // //console.log("NO user Found!");
        router.push("/login");
    }
  
    // if (userData && userData?.role !== 'admin') {
    //     // alert("No User Found!");
    //     toast.error("Not Allowed!");
    //     router.push("/dashboards");
    // }
  
  
  }, [userData, status, router]);

  return (
    <div className='bg-black h-screen text-black mt-12 px-[12px] font-nunito'>
      
      {screenLoading ? (
        <SpinnerLoader />
      ) :(
        <>
        {userData? (<div>
        <h1 className="font-bold text-4xl mb-4 text-green-600">Notifications</h1>
      <div className='overflow-y-auto max-h-[600px]'>
      {filteredInterviews
  .sort((a: any, b: any) => new Date(b.slot).getTime() - new Date(a.slot).getTime())
  .map((interview: any, index: number) => {
    const user = userNotification.find((user: any) => user.id === interview.user_id);
    if (!user || interview.is_confirmed !== "unConfirmed") return null;
    
    return (
      <div key={index} className="w-full text-left">
        <button onClick={() => onOpen(user.id, interview.slot, interview.id)} key={interview.id} className="cursor-pointer w-full">
          <div className="flex flex-col justify-center my-2 bg-white px-4 py-8 w-full shadow-md rounded-lg hover:bg-gray-400/50">
            {/* here div */}
            <h2 className="mb-6 px-4 font-bold md:text-2xl text-md text-left">
              {hrTable?.find((hr: any) => hr.user_id === user.id)?.fname} requested for an interview
            </h2>
            <div key={interview.id} className={`flex px-4 md:flex-row md:space-y-0 space-y-2 flex-col`}>
              <Avatar className="h-9 w-9 md:h-16 md:w-16 md:ml-0 ml-3">
                <AvatarImage src={user?.image} />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm md:text-xl font-bold leading-none text-left">{user.username}</p>
                <p className="text-sm md:text-lg text-left text-muted-foreground">{user.email}</p>
                <div className="ml-auto flex md:hidden text-xs">
                  <p className="text-xs">
                    Date: {formatDateTime(interview.slot).date}
                    <br />
                    Time: {formatDateTime(interview.slot).time}
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium hidden md:flex md:mx-auto md:space-x-16">
                <div className="flex flex-col space-y-2">
                  <span className="text-md text-[#6D6D6D]">Date</span>
                  <span className="text-[#333333]">{formatDateTime(interview.slot).date}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-md text-[#6D6D6D]">Time</span>
                  <span className="text-[#333333]">{formatDateTime(interview.slot).time}</span>
                </div>
              </div>
            </div>
          </div>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              id={id}
              slot={slot}
              interview_id={interview_id}
            />
          )}
        </button>
      </div>
    );
  })}

      
      </div>
      </div>):(<SpinnerLoader />)}
        </>
      )}


      
      
      
    </div>
  )
}

export default Notifications
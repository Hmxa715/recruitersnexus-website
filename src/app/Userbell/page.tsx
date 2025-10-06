"use client";
import React, { useState, useEffect } from "react";
import { format, isAfter, differenceInSeconds } from "date-fns";
import useUserData from "@/lib/db/userData";
import InterviewData from "@/lib/db/interviewData";
import SpinnerLoader from "../dashboard/components/SpinnerLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Userbell = () => {
  const { userData } = useUserData(); // Get logged-in user data
  const { interviews } = InterviewData(); // Fetch all interview data

  const [screenLoading, setScreenLoading] = useState(true);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({}); // Track countdowns for each interview

  useEffect(() => {
    setScreenLoading(true);
    const timer = setTimeout(() => {
      setScreenLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: format(date, "dd-MMMM-yyyy"),
      time: format(date, "HH:mm:ss"),
    };
  };

  const getTimeRemaining = (interviewDate: Date) => {
    const now = new Date();
    const diffInSeconds = differenceInSeconds(interviewDate, now);

    if (diffInSeconds <= 0) return "Started";

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Filter interviews for the logged-in user with the role "user," confirmed status, and upcoming date
  const filteredInterviews =
    userData?.role === "user"
      ? interviews?.filter((interview: any) => {
          const interviewDate = new Date(interview.slot);
          return (
            interview.user_id === userData?.id &&
            interview.is_confirmed === "confirmed" &&
            isAfter(interviewDate, new Date()) // Check if the interview is in the future
          );
        })
      : [];

  useEffect(() => {
    // Only set up the interval if there are filtered interviews
    if (filteredInterviews.length > 0) {
      const interval = setInterval(() => {
        const newCountdowns: { [key: string]: string } = {};
        filteredInterviews.forEach((interview: any) => {
          const timeRemaining = getTimeRemaining(new Date(interview.slot));
          newCountdowns[interview.id] = timeRemaining;
        });
        setCountdowns(newCountdowns);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [filteredInterviews]); // Ensure `useEffect` runs when `filteredInterviews` changes

  return (
    <div className="bg-black h-screen text-black mt-12 px-[12px] font-nunito">
      {screenLoading ? (
        <SpinnerLoader />
      ) : (
        <div>
          <h1 className="font-bold text-4xl mb-4 text-green-600">
            Upcoming Interviews
          </h1>
          <div className="overflow-y-auto max-h-[600px]">
            {filteredInterviews?.length > 0 ? (
              filteredInterviews.map((interview: any, index: number) => (
                <div key={index} className="w-full text-left mb-4">
                  <div className="flex flex-col justify-center bg-white px-4 py-8 w-full shadow-md rounded-lg">
                    <h2 className="mb-4 font-bold text-xl">Interview Details</h2>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 md:h-16 md:w-16">
                        <AvatarImage src={userData?.image} />
                        <AvatarFallback>{userData?.username?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="text-lg font-bold">{userData?.username}</p>
                        <p className="text-md text-muted-foreground">{userData?.email}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-md">
                        <span className="font-bold">Date:</span>{" "}
                        {formatDateTime(interview.slot).date}
                      </p>
                      <p className="text-md">
                        <span className="font-bold">Time:</span>{" "}
                        {formatDateTime(interview.slot).time}
                      </p>
                      <p className="text-md text-red-500 font-bold">
                        <span className="font-bold text-3xl">Countdown:</span>{" "}
                        <span className="font-bold text-3xl">{countdowns[interview.id] || "Calculating..."}</span>
                      </p>
                      <p className="text-green-600 text-md">
                        Plz open dashboard and visit interviews tab to join the interview.
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No upcoming interviews found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userbell;

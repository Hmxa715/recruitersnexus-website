"use client";
import { useState, useEffect } from "react";
import useUserData from "@/lib/db/userData";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/app/dashboard/components/overview-user";
import { format } from "date-fns";
import MainUsers from "@/lib/db/mainUsers";
import InterviewData from "@/lib/db/interviewData";
import { useRouter } from "next/navigation";
import HrData from "@/lib/db/hrData";
import toast from "react-hot-toast";
import { Video } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};
type Props = {
  params: {
    id: string;
  };
};

const Modal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) => {
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
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded-lg max-w-md relative z-20">
        {" "}
        {/* Set a higher z-index */}
        <h2 className="text-xl font-semibold mb-4">Report User</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full h-24 p-2 border rounded-md mb-4"
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardUser() {
  const router = useRouter();
  const { userData } = useUserData();
  const { hrTable } = HrData();
  const { interviews } = InterviewData();
  const [reject, setReject] = useState(false);
  const [reportUserId, setReportUserId] = useState("");
  const { users } = MainUsers();
  const [showModal, setShowModal] = useState(false);

  const handleReportSubmit = async (reason: string) => {
    try {
      setReject(true);
      const data = await fetch("/api/reports", {
        method: "POST",
        body: JSON.stringify({ reason: reason, user_id: reportUserId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!data.ok) {
        toast.error("Error submitting report");
        return;
      }
      toast.success("Report submitted");
      return data.json();
    } catch (error) {
      // //console.log(error);
    }
  };

  async function onClickJoin(id: any, slot: any) {
    router.push(`/meeting/${id}`);
  }

  const handleReportUser = (userId: string) => {
    setReportUserId(userId);
    setShowModal(true);
  };

  const formatDateTime = (dateTimeString: any) => {
    const optionsDate: any = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime: any = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };

    const date = new Date(dateTimeString);
    const formattedDate = format(date, "dd-MMMM-yyyy", optionsDate);
    const formattedTime = format(date, "HH:mm:ss zzz", optionsTime);

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const filteredInterviews = interviews.filter(
    (item: any) => item.user_id === userData?.id
  );
  // //console.log("Filtered Interviews at DashboardHR: ", filteredInterviews);
  const totalInterviews = filteredInterviews.filter(
    (item: any) => item.is_confirmed === "confirmed"
  );


  // //console.log("Total Interviews: ", totalInterviews);
  const conductedInterviews = totalInterviews
    .filter((item: any) => item.is_conducted === "conducted")
    .reverse();
  // //console.log("Conducted Interviews: ", conductedInterviews);
  const upcomingInterviews =
    totalInterviews.length - conductedInterviews.length;
  //console.log("Upcoming Interviews: ", upcomingInterviews);
  const upcomingSchedules = totalInterviews
    .filter((item: any) => item.is_conducted === "notConducted")
    .reverse();
  //console.log("Upcoming Schedules: ", upcomingSchedules);
  const filteredHrData = hrTable?.filter(
    (item: any) => item.user_id === userData?.id
  );

  const userNotification = users.filter((item: any) =>
    filteredInterviews
      .map((interview: any) => interview.hr_id)
      .includes(item.id)
  );
  //console.log("UserNotification: ", userNotification);

  async function onClickFeedback(hr_id: any, slot: any) {
    // alert("Shifting to Feedback Page!");
    toast.success("Shifting to Feedback Page!");
    router.push(`/feedback/user/${hr_id}?slot=${slot}`);
  }

  return (
    <div className="bg-[#F5F6FA] font-nunito">
      {/* <NavBar /> */}

      <div className="flex-1 space-y-4 py-8 md:px-8 px-[12px] pt-6 mt-12">
      <div className={`${userData ? "flex" : "hidden"} justify-between items-center`}>
          <h2 className="text-3xl font-bold tracking-tight text-[#242E49]">User Dashboard</h2>
          <Link className='text-blue-500 hover:text-blue-900' href="https://youtu.be/6dqjBlBdmSk?si=p-mfOQ0qGnzak5A4" target="_blank">How to Use?</Link>
        </div>
        <div className="flex items-center justify-between space-y-2">
         
        </div>
        <Tabs
          defaultValue="overview"
          className="space-y-8 md:space-y-4 bg-[#F5F6FA] "
        >
          <TabsList className="flex bg-[#F5F6FA] flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-between md:justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
             </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-b-none md:rounded-md md:rounded-r-none flex flex-row justify-around">
                <div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="text-2xl font-bold">
                        {totalInterviews?.length}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row w-full items-center ">
                    {/* <div className="text-2xl font-bold">{totalInterviews?.length}</div> */}
                    <div>Total Interviews</div>

                    {/* <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p> */}
                  </CardContent>
                </div>
                <div className="bg-[#ECF2FF] rounded-full p-4 self-center">
                  <Video
                    size={20}
                    color="#4765FF"
                    fill="#4765FF"
                    className=" "
                  />
                </div>
              </Card>

              <Card className="rounded-none flex flex-row justify-around">
                <div>
                  <CardHeader className="flex flex-row  items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="text-2xl font-bold">
                        {conductedInterviews?.length}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>Completed Interviews</div>
                    {/* <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p> */}
                  </CardContent>
                </div>
                <div className="bg-[#ECF2FF] rounded-full p-4 self-center">
                  <Video
                    size={20}
                    color="#4765FF"
                    fill="#4765FF"
                    className=" "
                  />
                </div>
              </Card>

              <Card className="rounded-t-none md:rounded-tr-xl md:rounded-l-none flex flex-row justify-around">
                <div>
                  <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="text-2xl font-bold">
                      {upcomingSchedules?.filter((interview: any) => { 
                             
                             const currentTime = new Date();
                             const slotTime = new Date(interview.slot);
                             const condition2 = slotTime.getTime() > currentTime.getTime();

                             return condition2;
                           }).length}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>Upcoming Interviews</div>
                    {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p> */}
                  </CardContent>
                </div>
                <div className="bg-[#ECF2FF] rounded-full p-4 self-center">
                  <Video
                    size={20}
                    color="#4765FF"
                    fill="#4765FF"
                    className=" "
                  />
                </div>
              </Card>
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
                  <CardTitle className="font-bold text-2xl px-2 py-2 font-nunito text-[#242E49]">
                    Upcoming Schedules
                  </CardTitle>
                  {/* <CardDescription>
                      You made 265 sales this month.
                    </CardDescription> */}
                </CardHeader>
                <div className="max-h-[350px] overflow-y-auto">
                  <CardContent>
                    <div className="space-y-8">
                      <div className="lg:grid md:grid-cols-4 w-full hidden  justify-around border-b-2 border-[#E6E9F4] pb-2  text-[#6D6D6D]  ">
                        <h2 className="text-base">Name</h2>
                        <h2 className="text-base">Email</h2>
                        <h2 className="text-base">Date</h2>
                        <h2 className="text-base">Time</h2>
                      </div>
                      {userNotification.map((user: any) => (
                        <div key={user.id} className="">

                          {upcomingSchedules
                            .filter(
                              (interview: any) => {
                                const condition1 = interview.hr_id === user.id;

                                const currentTime = new Date();
                                const slotTime = new Date(interview.slot);
                                const condition2 = slotTime.getTime() > currentTime.getTime();

                                return condition1 && condition2;
                              }
                            )
                            .map((interview: any, index: number) => (
                              <div
                                key={interview.id}
                                className={`grid grid-cols-4 w-full my-8 items-center justify-around lg:pt-0 pt-9 lg:border-t-0 border-t-2 pb-6  lg:border-b-2 border-solid border-[#E6E9F4]`}
                              >
                                <div className="flex flex-row w-[300px] space-x-4 items-center">
                                  <Avatar className="h-9 w-9 md:w-12 md:h-12">
                                    <AvatarImage src={user?.image} />
                                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                    <AvatarFallback>OM</AvatarFallback>
                                  </Avatar>

                                  <div className="ml-4 space-y-1">
                                    <p className="md:text-xs lg:text-base lg:font-normal font-bold leading-none">
                                      {user.username}
                                    </p>
                                    <p className="text-sm lg:hidden text-muted-foreground">{user.email}</p>

                                    <div className="flex flex-col w-full lg:hidden text-xs">
                                      <p className="w-full text-xs">
                                        Date: {formatDateTime(interview.slot).date}
                                      </p>

                                      <p className="w-full text-xs">
                                        Time: {formatDateTime(interview.slot).time}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="font-normal md:text-xs lg:text-base hidden lg:block ">
                                  <p className="md:text-xs lg:text-base font-normal">
                                    {user.email}
                                  </p>
                                </div>

                                <div className=" font-normal md:text-xs lg:text-base hidden lg:block">
                                  {formatDateTime(interview.slot).date}
                                </div>

                                <div className="font-normal md:text-xs lg:text-base hidden lg:block">
                                  {formatDateTime(interview.slot).time}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="userbell" className="">
<h1>notifications that belongs to user</h1>
            </TabsContent>
          
          {/* Interview Tab */}
          <TabsContent value="interviews" className="">
            <div className="bg-black">
              <h1 className="font-bold text-2xl mb-4">Interviews</h1>
              <h2 className="font-bold">Not Conducted Interviews</h2>
              <div className="bg-black">
                {/* NOT CONDUCTED INTERVIEWS */}
                {userNotification?.map((user: any) => (
                  <div className="" key={user.id}>
                    {upcomingSchedules
                      ?.filter((interview: any) => interview.hr_id === user.id)
                      .map((item: any) => {
                        // Parse the slot string into a Date object
                        const slotDate = new Date(item.slot);
                        // Calculate the difference between the slot time and the current time in milliseconds
                        const timeDifference = slotDate.getTime() - Date.now();
                        // Check if the time difference is less than or equal to 5 minutes or if the slot time has passed
                        if (
                          timeDifference <= 5 * 60 * 1000 ||
                          timeDifference <= 0
                        ) {
                          // If the condition is met, display the item
                          return (
                            <div
                              key={item.id}
                              className={`flex w-full bg-white p-4 shadow-md rounded-lg justify-between my-8 items-center`}
                            >
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.image} />
                                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                <AvatarFallback>OM</AvatarFallback>
                              </Avatar>

                              <div className="ml-4  space-y-4  md:space-y-1  flex-grow">
                                <p className="text-sm font-medium leading-none">
                                  {user.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                                <div className="ml-auto flex md:hidden text-xs">
                                  <p className="text-xs">
                                    Date: {formatDateTime(item?.slot).date}
                                    <br />
                                    Time: {formatDateTime(item?.slot).time}
                                  </p>
                                </div>

                                <div className="flex space-x-6 md:hidden flex-grow justify-start">
                                  <Button
                                    className="text-xs md:text-lg"
                                    onClick={() =>
                                      onClickJoin(item.id, item.slot)
                                    }
                                  >
                                    Join
                                  </Button>
                                  {showModal && (
                                    <Modal
                                      onClose={() => setShowModal(false)}
                                      onSubmit={(reason) =>
                                        handleReportSubmit(reason)
                                      }
                                    />
                                  )}
                                  <Button
                                    className="text-xs md:text-lg"
                                    onClick={() => handleReportUser(item.hr_id)}
                                  >
                                    Report User
                                  </Button>
                                  {/* <Button onClick={() => onClickMark(item.user_id, item.slot)}>Mark as Conducted</Button> */}
                                  {/* <Button onClick={() => onClickDelete(item.user_id, item.slot)}>Delete</Button> */}
                                </div>
                              </div>

                              <div className="font-medium text-sm self-center hidden md:block">
                                <span>
                                  {" "}
                                  Date: {formatDateTime(item.slot).date}{" "}
                                </span>
                                <br />
                                <span>
                                  {" "}
                                  Time: {formatDateTime(item.slot).time}
                                </span>
                              </div>

                              <div className="hidden md:flex space-x-6 flex-grow justify-end">
                                <Button
                                  onClick={() =>
                                    onClickJoin(item.id, item.slot)
                                  }
                                >
                                  Join
                                </Button>
                                {showModal && (
                                  <Modal
                                    onClose={() => setShowModal(false)}
                                    onSubmit={(reason) =>
                                      handleReportSubmit(reason)
                                    }
                                  />
                                )}
                                <Button
                                  onClick={() => handleReportUser(item.hr_id)}
                                >
                                  Report User
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                ))}
              </div>
              <hr className="my-8 border-t border-gray-300" />{" "}
              {/* Horizontal line separating the sections */}
              <h2 className="font-bold">Conducted Interviews</h2>
              <div
                className="bg-black"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {" "}
                {/* Set max height and allow scrolling */}
                {/* CONDUCTED INTERVIEWS */}
                {userNotification?.map((user: any) => (
                  <div key={user.id}>
                    {conductedInterviews
                      ?.filter((interview: any) => interview.hr_id === user.id)
                      .map((item: any) => (
                        <div
                          key={item.id}
                          className={`flex w-full justify-between bg-white p-4 shadow-md rounded-lg my-8 items-center `}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.image} />
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback>OM</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                            <p className="text-sm font-medium leading-none">
                              {user.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>

                            <div className="ml-auto flex md:hidden text-xs">
                              <p className="text-xs">
                                Date: {formatDateTime(item?.slot).date}
                                <br />
                                Time: {formatDateTime(item?.slot).time}
                              </p>
                            </div>

                            <div className="flex space-x-6 flex-grow justify-start md:hidden">
                              <Button
                                className="text-xs md:text-lg"
                                onClick={() =>
                                  onClickFeedback(item.hr_id, item.slot)
                                }
                              >
                                Feedback
                              </Button>
                              {/* <Button>Edit Feedback</Button> */}
                              {/* <Button>Delete</Button> */}
                            </div>
                          </div>

                          <div className="ml-auto font-medium text-sm hidden md:block">
                            <span>Date: {formatDateTime(item.slot).date}</span>
                            <br />
                            <span>Time: {formatDateTime(item.slot).time}</span>
                          </div>

                          <div className="hidden space-x-6 flex-grow justify-end md:flex">
                            <Button
                              onClick={() =>
                                onClickFeedback(item.hr_id, item.slot)
                              }
                            >
                              Feedback
                            </Button>
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
        </Tabs>
      </div>
    </div>
  );
}

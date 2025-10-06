"use client"
import { useState, useEffect } from 'react';
import useUserData from '@/lib/db/userData';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import MainUsers from '@/lib/db/mainUsers';
import InterviewData from '@/lib/db/interviewData';
import { useRouter } from 'next/navigation';
import HrData from '@/lib/db/hrData';
import toast from 'react-hot-toast';
import { Flag, Video } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-lg max-w-xl w-full relative z-20"> {/* Set a higher z-index */}
        <h2 className="text-xl font-bold mb-4">Report User</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="input py-3.5 px-4 bg-black h-44 w-full outline-none rounded-xl"
        ></textarea>
        <div className="flex justify-end my-4 space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Submit</button>
        </div>
      </div>
    </div>
  );
};
const UnconductedUSER = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const { hrTable } = HrData();
  const { interviews } = InterviewData();
  const [reject, setReject] = useState(false);
  const [reportUserId, setReportUserId] = useState("");
  const { users } = MainUsers();
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const filteredInterviews = interviews.filter((item: any) => item.user_id === userData?.id);
  //console.log("Filtered Interviews at DashboardHR: ", filteredInterviews);
  const totalInterviews = filteredInterviews.filter((item: any) => item.is_confirmed === "confirmed");
  //console.log("Total Interviews: ", totalInterviews);
  const conductedInterviews = totalInterviews.filter((item: any) => item.is_conducted === "conducted").reverse();
  //console.log("Conducted Interviews: ", conductedInterviews);
  const upcomingInterviews = totalInterviews.length - conductedInterviews.length;
  //console.log("Upcoming Interviews: ", upcomingInterviews);
  const upcomingSchedules = totalInterviews.filter((item: any) => item.is_conducted === "notConducted").reverse();
  //console.log("Upcoming Schedules: ", upcomingSchedules);
  const filteredHrData = hrTable?.filter((item: any) => item.user_id === userData?.id);
  const userNotification = users.filter((item: any) =>
    filteredInterviews.map((interview: any) => interview.hr_id).includes(item.id));
  //console.log("UserNotification: ", userNotification);
const currentTime = new Date();

const sortedUpcomingSchedules = upcomingSchedules.sort((a, b) => {
    const dateA = new Date(a.slot);
    const dateB = new Date(b.slot);
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      throw new Error('Invalid date');
    }
    
    const diffA = dateA.getTime() - currentTime.getTime();
    const diffB = dateB.getTime() - currentTime.getTime();
    
    if (diffA >= 0 && diffB >= 0) {
      // Both dates are in the future, sort by the closest to the current time
      return diffA - diffB;
    } else if (diffA < 0 && diffB < 0) {
      // Both dates are in the past, sort by the closest to the current time
      return diffB - diffA;
    } else if (diffA >= 0 && diffB < 0) {
      // A is in the future, B is in the past, A should come before B
      return -1;
    } else if (diffA < 0 && diffB >= 0) {
      // A is in the past, B is in the future, B should come before A
      return 1;
    }
    
    return 0;
});


  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = sortedUpcomingSchedules.slice(firstItemIndex, lastItemIndex);
  // const currentItems = [];


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
      //console.log(error);
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



  return (
    <div className='font-nunito'>
      <h2 className='font-bold mt-0 px-0 md:px-4 text-3xl text-[#242E49]'>Not Conducted Interviews</h2>
      
      {/* {currentItems.length === 0  && (<div className="flex w-full h-full justify-center items-center"><div className="flex bg-white w-[400px] h-[200px] justify-center rounded-lg shadow-md items-center"> <h1 className="font-nunito font-bold text-3xl text-[#242E49]">No Jobs Found</h1></div></div>)} */}
      
      <div className='h-full min-h-[400px] max-h-[400px] overflow-y-auto'>
        {/* NOT CONDUCTED INTERVIEWS */}
        {/* {userNotification?.map((user: any) => ( */}
          <div className='px-0 md:px-4'>
            {/* // .filter((interview: any) => interview.hr_id === user.id) */}
            {currentItems?.map((item: any) => {
                // Parse the slot string into a Date object
                const slotDate = new Date(item.slot);
                const tenMinutesAfterSlot = new Date(slotDate.getTime() + 10 * 60 * 1000);

                const isActive = Date.now() <= tenMinutesAfterSlot.getTime() ? "online" : "expired";
                // Calculate the difference between the slot time and the current time in milliseconds
                const timeDifference = slotDate.getTime() - Date.now();
                // Check if the time difference is less than or equal to 5 minutes or if the slot time has passed
                if (timeDifference <= 5 * 60 * 1000 || timeDifference <= 0) {
                  // If the condition is met, display the item
                  return (
                    <div key={item.id} className={`flex w-full flex-col space-y-4  lg:space-y-0  lg:flex-row bg-white px-8 py-4 shadow-md rounded-lg justify-between my-4 items-left lg:items-center`}>

                      <div className='flex ml-3 self-start lg:self-center'>
                      <Avatar className="h-12 w-12 md:h-16 md:w-16">
                        <AvatarImage src={userNotification.filter((user:any)=> user.id === item.hr_id)[0]?.image} />
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      </div>

                      <div className="ml-4  space-y-4  md:space-y-1  flex-grow">
                        <p className="text-sm md:text-lg font-bold leading-none">{userNotification.filter((user:any)=> user.id === item.hr_id)[0]?.username}</p>
                        <p className="text-sm md:text-md text-muted-foreground">{userNotification.filter((user:any)=> user.id === item.hr_id)[0]?.email}</p>
                        <div className='ml-auto flex lg:hidden text-xs'>
                          <p className='text-xs'>
                            Date: {formatDateTime(item?.slot).date}
                            <br />
                            Time: {formatDateTime(item?.slot).time}
                          </p>
                        </div>

                        <div className='flex space-x-6 md:hidden flex-grow justify-start'>
                          <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg ' disabled={isActive === "expired"} onClick={() => onClickJoin(item.id, item.slot)}> <Video size={20} className='block md:hidden' /> <span className='hidden md:flex'>{isActive === "online"? "Join Interview": "Expired"}</span></Button>
                          {showModal && (
                            <Modal
                              onClose={() => setShowModal(false)}
                              onSubmit={(reason) => handleReportSubmit(reason)}
                            />
                          )}
                          <Button className='bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg' onClick={() => handleReportUser(item.hr_id)}> <Flag size={20} className='block md:hidden'/> <span className='hidden md:flex'>Report User</span></Button>
                          {/* <Button onClick={() => onClickMark(item.user_id, item.slot)}>Mark as Conducted</Button> */}
                          {/* <Button onClick={() => onClickDelete(item.user_id, item.slot)}>Delete</Button> */}
                        </div>


                      </div>

                      <div className="ml-auto font-medium hidden lg:flex lg:mx-auto md:space-x-16">
                        <div className='flex flex-col space-y-2'><span className='text-md text-[#6D6D6D]'>Date</span>  <span className='text-[#333333]'>{formatDateTime(item.slot).date}</span> </div>
                        <div className='flex flex-col space-y-2'><span className='text-md text-[#6D6D6D]'> Time </span>  <span className='text-[#333333]'>{formatDateTime(item.slot).time}</span></div>
                      </div>
                      <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                        <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg ' disabled={isActive === "expired"} onClick={() => onClickJoin(item.id, item.slot)}>{isActive === "online"? "Join Interview": "Expired"}</Button>
                        {showModal && (
                          <Modal
                            onClose={() => setShowModal(false)}
                            onSubmit={(reason) => handleReportSubmit(reason)}
                          />
                        )}
                        <Button className='bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg' onClick={() => handleReportUser(item.hr_id)}>Report User</Button>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        {/* // ))} */}
      </div>
      <div className='mt-16'>
      <PaginationSection 
      totalItems={upcomingSchedules.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  )
}
export default UnconductedUSER
function PaginationSection({ totalItems, itemsPerPage, currentPage, setCurrentPage }:{totalItems: any,
  itemsPerPage: any,
  currentPage: any,
  setCurrentPage: any,}
) {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }
  const handlePrevPage = () => {
    if(currentPage > 1)
      {
        setCurrentPage(currentPage - 1);
      }
  }
  const handleNextPage = () => {
    if(currentPage < pages.length)
      {
        setCurrentPage(currentPage + 1);
      }
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
        <PaginationPrevious className='cursor-pointer hover:bg-neutral-200' onClick={()=> handlePrevPage()} />
      </PaginationItem>
      {pages.map((page,idx)=>(
        <PaginationItem key={idx} >
      <PaginationLink className={currentPage === page? "bg-[#4765FF] hover:bg-[#4765FF] text-white hover:text-white cursor-pointer rounded-md":"hover:bg-[#4765FF] hover:text-white cursor-pointer"} onClick={()=>setCurrentPage(page)}>
          {page}
      </PaginationLink>
      </PaginationItem>
))}
      <PaginationItem>
        <PaginationNext className='cursor-pointer hover:bg-neutral-200' onClick={()=> handleNextPage()} />
      </PaginationItem> 
      </PaginationContent>
    </Pagination>
  )
}
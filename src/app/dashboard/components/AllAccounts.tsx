"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Metadata } from "next";
import Image from "next/image";
import { useState, useEffect } from 'react';
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
import useUserData from '@/lib/db/userData';
import Link from 'next/link';
import { format } from 'date-fns';
import NavBar from './NavBar';
import MainUsers from '@/lib/db/mainUsers';
import InterviewData from '@/lib/db/interviewData';
import { useRouter } from 'next/navigation';
import HrData from '@/lib/db/hrData';
import FeedbackData from '@/lib/db/feedbackData';
import Rating from './Rating';
import VerificationData from '@/lib/db/vertificationData';
import toast from 'react-hot-toast';
import ReportsData from '@/lib/db/reportsData';
import { Plus } from 'lucide-react';
import JobData from '@/lib/db/jobData';
import SkillModal from './SkillModal';
import jobSkillsData from '@/lib/db/jobSkillsData';
import { X } from 'lucide-react';
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import SpinnerLoader from './SpinnerLoader';


const RoleModal = ({ onClose, email, user_id }: { onClose: () => void, email: any, user_id:any }) => {
    const [role, setRole] = useState("");
  
    const { userData } = useUserData();
  
//   console.log("EMAIL", email);
//   console.log("USERID", user_id);
  
  
    const handleSubmit = async () => {
      try {
  
        if (
          role.trim() === ""
        ) {
          toast.error("Please select a role");
          return;
        }
  
        const data = await fetch("/api/role", {
          method: "PUT",
          body: JSON.stringify({
            email: email,
            role: role,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        // alert("Mark as Conducted!");
        if (!data.ok) {
          toast.error("Error submitting role");
          return;
        }
        toast.success("Role assigned successfully");
        setRole("");

        if(role === "hr"){
            try {
                const res = await fetch("/api/hr2", {
                  method: 'PUT',
                  body: JSON.stringify({ is_approve: "unapproved", user_id: user_id }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  },
          
                })
          
                if (!res.ok) {
                  // alert("Error submitting data")
                  toast.error("Error submitting data");
                  return;
                }
          
                // toast.success("Account Approval request sent");
                window.location.reload();
          
              } catch (error) {
                //console.log(error);
          
              }
        }
        else if(role === "user")
            {
                try {
                    const res = await fetch("/api/hr2", {
                      method: 'PUT',
                      body: JSON.stringify({ is_approve: "user", user_id: user_id }),
                      headers: {
                        "Content-type": "application/json; charset=UTF-8"
                      },
              
                    })
              
                    if (!res.ok) {
                      // alert("Error submitting data")
                      toast.error("Error submitting data");
                      return;
                    }
              
                    // toast.success("Account Approval request sent");
                    window.location.reload();
              
                  } catch (error) {
                    //console.log(error);
              
                  }
            }

            else if(role === "admin")
                {
                    try {
                        const res = await fetch("/api/hr2", {
                          method: 'PUT',
                          body: JSON.stringify({ is_approve: "approved", user_id: user_id }),
                          headers: {
                            "Content-type": "application/json; charset=UTF-8"
                          },
                  
                        })
                  
                        if (!res.ok) {
                          // alert("Error submitting data")
                          toast.error("Error submitting data");
                          return;
                        }
                  
                        // toast.success("Account Approval request sent");
                        window.location.reload();
                  
                      } catch (error) {
                        //console.log(error);
                  
                      }
                }


        // window.location.reload();
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
        <div className="bg-white mt-[100px] p-8 rounded-lg max-w-xl w-full relative z-20">
          <div className="flex justify-center items-center flex-col space-y-6">
            <h2 className="text-3xl text-start self-start text-[#242E49]  font-nunito font-bold mb-4">
              Assign Role
            </h2>
            
  
            <div className="flex flex-row space-x-4 items-center justify-start w-full">
              <div>
                <label className='block text-sm font-bold mb-2' htmlFor='martial_status'>Select Role <span className='text-red-500'>*</span></label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' id='martial_status'>
                  <option value="">Select Role </option>
                  <option value="hr">HR</option>
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
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




interface UserReportsVisibility {
    [key: string]: boolean;
}



export const AllAccounts = () => {
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [skillId, setskillId] = useState(0);
    const router = useRouter();
    const { interviews } = InterviewData();
    const { users } = MainUsers();
    const [loading, setLoading] = useState(false);
    const [reject, setReject] = useState(false);
    const {userData, status} = useUserData();
    const { hrTable } = HrData();
    const [email, setEmail] = useState("");
    const [user_id, setUserId] = useState("");
    const { feedback } = FeedbackData();
    const { verification } = VerificationData();
    const { reports } = ReportsData();
    const filteredFeedback = feedback?.filter((item: any) => item.hr_id === userData?.id);
    const [isReportsVisible, setIsReportsVisible] = useState<UserReportsVisibility>({});
    const { jobs } = JobData();
    const [showJobModal, setShowJobModal] = useState(false);
    const { jobSkill } = jobSkillsData();
    const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);



  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
    }, 2000);
  }, []);


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

        if (userData && userData?.role !== 'admin') {
            // alert("No User Found!");
            toast.error("Not Allowed!");
            router.push("/dashboards");
        }


    }, [userData, status, router]);


    const openRoleModal = (email:any, user_id:any) => {
        setShowRoleModal(true);
        setEmail(email);
        setUserId(user_id);
      }

    const closeRoleModal = () => {
        setShowRoleModal(false);
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

    async function onClickRoute(id: any) {
        router.push(`/profile?id=${id}`)
    }

    const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = verification.slice(firstItemIndex, lastItemIndex);
  

  console.log("Current Items: ", currentItems);
  
   


    return (
        <div>

{screenLoading ? (
        <SpinnerLoader />
      ) :(

        <>
        {userData && userData?.role === 'admin'? (
                <div className='lg:px-8 px-[12px]'>
                <h1 className="font-bold text-2xl mt-8 mb-4">All Accounts: </h1>
                {users.map((user: any) => (
                    <div key={user.id} className="">
                        {currentItems
                            .filter((verify: any) => verify.user_id === user.id)
                            .map((item: any, index: number) => (

                                <div key={item.id} className={`grid grid-cols-3 my-2 gap-y-8 items-center place-items-stretch px-6  bg-white py-4  shadow-md rounded-lg `}>
                                    
                                    <div className='grid grid-cols-1 gap-y-4 w-[300px]'>
                                    <div className=''>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user?.image} />

                                            <AvatarFallback>OM</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className=" lg:space-y-1 space-y-6 ">
                                        <div>
                                        <p className="text-sm font-medium leading-none">{user.username + " (" + user.role + ")"}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <p>{item.verified}</p>
                                        <p>{hrTable?.filter((item: any) => item.user_id === user.id && user.role === 'hr').map((item: any) => (<div key={item.id}> <span className='text-[#4765FF]'>Status: </span> <span>{item?.is_approve}</span></div>))}</p>
                                        </div>
                                        <div className="ml-auto flex lg:hidden text-xs">
                                            Date: {formatDateTime(user.createdAt).date}
                                            <br />
                                            Time: {formatDateTime(user.createdAt).time}
                                        </div>

                                        <div className='grid grid-cols-1 gap-y-4  lg:hidden place-items-start gap-x-6 '>
                                            <Button className='bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg' onClick={() => onClickRoute(user.id)}>View Profile</Button>
                                            <Button className="bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg " onClick={()=>openRoleModal(user?.email, user?.id)}>Assign Role</Button>
                                        {showRoleModal && <RoleModal onClose={closeRoleModal} email={email} user_id={user_id} />}
                                        </div>


                                    </div>
                                    </div>


                                    <div className=" font-medium text-sm hidden lg:grid grid-cols-2 gap-x-16  ">
                                        <div> 
                                        <span> Date </span> <br/>{formatDateTime(user.createdAt).date}
                                        </div>
                                        
                                        <div>
                                        <span> Time </span> <br/>{formatDateTime(user.createdAt).time}
                                        </div>
                                    </div>


                                    <div className='hidden lg:grid grid-cols-2  gap-x-6  justify-end'>
                                        <Button className='bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg' onClick={() => onClickRoute(user.id)}>View Profile</Button>
                                        <Button className="bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg " onClick={()=>openRoleModal(user?.email, user?.id)}>Assign Role</Button>
                                        {showRoleModal && <RoleModal onClose={closeRoleModal} email={email} user_id={user_id} />}

                                        {/* <Button onClick={()=>onClickDeleteAccount(user.id)}>Delete Account</Button> */}
                                    </div>
                                </div>
                            ))}
                    </div>

                ))}
            </div>
            ):(<SpinnerLoader />)}
            
            <div className='mt-16'>
      <PaginationSection 
      totalItems={verification.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      />
      </div>
        </>

      )}


            
        </div>
    )
}


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
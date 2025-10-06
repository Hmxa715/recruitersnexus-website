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
import { Plus, Trash } from 'lucide-react';
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

interface UserReportsVisibility {
    [key: string]: boolean;
}



export const UnverifiedAccounts = () => {
    const [showSkillModal, setShowSkillModal] = useState(false);
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

        if (userData && userData?.role !== 'admin') {
            // alert("No User Found!");
            toast.error("Not Allowed!");
            router.push("/dashboards");
        }


    }, [userData, status, router]);

    async function onClickDeleteAccount(user_id: any) {
        try {
            const data = await fetch("/api/users", {
                method: 'DELETE',
                body: JSON.stringify({ user_id: user_id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });
            if (!data.ok) {
                // alert("Error deleting account");
                toast.error("Error deleting account")
                return;
            }
            // alert("Account deleted!")
            toast.success("Account deleted!");

        } catch (error) {
            //console.log(error);

        }

    }
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const unapprovedAccounts = verification?.filter((item: any) => item.verified === "unverified");
    const currentItems = unapprovedAccounts.slice(firstItemIndex, lastItemIndex);
    // const currentItems = [];


    return (
        <div className='bg-black  px-[12px] lg:px-8'>

{screenLoading ? (
        <SpinnerLoader />
      ) :(

        <>
        {userData && userData?.role === "admin" ? (

                
< div className='min-h-screen'>
<h1 className="font-bold text-2xl mt-8 mb-4">Unverified Accounts List: </h1>
{currentItems.length === 0 && (<div className="flex w-full h-screen justify-center items-center"><div className="flex bg-white w-[800px] px-2 text-center h-[200px] justify-center rounded-lg shadow-md items-center"> <h1 className="font-nunito font-bold text-3xl text-[#242E49]">No Unverified Account Found</h1></div></div>)}

{users.map((user: any) => (
<div key={user.id} className="bg-black ">
    {currentItems
        .filter((verify: any) => verify.user_id === user.id && verify.verified === "unverified")
        .map((item: any, index: number) => (

            <div key={item.id} className={`grid grid-cols-3 my-2  px-4 place-items-stretch items-center bg-white py-4 shadow-md rounded-lg `}>


                <div className='grid grid-cols-1 gap-y-3 place-items-start min-w-[300px]'>
                    <div>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className=" space-y-4  lg:space-y-1 w-full ">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>

                        <div className=" flex lg:hidden text-xs">Date: {formatDateTime(user.createdAt).date}
                            <br />
                            Time: {formatDateTime(user.createdAt).time}
                        </div>

                        <div className='flex lg:hidden flex-grow items-start space-x-6'>
                            <Button className='bg-[#F43F5E] hover:bg-[#F43F5E]/80  h-11 rounded-lg flex space-x-2' onClick={() => onClickDeleteAccount(user.id)}><Trash size={14} /> <span>Delete Account</span></Button>
                        </div>

                    </div>
                </div>


                <div className="font-medium text-sm hidden lg:grid grid-cols-2 gap-x-12">
                    <div>
                        <span> Date </span> <br />{formatDateTime(user.createdAt).date}
                    </div>

                    <div>
                        <span> Time </span> <br />{formatDateTime(user.createdAt).time}
                    </div>
                </div>


                <div className='hidden lg:flex space-x-6 flex-grow justify-end'>
                    <Button className='bg-[#F43F5E] hover:bg-[#F43F5E]/80  h-11 rounded-lg flex space-x-2' onClick={() => onClickDeleteAccount(user.id)}> <Trash size={14} /> <span>Delete Account</span></Button>
                </div>
            </div>
        ))}
</div>

))}
</div>
) : (<SpinnerLoader />)
}
<div className='mt-16'>
<PaginationSection
totalItems={unapprovedAccounts.length}
itemsPerPage={itemsPerPage}
currentPage={currentPage}
setCurrentPage={setCurrentPage}
/>
</div>
        </>


      )}




            
        </div >
    )
}


function PaginationSection({ totalItems, itemsPerPage, currentPage, setCurrentPage }: {
    totalItems: any,
    itemsPerPage: any,
    currentPage: any,
    setCurrentPage: any,
}
) {

    let pages = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pages.push(i);
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className='cursor-pointer hover:bg-neutral-200' onClick={() => handlePrevPage()} />
                </PaginationItem>

                {pages.map((page, idx) => (
                    <PaginationItem key={idx} >
                        <PaginationLink className={currentPage === page ? "bg-[#4765FF] hover:bg-[#4765FF] text-white hover:text-white cursor-pointer rounded-md" : "hover:bg-[#4765FF] hover:text-white cursor-pointer"} onClick={() => setCurrentPage(page)}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>

                ))}

                <PaginationItem>
                    <PaginationNext className='cursor-pointer hover:bg-neutral-200' onClick={() => handleNextPage()} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )


}
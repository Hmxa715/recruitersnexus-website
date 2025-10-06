"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { MainNav } from '../dashboard/components/main-nav';
import { Search } from '../dashboard/components/search';
import { UserNav } from '../dashboard/components/user-nav';
import useUserData from '@/lib/db/userData';
import { MainNavUser } from '../dashboard/components/main-nav-user';
import { Button } from "@/components/Button";
import { useRouter } from 'next/navigation';
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom';
import SettingBar from './SettingBar';
import UserInfo from './UserInfo';
import Qualifications from './Qualifications';
import Experience from './Experience';
import VerificationData from '@/lib/db/vertificationData';
import toast from 'react-hot-toast';
import NavBar from '../dashboard/components/NavBar';

export default function Setting({ id }: any) {
  const { userData, status } = useUserData();
  const [user_id, setId] = useState(userData?.id);
  const {verification} = VerificationData();
  const filteredVerification = verification.filter((item:any)=> item.user_id === userData?.id);
  const router = useRouter();

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

  }, [userData, status, router]);




  useEffect(() => {
    // Update user_id when userData changes
    setId(userData?.id);
  }, [userData]);

  //console.log("user id: " + userData?.id);





  return (
    <div>
  {userData ? (
    <div>
      <NavBar />
      <div className='w-full flex flex-wrap mt-12'>
        {/* Options */}
        <div className='w-full md:w-1/6 flex flex-col h-64  md:h-auto bg-slate-500 space-y-6'>
          <SettingBar />
        </div>
        <div className='w-full md:w-5/6 bg-black'>
          {id === "userinfo" ? (
            <UserInfo />
          ) : id === "qualifications" ? (
            <Qualifications />
          ) : id === "experience" ? (
            <Experience />
          ) : (
            <div className='flex justify-center items-center h-screen'>
              <h1>Not Found</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <SkeletonLoaderCustom />
  )}
</div>

  )
}

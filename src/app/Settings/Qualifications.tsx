"use client"
import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/Button'
import VerificationData from '@/lib/db/vertificationData'
import useUserData from '@/lib/db/userData'
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom'
import toast from 'react-hot-toast'
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SpinnerLoader from '../dashboard/components/SpinnerLoader'

const Qualifications = () => {
  const { userData, status } = useUserData();
  const { verification } = VerificationData();
  const filteredVerification = verification.filter((item: any) => item.user_id === userData?.id);
  const [degree, setdegree] = useState("");
  const [speciallization, setspeciallization] = useState("");
  const [CGPA, setCGPA] = useState("");
  const [passingYear, setpassingYear] = useState("");
  const [institute, setinstitute] = useState("")
  const router = useRouter();

  async function onRoute()
  {
    router.push("/setting?slug=experiences")
  }

  async function onSubmit() {
    if (degree === "") {
      toast.error("Please fill out the 'Degree' field");
      return;
    } else if (speciallization === "") {
      toast.error("Please fill out the 'Specialization' field");
      return;
    } else if (CGPA === "") {
      toast.error("Please fill out the 'CGPA' field");
      return;
    } else if (passingYear === "") {
      toast.error("Please fill out the 'Passing Year' field");
      return;
    } else if (institute === "") {
      toast.error("Please fill out the 'Institute' field");
      return;
    }
    

    try {
      const res = await fetch("/api/qualification", {
        method: 'POST',
        body: JSON.stringify({ degree: degree, speciallization: speciallization, cgpa: CGPA, passing_year: passingYear, institute: institute, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })

      if (!res.ok) {
        // alert("Failed to add qualification");
        toast.error("Failed to add qualification");
      }
      setdegree("");
      setspeciallization("");
      setCGPA("");
      setpassingYear("");
      setinstitute("");
      // alert("Qualification added successfully");
      toast.success("Qualification has been added!");
      window.location.reload();

      return res;
    }
    catch (error) {
      //console.log(error);
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
    <div className='bg-gray-100 min-h-screen font-nunito'>
      <div className='mx-auto py-0'>
        {userData && filteredVerification && filteredVerification[0]?.verified === "verified" || userData?.role === "admin" ? (
          <div>
            <h2 className='text-3xl font-bold mb-8 text-[#242E49]'>Qualifications</h2>

            {/* Box White */}
            <div className='bg-white  p-[12px] md:p-12 rounded-3xl shadow-md'>


              <Alert className='mb-10' variant="destructive">
                <AlertCircle className="h-4 w-4 font-bold" />
                <AlertTitle className='font-bold'>Disclaimer</AlertTitle>
                <AlertDescription className='font-bold'>
                  Please ensure that all fields are accurately filled out as any incorrect information may result in disqualification from the job selection process. Providing false information could lead to dismissal or rejection of your application.
                </AlertDescription>
              </Alert>



              <div className='flex flex-col space-y-6'>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>

                <div className='flex flex-col'>
                  <label htmlFor='degree' className='block text-sm font-bold mb-2'>Degree <span className='text-red-500'>*</span></label>
                  <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Degree...' value={degree} onChange={(e) => setdegree(e.target.value)} id='degree' />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='specialization' className='block text-sm font-bold mb-2'>Specialization <span className='text-red-500'>*</span></label>
                  <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Speciallization...' value={speciallization} onChange={(e) => setspeciallization(e.target.value)} id='specialization' />
                </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>

                <div className='flex flex-col'>
                  <label htmlFor='CGPA' className='block text-sm font-bold mb-2'>CGPA <span className='text-red-500'>*</span></label>
                  <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter CGPA...' value={CGPA} onChange={(e) => setCGPA(e.target.value)} id='CGPA' />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='passingYear' className='block text-sm font-bold mb-2'>Passing Year <span className='text-red-500'>*</span></label>
                  <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' value={passingYear} placeholder='Enter Passing Year...' onChange={(e) => setpassingYear(e.target.value)} id='passingYear' />
                </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='institute' className='block text-sm font-bold mb-2'>Institute <span className='text-red-500'>*</span></label>
                  <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Institute...' value={institute} onChange={(e) => setinstitute(e.target.value)} id='institute' />
                </div>
              </div>

              <div className='mt-8 w-full md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4 space-x-0 flex justify-end'>
                <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg' onClick={onSubmit} type="submit">Save now</Button>
                <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg' onClick={onRoute} type="submit">Next</Button>
              </div>

            </div>

          </div>
        ) : userData && filteredVerification && filteredVerification[0]?.verified === "unverified" ? (
          <div className='flex w-full h-screen justify-center items-center'>
            <h1>Please verify your account to access following content</h1>
          </div>
        ) : (
          <SpinnerLoader />
        )}
      </div>
    </div>



  )
}

export default Qualifications
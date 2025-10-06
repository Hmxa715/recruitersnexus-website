"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnconductedHR } from './UnconductedHR';
import ConductedHR from './ConductedHR';
import useUserData from '@/lib/db/userData';
import UnconductedUSER from './UnconductedUSER';
import ConductedUSER from './ConductedUSER';
import UserInfo from '@/app/Settings/UserInfo';
import Qualifications from '@/app/Settings/Qualifications';
import Experience from '@/app/Settings/Experience';
import MockInterview from './MockInterview';
import JobInterview from './JobInterview';



const ScheduleInterview = ({ hr_id, filterServices, allInterviews, filteredHr }: any) => {

const {userData} = useUserData();    

  return (
    <div className='bg-black mt-6 px-0'>

<Tabs defaultValue="mock" className="space-y-4 md:space-y-2 bg-black ">
          <TabsList className='flex bg-black w-full  space-x-4   flex-row items-start  justify-end'>
            <TabsTrigger className='data-[state=active]:bg-[#242E49] data-[state=active]:text-white w-36 py-3 bg-white shadow-lg ' value="mock">Mock Interview Slots</TabsTrigger>

            <TabsTrigger className='data-[state=active]:bg-[#242E49] data-[state=active]:text-white w-36 py-3 bg-white shadow-lg ' value="job" >
            Job Interview Slots
            </TabsTrigger>

            

            


          </TabsList>

          <TabsContent value="mock" className="">

          <MockInterview  hr_id={hr_id} filteredHr={filteredHr} filterServices={filterServices} allInterviews={allInterviews}/>

          </TabsContent>


          <TabsContent value="job" className="">
            
           <JobInterview  hr_id={hr_id} filteredHr={filteredHr} filterServices={filterServices} allInterviews={allInterviews}/>

          </TabsContent>

          




          </Tabs>


    </div>
  )
}

export default ScheduleInterview
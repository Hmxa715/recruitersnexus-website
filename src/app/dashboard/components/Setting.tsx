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
import { User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom';
import HrData from '@/lib/db/hrData';


const Setting = () => {
  // const searchParams = useSearchParams();
const router = useRouter();
const {userData, status} = useUserData();
const {hrTable} = HrData();
const params = useSearchParams();
const slug = params.get("slug");

const [defaultValue, setDefaultValue] = useState( slug || "userInfo");

// window.location.reload();

const filterHrData = hrTable.filter((item:any)=> item.user_id === userData?.id);
  // const changeTabValue = (newValue: string) => {
  //   setTabValue(newValue);
  // };
//   const slug = searchParams.get('default') ?? 'userInfo';   
const [tabValue, setTabValue] = useState<string>("");
// const {userData} = useUserData(); 
// const [qualificationOn, setQualficationOn] = useState("off");
// const [experienceOn, setExperienceOn] = useState("off");


// useEffect(() => {
//   // Check if there is no user data (e.g., user logged out)
//   if (status === "404") {
//       // //console.log("No user data found.");
//       // //console.log("Status: " + status);
//       // alert("No User Found!");
//       toast.error("No User Found!");
//       // //console.log("NO user Found!");
//       router.push("/login");
//   }

//   // if (userData && userData?.role !== 'admin') {
//   //     // alert("No User Found!");
//   //     toast.error("Not Allowed!");
//   //     router.push("/dashboards");
//   // }


// }, [userData, status, router]);


// useEffect(() => {
//   console.log("Tab value is: " , tabValue);
  
//   if (slug === "qualifications") {
//       // setTabValue("qualifications");
//       setDefaultValue("qualifications");
//   } else if (slug === "experiences") {
//       // setTabValue("experiences");
//       setDefaultValue("experiences");
//   } else {
//       // setTabValue("userInfo");
//       setDefaultValue("userInfo");
      
//   }
// }, [tabValue,defaultValue,slug]);


const changeTabValue = (newValue: string) => {
  setDefaultValue(newValue);
  router.replace(`/settings/${newValue}`);
  window.location.reload();
};

console.log("Default Value: ", defaultValue);


useEffect(() => {
  
  if (slug === "qualifications") {
      // setTabValue("qualifications");
      setDefaultValue("qualifications");
  } else if (slug === "experiences") {
      // setTabValue("experiences");
      setDefaultValue("experiences");
  } else {
      // setTabValue("userInfo");
      setDefaultValue("userInfo");
      
  }

  if(slug === "qualifications" && defaultValue === "userInfo")
    {
      window.location.reload();
    }

    if(slug === "experiences" && defaultValue === "qualifications")
      {
        window.location.reload();
      }
    
}, [slug,defaultValue]);


console.log("Slug Value: ", slug);



  return (
    <div className='bg-black mt-6 md:mt-10 px-4 font-nunito'>
{/* {userData && filterHrData.length > 0 ?( */}
          <Tabs defaultValue={defaultValue || "userInfo"} className="space-y-0 md:space-y-0 bg-black ">
          <TabsList className='flex bg-black w-full h-32 space-x-4  flex-wrap  flex-row items-start  justify-end'>
            <TabsTrigger className='data-[state=active]:bg-[#242E49] data-[state=active]:text-white text-xs md:text-md w-26 md:w-36 py-3 bg-white shadow-lg ' value="userInfo">User Information</TabsTrigger>

            <TabsTrigger className='data-[state=active]:bg-[#242E49] data-[state=active]:text-white text-xs md:text-md w-26 md:w-36 py-3 bg-white shadow-lg ' value={`qualifications`} >
            Qualifications
            </TabsTrigger>

            <TabsTrigger className='data-[state=active]:bg-[#242E49] data-[state=active]:text-white text-xs md:text-md w-26 md:w-36 py-3 bg-white shadow-lg ' value={`experiences`} >
            Experiences
            </TabsTrigger>

            


          </TabsList>

          <TabsContent value="userInfo" className="">

          <UserInfo changeTabValue={changeTabValue} setDefaultValue={setDefaultValue}/>

          </TabsContent>


          <TabsContent value="qualifications" className="">
            
           <Qualifications/>

          </TabsContent>

          <TabsContent value="experiences" className="">
            
           <Experience/>

          </TabsContent>




          </Tabs>
        {/* // ):(<SkeletonLoaderCustom/>)} */}



    </div>
  )
}

export default Setting
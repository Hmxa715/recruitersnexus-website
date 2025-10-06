"use client"
import React from 'react'
import { useState } from 'react'
// import { Button } from '@/components/Button'
import { Button } from '@/components/ui/button'
import useUserData from '@/lib/db/userData'
import VerificationData from '@/lib/db/vertificationData'
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom'
import toast from 'react-hot-toast'
import { DefaultDate } from '../dashboard/components/DefaultDate'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash } from 'lucide-react';
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import SpinnerLoader from '../dashboard/components/SpinnerLoader'

const Experience = () => {
  const { userData, status } = useUserData();
  const { verification } = VerificationData();
  const filteredVerification = verification.filter((item: any) => item.user_id === userData?.id);
  const [designation, setdesignation] = useState("");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [aoe, setaoe] = useState("")
  const [organization, setorganization] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [total_experience, settotal_experience] = useState("");
  const router = useRouter();

  const handleFileChange = async (e: any) => {

    const length = e.target.files.length;
    const file = e.target.files[length - 1];
    setSelectedImage(file);
    //console.log("Length: ", length);
    //console.log("File: ", file);


    function calculateExperience(fromDate:any, toDate:any) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
    
      // Calculate the difference in milliseconds
      const difference = to.getTime() - from.getTime();
    
      // Convert milliseconds to years and months
      const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
      const millisecondsInMonth = millisecondsInYear / 12;
    
      const years = Math.floor(difference / millisecondsInYear);
      const months = Math.floor((difference % millisecondsInYear) / millisecondsInMonth);
    
      let result = "";
      if (years > 0) {
        result += years === 1 ? "1 year" : `${years} years`;
      }
      if (months > 0) {
        if (result !== "") {
          result += " ";
        }
        result += months === 1 ? "1 month" : `${months} months`;
      }
    
      return result !== "" ? result : "Less than a month";
    }




    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${process.env.NEXT_PUBLIC_upload_presets}` || "");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      setUploadedImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      // setErrorMessage("Error uploading image. Please try again later.");
    }
  };


  function onChangeCheckbox() {
    if (to === "present") {
      setto("");
    }
    else {
      setto("present");
    }
  }

  //console.log("Set To Checkbox: ", to);



  // const handleFromDateChange = (date: Date | null) => {
  //   setfrom(date?.toDateString() || "");
  // };

  const handleFromDateChange = (e: any) => {
    const dateString = e.target.value; // Get the value from the input
    const selectedDate = new Date(dateString);
    const date = selectedDate.toDateString();
    setfrom(date || "");
  };

  // const handleToDateChange = (date: Date | null) => {
  //   setto(date?.toDateString() || "");
  // };

  const handleToDateChange = (e: any) => {
    const dateString = e.target.value; // Get the value from the input
    const selectedDate = new Date(dateString);
    const date = selectedDate.toDateString();
    setto(date || "");
  };

  async function onSubmit() {

    // if (!selectedImage) {
    //   console.error("No image selected.");
    //   return;
    // }

    if (designation === "") {
      toast.error("Please fill out the 'Designation' field");
      return;
    } else if (from === "") {
      toast.error("Please fill out the 'From' field");
      return;
    } else if (to === "") {
      toast.error("Please fill out the 'To' field");
      return;
    } else if (total_experience === "") {
      toast.error("Please fill out the 'Total Experience' field");
      return;
    } else if (aoe === "") {
      toast.error("Please fill out the 'Area Of Expertise' field");
      return;
    } else if (organization === "") {
      toast.error("Please fill out the 'Organization' field");
      return;
    } else if (address === "") {
      toast.error("Please fill out the 'Address' field");
      return;
    }
    
    try {
      const res = await fetch("/api/experience", {
        method: 'POST',
        body: JSON.stringify({ designation: designation, from_date: from, to_date: to,total_experience: total_experience.toLowerCase() ,aoe: aoe, organization: organization, user_id: userData?.id, address: address, image: uploadedImageUrl }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })

      if (!res.ok) {
        // alert("Failed to add qualification");
        toast.error("Failed to add qualification");
      }
      setdesignation("");
      setfrom("");
      setto("");
      setaoe("");
      setorganization("");
      setAddress("");
      setImageUrl(null);
      setUploadedImageUrl(null);

      // alert("Experience added successfully");
      toast.success("Experience has been added!");
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
      <div className='  mx-auto py-0'>
        {userData && filteredVerification && filteredVerification[0]?.verified === "verified" || userData?.role === "admin" ? (
          <div>
            <div className='flex flex-col space-y-4'>
              <h2 className='text-3xl font-bold mb-8 text-[#242E49]'>Experience</h2>


              {/* White Box */}

              <div className='bg-white  p-[12px] md:p-12 rounded-3xl shadow-md'>


                <Alert className='mb-10' variant="destructive">
                  <AlertCircle className="h-4 w-4 font-bold" />
                  <AlertTitle className='font-bold'>Disclaimer</AlertTitle>
                  <AlertDescription className='font-bold'>
                    Please ensure that all fields are accurately filled out as any incorrect information may result in disqualification from the job selection process. Providing false information could lead to dismissal or rejection of your application.
                  </AlertDescription>
                </Alert>

                <div className='flex flex-col space-y-6'>

                  <div className='flex flex-row space-x-4 items-center justify-start w-full'>
                    <div className={`relative flex self-start ${imageUrl ? "p-0" : "p-8"} border-black rounded-full bg-black border-1 border-solid`}>
                      <Avatar className={`h-9 w-9 ${imageUrl ? "md:h-32 md:w-32" : "md:h-16 md:w-16"}  outline-1 rounded-full border-1 outline-solid outline-black object-cover`}>
                        <AvatarImage className='w-full h-full' src={imageUrl || "/camera.png"} />
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <label className='absolute bottom-1 right-2  mr-0 w-7 h-7 p-1 flex justify-center items-center cursor-pointer rounded-full text-white bg-[#4765FF]'><Plus size={24} color='white' /> <input id="image-upload" type="file" className="hidden" onChange={handleFileChange} /></label>
                    </div>

                    <p className="text-[#AEAEAE]">Add your company Logo {"("}Optional{")"}</p>
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor='designation' className='block text-sm font-bold mb-2'>Designation <span className='text-red-500'>*</span></label>
                    <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Designation...' value={designation} onChange={(e) => setdesignation(e.target.value)} id='designation' />
                  </div>

                  <div className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full'>

                    <div className='flex flex-col w-full'>
                      <label htmlFor='from' className='block text-sm font-bold mb-2'>From <span className='text-red-500'>*</span></label>
                      {/* <input type="date" className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md' value={from} onChange={(e) => setfrom(e.target.value)} id='from' /> */}
                      <input type="date" className='cursor-pointer input  w-full py-3.5  px-4 bg-black outline-none rounded-xl' onChange={handleFromDateChange} name="" id="from" />
                    </div>

                    <div className='flex flex-col space-y-5 w-full'>
                      {/* <input type="date" className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md' value={to} onChange={(e) => setto(e.target.value)} id='to' /> */}

                      <div className='flex flex-col'>
                        <label htmlFor='to' className='block text-sm font-bold mb-2'>To <span className='text-red-500'>*</span></label>
                        <input disabled={to === "present"} type="date" className={`cursor-pointer ${to === "present" ? "cursor-not-allowed" : "cursor-pointer"} ${to === "present" ? "bg-gray-300" : "bg-black"} input  w-full py-3.5  px-4  outline-none rounded-xl`} onChange={handleToDateChange} name="" id="to" />
                      </div>


                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="presentCheckbox"
                          className="hidden"
                          value={to}
                          onChange={onChangeCheckbox}
                          name="present"
                        />
                        <label
                          htmlFor="presentCheckbox"
                          className="inline-block relative w-5 h-5 border border-gray-300 rounded-md bg-white cursor-pointer"
                        >
                          <svg
                            className={`w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current ${to === "present" ? 'block' : 'hidden'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M17.865 4.759a.75.75 0 010 1.06l-10 10a.75.75 0 01-1.06 0L2.135 9.314a.75.75 0 011.061-1.06L7 12.938l9.438-9.439a.75.75 0 011.06 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                        <span className="text-sm">Currently Working</span>
                      </div>


                    </div>

                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>

                  <div className='flex flex-col'>
                    <label htmlFor='total_experience' className='block text-sm font-bold mb-2'>Total Experience <span className='text-red-500'>*</span></label>
                    <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Total Experience at current Job (e.g: 0 years, 5 months)...' value={total_experience} onChange={(e) => settotal_experience(e.target.value)} id='total_exeperience' />
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor='organization' className='block text-sm font-bold mb-2'>Organization <span className='text-red-500'>*</span></label>
                    <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' value={organization} placeholder='Enter Organization...' onChange={(e) => setorganization(e.target.value)} id='organization' />
                  </div>
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor='aoe' className='block text-sm font-bold mb-2'>Area of Expertise <span className='text-red-500'>*</span></label>
                    <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Area of Expertise...' value={aoe} onChange={(e) => setaoe(e.target.value)} id='aoe' />
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor='address' className='block text-sm font-bold mb-2'>Address <span className='text-red-500'>*</span></label>
                    <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' value={address} placeholder='Enter Address...' onChange={(e) => setAddress(e.target.value)} id='address' />
                  </div>



                </div>

                <div className='mt-8 flex justify-end'>
                  <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg' onClick={onSubmit} type="submit">Save Now</Button>
                </div>

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

export default Experience
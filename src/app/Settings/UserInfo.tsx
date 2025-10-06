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
import { nationalityData } from '@/data/page-data';
import toast from 'react-hot-toast';
import MainUsers from '@/lib/db/mainUsers';
import HrData from '@/lib/db/hrData';
import { DefaultDate } from '../dashboard/components/DefaultDate';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash } from 'lucide-react';
import { useRef } from 'react';
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import SpinnerLoader from '../dashboard/components/SpinnerLoader';



const UserInfo = ({ changeTabValue, setDefaultValue }: any) => {
  const { userData, status } = useUserData();
  const { users } = MainUsers();
  const { hrTable } = HrData();
  const filteredUsers = users?.filter((item: any) => item?.id === userData?.id);
  const filteredInfo = hrTable?.filter((item: any) => item?.user_id === userData?.id);
  const [user_id, setId] = useState(userData?.id);
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [about, setAbout] = useState("")
  const [father_name, setfather_name] = useState("");
  const [dob, setdob] = useState("");
  const [gender, setgender] = useState("");
  const [martial_status, setmartial_status] = useState("");
  const [nic, setnic] = useState("");
  const [nationality, setnationality] = useState("");
  const [religion, setreligion] = useState("")
  const [designation, setdesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // Trigger focus on the input element
    const input = document.getElementById('dob');
    if (input) {
      const event = new Event('focus'); // Create a focus event
      input.dispatchEvent(event); // Dispatch the focus event on the input field
    }
  };


  

  const router = useRouter();

  const [routeChanged, setRouteChanged] = useState(false);

  useEffect(() => {
    if (routeChanged) {
      router.refresh();
    }
  }, [routeChanged, router]);




  useEffect(() => {
    // Populate the input fields with fetched data
    if (filteredInfo && filteredUsers && filteredInfo.length > 0) {
      const userInfo = filteredInfo[0];
      setFname(userInfo.fname || "");
      setLname(userInfo.lname || "");
      setAbout(userInfo.about || "");
      setfather_name(userInfo.father_name || "");
      setdob(userInfo.dob || "");
      setgender(userInfo.gender || "");
      setmartial_status(userInfo.martial_status || "");
      setnic(userInfo.nic || "");
      setnationality(userInfo.nationality || "");
      setreligion(userInfo.religion || "");
      setdesignation(userInfo.designation || "");
      setImageUrl(filteredUsers[0]?.image || null);
      setPhone(userInfo.phone || ""); 
    }

    if (status === "404") {
      toast.error("No User Found!");
      router.push("/login");
  }
  }, [hrTable]);


  const handleAboutChange = (e: any) => {
    // Get the input value from the event
    const inputValue = e.target.value;

    // Replace "\n" characters with actual line breaks
    const formattedValue = inputValue.replace(/\\n/g, "\n");

    // Set the formatted value to the state
    setAbout(formattedValue);
  };

  // const handledobDateChange = (date: Date | null) => {
  //   setdob(date?.toDateString() || "");
  // };

  const handledobDateChange = (e: any) => {
    const dateString = e.target.value; // Get the value from the input
     // const selectedDate = new Date(dateString);
    // const date = selectedDate.toDateString();
    setdob(dateString || "");
  };


  const handleFileChange = async (e: any) => {

    const length = e.target.files.length;
    const file = e.target.files[length - 1];
    setSelectedImage(file);
    //console.log("Length: ", length);
    //console.log("File: ", file);

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





  async function onClickApproveRequest() {
    try {
      const res = await fetch("/api/hr2", {
        method: 'PUT',
        body: JSON.stringify({ is_approve: "pending", user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      })

      if (!res.ok) {
        // alert("Error submitting data")
        toast.error("Error submitting data");
        return;
      }

      toast.success("Account Approval request sent");
      window.location.reload();

    } catch (error) {
      //console.log(error);

    }
  }


  async function onSubmit() {

    // console.log("Dob: ", dob);
    
    
    try {

      const hasNumber = /\d/;
      const onlyNumbers = /^\d+$/;

      if (fname === "") {
        toast.error("Please fill 'First Name' field");
        return;
      }
      else if (hasNumber.test(fname)) {
        toast.error("First Name should not contain numbers");
        return;
      }
      else if (lname === "") {
        toast.error("Please fill 'Last Name' field");
        return;
      }
      else if (hasNumber.test(lname)) {
        toast.error("Last Name should not contain numbers");
        return;
      }
      else if (father_name === "") {
        toast.error("Please fill 'Father Name' field");
        return;
      }
      else if (hasNumber.test(father_name)) {
        toast.error("Father Name should not contain numbers");
        return;
      }
      else if (dob === "") {
        toast.error("Please fill 'Date of Birth' field");
        return;
      }
      else if (about === "") {
        toast.error("Please fill 'About' field");
        return;
      }
      else if (gender === "") {
        toast.error("Please fill 'Gender' field");
        return;
      }
      else if (martial_status === "") {
        toast.error("Please fill 'Marital Status' field");
        return;
      }
      else if (phone === "") {
        toast.error("Please fill 'Phone Number' field");
        return;
      }
      else if (nic === "") {
        toast.error("Please fill 'ID' field");
        return;
      }
      else if (!onlyNumbers.test(nic)) {
        toast.error("ID should contain only numbers");
        return;
      }
      else if (designation === "") {
        toast.error("Please fill 'Designation' field");
        return;
      }
      else if (religion === "") {
        toast.error("Please fill 'Religion' field");
      }
      else if (nationality === "") {
        toast.error("Please fill 'Nationality' field");
        return;
      }



      // const formattedAbout = about.replace(/\n/g, "<br>");
      const updatedData = {
        user_id: userData?.id,
        ...(fname && { fname }), // Include fname if it's not empty
        ...(lname && { lname }), // Include lname if it's not empty
        ...(about && { about }), // Include about if it's not empty
        ...(father_name && { father_name }), // Include father_name if it's not empty
        ...(dob && { dob }), // Include dob if it's not empty
        ...(gender && { gender }), // Include gender if it's not empty
        ...(martial_status && { martial_status }), // Include martial_status if it's not empty
        ...(nic && { nic }), // Include nic if it's not empty
        ...(nationality && { nationality }), // Include nationality if it's not empty
        ...(religion && { religion }), // Include religion if it's not empty
        ...(designation && { designation }),
        ...(phone && { phone }),
        is_approve: userData?.role === "user" && "user",
      };

      // const updatedImage =  {...(uploadedImageUrl && {uploadedImageUrl })}



      //console.log("User Id in submit: " + user_id);

      fetch(`/api/picture`, {
        method: 'PUT',
        body: JSON.stringify({
          id: userData?.id, image: uploadedImageUrl
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })

      const res = await fetch("/api/hr2", {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      })

      // if (!res.ok) {
      //   // alert("Error submitting data")
      //   toast.error("Error submitting data");
      //   return;
      // }
         // setFname("");
      // setLname("");
      // setAbout("");
      // setfather_name("");
      // setdob("");
      // setgender("");
      // setmartial_status("");
      // setnic("");
      // setnationality("");
      // setreligion("");
      // setdesignation("");
      // setPhone("");
      // alert("Data submitted Successfully!");
      toast.success("User information updated")
      // router.push("/setting?default=q")
      // window.location.reload();
      // changeTabValue("q");
      setRouteChanged(true);
      router.push("/setting?slug=qualifications");
      // setDefaultValue("qualifications");
      // router.replace("/setting?slug=qualifications").then(()=> router.reload());
      // changeTabValue("qualifications");
      // window.location.reload();

      // router.push("/setting?slug=qualifications");
      // window.location.reload();
      // window.location.reload();
      return res;
    } catch (error) {
      //console.log(error);

    } finally{
      router.refresh(); 
       }
    

  }


  return (
    <div className='bg-black min-h-screen font-nunito'>
      {userData? (<div className=' mx-auto py-0'>
        <h2 className='text-3xl font-bold mb-8 text-[#242E49]'>User Information</h2>

        {/* Box white */}

        <div className='bg-white p-[12px] md:p-12 rounded-3xl shadow-md'>

          <Alert className='mb-10' variant="destructive">
            <AlertCircle className="h-4 w-4 font-bold" />
            <AlertTitle className='font-bold'>Disclaimer</AlertTitle>
            <AlertDescription className='font-bold'>
              Please ensure that all fields are accurately filled out as any incorrect information may result in disqualification from the job selection process. Providing false information could lead to dismissal or rejection of your application.
            </AlertDescription>
          </Alert>


          <div className='flex flex-row space-x-4 items-center justify-start w-full mb-8'>

            <div className={`relative flex self-start ${imageUrl ? "p-0" : "p-8"} border-black rounded-full bg-black border-1 border-solid`}>
              <Avatar className={`h-9 w-9 ${imageUrl ? "md:h-32 md:w-32" : "md:h-16 md:w-16"}  outline-1 rounded-full border-1 outline-solid outline-black object-cover`}>
                <AvatarImage className='w-full h-full' src={imageUrl || "/camera.png"} />
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <label className='absolute bottom-1 right-2  mr-0 w-7 h-7 p-1 flex justify-center items-center cursor-pointer rounded-full text-white bg-[#4765FF]'><Plus size={24} color='white' /> <input id="image-upload" type="file" className="hidden" onChange={handleFileChange} /></label>
            </div>

            <p className="text-[#AEAEAE]">Upload your Profile Picture</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>
            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='fname'>First Name <span className='text-red-500'>*</span> </label>
              <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter First Name...' value={fname} onChange={(e) => setFname(e.target.value)} id='fname' />
            </div>
            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='lname'>Last Name <span className='text-red-500'>*</span></label>
              <input type="text" className='input py-3.5 px-4 bg-black w-full outline-none rounded-xl' placeholder='Enter Last Name...' value={lname} onChange={(e) => setLname(e.target.value)} id='lname' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>
            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='father_name'>Father{"'"}s Name <span className='text-red-500'>*</span></label>
              <input type="text" className='input w-full py-3.5  px-4 bg-black outline-none rounded-xl' placeholder='Enter Father Name...' value={father_name} onChange={(e) => setfather_name(e.target.value)} id='father_name' />
            </div>
            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='dob'>Date of Birth <span className='text-red-500'>*</span></label>
              {/* <input type="date" className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md' value={dob} onChange={(e) => setdob(e.target.value)} id='dob' /> */}
              {/* <DefaultDate className='w-full' onDateChange={handledobDateChange} /> */}
              {/* <div className='' onClick={handleClick}> */}
              <input type="date" className='cursor-pointer input  w-full py-3.5  px-4 bg-black outline-none rounded-xl' value={dob} onChange={handledobDateChange} name="" id="dob" />
              {/* </div> */}
            </div>


          </div>

          <div className='mb-5'>
            <label className='block text-sm font-bold mb-2' htmlFor='about'>About <span className='text-red-500'>*</span></label>
            <textarea className='input py-2 w-full h-48 px-4 bg-black rounded-xl outline-none' placeholder='Enter Bio...' value={about} onChange={handleAboutChange} id='about' />
          </div>


          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>
            <div>
              <label className='block text-sm font-bold mb-2 ' htmlFor='gender'>Gender <span className='text-red-500'>*</span></label>
              <select value={gender} onChange={(e) => setgender(e.target.value)} className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' id='gender'>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="female">Other</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='martial_status'>Martial Status <span className='text-red-500'>*</span></label>
              <select value={martial_status} onChange={(e) => setmartial_status(e.target.value)} className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' id='martial_status'>
                <option value="">Select Martial Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
                <option value="Domestic partnership">Domestic partnership</option>
                <option value="Civil union">Civil union</option>
                <option value="Cohabiting">Cohabiting</option>
                <option value="Annulled">Annulled</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* <input type="text" className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' placeholder='Enter Martial Status...' value={martial_status} onChange={(e) => setmartial_status(e.target.value)} id='martial_status' /> */}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>


          <div className='mb-5'>
            <label className='block text-sm font-bold mb-2' htmlFor='phone'>Phone Number <span className='text-red-500'>*</span></label>
            <input type="text" className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' placeholder='Enter Phone Number...' value={phone} onChange={(e) => setPhone(e.target.value)} id='phone' />
          </div>

          <div className='mb-5'>
            <label className='block text-sm font-bold mb-2' htmlFor='nic'>ID <span className='text-red-500'>*</span></label>
            <input type="text" className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' placeholder='Enter NIC (Without Dashes)...' value={nic} onChange={(e) => setnic(e.target.value)} id='nic' />
          </div>
          </div>

          <div className='mb-5'>
            <label className='block text-sm font-bold mb-2' htmlFor='nic'>Designation <span className='text-red-500'>*</span></label>
            <input type="text" className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' placeholder='Enter Designation...' value={designation} onChange={(e) => setdesignation(e.target.value)} id='designation' />
          </div>


          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>

            <div>
              <label className='block text-sm font-bold mb-2' htmlFor='religion'>Religion <span className='text-red-500'>*</span></label>
              <input type="text" className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' placeholder='Enter Religion...' value={religion} onChange={(e) => setreligion(e.target.value)} id='religion' />
            </div>

            <div >
              <label className='block text-sm font-bold mb-2 ' htmlFor='nationality'>Nationality <span className='text-red-500'>*</span></label>
              <select value={nationality} onChange={(e) => setnationality(e.target.value)} className='input py-3.5 px-4 bg-black rounded-xl w-full outline-none' id='nationality'>
                <option value="">Select Nationality</option>
                {nationalityData.map((item: any) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>




          </div>





          <div className='mt-8 flex flex-col space-y-6 md:space-y-0 md:flex-row space-x-0 md:space-x-4 justify-end'>
            {userData && userData?.role === 'hr' && filteredInfo[0]?.is_approve !== "approved" && (
              <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80 text-xs md:text-md  h-11 rounded-lg' disabled={filteredInfo[0]?.is_approve === "pending"} onClick={onClickApproveRequest} type="submit">{filteredInfo[0]?.is_approve === "pending" ? "Still in pending" : "Send Approve Request"}</Button>
            )}
            <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80 text-xs md:text-md h-11 rounded-lg' onClick={onSubmit} type="submit">Save Now & Next</Button>
          </div>

        </div>



      </div>):(<SpinnerLoader/>)}
      
    </div>
  )

}

export default UserInfo;
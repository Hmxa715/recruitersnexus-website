"use client"
import React, { useState } from 'react'
import { Button } from '@/components/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import bcryptjs from "bcryptjs";
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom';
import toast from 'react-hot-toast';

const ChangePassword = ({id,forgot_pass}:any) => {
    const [newPass, setnewPass] = useState("");
    const [confirmPass, setconfirmPass] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [check, setCheck] = useState("loading");
    const hashedForgotParamsCode = searchParams.get('hashedForgotParamsCode');

    //console.log("Hashed Forgot Params Code: ", hashedForgotParamsCode);
    
    // //console.log("hashedForgotCode: ", hashedForgotCode);
    // //console.log(hashedForgotCode + " ===== " + hashedForgotParamsCode);
    

    useEffect(() => {
      async function getData()
      {
        if(hashedForgotParamsCode !== null)
        {
        const validPassword = await bcryptjs.compare(
          forgot_pass,
          hashedForgotParamsCode
        );
        // alert("Check: " + validPassword)
        if(validPassword)
        {
        setCheck("true");
        }else {
          setCheck("false");
        }
        }
        
        
      }
      getData();
      
    }, [forgot_pass,hashedForgotParamsCode,check])
    
    

    async function onSubmit()
    {
        if(newPass !== confirmPass)
        {
            // alert("Password does not match");
            toast.error("Password does not match");
            return;
        }
        const res = await fetch(process.env.NEXT_PUBLIC_Backend_URL+"/api/password", {
            method:"PUT",
            body: JSON.stringify({
                password: newPass,
                user_id:id
            })
        })

        if(res.ok)
        {
        // alert("Password is successfully changed!");
        toast.success("Password is successfully changed!");
        const otpReg = Math.floor(100000 + Math.random() * 900000);
        const res = await fetch("/api/verify", {
          method: "PUT",
          body: JSON.stringify({forgot_pass:otpReg,user_id:id })
        });

        if(res.ok)
        {
          router.push("/login")
        }

        
        
        
        }
        return res;
    }

  return (
    <div>
      {forgot_pass && check === "true"?(
        <div className='flex w-full bg-black h-screen items-center justify-center'>
        <div className='flex text-white flex-col items-center shadow-xl rounded-lg w-[90%] h-[90%] md:h-[60%] md:w-[60%] space-y-5 p-10 justify-center bg-[#242E49]'>
      <h2  className='font-bold text-center'>Change Password</h2>
      <label className='font-bold text-center'>New Password</label>
      <input className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md text-black' value={newPass} onChange={(e)=> setnewPass(e.target.value)} type="password" placeholder='Enter new password...'  name="" id="newPass" />
      <label  className='font-bold text-center'>Confirm Password</label>
      <input className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md text-black' value={confirmPass} onChange={(e)=> setconfirmPass(e.target.value)} type="password" placeholder='Enter confirm password...'  name="" id="confirmPass" />
      <Button className='bg-red-400' onClick={onSubmit}>Submit</Button>
      </div>
    </div>

      ):forgot_pass && check === "false"?(<div className='flex w-full h-screen items-center justify-center'>
      <h1>THE PAGE CANT BE REACHED! SORRY!</h1>
    </div>):(<SkeletonLoaderCustom /> )}
    </div>
  )
}

export default ChangePassword
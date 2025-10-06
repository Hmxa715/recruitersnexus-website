"use client"
import React, { useState, useEffect } from 'react'
import { Button
 } from '@/components/Button';
import useUserData from '@/lib/db/userData';
import { verifyData } from '@/data/page-data';
import { useRouter } from 'next/navigation';
import bcryptjs from "bcryptjs";
import { userData,myDataHr } from '@/data/page-data';
import MainUsers from '@/lib/db/mainUsers';
import HrData from '@/lib/db/hrData';
import VerificationData from '@/lib/db/vertificationData';
import toast from 'react-hot-toast';




const FindForgot = () => {
  const router = useRouter();
  const {userData} = useUserData();
  const {verification} = VerificationData();
  // const [verification, setVerification] = useState([]);
  const {users} = MainUsers();
  // const [users, setUsers] = useState([]);
  const {hrTable} = HrData();
  // const [hrTable, setHrTable] = useState([]);

    const [email, setEmail] = useState("");

    const filteredVerification:verifyData[] = verification.filter((item:any)=>userData?.id === item?.user_id)


    



    async function onSubmit()
    {

      //Get data from users2 and compare email. on the basis of email, get userid then compare userid and get security code
      const filteredUsers:userData[] = users.filter((item:any)=> email === item?.email);
      const filteredHrTable:myDataHr[] = hrTable.filter((item:any)=> filteredUsers[0]?.id === item?.user_id)
      // const infoPersonal = filteredHrTable.filter((item:any)=> )
      const salt = await bcryptjs.genSalt(10);
    const otpReg = Math.floor(100000 + Math.random() * 900000);
    const hashedForgotPass = await bcryptjs.hash(otpReg.toString(), salt);

    const message = `<!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Noto+Serif" rel="stylesheet" type="text/css">
      <link href="https://fonts.googleapis.com/css2?family=Inter&amp;family=Work+Sans:wght@700&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
      <style>
        * {
          box-sizing: border-box;
        }
    
        body {
          margin: 0;
          padding: 0;
        }
    
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
    
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
    
        p {
          line-height: inherit
        }
    
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
    
        .image_block img+div {
          display: none;
        }
    
        @media (max-width:720px) {
          .mobile_hide {
            display: none;
          }
    
          .row-content {
            width: 100% !important;
          }
    
          .stack .column {
            width: 100%;
            display: block;
          }
    
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
    
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
    
          .row-2 .column-1 .block-1.heading_block h2 {
            font-size: 30px !important;
          }
        }
      </style>
    </head>
    
    <body style="background-color: #f7f7f7; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f7f7;">
        <tbody>
          <tr>
            <td>
              <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 700px; margin: 0 auto;" width="700">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <div class="spacer_block block-1" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #201f42; border-bottom: 0 solid #EFEEF4; border-left: 0 solid #EFEEF4; border-right: 0px solid #EFEEF4; border-top: 0 solid #EFEEF4; color: #000000; width: 700px; margin: 0 auto;" width="700">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:15px;padding-top:15px;text-align:center;width:100%;">
                                    <h2 style="margin: 0; color: #dcdef1; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 34px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 40.8px;">Security code for Password Reset</h2>
                                  </td>
                                </tr>
                              </table>
                              <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="color:#ffffff;direction:ltr;font-family:Inter, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
                                      <p style="margin: 0; margin-bottom: 0px;">Hi ${filteredHrTable[0]?.fname},</p>
                                      <p style="margin: 0;">This is your code for Password Reset:</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="button_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:15px;padding-top:30px;text-align:center;">
                                    <div class="alignment" align="center"><!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:58px;width:136px;v-text-anchor:middle;" arcsize="0%" strokeweight="0.75pt" strokecolor="#201F42" fillcolor="#ffffff">
    <w:anchorlock/>
    <v:textbox inset="0px,0px,0px,0px">
    <center style="color:#201f42; font-family:Georgia, serif; font-size:21px">
    <![endif]-->
                                      <div style="text-decoration:none;display:inline-block;color:#201f42;background-color:#ffffff;border-radius:0px;width:auto;border-top:1px solid #201F42;font-weight:400;border-right:1px solid #201F42;border-bottom:1px solid #201F42;border-left:1px solid #201F42;padding-top:5px;padding-bottom:5px;font-family:'Noto Serif', Georgia, serif;font-size:21px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:21px;display:inline-block;letter-spacing:normal;"><span style="word-break:break-word;"><strong><span class style="line-height: 42px;" data-mce-style>${otpReg}</span></strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                 <tr>
                                   <td class="pad">
                                     <div style="color:#ffffff;direction:ltr;font-family:Inter, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
                                      <p style="margin: 0; margin-bottom: 16px;"><br>Best regards,<br>Copyright © 2024 Recruiters Nexus, All rights reserved.</p>
																	<p style="margin: 0; margin-bottom: 16px;"><br>You are receiving this email because you opted in via our website.</p>
																	<p style="margin: 0;"><br>Our mailing address is:<br>Recruiters Nexus<br>Village Kanate </br> Distt. & Tehsil Mansehra <br/> KPK <br/>Pakistan<br/></p>
                                                                      <p style="margin: 0;">If you didn't send the code, <a href="https://www.recruitersnexus.com/contact" target="_blank">Contact us</a></p>

                                     </div>
                                   </td>
                                 </tr>
                               </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><!-- End -->
    </body>
    
    </html>`


    
  try {
    
    const res = await fetch("/api/verify", {
      method: "PUT",
      body: JSON.stringify({forgot_pass:otpReg,user_id:filteredUsers[0]?.id })
    });
    if(res.ok)
    {
      // alert("Code Resent on email!");
      toast.success("Code Resent on email!");
      try {
				
        // //console.log("Form Data: " , service,experience,certif,aoe);
        // setLoading(true);
        const res = await fetch("/api/mail",{
          method: 'POST',
          body: JSON.stringify({forgot_pass:otpReg,fname:filteredHrTable[0]?.fname,userEmail:filteredUsers[0]?.email,message:message}),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          
        })

        // router.push(`/verifyUser/${id}?hashedRegistrationCode=${hashedRegistrationCode}`);
        
        router.push(`/forgotPassword/${filteredUsers[0]?.id}?hashedRegistrationCode=${hashedForgotPass}`);
        return res;
        
      } catch (error) {
        //console.log(error);
        
      }
      
    }
  } catch (error) {
    console.error(error);
  }
    }


  return (
    <div className='h-screen bg-black text-white/60 w-full flex items-center justify-center flex-col'>
        
        <div className='bg-[#242E49]  w-3/4 h-3/4  md:w-1/2 md:h-1/2 justify-center shadow-xl rounded-lg p-10 flex flex-col items-center space-y-6'>
        <h2 className='text-white text-center text-lg md:text-2xl'>Please enter your email address and a security code will be sent on your email</h2>
        <input className='input py-2 px-4 bg-gray-300 rounded-lg shadow-md text-black' placeholder='Enter your email..' value={email} onChange={(e)=> setEmail(e.target.value)} type="text"   name="" id="email" />
        <Button onClick={onSubmit}>Submit</Button>
        </div>
    </div>
  )
}

export default FindForgot
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import useUserData from '@/lib/db/userData';
import moment from 'moment-timezone';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '@/components/SkeletonLoader';
import VerificationData from '@/lib/db/vertificationData';
import toast from 'react-hot-toast';
import SkeletonLoaderCustom from '@/components/SkeletonLoaderCustom';
import { v4 as uuidv4 } from 'uuid';

export default function Schedule({ hr_id, filterServices, allInterviews, filteredHr }: any) {
  const { userData, status } = useUserData();
  const [slot, setSlot] = useState<string | null>(null);
  const [user_id, setuserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);
  const router = useRouter();
  const { verification } = VerificationData();
  const [category, setCategory] = useState("");

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

    if (userData && userData?.role == 'hr') {
      // alert("No User Found!");
      toast.error("No User Found!");
      router.push("/dashboards");
    }


  }, [userData, status, router]);


  //console.log("params in client: " + hr_id);
  //console.log("User Data in client: " + userData?.id);

  useEffect(() => {
    if (userData) {
      setuserId(userData?.id);
    }

  }, [userData]);



  const handleRadioChange = (slot: string,category:string) => {
    setSlot(moment.utc(slot).format());
    setCategory(category);
  };

  //console.log("User ID: " + user_id);

  //console.log("All Interviews: ", allInterviews);
  //console.log("Slot: " + slot);
  //console.log("Comparison: ", slot === allInterviews[4]?.slot);



  //console.log("Interview Slot: ", allInterviews.map((item: any) => item.slot));
  //console.log("Services Slot: ", filterServices.map((item: any) => item.slot));
  //console.log("Filtered Interview + Services ", allInterviews.filter((item: any) => item.slot === "2024-02-15T13:15:00.000Z"));

  const formattedSlot = moment.utc(slot).format();


  //console.log("Formatted Slot: ", formattedSlot);
  
  const filteredInterviews = allInterviews?.filter((item: any) => { return item.is_confirmed === "unConfirmed" && item.slot === slot && item.hr_id === hr_id && item?.user_id === user_id });
  //console.log("Interviews Filtered: ", filteredInterviews);
  const filteredVerifications = verification?.filter((item: any) => userData?.id === item?.user_id);




  const handleSchedule = async () => {
    const UUID = uuidv4();
    //console.log("Formatted Slot: ", formattedSlot);
    try {
      const slotDate = slot ? new Date(slot) : null;
      if (!slotDate) {
        // alert("Invalid slot!");
        toast.error("Invalid slot!");
        return;
      }
      const currentDate = new Date();
      if (currentDate > slotDate) {
        // alert("Please Select Future Date!");
        toast.error("Please Select Future Date!");
        try {

          // //console.log("Slot: ", slot);
          // alert("Slot: " + slot);

          const data = await fetch("/api/getServices", {
            method: 'DELETE',
            body: JSON.stringify({ user_id: hr_id, slot: slot }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            },

          });
          // setDeletionStatus((prevStatus) => !prevStatus);
          // alert("Slot is expired!");
          toast.error("Slot is expired!");

          window.location.reload();
          return data.json();
          // return {"message":"deleted"}
        } catch (error) {
          //console.log(error);
        }
        return;
      }

      if (filteredInterviews.length > 0) {
        // alert("Sorry! Slot Request Already sent!");
        toast.error("Sorry! Slot Request Already sent!");
        return;
      }
      if (slot?.length === 0 || slot === null) {
        // alert("Please Select a slot!");
        toast.error("Please Select a slot!");
        return;
      }
      // //console.log("Form Data: " , service , slot, userData?.id);
      if(category === "mock"){
        setLoading(true);
      }
      else if(category === "job")
      {
        setLoadingJob(true);
      }
      
      const res = await fetch("/api/interview", {
        method: 'POST',
        body: JSON.stringify({id:UUID ,slot: formattedSlot, hr_id: hr_id, user_id: user_id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },

      })


      // alert("Schedule Request Send");
      toast.success("Schedule Request for Interview has been send!");

      // Email send API From here
      const subject = "Interview Schedule Request"

      const message = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
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

		@media (max-width:700px) {
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
		}
	</style>
</head>

<body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-2" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
													<table class="heading_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 58px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 87px;"><span class="tinyMce-placeholder">Interview Schedule</span></h1>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#e3e6ff;direction:ltr;font-family:Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:22px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:33px;">
																	<p style="margin: 0; margin-bottom: 16px;">Dear ${filteredHr[0]?.username},</p>
																	<p style="margin: 0; margin-bottom: 16px;">Greetings,<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; We are pleased to inform you that you have been enlisted to conduct a face-to-face interview of ${userData?.username} (Email: ${userData?.email}) around on ${formatDateTime(slot).date} at ${formatDateTime(slot).time}. The duration of interview will be 30 mins, approximately.</p>
																	<p style="margin: 0; margin-bottom: 16px;"><br>Please confirm your availability by clicking on following: link: https://www.recruitersnexus.com/notifications</p>
																	<p style="margin: 0; margin-bottom: 16px;"><br>Best regards,<br>Copyright © 2024 Recruiters Nexus, All rights reserved.</p>
																	<p style="margin: 0; margin-bottom: 16px;"><br>You are receiving this email because you opted in via our website.</p>
																	<p style="margin: 0;"><br>Our mailing address is:<br>Recruiters Nexus<br>Village Kanate </br> Distt. & Tehsil Mansehra <br/> KPK <br/> Pakistan.</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 25px; padding-right: 25px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-2" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
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
        const res = await fetch("/api/mail", {
          method: 'POST',
          body: JSON.stringify({ subject: subject, message: message, userEmail: filteredHr[0]?.email }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },

        })

        if (!res.ok) {
          toast.error("Error Sending Warning Email");
          return;
        }

        // toast.success("Interview Email Sent")
        window.location.reload();
      } catch (error) {
        //console.log("Error in sending warning mail!");

        //console.log(error);
      }



      return res;
    } catch (error) {
      //console.log(error);

    }

    // Make nodemailer config fire from here
    // Get user email through session
    // const userEmail = ""
    // const hrEmail = filterServices.map((item:any)=> item.email)  // hr email

    // Forward a mail to both of them, also delete the selected slot from the database, also attach meeting link
  };

  return (
    <div className='p-6 bg-[#F2F5F9] h-full  '>
      {userData && userData.role == 'user' || userData?.role == 'admin' && filteredVerifications[0]?.verified === "verified" ? (
        <div className=''>
          <div className='w-full mb-32 md:mb-0'>
            <span className='text-xl font-bold '>
              {filteredHr[0]?.username}  has slots :
            </span>
          </div>

          <div className='flex md:flex-row flex-col rounded-lg items-center justify-around w-full h-auto space-y-6 md:space-y-0'>
            <div className='p-6 shadow-xl border-1 bg-[#242E49] border-black rounded-lg'  >
              <h1 className='text-xl text-white font-bold mb-4'>Mock interview Slots:</h1>

              <div className='p-6 ' style={{ maxHeight: "150px", overflowY: "auto" }}>
                <ul className=''>
                  {filterServices?.filter((item: any) => item?.category === "mock").map((item: any) => (
                    <li className='bg-white py-2 px-3 flex items-center justify-center shadow-md rounded-lg mb-4' key={item.sid}>
                      <input
                        type="radio"
                        name="serviceRadio"
                        id={hr_id}
                        checked={slot === item.slot}
                        onChange={() => handleRadioChange(item.slot,item.category)}
                      />
                      {" "} <span className='ml-3 text-md'>{item?.service}</span> <span className='ml-4 text-sm bg-gray-200 px-2 py-1 rounded-full'>{formatDateTime(item.slot).date}, {formatDateTime(item.slot).time}</span>
                    </li>

                  ))}
                </ul>
              </div>
              <Button className='mt-6' disabled={loading} onClick={handleSchedule}>{`${loading ? "Submitting..." : "Schedule Now"}`}</Button>
            </div>

            <div className='w-full  md:hidden'>
              <hr className="my-8 border-t border-gray-300" />
            </div>


            <div className='p-6 shadow-xl border-1 bg-[#242E49] border-black rounded-lg'  >
              <h1 className='text-xl font-bold mb-4 text-white'>Job interview Slots:</h1>

              
                <div className='p-6 scrollbar scrollbar-thumb-[#242E49] scrollbar-track-gray-[#242E49]' style={{ maxHeight: "150px", overflowY: "auto" }}>
                  <ul className=''>
                    {filterServices?.filter((item: any) => item.category === "job").map((item: any) => (
                      <li className='bg-white py-2 px-3 flex items-center justify-center shadow-md rounded-lg mb-4' key={item.sid}>
                        <input
                          type="radio"
                          name="serviceRadio"
                          id={hr_id}
                          checked={slot === item.slot}
                          onChange={() => handleRadioChange(item.slot,item.category)}
                        />
                        {" "} <span className='ml-3 text-md'>{item?.service}</span> <span className='ml-4 text-sm bg-gray-200 px-2 py-1 rounded-full'>{formatDateTime(item.slot).date}, {formatDateTime(item.slot).time}</span>
                      </li>

                    ))}
                  </ul>
                </div>
              
              <Button className='mt-6' disabled={loadingJob} onClick={handleSchedule}>{`${loadingJob ? "Submitting..." : "Schedule Now"}`}</Button>

            </div>
          </div>
        </div>


      ) : (<SkeletonLoaderCustom />)}

    </div>
  );
}

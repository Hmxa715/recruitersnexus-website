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
import { Plus, Video } from 'lucide-react';
import JobData from '@/lib/db/jobData';
import SkillModal from './SkillModal';
import jobSkillsData from '@/lib/db/jobSkillsData';
import { X } from 'lucide-react';

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Example dashboard app built using the components.",
};

interface UserReportsVisibility {
    [key: string]: boolean;
}


const JobModal = ({ onClose }: { onClose: () => void }) => {
    const [title, setTitle] = useState("");
    const [salary_start, setSalary_start] = useState(0);
    const [salary_end, setSalary_end] = useState(0);
    const [description, setDescription] = useState("");
    const { userData } = useUserData();

    const salaryStartOptions = [
        { value: 0, label: '$0' },
        { value: 1000, label: '$1000' },
        { value: 5000, label: '$5000' },
        { value: 10000, label: '$10,000' },
        { value: 15000, label: '$15,000' },
        { value: 20000, label: '$20,000' },
        { value: 25000, label: '$25,000' },
        { value: 30000, label: '$30,000' },
        { value: 35000, label: '$35,000' },
        { value: 40000, label: '$40,000' },
        { value: 45000, label: '$45,000' },
        { value: 50000, label: '$50,000' },
        { value: 55000, label: '$55,000' },
        { value: 60000, label: '$60,000' },
        { value: 65000, label: '$65,000' },
        { value: 70000, label: '$70,000' },
        { value: 75000, label: '$75,000' },
        { value: 80000, label: '$80,000' },
        { value: 85000, label: '$85,000' },
        { value: 90000, label: '$90,000' },
        { value: 95000, label: '$95,000' },
        { value: 100000, label: '$100,000' },
        { value: 150000, label: '$150,000' },
        { value: 200000, label: '$200,000' },
        // Add more options as needed
    ];

    const salaryEndOptions = [
        { value: 2000, label: '$2000' },
        { value: 6000, label: '$6000' },
        { value: 12000, label: '$12,000' },
        { value: 15000, label: '$15,000' },
        { value: 20000, label: '$20,000' },
        { value: 25000, label: '$25,000' },
        { value: 30000, label: '$30,000' },
        { value: 35000, label: '$35,000' },
        { value: 40000, label: '$40,000' },
        { value: 45000, label: '$45,000' },
        { value: 50000, label: '$50,000' },
        { value: 55000, label: '$55,000' },
        { value: 60000, label: '$60,000' },
        { value: 65000, label: '$65,000' },
        { value: 70000, label: '$70,000' },
        { value: 75000, label: '$75,000' },
        { value: 80000, label: '$80,000' },
        { value: 85000, label: '$85,000' },
        { value: 90000, label: '$90,000' },
        { value: 95000, label: '$95,000' },
        { value: 100000, label: '$100,000' },
        { value: 150000, label: '$150,000' },
        { value: 200000, label: '$200,000' },
        // Add more options as needed
    ];

    const handleSalaryStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSalary_start(parseInt(e.target.value));
    };

    const handleSalaryEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSalary_end(parseInt(e.target.value));
    };

    const handleSubmit = async () => {
        try {
            const data = await fetch("/api/job", {
                method: 'POST',
                body: JSON.stringify({ title: title, salary_start: salary_start, salary_end: salary_end, description: description, is_approved: "approved", user_id: userData?.id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });
            // alert("Mark as Conducted!");
            if (!data.ok) {
                toast.error("Error submitting job");
                return;
            }
            toast.success("Job has been posted and send for approval!");
            setTitle("");
            setSalary_start(0);
            setSalary_end(0);
            setDescription("");
            onClose();

        } catch (error) {
            // //console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
            <div className="bg-white p-8 rounded-lg max-w-md relative z-20">
                <div className='flex justify-center items-center flex-col space-y-6'>
                    <h2 className="text-xl font-semibold mb-4">Add Job Posting</h2>
                    <span className='font-bold self-start'>Job Title: </span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                    <span className='font-bold self-start'>Starting Salary: </span>
                    <select value={salary_start} onChange={handleSalaryStartChange}>
                        {salaryStartOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <span className='font-bold self-start'>Ending Salary: </span>
                    <select value={salary_end} onChange={handleSalaryEndChange}>
                        {salaryEndOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <span className='font-bold self-start'>Job Description</span>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};




function DashboardAdmin() {
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [skillId, setskillId] = useState(0);
    const { userData } = useUserData();
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

    const openJobModal = () => {
        setShowJobModal(true);
    };

    const closeJobModal = () => {
        setShowJobModal(false);
    };

    const toggleReports = (userId: string) => {
        setIsReportsVisible(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    // Function to open the skill modal
    const openSkillModal = (id: any) => {
        setShowSkillModal(true);
        setskillId(id);

    };

    // Function to close the skill modal
    const closeSkillModal = () => {
        setShowSkillModal(false);
    };

    // Function to handle submission of skill data
    const handleSkillSubmit = async (skill: string) => {
        try {
            const res = await fetch("/api/job_skill", {
                method: 'POST',
                body: JSON.stringify({ skill: skill, user_id: skillId }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            if (!res.ok) {
                // alert("Error submitting skills");
                toast.error("Error submitting skills");
                return;
            }
            //   setTimestamp(Date.now());

            //   alert("Skill added successfully");
            toast.success("Skill Submitted");
            return res;
        }
        catch (error) {
            // //console.log(error);
        }
    };




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


    // //console.log("Time Slots: ", interviews);

    const totalInterviews = interviews?.filter((item: any) => item.is_confirmed === "confirmed");
    // //console.log("Total Interviews: ", totalInterviews);
    const conductedInterviews = totalInterviews?.filter((item: any) => item.is_conducted === "conducted").reverse();
    // //console.log("Conducted Interviews: ", conductedInterviews);
    const upcomingInterviews = totalInterviews.length - conductedInterviews.length;
    // //console.log("Upcoming Interviews: ", upcomingInterviews);
    const upcomingSchedules = totalInterviews?.filter((item: any) => item.is_conducted === "notConducted").reverse();
    // //console.log("Upcoming Schedules: ", upcomingSchedules);
    const filteredHrData = hrTable?.filter((item: any) => item.user_id === userData?.id);

    const userNotification = users?.filter((item: any) =>
        interviews.map((interview: any) => interview.user_id).includes(item.id));
    // //console.log("UserNotification: ", userNotification);


    async function onClickDeleteSkill(id: any) {
        try {

            // //console.log("Slot: ", slot);
            // alert("Slot: " + slot);

            const data = await fetch("/api/job_skill", {
                method: 'DELETE',
                body: JSON.stringify({ id: id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });

            toast.success("Skill Deleted");

            return data.json();
            // return {"message":"deleted"}
        } catch (error) {
            // //console.log(error);
        }
    }




    async function onClickMark(user_id: any, slot: any) {
        try {
            setLoading(true);
            const data = await fetch("/api/interview", {
                method: 'PUT',
                body: JSON.stringify({ hr_id: userData?.id, user_id: user_id, slot: slot, is_conducted: "conducted" }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });

            toast.success("Interview is marked as Conducted");
        } catch (error) {
            // //console.log(error);
        } finally {
            setLoading(false);
        }
    }

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
            // //console.log(error);

        }

    }

    async function onClickDelete(user_id: any, slot: any) {
        try {
            setReject(true);
            const data = await fetch("/api/interview", {
                method: 'DELETE',
                body: JSON.stringify({ hr_id: userData?.id, user_id: user_id, slot: slot, is_confirmed: "confirmed" }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });
            // alert("Interview Deleted!");
            toast.success("Interview Deleted!");
            return data.json();
        } catch (error) {
            // //console.log(error);
        } finally {
            setReject(false);

        }

    }

    async function onClickFeedback(user_id: any, slot: any) {
        // alert("Shifting to Feedback Page!");
        toast.success("Shifting to Feedback Page");
        router.push(`/feedback/hr/${user_id}?slot=${slot}`);
    }


    async function onClickApproveJob(id: any, user_id: any, is_approved: string) {
        try {
            const res = await fetch("/api/job", {
                method: 'PUT',
                body: JSON.stringify({ id: id, is_approved: is_approved, user_id: user_id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            })

            if (!res.ok) {
                // alert("Error submitting data")
                toast.error("Error submitting data");
                return;
            }

            if (is_approved === "approved") {
                toast.success("Account is approved")
                return;
            }
            else if (is_approved === "unapproved") {
                toast.success("Account is not approved")
                return;
            }
        } catch (error) {
            // //console.log(error);

        }
    }


    async function onClickDeleteJob(id: any, user_id: any) {
        try {
            setReject(true);
            const data = await fetch("/api/job", {
                method: 'DELETE',
                body: JSON.stringify({ id: id, user_id: user_id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            });

            toast.success("Job Deleted!");
            return data.json();
        } catch (error) {
            // //console.log(error);
        }
    }

    async function onClickApprove(user_id: any, is_approve: any) {
        try {
            const res = await fetch("/api/hr2", {
                method: 'PUT',
                body: JSON.stringify({ is_approve: is_approve, user_id: user_id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            })

            if (!res.ok) {
                // alert("Error submitting data")
                toast.error("Error submitting data");
                return;
            }

            if (is_approve === "approved") {
                toast.success("Account is approved")
                return;
            }
            else if (is_approve === "unapproved") {
                toast.success("Account is not approved")
                return;
            }
        } catch (error) {
            // //console.log(error);

        }
    }





    async function onClickRoute(id: any) {
        router.push(`/profile?id=${id}`)
    }


    async function onClickSendWarning(userEmail: any, totalReports: any, username: any, userReports: any) {
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
                                                        <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                                            <div class="spacer_block block-2" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                                                            <table class="heading_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 58px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 87px;"><span class="tinyMce-placeholder">WARNING!</span></h1>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div style="color:#e3e6ff;direction:ltr;font-family:Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:22px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:33px;">
                                                                            <p style="margin: 0; margin-bottom: 16px;">Dear ${username},&nbsp;</p>
                                                                            <p style="margin: 0;">There has been ${totalReports} reports against you. Please try to maintain discipline and be in the meeting on time. Thank you!</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="button_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="alignment" align="center"><!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:72px;width:315px;v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#ffffff">
        <w:anchorlock/>
        <v:textbox inset="0px,0px,0px,0px">
        <center style="color:#242e49; font-family:Arial, sans-serif; font-size:21px">
        <![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#242e49;background-color:#ffffff;border-radius:0px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:21px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:45px;padding-right:45px;font-size:21px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 42px;">Reasons for the reports:</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-6" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div><!--[if mso]><style>#list-r0c0m6 ul{ margin: 0 !important; padding: 0 !important; } #list-r0c0m6 ul li{ mso-special-format: bullet; }#list-r0c0m6 .levelOne li { margin-top: 0 !important; } #list-r0c0m6 .levelOne { margin-left: -20px !important; }#list-r0c0m6 .levelTwo li { margin-top: 0 !important; } #list-r0c0m6 .levelTwo { margin-left: 10px !important; }#list-r0c0m6 .levelThree li { margin-top: 0 !important; } #list-r0c0m6 .levelThree { margin-left: 40px !important; }#list-r0c0m6 .levelFour li { margin-top: 0 !important; } #list-r0c0m6 .levelFour { margin-left: 70px !important; }#list-r0c0m6 .levelFive li { margin-top: 0 !important; } #list-r0c0m6 .levelFive { margin-left: 100px !important; }#list-r0c0m6 .levelSix li { margin-top: 0 !important; } #list-r0c0m6 .levelSix { margin-left: 130px !important; }</style><![endif]-->
                                                            <table class="list_block block-7" id="list-r0c0m6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="levelOne" style="margin-left: 0;">
                                                                            <ul class="leftList" start="1" style="margin-top: 0; margin-bottom: 0; padding: 0; padding-left: 20px; font-weight: 400; text-align: left; color: #101112; direction: ltr; font-family: Nunito,Arial,Helvetica Neue,Helvetica,sans-serif; font-size: 16px; letter-spacing: 0; line-height: 120%; mso-line-height-alt: 19.2px; list-style-type: disc;">
                                                                                ${userReports?.map((item: any) => (
            `<li style="margin-bottom: 0; text-align: left;"><span style="color: #ffffff;">${item.reason}</span></li>`))
            }
                                                                            </ul>
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
                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #242e49; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-left: 25px; padding-right: 25px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div style="color:#101112;direction:ltr;font-family:Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                            <p style="margin: 0;"><span style="color: #ffffff;"><strong>Note</strong>: Your account will be terminated incase you get more than 3 reports.</span></p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-2" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                                                            <div class="spacer_block block-3" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
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

        const subject = `Warning, You have been reported by a candidate`
        try {
            const res = await fetch("/api/mail", {
                method: 'POST',
                body: JSON.stringify({ subject: subject, message: message, userEmail: userEmail }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            })

            if (!res.ok) {
                toast.error("Error Sending Warning Email");
                return;
            }

            //   toast.success("Warning Email Sent")
        } catch (error) {
            // //console.log("Error in sending warning mail!");

            // //console.log(error);
        }
    }


    return (
        <div className='bg-black font-nunito'>


            {/* <NavBar /> */}


            <div className="flex-1 space-y-4 p-4 pt-6 mt-12">
                <div className={`${userData ? "flex" : "hidden"} flex-col space-y-10`}>
                    {/* <h1 className='text-4xl sm:text-6xl'>{filteredHrData[0]?.fname + " " + filteredHrData[0]?.lname.charAt(0) + "."}</h1> */}

                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                </div>
                <div className="flex items-center justify-between space-y-2">
                    {/* <div className="flex items-center space-x-2">
                  <CalendarDateRangePicker />
                  <Button>Download</Button>
                </div> */}
                </div>
                <Tabs defaultValue="overview" className="space-y-8 md:space-y-4 ">
                    {/* <TabsList className='flex flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-between md:justify-start'> */}
                        {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}

                        {/* <TabsTrigger value="all_accounts" >
                            All accounts
                        </TabsTrigger> */}

                        {/* <TabsTrigger value="accounts" >
                            Unverified Accounts
                        </TabsTrigger> */}
                        {/* <TabsTrigger value="interviews" >
                            Interviews
                        </TabsTrigger> */}

                        {/* <TabsTrigger value="approve" >
                            Accounts Approval
                        </TabsTrigger> */}

                        {/* <TabsTrigger value="reports" >
                            Account reports
                        </TabsTrigger> */}

                        {/* <TabsTrigger value="job" >
                            Job Postings List
                        </TabsTrigger> */}

                    {/* </TabsList> */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">

                            <Card className='rounded-b-none md:rounded-md md:rounded-r-none flex flex-row justify-around'>
                <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{totalInterviews?.length}</div>
                  </CardTitle>
                  
                </CardHeader>
                <CardContent className='flex flex-row w-full items-center '>
                  {/* <div className="text-2xl font-bold">{totalInterviews?.length}</div> */}
                    <div>Total Interviews</div>
                  
                  {/* <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>


              <Card className='rounded-none flex flex-row justify-around'>
              <div>
                <CardHeader className="flex flex-row  items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{conductedInterviews?.length}</div>

                  </CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <div>Completed Interviews</div>
                  {/* <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>


              <Card className='rounded-t-none md:rounded-tr-xl md:rounded-l-none flex flex-row justify-around'>
                <div>
                <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-2xl font-bold">{upcomingSchedules?.filter((interview: any) => { 
                             
                             const currentTime = new Date();
                             const slotTime = new Date(interview.slot);
                             const condition2 = slotTime.getTime() > currentTime.getTime();

                             return condition2;
                           }).length}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>Upcoming Interviews</div>
                  {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p> */}
                </CardContent>
                </div>
                <div className='bg-[#ECF2FF] rounded-full p-4 self-center'>
                    <Video size={20} color='#4765FF' fill='#4765FF' className=' ' />
                  </div>
              </Card>

              
              {/* <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card> */}


                        </div>
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                            {/* <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <Overview />
                                </CardContent>
                            </Card> */}
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Upcoming Schedules</CardTitle>
                                    
                                </CardHeader>

                                <div className='max-h-[350px]  overflow-y-auto'>
                                    <CardContent>

                                        <div className="space-y-8">
                                        <div className={`lg:grid md:grid-cols-4 w-full hidden  justify-around border-b-2 border-[#E6E9F4] pb-2  text-[#6D6D6D] `}>
                                                        <h2 className='text-base'>Name</h2>
                                                        <h2 className='text-base'>Email</h2>
                                                        <h2 className='text-base'>Date</h2>
                                                        <h2 className='text-base'>Time</h2>
                                                    </div>
                                            {userNotification.map((user: any) => (

                                                <div key={user.id} className="">
                                                    
                                                    {upcomingSchedules.
                                                        filter((interview: any) => { 
                                                            const condition1 = interview.user_id === user.id;
                              
                                                            const currentTime = new Date();
                                                            const slotTime = new Date(interview.slot);
                                                            const condition2 = slotTime.getTime() > currentTime.getTime();
                              
                                                            return condition1 && condition2;
                                                          })
                                                        .map((interview: any, index: number) => (
                                                                <div key={interview.id} className={`grid grid-cols-4 my-8 items-center justify-around lg:pt-0 pt-9 lg:border-t-0 border-t-2 pb-6 lg:border-b-2 border-solid border-[#E6E9F4]`}>




                                                                    <div className='flex flex-row space-x-4 items-center w-[300px]'>

                                                                        <Avatar className="h-9 w-9 md:w-12 md:h-12">
                                                                            <AvatarImage src={user?.image} />
                                                                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                                                            <AvatarFallback>OM</AvatarFallback>
                                                                        </Avatar>


                                                                        <div className="ml-4 space-y-1">
                                                                            <p className="md:text-sm lg:text-base font-bold lg:font-normal leading-none">{user.username}</p>
                                                                            <p className="text-sm lg:hidden text-muted-foreground">{user.email}</p>

                                                                            <div className=' flex lg:hidden text-xs'>
                                                                                <p className='text-xs'>
                                                                                    Date: {formatDateTime(interview.slot).date}
                                                                                    <br />
                                                                                    Time: {formatDateTime(interview.slot).time}
                                                                                </p>
                                                                            </div>
                                                                        </div>


                                                                    </div>

                                                                    <div className='font-normal md:text-sm lg:text-base hidden lg:block '><p className="md:text-sm lg:text-base font-normal">{user.email}</p></div>


                                                                    <div className=" font-normal md:text-sm lg:text-base hidden lg:block">{formatDateTime(interview.slot).date}
                                                                    </div>

                                                                    <div className="font-normal md:text-sm lg:text-base hidden lg:block">{formatDateTime(interview.slot).time}</div>


                                                                </div>
                                                        ))}
                                                </div>
                                            ))}
                                        </div>

                                        {/* <RecentSales upcomingInterviews={upcomingInterviews} userNotification={userNotification} /> */}
                                    </CardContent>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* All accounts Section */}

                    <TabsContent value="all_accounts" className="">
                        <div>
                            <h1 className="font-bold text-2xl mb-4">All Accounts: </h1>
                            {users.map((user: any) => (
                                <div key={user.id} className="">
                                    {verification
                                        .filter((verify: any) => verify.user_id === user.id && user.role != 'admin')
                                        .map((item: any, index: number) => (

                                            <div key={item.id} className={`flex my-8 items-center justify-around bg-white p-4 shadow-md rounded-lg `}>
                                                <div >
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user?.image} />

                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-4 space-y-1 flex-grow">
                                                    <p className="text-sm font-medium leading-none">{user.username + " (" + user.role + ")"}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    <p>{item.verified}</p>
                                                    <div className="ml-auto flex md:hidden text-xs">Date: {formatDateTime(user.createdAt).date}
                                                        <br />
                                                        Time: {formatDateTime(user.createdAt).time}
                                                    </div>

                                                    <div className='flex flex-col  md:hidden flex-grow items-start space-y-6 '>
                                                        <Button onClick={() => onClickRoute(user.id)}>View Profile</Button>

                                                    </div>


                                                </div>


                                                <div className="ml-auto font-medium text-sm hidden md:block">Date: {formatDateTime(user.createdAt).date}
                                                    <br />
                                                    Time: {formatDateTime(user.createdAt).time}
                                                </div>


                                                <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                    <Button onClick={() => onClickRoute(user.id)}>View Profile</Button>
                                                    {/* <Button onClick={()=>onClickDeleteAccount(user.id)}>Delete Account</Button> */}
                                                </div>
                                            </div>
                                        ))}
                                </div>

                            ))}
                        </div>
                    </TabsContent>





                    {/* Unverified Section */}

                    <TabsContent value="accounts" className="">
                        <div className='bg-black'>
                            <h1 className="font-bold text-2xl mb-4">Unverified Accounts List: </h1>
                            {users.map((user: any) => (
                                <div key={user.id} className="bg-black">
                                    {verification
                                        .filter((verify: any) => verify.user_id === user.id && verify.verified === "unverified")
                                        .map((item: any, index: number) => (

                                            <div key={item.id} className={`flex my-8 items-center justify-around bg-white p-4 shadow-md rounded-lg `}>
                                                <div >
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user?.image} />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>

                                                    <div className="ml-auto flex md:hidden text-xs">Date: {formatDateTime(user.createdAt).date}
                                                        <br />
                                                        Time: {formatDateTime(user.createdAt).time}
                                                    </div>

                                                    <div className='flex md:hidden flex-grow items-start space-x-6'>
                                                        <Button onClick={() => onClickDeleteAccount(user.id)}>Delete Account</Button>
                                                    </div>

                                                </div>


                                                <div className="font-medium text-sm self-center hidden md:block">Date: {formatDateTime(user.createdAt).date}
                                                    <br />
                                                    Time: {formatDateTime(user.createdAt).time}
                                                </div>


                                                <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                    <Button onClick={() => onClickDeleteAccount(user.id)}>Delete Account</Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                            ))}
                        </div>
                    </TabsContent>

                    {/* Interview Tab */}
                    <TabsContent value="interviews" className="">
                        <div>
                            <h1 className="font-bold text-2xl mb-4">Interviews</h1>
                            <h2 className='font-bold'>Not Conducted Interviews</h2>
                            <div>
                                {/* NOT CONDUCTED INTERVIEWS */}
                                {userNotification?.map((user: any) => (
                                    <div className='' key={user.id}>
                                        {upcomingSchedules?.filter((interview: any) => interview.user_id === user.id)
                                            .map((item: any) => {
                                                // Parse the slot string into a Date object
                                                const slotDate = new Date(item.slot);
                                                // Calculate the difference between the slot time and the current time in milliseconds
                                                const timeDifference = slotDate.getTime() - Date.now();
                                                // Check if the time difference is less than or equal to 5 minutes or if the slot time has passed
                                                if (timeDifference <= 5 * 60 * 1000 || timeDifference <= 0) {
                                                    // If the condition is met, display the item
                                                    return (
                                                        <div key={item.id} className={`flex w-full justify-between bg-white p-4 shadow-md rounded-lg my-8 items-center  `}>


                                                            <Avatar className="h-9 w-9">
                                                                <AvatarImage src={user.image} />
                                                                <AvatarFallback>OM</AvatarFallback>
                                                            </Avatar>


                                                            <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                                                                <p className="text-sm font-medium leading-none">{user.username}</p>
                                                                <p className="text-sm text-muted-foreground">{user.email}</p>

                                                                <div className='ml-auto flex md:hidden text-xs'>
                                                                    <p className='text-xs'>
                                                                        Date: {formatDateTime(item?.slot).date}
                                                                        <br />
                                                                        Time: {formatDateTime(item?.slot).time}
                                                                    </p>
                                                                </div>

                                                                <div className='flex md:hidden flex-grow items-start space-x-4'>
                                                                    {/* <Button>Join</Button> */}
                                                                    <Button className='text-xs' onClick={() => onClickMark(item.user_id, item.slot)}>Mark as Conducted</Button>
                                                                    <Button className='text-xs' onClick={() => onClickDelete(item.user_id, item.slot)}>Delete</Button>
                                                                </div>

                                                            </div>

                                                            <div className="font-medium text-sm self-center hidden md:block">
                                                                <span> Date: {formatDateTime(item.slot).date} </span>
                                                                <br />
                                                                <span> Time: {formatDateTime(item.slot).time}</span>
                                                            </div>

                                                            <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                                {/* <Button>Join</Button> */}
                                                                <Button onClick={() => onClickMark(item.user_id, item.slot)}>Mark as Conducted</Button>
                                                                <Button onClick={() => onClickDelete(item.user_id, item.slot)}>Delete</Button>
                                                            </div>
                                                        </div>

                                                    );
                                                }
                                            })}
                                    </div>
                                ))}
                            </div>
                            <hr className="my-8 border-t border-gray-300" /> {/* Horizontal line separating the sections */}
                            <h2 className='font-bold'>Conducted Interviews</h2>
                            <div className='' style={{ maxHeight: "400px", overflowY: "auto" }}> {/* Set max height and allow scrolling */}
                                {/* CONDUCTED INTERVIEWS */}
                                {userNotification?.map((user: any) => (
                                    <div key={user.id}>
                                        {conductedInterviews?.filter((interview: any) => interview.user_id === user.id)
                                            .map((item: any) => (
                                                <div key={item.id} className={`flex w-full justify-between bg-white p-4 shadow-md rounded-lg my-8 items-center `}>
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user?.image} />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                                                        <p className="text-sm font-medium leading-none">{user.username}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>

                                                        <div className='ml-auto flex md:hidden text-xs'>
                                                            <p className='text-xs'>
                                                                Date: {formatDateTime(item?.slot).date}
                                                                <br />
                                                                Time: {formatDateTime(item?.slot).time}
                                                            </p>
                                                        </div>

                                                        <div className='flex space-x-6 flex-grow justify-start md:hidden'>
                                                            <Button onClick={() => onClickFeedback(item.user_id, item.slot)}>Feedback</Button>
                                                            {/* <Button>Edit Feedback</Button> */}
                                                            {/* <Button>Delete</Button> */}
                                                        </div>



                                                    </div>

                                                    <div className="ml-auto font-medium text-sm hidden md:block">
                                                        <span>Date: {formatDateTime(item.slot).date}</span>
                                                        <br />
                                                        <span>Time: {formatDateTime(item.slot).time}</span></div>


                                                    <div className='hidden space-x-6 flex-grow justify-end md:flex'>
                                                        <Button onClick={() => onClickFeedback(item.user_id, item.slot)}>Feedback</Button>
                                                        {/* <Button>Edit Feedback</Button> */}
                                                        {/* <Button>Delete</Button> */}
                                                    </div>

                                                </div>


                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>



                    {/* Accounts Approval Request */}

                    <TabsContent value="approve" className="">
                        <div>
                            <h1 className="font-bold text-2xl mb-4">Account Approval List: </h1>
                            {users.map((user: any) => (
                                <div key={user.id} className="">
                                    {hrTable
                                        .filter((info: any) => info.user_id === user.id && info.is_approve === "pending" && user.role === 'hr')
                                        .map((item: any, index: number) => (

                                            <div key={item.id} className={`flex my-8 items-center justify-around bg-white p-4 shadow-md rounded-lg `}>
                                                <div >
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user.image} />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-4 space-y-4  md:space-y-1 flex-grow">
                                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>

                                                    <div className="ml-auto flex md:hidden text-xs">Date: {formatDateTime(user.createdAt).date}
                                                        <br />
                                                        Time: {formatDateTime(user.createdAt).time}
                                                    </div>

                                                    <div className='flex flex-col  md:hidden flex-grow items-start space-y-6'>

                                                        <div className='flex space-x-6'>
                                                            <div >
                                                                <Button className='text-xs' onClick={() => onClickRoute(user.id)}>View Profile</Button>
                                                            </div>

                                                            <div >
                                                                <Button className='text-xs' onClick={() => onClickApprove(user.id, "approved")}>Approve Profile</Button>
                                                            </div>
                                                        </div>

                                                        <div className='flex space-x-6'>
                                                            <Button className='text-xs' onClick={() => onClickApprove(user.id, "unapproved")}>Decline Approval</Button>
                                                        </div>
                                                    </div>


                                                </div>


                                                <div className="font-medium text-sm self-center hidden md:block">Date: {formatDateTime(user.createdAt).date}
                                                    <br />
                                                    Time: {formatDateTime(user.createdAt).time}
                                                </div>


                                                <div className='hidden md:flex space-x-6 flex-grow justify-end '>
                                                    <Button onClick={() => onClickRoute(user.id)}>View Profile</Button>
                                                </div>

                                                <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                    <Button onClick={() => onClickApprove(user.id, "approved")}>Approve Profile</Button>
                                                </div>

                                                <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                    <Button onClick={() => onClickApprove(user.id, "unapproved")}>Decline Approval</Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                            ))}
                        </div>
                    </TabsContent>


                    {/* Account reports */}



                    <TabsContent value="reports" className="">
                        <div>
                            <h1 className="font-bold text-2xl mb-4">Reported Accounts List: </h1>
                            {users.map((user: any) => {
                                const userReports = reports.filter((report: any) => report.user_id === user.id);
                                if (userReports.length === 0) return null;
                                return (
                                    <div key={user.id} className="border bg-white p-4 shadow-md rounded-lg mb-4">
                                        <div onClick={() => toggleReports(user.id)} className="cursor-pointer">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className='ml-4 space-y-4  md:space-y-1 flex-grow'>
                                                    <h2 className="text-lg font-medium">{user.username} {" ("}{user.role}{") "}</h2>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>

                                                    <div className='md:hidden flex text-xs items-center space-x-6'>
                                                        <Button className='flex space-x-6 flex-grow justify-end' onClick={(e) => { e.stopPropagation(); onClickSendWarning(user.email, userReports.length, user.username, userReports); }}>Send Warning</Button>
                                                        <Button className='flex space-x-6 flex-grow justify-end' onClick={(e) => { e.stopPropagation(); onClickRoute(user.id); }}>Block Account</Button>
                                                    </div>

                                                </div>
                                                <div className='md:flex hidden items-center space-x-6'>
                                                    <Button className='flex space-x-6 flex-grow justify-end' onClick={(e) => { e.stopPropagation(); onClickSendWarning(user.email, userReports.length, user.username, userReports); }}>Send Warning</Button>
                                                    <Button className='flex space-x-6 flex-grow justify-end' onClick={(e) => { e.stopPropagation(); onClickRoute(user.id); }}>Block Account</Button>
                                                </div>
                                            </div>
                                        </div>
                                        {isReportsVisible[user.id] && (
                                            <div>
                                                <h3>Total Reports: {userReports.length}</h3>
                                                <div>
                                                    {userReports.map((report: any, index: number) => (
                                                        <div key={report.id} className="border rounded-lg p-2 my-2">
                                                            <p>Reason: {report.reason}</p>
                                                            {/* You can add additional report details here if needed */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>


                    {/* Job Posting */}

                    <TabsContent value="job" className="">
                        <div>
                            <div className='w-full flex justify-between '>
                                <h1 className="font-bold text-2xl mb-4">Job Posting List: </h1>
                                <button className='hover:text-green-400 ' onClick={openJobModal}><Plus /></button>
                            </div>
                            {users.map((user: any) => (
                                <div key={user.id} className="">
                                    {jobs
                                        .filter((job: any) => job.user_id === user.id)
                                        .map((item: any, index: number) => (

                                            <div key={item.id} className={`flex my-8 items-center justify-around bg-white p-4 shadow-md rounded-lg `}>

                                                <div className="ml-4 space-y-4  md:space-y-1 flex-grow w-4/5 md:w-2/5">

                                                    <div className='flex flex-col space-y-4 '>
                                                        <h1 className="text-lg font-bold leading-none">{item.title}</h1>
                                                        <p className="text-sm text-muted-foreground w-4/5 md:w-2/5">{item.description}</p>
                                                        <div className='flex flex-row space-x-4'>
                                                            {jobSkill?.filter((skill: any) => skill.user_id === item.id).map((item: any) => (
                                                                <div key={item?.sid} className='flex flex-row space-x-4'>

                                                                    <div className='text-sm bg-black py-1.5 px-2 rounded-lg flex w-full relative'>
                                                                        <div className='flex w-full justify-end'>
                                                                            <button onClick={() => onClickDeleteSkill(item.sid)}><X className="w-2 cursor-pointer hover:text-red-500 h-2 flex absolute top-0 right-0  mr-1 mt-1 " /></button>
                                                                        </div>
                                                                        <div>
                                                                            <span>{item?.skill}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>


                                                    <div className='flex text-sm md:hidden space-x-6'>
                                                        <p className='text-xs'><span className='font-bold'>Salary:</span> {item.salary_start}$ - {item.salary_end}$</p>
                                                        <p className='text-xs'><span className='font-bold'>Job Status:</span> {item.is_approved}</p>
                                                    </div>

                                                    <div className='flex space-y-4 justify-start md:hidden text-xs flex-col'>

                                                        <div className='flex space-x-6 '>
                                                            <div >
                                                                <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "approved")}>Approve Job</Button>
                                                            </div>

                                                            <div className='flex space-x-6'>
                                                                <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "unapproved")}>Decline Job</Button>
                                                            </div>
                                                        </div>

                                                        <div className='flex space-x-6 '>

                                                            <div>
                                                                <Button onClick={() => openSkillModal(item?.id)} className="text-xs">Add Skill</Button>
                                                            </div>

                                                            {showSkillModal && <SkillModal onClose={closeSkillModal} onSubmit={handleSkillSubmit} />}


                                                            <div className='flex space-x-6 flex-grow justify-start'>
                                                                <Button className='text-xs' onClick={() => onClickDeleteJob(item.id, item.user_id)}>Delete Job</Button>
                                                            </div>

                                                        </div>
                                                    </div>




                                                </div>


                                                <div className="font-medium hidden md:flex flex-col space-y-4">
                                                    <p><span className='font-bold text-md'>Salary:</span> {item.salary_start}$ - {item.salary_end}$</p>
                                                    <p><span className='font-bold text-md'>Job Status:</span> {item.is_approved}</p>
                                                </div>


                                                <div className='space-y-3 flex-col hidden md:flex justify-end flex-grow'>
                                                    <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                        <div >
                                                            <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "approved")}>Approve Job</Button>
                                                        </div>

                                                        <div >
                                                            <Button className='text-xs' onClick={() => onClickApproveJob(item.id, item.user_id, "unapproved")}>Decline Job</Button>
                                                        </div>

                                                    </div>

                                                    <div className='hidden md:flex space-x-6 flex-grow justify-end'>
                                                        <div >
                                                            <Button onClick={() => openSkillModal(item?.id)} className="text-xs">Add Skill</Button>
                                                        </div>
                                                        {showSkillModal && <SkillModal onClose={closeSkillModal} onSubmit={handleSkillSubmit} />}

                                                        <div>
                                                            <Button className='text-xs' onClick={() => onClickDeleteJob(item.id, item.user_id)}>Delete Job</Button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        ))}
                                </div>

                            ))}
                            {showJobModal && <JobModal onClose={closeJobModal} />}
                        </div>
                    </TabsContent>





                </Tabs>
            </div>

        </div>
    );
}

export default DashboardAdmin
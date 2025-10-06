"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import useUserData from "@/lib/db/userData";
import HrData from "@/lib/db/hrData";
import MainUsers from "@/lib/db/mainUsers";
import SkillsData from "@/lib/db/skillsData";
import QualificationData from "@/lib/db/qualificationData";
import ExperienceData from "@/lib/db/experienceData";
import Rating from "./Rating";
import { useRouter } from "next/navigation";
import format from "date-fns/format";
import { Pen } from "lucide-react";
import VerificationData from "@/lib/db/vertificationData";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Trash2 } from "lucide-react";
import RatingUser from "./RatingUser";
import SkeletonLoaderCustom from "@/components/SkeletonLoaderCustom";
import SpinnerLoader from "./SpinnerLoader";


const Modal = ({ onClose }: { onClose: () => void }) => {
  const { userData } = useUserData();
  const { verification } = VerificationData();
  const filteredVerifications = verification?.filter(
    (item: any) => userData?.id === item?.user_id
  );
  const [skill, setSkill] = useState("");
  const { skills } = SkillsData();
  const filterSkills = skills?.filter(
    (item: any) => item?.user_id === userData?.id
  );

  async function onAddSkill() {
    try {
      if (
        filterSkills.some(
          (item: any) => item?.skill.toLowerCase() === skill.toLowerCase()
        )
      ) {
        toast.error("Skill already exists");
        return;
      }

      const res = await fetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ skill: skill, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!res.ok) {
        // alert("Error submitting skills");
        toast.error("Error submitting skills");
        return;
      }
      //   setTimestamp(Date.now());
      setSkill("");
      //   alert("Skill added successfully");
      toast.success("Skill Submitted");
      return res;
    } catch (error) {
      //console.log(error);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4 flex flex-col space-y-4">
        <button className={`close-button`} onClick={onClose}>
          <X />
        </button>
        <h1 className="font-bold text-xl text-left">
          Add a skill to your profile
        </h1>
        <input
          className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl"
          type="text"
          placeholder="Enter skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          id="skill"
        />
        <Button
          className="self-start bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg"
          onClick={onAddSkill}
          type="submit"
        >
          Add Skill
        </Button>
      </div>
    </div>
  );
};

const Profile = ({ user_id }: any) => {
    const [showModal, setShowModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [calculate_experience, setCalculateExperience] = useState("");


  const formatDateTime = (dateTimeString: any) => {
    const optionsDate: any = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime: any = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };

    const date = new Date(dateTimeString);
    const formattedDate = format(date, "dd-MMMM-yyyy", optionsDate);
    const formattedTime = format(date, "HH:mm:ss zzz", optionsTime);

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

    const router = useRouter();
    function handleClick() {
        router.push("setting");
    }

    function handleEdit() {
        setEdit(!edit);
    }

    async function handleCalculateExperience() {

        if (calculate_experience === "") {
            toast.error("Please fill total experience");
            return;
        }

        try {
            const res = await fetch("/api/calculateExperience", {
                method: 'PUT',
                body: JSON.stringify({ calculate_experience: calculate_experience, user_id: user_id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },

            })

            if (!res.ok) {
                // alert("Error submitting data")
                toast.error("Error updating total experience");
                return;
            }

            toast.success("Calculated Experience Updated");
            setEdit(false);
            window.location.reload();
        } catch (error) {

        }
    }


    // function calculateTotalExperience(experienceArray:any) {
    //     let totalYears = 0;
    //     let totalMonths = 0;

    //     // Iterate over each experience string in the array
    //     experienceArray.forEach((experience:any) => {
    //       // Split the experience string into years and months
    //       const [yearsStr, monthsStr] = experience.split(" ");
    //       const years = parseInt(yearsStr) || 0; // Convert years string to integer, default to 0 if not parsable
    //       const months = parseInt(monthsStr) || 0; // Convert months string to integer, default to 0 if not parsable

    //       // Accumulate years and months
    //       totalYears += years;
    //       totalMonths += months;
    //     });

    //     // Convert excess months to years
    //     totalYears += Math.floor(totalMonths / 12);
    //     totalMonths %= 12;

    //     // Format the total years and months into a single string
    //     let result = "";
    //     if (totalYears > 0) {
    //       result += totalYears === 1 ? "1 year" : `${totalYears} years`;
    //     }
    //     if (totalMonths > 0) {
    //       if (result !== "") {
    //         result += " ";
    //       }
    //       result += totalMonths === 1 ? "1 month" : `${totalMonths} months`;
    //     }

    //     return result !== "" ? result : "Less than a month";
    //   }



    function calculateTotalExperience(experiences: any[]): string {
        let totalYears = 0;
        let totalMonths = 0;

        experiences.forEach((exp) => {
            if (exp.total_experience !== null) {
                // Splitting by comma instead of space
                const parts = exp.total_experience.split(",");
                let yearsStr = "0";
                let monthsStr = "0";

                if (parts.length > 0) {
                    // If years are provided
                    yearsStr = parts[0].trim();
                    const years = parseInt(yearsStr) || 0;
                    totalYears += years;
                }

                if (parts.length > 1) {
                    // If months are provided
                    monthsStr = parts[1].trim();
                    const months = parseInt(monthsStr) || 0;
                    totalMonths += months;
                }
            }
        });

        // Convert extra months to years
        totalYears += Math.floor(totalMonths / 12);
        totalMonths %= 12;

        return `${totalYears} years ${totalMonths} months`;
    }


  async function onClickExperienceDelete(id: any) {
    try {
      // //console.log("Slot: ", slot);
      // alert("Slot: " + slot);

      const data = await fetch("/api/experience", {
        method: "DELETE",
        body: JSON.stringify({ id: id, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      //   setDeletionStatus((prevStatus) => !prevStatus);

      //   //console.log("Deletion status updated:", deletionStatus);
      //   setForceUpdate(prev => !prev);

            //   alert("Skill Deleted!");
            toast.success("Experience Deleted");
            window.location.reload();

      return data.json();
      // return {"message":"deleted"}
    } catch (error) {
      //console.log(error);
    }
  }

  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
    }, 2000);
  }, []);


  async function onClickApprove(user_id: any, is_approve: any) {
    try {
      const res = await fetch("/api/hr2", {
        method: "PUT",
        body: JSON.stringify({ is_approve: is_approve, user_id: user_id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (!res.ok) {
        // alert("Error submitting data")
        toast.error("Error submitting data");
        return;
      }

      if (is_approve === "approved") {
        toast.success("Account is approved");
        return;
      } else if (is_approve === "unapproved") {
        toast.success("Account is not approved");
        return;
      }
    } catch (error) {
      // //console.log(error);
    }
  }

  async function onClickEducationDelete(id: any) {
    try {
      // //console.log("Slot: ", slot);
      // alert("Slot: " + slot);

      const data = await fetch("/api/qualification", {
        method: "DELETE",
        body: JSON.stringify({ id: id, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      //   setDeletionStatus((prevStatus) => !prevStatus);

      //   //console.log("Deletion status updated:", deletionStatus);
      //   setForceUpdate(prev => !prev);

      //   alert("Skill Deleted!");
      toast.success("Qualification Deleted");

      return data.json();
      // return {"message":"deleted"}
    } catch (error) {
      //console.log(error);
    }
  }

  async function onClickDelete(sid: any) {
    try {
      // //console.log("Slot: ", slot);
      // alert("Slot: " + slot);

      const data = await fetch("/api/skills", {
        method: "DELETE",
        body: JSON.stringify({ sid: sid, user_id: userData?.id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      //   setDeletionStatus((prevStatus) => !prevStatus);

      //   //console.log("Deletion status updated:", deletionStatus);
      //   setForceUpdate(prev => !prev);

      //   alert("Skill Deleted!");
      toast.success("Skill Deleted");

      return data.json();
      // return {"message":"deleted"}
    } catch (error) {
      //console.log(error);
    }
  }

  const { userData } = useUserData();
  //console.log("ID in Profile: ", user_id);

    const filterUserData = MainUsers().users?.filter((item: any) => item?.id === user_id);
    const filterHrData = HrData().hrTable?.filter((item: any) => item?.user_id === user_id);
    const filterSkillsData = SkillsData().skills?.filter((item: any) => item?.user_id === user_id);
    const filterQualificationData = QualificationData().qualification?.filter((item: any) => item?.user_id === user_id);
    const filterExperienceData = ExperienceData().experience?.filter((item: any) => item?.user_id === user_id);
    const filteredVerifications = VerificationData().verification?.filter((item: any) => userData?.id === item?.user_id);
    const totalExperienceCalculated = calculateTotalExperience(filterExperienceData);

  let skills = [
    {
      skill: "Nodejs",
      id: 1,
    },
    {
      skill: "Reactjs",
      id: 2,
    },
    {
      skill: "Nextjs",
      id: 3,
    },
    {
      skill: "TailwindCSS",
      id: 4,
    },
    {
      skill: "Bootstrap",
      id: 5,
    },
  ];
  let education = [
    {
      title: "MBBS",
      university: "LUMS University Lahore",
      year: "(March, 2020 - July, 2024)",
      id: 1,
    },

    {
      title: "FSC (Med)",
      university: "Aspire College Lahore",
      year: "(March, 2018 - Feb, 2020)",
      id: 2,
    },
  ];
  let experience = [
    {
      id: 1,
      image: "/ibex.png",
      name: "Ibex Pakistan",
      address: "Gulberg-Phase 11, karachi",
      designation: "Sr UI/UX Designer & Team Lead",
      period: "15 March, 2023 - Present",
      expertise: "Lorem Ipsum",
    },
    {
      id: 2,
      image: "/ibex.png",
      name: "Ibex Pakistan",
      address: "Gulberg-Phase 11, karachi",
      designation: "Sr UI/UX Designer & Team Lead",
      period: "15 March, 2023 - Present",
      expertise: "Lorem Ipsum",
    },
    {
      id: 3,
      image: "/ibex.png",
      name: "Ibex Pakistan",
      address: "Gulberg-Phase 11, karachi",
      designation: "Sr UI/UX Designer & Team Lead",
      period: "15 March, 2023 - Present",
      expertise: "Lorem Ipsum",
    },
    {
      id: 4,
      image: "/ibex.png",
      name: "Ibex Pakistan",
      address: "Gulberg-Phase 11, karachi",
      designation: "Sr UI/UX Designer & Team Lead",
      period: "15 March, 2023 - Present",
      expertise: "Lorem Ipsum",
    },
  ];
  return (
    <div className="bg-[#F2F5F9 ] px-[15px] py-[14px] md:px-[40px] md:py-[39px]">

{screenLoading ? (
        <SpinnerLoader />
      ) :(

        <>
        {filterUserData[0] ? (
        <div>
          {filterHrData.map((item: any, index: number) => (

            <>
            
          <span key={index} className="font-nunito text-[24px] leading[30px] md:text-[30px] md:leading[39px] font-bold text-[#242E49]">
          {item.fname}&apos;s Profile
          </span>
            <div
              key={index}
              className="bg-white rounded-[16px] mt-4 text-center flex flex-col lg:flex-row mb-[30px]"
            >
              <div className="lg:w-[30%] py-6 sm:py-8 px-3 sm:px-6px md:px-12 border-r-[1px] flex flex-col items-center justify-center">
                {filterUserData?.map((user: any, index: number) => (
                  <Image
                    key={index}
                    src={user?.image || "/demoProfile.jpg"}
                    width={126}
                    height={126}
                    alt="profile picture"
                    className="rounded-full"
                  />
                ))}

                <span className="font-nunito leading-[37px] text-[28px] font-bold text-[#242E49] my-2">
                  {item.fname} {item.lname}
                </span>
                <span className="font-be leading-[27px] text-[18px] text-[#6D6D6D]">
                  {item?.designation}
                </span>

                <span className="font-nunito leading-[26px] text-[20px] font-bold text-[#242E49] my-2">
                  Ratings:
                </span>

                {filterUserData[0]?.role === "hr" && <Rating id={user_id} />}

                {filterUserData[0]?.role === "user" && (
                  <RatingUser id={user_id} />
                )}

                {/* <Image src={"/stars.png"} width={108} height={20} alt='Ratings'  className='w-auto h-auto'/> */}
                {/* <span className='font-be leading-[20px] text-[14px] text-[#6D6D6D] my-2'>Average rating: 5</span> */}

                {userData?.id === user_id && (
                  <button
                    onClick={handleClick}
                    className="mt-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-[10px] shadow-md hover:bg-blue-700 transition-colors"
                  >
                    Profile Setting
                  </button>
                )}

                {userData?.role === "admin" ||
                  (userData?.role === "user" &&
                    filterUserData[0]?.role === "hr" && (
                      <button
                        onClick={() =>
                          router.push(`/scheduleInterview?id=${user_id}`)
                        }
                        className="mt-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-[10px] shadow-md hover:bg-blue-700 transition-colors"
                      >
                        Schedule Interview Now
                      </button>
                    ))}

                            {userData?.role === "admin" && filterUserData[0]?.role === "hr" && (
                                <button onClick={() => onClickApprove(user_id, "approved")} className="mt-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-[10px] shadow-md hover:bg-blue-700 transition-colors">
                                    Approve Profile
                                </button>
                            )}

                        </div>
                        <div className='lg:w-[70%] py-6 sm:py-8 px-3 sm:px-6px md:px-12 flex flex-col items-start justify-start'>

                            <div className='flex flex-col mb-6'>
                                <span className='font-nunito leading-[26px] text-[20px] font-bold text-[#242E49] text-left'>About me:</span>
                                <span className='font-be leading-[21px] text-[14px]  text-[#333333] text-left mt-2'>
                                    {item?.about}
                                </span>
                            </div>
                            <div className='flex flex-col mb-3 w-full'>
                                <div className='flex w-full justify-between'>
                                    <span className='font-nunito leading-[26px] text-[20px] font-bold text-[#242E49] text-left'>Skills:</span>
                                    <button disabled={filteredVerifications[0]?.verified === "unverified"} onClick={() => setShowModal(true)} ><Pen className={`${userData?.id === user_id ? "visible" : "hidden"}  ${filteredVerifications[0]?.verified === "unverified" ? "cursor-not-allowed" : "visible"} h-5 w-5 self-center cursor-pointer hover:text-green-500`} /></button>
                                    {showModal && <Modal onClose={() => setShowModal(false)} />}
                                </div>
                                <div className='gap-2 mt-2 mb-6 flex flex-wrap' >
                                    {
                                        filterSkillsData.map(item => (

                                            <div key={item.sid} className='relative text-[#333333] text-[14px] font-be bg-[#DEEBFF] rounded-[16px] py-1 px-3'> <span>{item.skill} </span> <button disabled={filteredVerifications[0]?.verified === "unverified"} className={`${userData?.id === user_id ? "visible" : "hidden"} ${filteredVerifications[0]?.verified === "unverified" ? "cursor-not-allowed" : "visible"}}`} onClick={() => onClickDelete(item.sid)}><X className="w-3 cursor-pointer hover:text-red-500 h-3 flex absolute top-0 right-0 mr-1 mt-1 " /></button></div>
                                        ))}
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <span className='font-nunito leading-[26px] text-[20px] font-bold text-[#242E49] text-left'>Education:</span>
                                <div className='gap-2 mt-2 mb-6 flex flex-wrap' >
                                    {
                                        filterQualificationData.map(item => (
                                            <div key={item.id} className='flex flex-col w-[300px]  text-left text-[#333333] font-be bg-[#DEEBFF] rounded-[8px] gap-y-1 py-4 px-3 relative'>
                                                <button disabled={filteredVerifications[0]?.verified === "unverified"} className={`${userData?.id === user_id ? "visible" : "hidden"} ${filteredVerifications[0]?.verified === "unverified" ? "cursor-not-allowed" : "visible"}}`} onClick={() => onClickEducationDelete(item.id)}><Trash2 className="w-6  absolute top-0 right-0 cursor-pointer text-black hover:text-red-500 h-6 flex  mr-1 mt-1 " /></button>
                                                <span className='text-[16px] font-bold'>{item.speciallization}</span>
                                                {/* <span className='text-[16px] font-bold'>{item.degree}</span> */}
                                                <span className='text[14px] leading-[21px]'>{item.degree}</span>
                                                <span className='text[14px] leading-[21px]'>{item.institute}</span>
                                                <span className='text[14px] leading-[21px]'>{item.cgpa} </span>
                                                <span className='text[14px] leading-[21px]'>{'('}{item.passing_year}{')'}</span>

                                            </div>
                                        ))}
                                </div>
                            </div>


                            <div className='flex w-full flex-col space-y-2 mb-6'>
                                <span className='font-nunito leading-[26px] text-[20px] font-bold text-[#242E49] w-full text-left'><div className='flex justify-between  w-full'><span>Total Experience:</span> <button onClick={() => setEdit(!edit)}><Pen className={`${userData?.id === user_id ? "visible" : "hidden"}  ${filteredVerifications[0]?.verified === "unverified" ? "cursor-not-allowed" : "visible"} h-5 w-5 self-center cursor-pointer hover:text-green-500`} /></button>  </div></span>

                                {!edit ? (
                                    <div className='self-start text-left'>
                                        <span className='font-be leading-[21px] self-start text-[14px]  text-[#333333] text-left mt-2'>
                                            {item?.calculate_experience}
                                        </span>
                                    </div>
                                ) : (

                                    <div className='flex flex-row items-center h-full  space-x-6 '>
                                        <input type="text" className='input py-3.5 px-4 bg-black w-1/2 outline-none rounded-xl' value={calculate_experience} onChange={(e) => setCalculateExperience(e.target.value)} placeholder='Enter total experience...' name="calculate_experience" id="calculate_experiencee" />
                                        <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg' onClick={handleCalculateExperience}>Submit</Button>
                                    </div>

                                )}



                            </div>

                        </div>


                    </div>
            </>
            
                ))}

          <span className="font-nunito text-[24px] leading[30px] md:text-[30px] md:leading[39px] font-bold text-[#242E49]">
            Professional Experience
          </span>
          {filterExperienceData.map((item) => (
            <div
              key={item.id}
              className="relative bg-white font-be text-[#333333] rounded-[8px] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 lg:gap-y-0 lg:grid-cols-4 py-3 px-3 sm:py-4 sm:px-6 mt-4"
            >
              <div className="flex items-center ">
                <button
                  disabled={filteredVerifications[0]?.verified === "unverified"}
                  className={`${
                    userData?.id === user_id ? "visible" : "hidden"
                  } ${
                    filteredVerifications[0]?.verified === "unverified"
                      ? "cursor-not-allowed"
                      : "visible"
                  }}`}
                  onClick={() => onClickExperienceDelete(item.id)}
                >
                  <Trash2 className="w-6 cursor-pointer hover:text-red-500 h-6 flex absolute top-0 right-0 mr-1 mt-1 " />
                </button>

                <div className="aspect-square w-[70px] h-[70px]">
                  <Image
                    src={`${item?.image || "/camera.png"}`}
                    width={70}
                    height={70}
                    alt="company logo"
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col px-2 gap-y-2 justify-start text-left">
                  <span className="text-[20px] leading-[20px] font-bold">
                    {item.organization}
                  </span>
                  <span className="text-[14px] leading-[20px] ">
                    {item?.address}
                  </span>
                </div>
              </div>

              <div className="flex flex-col px-2 gap-y-2 justify-start text-left">
                <span className="text-[14px] leading-[20px] text-[#6D6D6D]">
                  Designation:
                </span>
                <span className="text-[14px] leading-[20px] ">
                  {item.designation}
                </span>
              </div>

                            <div className='flex flex-col px-2 gap-y-2 justify-start text-left'>
                                <span className='text-[14px] leading-[20px] text-[#6D6D6D]'>Time Period:</span>
                                <span className='text-[14px] leading-[20px] '>{formatDateTime(item.from_date).date} - {item.to_date === "present"? "Present" : formatDateTime(item.to_date).date} {"(" + item.total_experience + ")"}</span>
                            </div>

              <div className="flex flex-col px-2 gap-y-2 justify-start  text-left  ">
                <span className="text-[14px] leading-[20px] text-[#6D6D6D]">
                  Area of Expertise:
                </span>
                <span className="text-[14px] leading-[20px] ">{item.aoe}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SpinnerLoader />
      )}
        </>
      )}

      
    </div>
  );
};
export default Profile;

"use client"
import React, { useState } from 'react';
// import { Button } from '@/components/Button';
import { useSearchParams } from 'next/navigation';
import InterviewData from '@/lib/db/interviewData';
import useUserData from '@/lib/db/userData';
import FeedbackData from '@/lib/db/feedbackData';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const StarRating = ({ value, onStarClick }: any) => {
    const [hoverValue, setHoverValue] = useState(0);


    const handleStarClick = (rating: any) => {
        onStarClick(rating);
    };

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        style={{
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: (index < (hoverValue || value)) ? 'gold' : 'grey',
                        }}
                        onMouseEnter={() => setHoverValue(ratingValue)}
                        onMouseLeave={() => setHoverValue(0)}
                        onClick={() => handleStarClick(ratingValue)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

const FeedbackUserModal = ({onClose, id, slot }: { onClose: () => void, id: any, slot: any }) => {
    const [presentation, setPresentation] = useState(0);
    const [businessAcumen, setBusinessAcumen] = useState(0);
    const [objectHandling, setObjectHandling] = useState(0);
    const [professionalism, setProfessionalism] = useState(0);
    const [relevantExperience, setRelevantExperience] = useState(0);
    const [user_feedback, setfeedback] = useState("")
    const searchParams = useSearchParams();
    //   const slot = searchParams.get('slot');
    const { interviews } = InterviewData();
    const { userData } = useUserData();
    const { feedback } = FeedbackData();
    const router = useRouter();

    //console.log("Presentation: ", presentation);
    //console.log("Business Acumen: ", businessAcumen);
    //console.log("Object Handling: ", objectHandling);
    //console.log("Professionalism: ", professionalism);
    //console.log("Relevant Experience: ", relevantExperience);
    // const formattedSlot = moment(slot).format();
    //console.log("Slot from Params: ", slot);
    // //console.log("Formatted Slot: ", formattedSlot);





    const filteredFeedback = feedback?.filter((item: any) => item?.hr_id === id && item?.slot === slot && item?.user_id === userData?.id);
    //console.log("Filtered Feedback: ", filteredFeedback);


    const calculate_stars = (rating_one: any, rating_two: any, rating_three: any, rating_four: any, rating_five: any) => {
        return ((((rating_one / 5) + (rating_two / 5) + (rating_three / 5) + (rating_four / 5) + (rating_five / 5)) / 5) * 5).toPrecision(3);
    }


    async function onClickDashboard() {
        router.push("/dashboards");
    }

    async function onSubmit() {
        try {

            if (user_feedback.length === 0 || user_feedback === null) {
                // alert("Please enter the user feedback!");
                toast.error("Please enter the user feedback!");
                return;
            }
            const total_rating = calculate_stars(presentation, businessAcumen, objectHandling, professionalism, relevantExperience);
            //console.log("Total Rating: ", total_rating);

            if (filteredFeedback[0]) {
                // alert("Feedback inserted already by hr ");
                toast.success("Feedback has been submitted. Thank you!");
                const res = await fetch("/api/feedback", {
                    method: 'PUT',
                    body: JSON.stringify({ rating_one: presentation, rating_two: businessAcumen, rating_three: objectHandling, rating_four: professionalism, rating_five: relevantExperience, total_rating: total_rating, user_feedback: user_feedback, slot: slot, hr_id: id, user_id: userData?.id }),
                })
                if (!res.ok) {
                    // alert("Error in updating data");
                    toast.error("Error in updating data");
                    return;
                }
                // alert("Data updated!");
                toast.success("Feedback has been submitted. Thank you!");
                router.push("/dashboards");
            }
            else {
                // alert("New feedback data inserted by User!")
                toast.success("Feedback has been submitted. Thank you!");
                const res = await fetch("/api/feedback", {
                    method: 'POST',
                    body: JSON.stringify({ rating_one: presentation, rating_two: businessAcumen, rating_three: objectHandling, rating_four: professionalism, rating_five: relevantExperience, total_rating: total_rating, user_feedback: user_feedback, slot: slot, hr_id: id, user_id: userData?.id }),
                })
                if (!res.ok) {
                    // alert("Error in inserting data");
                    toast.error("Error in submitting data");
                }
                router.push("/dashboards");
                window.location.reload();
            }



        } catch (error) {
            //console.log(error);
        }
    }



    const handlePresentationRating = (rating: any) => {
        setPresentation(rating);
    };

    const handleBusinessAcumenRating = (rating: any) => {
        setBusinessAcumen(rating);
    };

    const handleObjectHandlingRating = (rating: any) => {
        setObjectHandling(rating);
    };

    const handleProfessionalismRating = (rating: any) => {
        setProfessionalism(rating);
    };

    const handleRelevantExperienceRating = (rating: any) => {
        setRelevantExperience(rating);
    };

    return (
        <div className='flex h-full bg-white py-0 min-w-[250px] px-4 md:px-0  rounded-2xl w-full  text-white justify-center items-center'>
            <div className='flex h-full  w-full md:w-[800px] justify-around py-0 px-3 md:px-10  text-black rounded-xl max-h-[500px] md:max-h-full overflow-y-auto md:overflow-y-none '>
                <div className='flex flex-col w-full space-y-6 items-start '>
                    <h2 className='font-bold my-2'>Your feedback</h2>


                    <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-32 w-full'>

                        <div >
                            <span className='font-bold text-sm'>Presentation: <span className='text-red-500'>*</span></span>
                            <StarRating value={presentation} onStarClick={handlePresentationRating} />
                        </div>

                        <div>
                            <span className='font-bold text-sm'>Business Acumen: <span className='text-red-500'>*</span></span>
                            <StarRating value={businessAcumen} onStarClick={handleBusinessAcumenRating} />
                        </div>

                        <div>
                            <span className='font-bold text-sm'>Object Handling: <span className='text-red-500'>*</span></span>
                            <StarRating value={objectHandling} onStarClick={handleObjectHandlingRating} />
                        </div>


                    </div>


                    <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-32 w-full'>

                        <div>
                            <span className='font-bold text-sm'>Professionalism: <span className='text-red-500'>*</span></span>
                            <StarRating value={professionalism} onStarClick={handleProfessionalismRating} />

                        </div>


                        <div>
                            <span className='font-bold text-sm'>Relevant Experience: <span className='text-red-500'>*</span></span>
                            <StarRating value={relevantExperience} onStarClick={handleRelevantExperienceRating} />

                        </div>



                    </div>

                    <div className='flex  focus:outline-none flex-col  self-start  w-full'>
                        <h1 className='font-bold text-lg my-2'>Write your experience with the HR <span className='text-red-500'>*</span></h1>
                        <textarea
                            className=' p-6 w-full shadow-md rounded-xl bg-black h-44 focus:outline-none   text-black'
                            value={user_feedback}
                            placeholder='Write a feedback...'
                            onChange={(e) => setfeedback(e.target.value)}
                            id='feedback'
                        />
                    </div>



                    <div className='flex space-x-4 self-end'>
                        <Button className='bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg' onClick={onClose}>Cancel</Button>
                        <Button className='bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg' onClick={onSubmit}>Submit</Button>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default FeedbackUserModal;
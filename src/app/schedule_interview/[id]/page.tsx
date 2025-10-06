import { CalendarDateRangePicker } from '@/app/dashboard/components/date-range-picker';
import React from 'react'
import { userData } from '@/data/page-data';
import { UserNav } from '@/app/dashboard/components/user-nav';
import { MainNav } from '@/app/dashboard/components/main-nav'
import { Search } from '@/app/dashboard/components/search'
import { Button } from '@/components/Button';
import Schedule from './Schedule';
import NavBar from '@/app/dashboard/components/NavBar';





async function getHrData() {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_Backend_URL + '/api/users', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return data.json();
  } catch (error) {
    //console.log(error);
  }
}

async function getInterviews() {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_Backend_URL + '/api/interview', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return data.json();
  } catch (error) {
    //console.log(error);
  }
}




const getServiceData = async () => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_Backend_URL + "/api/getServices", {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // //console.log(response)
    const services = await response.json();
    // //console.log("JSON Data:", services);

    return services;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error; // Re-throw the error to propagate it to the calling code
  }
};






export default async function page({ params }: { params: { key: string, id: string } }) {


  const hrData: userData[] = await getHrData();
  const hrService = await getServiceData();
  const allInterviews = await getInterviews();

 
  const filteredHr = hrData.filter((item: any) => item?.id === params.id);
  const filterServices = hrService.filter((item: any) => item?.user_id === params.id);

  



  return (
    <div className='bg-black h-auto w-full'>
      
      <NavBar/>

      {filterServices[0]?.user_id ? (
        <div key={filteredHr[0].id} className='text-xl'>


          <Schedule hr_id={params.id} filteredHr={filteredHr} filterServices={filterServices} allInterviews={allInterviews} />


        </div>
      ) : (
        <div className='text-xl h-[50%] w-full flex justify-center items-center'><h1>NO HR SLOTS FOUND!</h1></div>
      )
      }


    </div>
  )
}

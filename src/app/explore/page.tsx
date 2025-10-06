import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentSales } from '../dashboard/components/recent-sales-user';
import { UserNav } from '../dashboard/components/user-nav'
import { MainNav } from '../dashboard/components/main-nav'
import { Search } from '../dashboard/components/search'
import NavBar from '../dashboard/components/NavBar';


export default function page() {
  return (
    <div className='bg-black w-full h-screen'>
      

      <NavBar/>

      <div className="grid gap-4 md:grid-cols-1 bg-black h-screen">
        <Card className="col-span-3 bg-black h-screen">
          <CardHeader>
            <CardTitle>Experts</CardTitle>
            <CardDescription>
              Quailty experts here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

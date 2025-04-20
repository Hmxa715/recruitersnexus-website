"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserData from "@/lib/db/userData";
import { ShimmerButton } from "./ui/tailwindcss-buttons";
import { transactions } from "../../lib/db/schema";

export default function Navbar() {
  const { userData } = useUserData();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setOpen(!open);
  };

  function handleRoute(path: string) {
    router.push(`/${path}`);
  }

  return (
    <>
      <header className="text-gray-600 body-font mb-0 sticky mx-auto z-[2] bg-black">
        <div className="relative container flex flex-wrap p-4 mx-auto flex-row items-center justify-between text-white">
          <Link
            href="/"
            className=" flex title-font font-medium items-center pl-2 text-gray-900 mb-0"
          >
            <Image
              className=""
              height={120}
              width={150}
              src="/RN-new-white.png"
              alt="logo"
              priority
            />
          </Link>

          <div className="hidden md:block">
            <nav className="flex flex-wrap items-center text-base justify-center space-x-10  text-[16px] font-be">
              <Link href={"/"} className=" hover:text-white/80">
                Home
              </Link>
              <Link href={"/about"} className=" hover:text-white/80">
                About Us
              </Link>

              <Link href={"/jobs"} className=" hover:text-white/80">
                Jobs
              </Link>
              <Link href={"/contact"} className=" hover:text-white/80">
                Contact Us
              </Link>
              {/* <div className={`hidden  ${userData ? "md:flex" : "md:hidden"} flex-wrap space-x-4 mr-10`}>
            <Link href={"/transactions"} className=" hover:text-white/80">
              Transactions
            </Link>
            </div> */}
            </nav>
          </div>
          <div className="">
            <div
              className={`hidden  ${
                userData ? "md:flex" : "md:hidden"
              } flex-wrap space-x-4 mr-10`}
            >
              <ShimmerButton onClick={() => handleRoute("dashboards")}>
                Dashboard
              </ShimmerButton>
            </div>
            <div
              className={`hidden  ${
                userData ? "md:hidden" : "md:flex"
              } flex-wrap space-x-4 mr-10`}
            >
              <ShimmerButton onClick={() => handleRoute("login")}>
                Login
              </ShimmerButton>
              <ShimmerButton onClick={() => handleRoute("signup")}>
                Sign Up
              </ShimmerButton>
              <ShimmerButton onClick={() => handleRoute("login")}>
                Schedule Interview
              </ShimmerButton>
            </div>
            {/* mobile menu button */}
            <div className="mr-2 flex md:hidden">
              <button
                onClick={handleClick}
                type="button"
                className="bg-[#4765FF] inline-flex items-center justify-center p-2 rounded-[10px] text-white hover:bg-[#4765FF]/55 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${open ? "block" : "hidden"}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3  text-right">
            <Link
              href="/"
              className="text-white hover:font-extrabold hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:font-extrabold hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/jobs"
              className="text-white hover:font-extrabold hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Jobs
            </Link>
            <Link
              href="/contact"
              className="text-white hover:font-extrabold hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            {/* <div className={`${userData ? "flex" : "hidden"}  space-x-4`}>
              <Link
                href="/transactions"
                className="text-white hover:font-extrabold hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
              >
                Transactions
              </Link>
            </div> */}
            <div className={`${userData ? "flex" : "hidden"}  space-x-4`}>
              <ShimmerButton onClick={() => handleRoute("dashboards")}>
                Dashboard
              </ShimmerButton>
            </div>
            <div className={`${userData ? "hidden" : "flex"}  space-x-4`}>
              <ShimmerButton onClick={() => handleRoute("login")}>
                Login
              </ShimmerButton>
              <ShimmerButton onClick={() => handleRoute("signup")}>
                Sign Up
              </ShimmerButton>
              <ShimmerButton onClick={() => handleRoute("login")}>
                Schedule Interview
              </ShimmerButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

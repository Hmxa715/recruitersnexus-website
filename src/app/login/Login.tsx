"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useUserData from "@/lib/db/userData";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import NavbarLogo from "../comps/NavbarLogo";

type FormInputs = {
  email: string;
  password: string;
};

const profileFormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  password: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  email: "",
  password: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility: () => void = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { userData, UUID, status } = useUserData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    if (userData) {
      // Redirect to the dashboard
      // toast.error("User is already logged in");
      // alert("Already Logged in!");
      router.push("/dashboards");
    }
  }, [userData, router]);

  function loginSuccessToast() {
    toast.success("Login Successfull!");
  }

  async function onSubmit(data: ProfileFormValues) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_Backend_URL + "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify({
          // username: data.current.username,
          email: data.email,
          password: data.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      toast.error("Wrong password or email. Please try again");
      // alert(res.statusText);
      return;
    }
    const response = await res.json();
    toast.success("Login Successfull!");
    // alert("Login Successfull!");

    //console.log({ response });

    if (userData && userData?.role != "hr" && userData?.role != "user") {
      //console.log("user data  role: " + response.role);

      router.push("/role");
    } else {
      router.push("/dashboards");
    }
  }

  return (
    <div className="w-full bg-black   ">
      <NavbarLogo />

      <div className="flex w-full justify-center items-center py-28 md:py-36 px-2 ">
        <div className="bg-[#242E49] text-white rounded-lg p-8 space-y-4 w-full min-w-[300px] max-w-md">
          <Form {...form}>
            {/* {!userData ? ( */}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-[#242E49] text-white rounded-lg  space-y-4 w-full min-w-[300px] max-w-md"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <input
                        placeholder="Enter your email.."
                        type="email"
                        {...field}
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    {/* <FormControl>
                      <input
                        placeholder="Enter your password.."
                        type="password"
                        {...field}
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                      />
                    </FormControl> */}
                    <FormControl>
                      <div className="relative">
                        <input
                          placeholder="Enter your password.."
                          type={showPassword ? "text" : "password"}
                          required
                          {...field}
                          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="text-gray-400" />
                          ) : (
                            <Eye className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Link
                  className="text-blue-300 hover:text-blue-100"
                  href={"/FindForgotPassword"}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex w-full justify-center items-center gap-y-2 gap-x-8">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 w-full"
                >
                  Continue
                </Button>
                {/* <Link
                  className="bg-white text-[14px] text-black py-1.5 px-4 hover:bg-white/70 hover:text-white rounded-lg"
                  href={"/"}
                >
                  Cancel
                </Link> */}
              </div>
            </form>
          </Form>

          {/* <div className="flex w-full justify-center">
                <span className="text-gray-300 text-center text-2xl">OR</span>
                </div> */}

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-2 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="flex flex-col space-y-6 justify-center items-center">
            <button
              onClick={async () => {
                try {
                  const result = await signIn(
                    "google",
                    {
                      callbackUrl: "https://www.recruitersnexus.com/dashboards",
                    },
                    {
                      prompt: "select_account",
                    }
                  );

                  if (result?.error) {
                    // Handle login errors (optional)
                    console.error("Login error:", result.error);
                    return;
                  }

                  // Successful login, redirect to dashboard
                  
              /*    setTimeout(loginSuccessToast, 3000);*/

                  // toast.success("Login Successfull!");
                } catch (error) {
                  console.error("Login error:", error);
                }
              }}
              className="btn btn-google flex items-center bg-white text-black py-2 px-4 md:py-4 md:px-8 rounded-lg hover:bg-white/70 "
            >
              {" "}
              <FcGoogle className="text-3xl mx-2" /> Continue with Google
            </button>
            {/* <button
              onClick={async () =>
                signIn("google", undefined, { prompt: "select_account" })
              }
              className="btn btn-google flex items-center bg-white text-black py-2 px-4 md:py-4 md:px-8 rounded-lg hover:bg-white/70 "
            >
              {" "}
              <FcGoogle className="text-3xl mx-2" /> Continue with Google
            </button> */}
            <button
              onClick={async () => {
                try {
                  const result = await signIn(
                    "linkedin",
                    {
                      callbackUrl: "https://www.recruitersnexus.com/dashboards",
                    },
                    {
                      prompt: "select_account",
                    }
                  );

                  if (result?.error) {
                    // Handle login errors (optional)
                    console.error("Login error:", result.error);
                    return;
                  }

                  // Successful login, redirect to dashboard
                  // toast.success("Login Successfull!");
                  // router.push("/dashboards");
                } catch (error) {
                  console.error("Login error:", error);
                }
              }}
              className="btn btn-linkedin flex items-center bg-[#326799] py-2 px-4 md:py-4 md:px-8 rounded-lg hover:bg-[#326799]/50"
            >
              <BsLinkedin className="text-3xl mx-2" /> Continue with LinkedIn
            </button>
          </div>

          <div className="flex">
            <p>Don{"'"}t have an account?&nbsp;</p>
            <Link
              className="text-blue-300 hover:text-blue-100"
              href={"/signup"}
            >
              Sign up
            </Link>
          </div>
          {/* </div> */}
        </div>
      </div>
      {/* ) : (
          <SkeletonLoaderCustom />
        )} */}
    </div>
  );
}

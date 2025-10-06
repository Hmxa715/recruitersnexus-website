"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useUserData from "@/lib/db/userData";
import SkeletonLoaderCustom from "@/components/SkeletonLoaderCustom";
import { signIn } from "next-auth/react";
import MainUsers from "@/lib/db/mainUsers";
import { BsLinkedin } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import NavbarLogo from "../comps/NavbarLogo";

type FormInputs = {
  username: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
};

const profileFormSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .min(15, {
      message: "Email must be strong.",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  fname: z.string().min(2, { message: "Please enter your first name." }),
  lname: z.string().min(2, { message: "Please enter your last name." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
const defaultValues: Partial<ProfileFormValues> = {
  username: "",
  email: "",
  password: "",
};

export default function SignUpComponent() {
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility: () => void = () => {
    setShowPassword(!showPassword);
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const router = useRouter();
  const { userData, status } = useUserData();
  const [check, setCheck] = useState("loading");
  const { users } = MainUsers();

  useEffect(() => {
    if (userData) {
      setCheck("loading");
      router.push("/dashboards");
    } else {
      setCheck("false");
    }
  }, [userData, router, check]);

  async function onSubmit(data: ProfileFormValues) {
    if (users.some((user) => user.email === data.email)) {
      toast.error("Email already exists");
      return;
    }
    if (users.some((user) => user.username === data.username)) {
      toast.error("Username already exists");
      return;
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_Backend_URL + "/api/users/signup",
      {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          fname: data.fname,
          lname: data.lname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      // alert(res.statusText);
      toast.error(res.statusText);
      return;
    }
    const response = await res.json();
    toast.success("User is Registered!");
    //console.log({ response });

    router.push("/login");
  }

  return (
    <div className="bg-black">

      <NavbarLogo />
      <div className="flex w-full justify-center items-center py-20 px-2 ">
        <div className="bg-[#242E49] text-white rounded-lg p-8 space-y-4 w-full min-w-[300px] max-w-md">
        {/* <div className="bg-[#242E49] text-white rounded-lg space-y-4 w-full  "> */}
      <Form {...form}>
        {check == "false" ? (
          <div className="flex w-full bg-black justify-center items-center ">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-[#242E49] text-white px-2 rounded-lg space-y-4 w-full min-w-[300px] md:min-w-[400px] max-w-md"
            >
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="fname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                          placeholder="Enter your First name.."
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                          placeholder="Enter your Last name.."
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="flex space-x-4"> */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="Enter your username.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="Enter your email.."
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* </div> */}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          placeholder="Enter your password.."
                          type={showPassword ? 'text' : 'password'}
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

              <div className="flex justify-center items-center gap-y-2 ">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 w-full"
                  type="submit"
                >
                  Continue
                </Button>

              </div>
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-2 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

            </form>
          </div>
        ) : (
          <SkeletonLoaderCustom />
        )}
      </Form>

      
                 <div className="flex flex-col space-y-6 justify-center items-center">
            <button
              onClick={async () => {
                try {
                  const result = await signIn("google", { callbackUrl: 'https://www.recruitersnexus.com/dashboards' }, {
                    prompt: "select_account",
                  });

                  
                  if (result?.error) {
                    // Handle login errors (optional)
                    console.error("Login error:", result.error);
                    return;
                  }

                  // Successful login, redirect to dashboard
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
                  const result = await signIn("linkedin",  { callbackUrl: 'https://www.recruitersnexus.com/dashboards' }, {
                    prompt: "select_account",
                  });

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
                <p>Already have an account?&nbsp;</p>
                <Link
                  className="text-blue-300 hover:text-blue-100"
                  href={"/login"}
                >
                  Login
                </Link>
              </div>
              <div>
                <Link
                  className="text-blue-300 hover:text-blue-100"
                  href={"/login"}
                ></Link>
              </div>
      {/* Social login */}
      </div>
      </div>
    </div>
  );
}

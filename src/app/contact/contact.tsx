"use client";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ShimmerButton } from "../comps/ui/tailwindcss-buttons";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // event.preventDefault()
    // Add your form handling code here
    // //console.log("Submit: ", name, email, phone, message);

    if (name == "") {
      toast.error("Please fill 'Name' field");
      return;
    } else if (email == "") {
      toast.error("Please fill 'Email' field");
      return;
    } else if (phone == "") {
      toast.error("Please fill 'Phone' field");
      return;
    } else if (message == "") {
      toast.error("Please fill 'Message' field");
      return;
    }

    const user_email = process.env.NEXT_PUBLIC_Email;
    const email_msg = `<h1>User details via Contact Us: </h1> <br/> <ul> <li>Name: ${name}</li> <li>Email: ${email} </li> <li>Phone: ${phone} </li> <li>Message: ${message}</li> </ul>`;
    const subject = `Contact Us Request`;
    try {
      setLoading(true);
      const res = await fetch("/api/mail", {
        method: "POST",
        body: JSON.stringify({
          subject: subject,
          message: email_msg,
          userEmail: user_email,
          contact: "contact",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      // //console.log("Submit done: ", name, email, phone, message);
      if (res.status === 200) {
        toast.success("Email Sent");
        window.location.reload();
      } else {
        toast.error("Error Sending Email");
      }
      // toast.success("Email Sent")
    } catch (error) {
      // //console.log("Error in sending Email ");
      toast.error("Error in sending Email.");
      // //console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
  <>  <div>
  
  <div className="w-[100%] bg-black-50/50 py-16">
    <div className="bg-black text-white w-[92%] sm:w-[80%] mx-auto py-6 rounded-xl shadow-lg px-3 sm:px-10">
      <h2 className="text-[42px] leading-[55.75px] font-nunito font-bold  mb-4">
        Get In Touch!
      </h2>
      <div className="flex flex-col ">
        <div className="flex flex-col md:flex-row mb-6 gap-y-4 md:gap-x-4 w-full">
          <div className="flex flex-col md:w-[50%]">
            <label
              className=" text-[18px] font-be leading-[20px] font-semibold mb-3"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="input py-3.5 px-4 bg-black text-black w-full outline-none rounded-xl"
              
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
            />
          </div>
          <div className="flex flex-col md:w-[50%]">
            <label
              className=" text-[18px] font-be leading-[20px] font-semibold mb-3"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="input py-3.5 px-4 bg-black text-black w-full outline-none rounded-xl"
             
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
            />
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <label
            className=" text-[18px] font-be leading-[20px] font-semibold mb-3"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            className="input py-3.5 px-4 bg-black text-black w-full outline-none rounded-xl"
            
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Your Phone Number"
          />
        </div>
        <div className="flex flex-col mb-6">
          <label
            className=" text-[18px] font-be leading-[20px] font-semibold mb-3"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="input py-3.5 px-4 bg-black  text-black w-full outline-none rounded-xl"
           
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write here..."
          ></textarea>
        </div>
        <div className="flex justify-end">
        <ShimmerButton
                onClick={handleSubmit}
                className="w-auto text-white font-be leading-[23.38px] text-[16px] py-[13px] px-[18.5px] rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Loading" : "Submit"}
              </ShimmerButton>
        </div>
      </div>
    </div>
 
  </div>
</div></>
  );
}

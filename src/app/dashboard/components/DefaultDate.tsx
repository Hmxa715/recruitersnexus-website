"use client"
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DefaultDate({
  className,
  onDateChange, // New prop
}: React.HTMLAttributes<HTMLDivElement> & { onDateChange: (date: Date | null) => void }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange(date); // Call the callback to update the parent state
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"ghost"}
            className={cn(
              " justify-start text-left font-normal input h-[51px]  px-4 bg-black rounded-xl",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? (
              startDate.toLocaleDateString() // Changed to toLocaleDateString
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            selectsStart
            inline
            dateFormat="MMMM d, yyyy" // Removed time related format
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

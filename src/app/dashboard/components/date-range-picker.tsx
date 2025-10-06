"use client"
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CalendarDateRangePicker({
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
              "w-full input h-10  py-2 px-4 bg-black rounded-xl outline-none justify-between text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            
            <div>
            {startDate ? (
              startDate.toLocaleString()
            ) : (
              <span>Pick a date</span>
            )}
            </div>
            
            <CalendarIcon color="black" className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            selectsStart
            inline
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
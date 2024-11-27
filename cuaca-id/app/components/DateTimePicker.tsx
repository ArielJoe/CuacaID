"use client";

import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Calendar } from "./DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addSchedule } from "../actions";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function DateTimePicker() {
  const startHourRef = useRef<HTMLInputElement>(null);
  const startMinuteRef = useRef<HTMLInputElement>(null);
  const startSecondRef = useRef<HTMLInputElement>(null);
  const endHourRef = useRef<HTMLInputElement>(null);
  const endMinuteRef = useRef<HTMLInputElement>(null);
  const endSecondRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!title.trim()) {
      event.preventDefault();
      toast({ description: "Title is required!" });
      return;
    }

    if (!description.trim()) {
      event.preventDefault();
      toast({ description: "Description is required!" });
      return;
    }

    if (!date) {
      event.preventDefault();
      toast({ description: "Date is required!" });
      return;
    }

    if (!startTime) {
      event.preventDefault();
      toast({ description: "Start time is required!" });
      return;
    }

    if (!endTime) {
      event.preventDefault();
      toast({ description: "End time is required!" });
      return;
    }

    if (endTime <= startTime) {
      event.preventDefault();
      toast({ description: "End time must be after the start time!" });
      return;
    }

    const currentDateTime = new Date();
    const combinedStartDateTime = new Date(
      new Date(date).toDateString() + " " + startTime.toTimeString()
    );

    if (combinedStartDateTime <= currentDateTime) {
      event.preventDefault();
      toast({
        description:
          "Date and start time must be after the current date and time!",
      });
      return;
    }

    try {
      const dateValue = new Date(date).toDateString();
      const startTimeValue = new Date(startTime);
      const endTimeValue = new Date(endTime);

      const formatTime = (time: Date) => {
        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        const seconds = time.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      };

      const formattedStartTime = formatTime(startTimeValue);
      const formattedEndTime = formatTime(endTimeValue);

      await addSchedule(
        title,
        description,
        dateValue,
        formattedStartTime,
        formattedEndTime
      );

      toast({ description: "Schedule added successfully!" });

      setTitle("");
      setDescription("");
      setDate(undefined);
      setStartTime(undefined);
      setEndTime(undefined);
    } catch (error) {
      console.log("Error adding schedule:", error);
    }
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <Popover>
        <Input placeholder="Title" value={title} onChange={handleTitleChange} />
        <Input
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal w-full",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date ? format(date!, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 grid gap-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </PopoverContent>
        <div className="flex flex-col gap-2 border border-secondary rounded-md p-3">
          <div className="sm:flex sm:justify-around">
            <div>
              <Label>Start Time</Label>
              <div className="flex items-center gap-2">
                <TimePickerInput
                  picker="hours"
                  date={startTime}
                  setDate={setStartTime}
                  ref={startHourRef}
                  onRightFocus={() => startMinuteRef.current?.focus()}
                />
                :
                <TimePickerInput
                  picker="minutes"
                  date={startTime}
                  setDate={setStartTime}
                  ref={startMinuteRef}
                  onLeftFocus={() => startHourRef.current?.focus()}
                  onRightFocus={() => startSecondRef.current?.focus()}
                />
                :
                <TimePickerInput
                  picker="seconds"
                  date={startTime}
                  setDate={setStartTime}
                  ref={startSecondRef}
                  onLeftFocus={() => endHourRef.current?.focus()}
                />
              </div>
            </div>
            <div>
              <Label>End Time</Label>
              <div className="flex items-center gap-2">
                <TimePickerInput
                  picker="hours"
                  date={endTime}
                  setDate={setEndTime}
                  ref={endHourRef}
                  onRightFocus={() => endMinuteRef.current?.focus()}
                />
                :
                <TimePickerInput
                  picker="minutes"
                  date={endTime}
                  setDate={setEndTime}
                  ref={endMinuteRef}
                  onLeftFocus={() => endHourRef.current?.focus()}
                  onRightFocus={() => endSecondRef.current?.focus()}
                />
                :
                <TimePickerInput
                  picker="seconds"
                  date={endTime}
                  setDate={setEndTime}
                  ref={endSecondRef}
                  onLeftFocus={() => endMinuteRef.current?.focus()}
                />
              </div>
            </div>
          </div>
        </div>
        <Button className="w-full" type="submit">
          Set
        </Button>
      </Popover>
    </form>
  );
}

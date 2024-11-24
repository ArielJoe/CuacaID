"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface Schedule {
  id: string;
  title: string;
  description: string;
  fromTime: string;
  tillTime: string;
  day: string;
}

export function CalendarComponent({ schedules }: { schedules: Schedule[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col sm:flex-row w-full">
      <div className="mt-5 mr-4 w-full sm:w-[40%]">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-primary/30 rounded-md p-3 mb-3"
            >
              <p>{schedule.title}</p>
              <p>{schedule.description}</p>
              <p>
                {schedule.day}, {schedule.fromTime} - {schedule.tillTime}
              </p>
            </div>
          ))
        ) : (
          <p>No schedules found.</p>
        )}
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border w-full sm:w-[60%]"
      />
    </div>
  );
}

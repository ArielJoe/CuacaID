"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "../lib/hooks";
import { deleteSchedule, getSchedule } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Schedule {
  id: string;
  day: string;
  time: string;
  title: string;
  description: string;
}

export function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    try {
      const session = await requireUser();
      const userId = session.user?.id;
      const schedule = await getSchedule(userId!);
      setSchedules(schedule);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Fetching schedules data...
        </div>
      );
    }
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    console.log(event);
    await deleteSchedule(id);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row w-full">
      <div className="w-full sm:w-[40%]">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="relative flex bg-secondary/80 rounded-md py-3 px-4 mb-3"
            >
              <div className="grid gap-2">
                <p>{schedule.title}</p>
                <p>{schedule.description}</p>
                <p>
                  {schedule.day}, {schedule.time}
                </p>
              </div>

              <div className="absolute top-3 right-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="p-3 bg-primary">
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule Deletion</DialogTitle>
                    </DialogHeader>
                    Delete this schedule?
                    <div className="grid gap-2 border border-secondary rounded-md p-3">
                      <p>{schedule.title}</p>
                      <p>{schedule.description}</p>
                      <p>
                        {schedule.day}, {schedule.time}
                      </p>
                    </div>
                    <DialogFooter>
                      <form
                        onSubmit={(event) => handleSubmit(event, schedule.id)}
                      >
                        <Button type="submit" className="flex w-full">
                          Delete
                        </Button>
                      </form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        ) : (
          <p>No Schedules Found</p>
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

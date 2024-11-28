"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { requireUser } from "@/app/lib/hooks";
import { getSchedule } from "@/app/actions";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface Schedule {
  id: string;
  title: string;
  description: string;
  day: string;
  startTime: string;
  endTime: string;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [markedDays, setMarkedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    try {
      const session = await requireUser();
      const userId = session.user?.id;
      const schedules: Schedule[] = await getSchedule(userId!);
      const days = schedules.map((schedule) => new Date(schedule.day));

      setMarkedDays(days);
    } catch (error) {
      console.log("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Fetching calendar data...
        </div>
      );
    }
  }

  // Modifier function to check if a date is in the markedDays array
  const isMarkedDay = (date: Date) => {
    return markedDays.some(
      (markedDate) =>
        markedDate.getDate() === date.getDate() &&
        markedDate.getMonth() === date.getMonth() &&
        markedDate.getFullYear() === date.getFullYear()
    );
  };

  // Modifier function to check if a date is Sunday
  const isSunday = (date: Date) => date.getDay() === 0;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full h-fit", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row w-full h-full space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full h-full flex flex-col justify-center",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base font-medium sm:text-lg",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full h-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-xs sm:text-sm",
        row: "flex h-[75px] w-full mt-2",
        cell: "h-12 w-full text-center text-xs sm:text-sm p-0 relative flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-12 w-12 p-0 text-base sm:text-lg md:text-3xl font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary/30 text-primary hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiers={{
        sunday: isSunday, // Use the function to determine if a date is Sunday
        marked: isMarkedDay, // Use the function to determine if a date is marked
      }}
      modifiersClassNames={{
        sunday: "text-red-500",
        marked: "bg-primary text-secondary",
      }}
      components={{
        IconLeft: (
          {
            /* ...props  */
          }
        ) => <ChevronLeft className="h-5 w-5" />,
        IconRight: (
          {
            /* ...props*/
          }
        ) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

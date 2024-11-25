"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
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

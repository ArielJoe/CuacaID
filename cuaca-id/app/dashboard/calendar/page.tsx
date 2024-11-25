import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { CalendarComponent } from "@/app/components/Calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/app/components/DateTimePicker";

export default async function MyCalendar() {
  const session = await requireUser();

  const schedules = await prisma.calendar.findMany({
    where: {
      userId: session.user?.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fromTime: true,
      tillTime: true,
      day: true,
    },
  });

  return (
    <div>
      <CalendarComponent schedules={schedules} />

      <Dialog>
        <DialogTrigger className="flex justify-center items-center bg-primary rounded-full absolute bottom-8 right-8 w-[50px] h-[50px]">
          <Plus className="text-secondary text-center" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-3">
            <DialogTitle>Set Your Schedule</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input placeholder="Title" />
            <Input placeholder="Description" />
            <DateTimePicker />
            <Button>Set</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

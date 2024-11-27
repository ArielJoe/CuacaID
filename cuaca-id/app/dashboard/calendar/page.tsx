import { CalendarComponent } from "@/app/components/Calendar";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/app/components/DateTimePicker";

export default async function MyCalendar() {
  return (
    <div>
      <CalendarComponent />

      <Dialog>
        <DialogTrigger className="flex justify-center items-center bg-primary rounded-full fixed bottom-8 right-8 w-[50px] h-[50px]">
          <Plus className="text-secondary text-center" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-3">
            <DialogTitle>Set Your Schedule</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <DateTimePicker />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

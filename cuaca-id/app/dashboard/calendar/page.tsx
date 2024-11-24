import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { CalendarComponent } from "@/app/components/Calendar";

export default async function MyCalendar() {
  const session = await requireUser(); // Ensure the user is authenticated
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
    </div>
  );
}

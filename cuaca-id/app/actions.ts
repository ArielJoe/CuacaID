"use server";

import { parseWithZod } from "@conform-to/zod";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { notFound, redirect } from "next/navigation";

export async function OnboardingAction(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            userName: formData.get("userName") as string,
          },
        });
        return !existingUsername;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  /* const data = */ await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      userName: submission.value.userName,
      name: submission.value.fullName,
    },
  });

  return redirect("/dashboard");
}

export async function SettingsAction(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  /* const user = */ await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard/settings");
}

export async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export async function getSchedule(userId: string) {
  const schedules = await prisma.calendar.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      description: true,
      title: true,
      day: true,
      startTime: true,
      endTime: true,
    },
  });
  return schedules;
}

export async function addSchedule(
  title: string,
  description: string,
  day: string,
  startTime: string,
  endTime: string
) {
  const session = await requireUser();
  const userId = session.user?.id;
  try {
    const schedule = await prisma.calendar.create({
      data: {
        title,
        description,
        day,
        startTime,
        endTime,
        userId,
      },
    });
    console.log("Schedule created:", schedule);
  } catch (error) {
    console.log("Error creating schedule:", error);
  }
}

export async function deleteSchedule(id: string) {
  try {
    const schedule = await prisma.calendar.delete({
      where: {
        id: id,
      },
    });
    console.log("Schedule deleted:", schedule);
  } catch (error) {
    console.log("Error deleting schedule:", error);
  }
}

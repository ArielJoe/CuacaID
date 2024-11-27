import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(3).max(100),
  userName: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: " Username can only contain letters, numbers, or -",
    }),
});

export function onboardingSchemaValidation(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    userName: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: " Username can only contain letters, numbers, or -",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already used!",
              });
            }
          });
        })
      ),
    fullName: z.string().min(3).max(100),
  });
}

export const settingsSchema = z.object({
  fullName: z.string().min(3).max(100),
  profileImage: z.string(),
});

export const schedulingSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(100),
  date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Date must be a valid date",
  }),
});

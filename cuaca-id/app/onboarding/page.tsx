"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { OnboardingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";
import { redirect } from "next/navigation";
import { requireUser } from "../lib/hooks";

export default function OnboardingRoute() {
  const [lastResult, action] = useActionState(OnboardingAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const session = await requireUser();
      if (session.user?.name) {
        redirect("/dashboard");
      } else {
        setPassed(true);
      }
    };

    checkUser();
  }, []);

  return (
    passed && (
      <div className="min-h-screen w-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CuacaID</CardTitle>
            <CardDescription>
              Please complete the following data to continue!
            </CardDescription>
          </CardHeader>
          <form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            noValidate
          >
            <CardContent className="flex flex-col gap-y-5">
              <div className="grid gap-y-2">
                <Label>Full Name</Label>
                <Input
                  name={fields.fullName.name}
                  defaultValue={fields.fullName.initialValue}
                  key={fields.fullName.key}
                  placeholder="John Doe"
                />
                <p className="text-red-500 text sm">{fields.fullName.errors}</p>
              </div>
              <div className="grid gap-y-2">
                <Label>Username</Label>
                <div className="flex rounded-md">
                  {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  CuacaID.com/
                </span> */}
                  <Input
                    placeholder="John2005"
                    className="rounded-l-none"
                    name={fields.userName.name}
                    key={fields.userName.key}
                    defaultValue={fields.userName.initialValue}
                  />
                </div>
                <p className="text-red-500 text sm">{fields.userName.errors}</p>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton text="Submit" className="w-full" />
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  );
}

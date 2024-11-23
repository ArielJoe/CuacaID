/*
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CalendarCheckIcon } from "lucide-react";

export default function OnboardingRouteTwo() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Almost Done!</CardTitle>
          <CardDescription>
            We have to connect your calendar to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/api/auth">
              <CalendarCheckIcon className="mr-2"></CalendarCheckIcon>Connect
              Calendar to Your Account
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
*/
"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRouteTwo() {
  useEffect(() => {
    redirect("/dashboard");
  }, []);
}

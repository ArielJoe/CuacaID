"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { getData, SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../lib/zodSchemas";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { requireUser } from "../lib/hooks";

interface UserData {
  name: string;
  email: string;
  image?: string;
}

export default function SettingsForm() {
  const [data, setData] = useState<UserData | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState("");
  const [lastResult, action] = useActionState(SettingsAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const fetchData = async () => {
      const session = await requireUser();
      const userData = await getData(session.user?.id as string);
      setData(userData as UserData);
      setCurrentProfileImage(userData.image as string);
    };

    fetchData().catch((error) => {
      console.error("Error fetching data:", error);
      toast.error("Failed to load user data.");
    });
  }, []);

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="size-4 mr-2 animate-spin" />
        Fetching personal data...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              defaultValue={data.name}
              placeholder="John Doe"
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              disabled
              defaultValue={data.email}
              placeholder="johndoe@gmail.com"
            />
          </div>
          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage!}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <Image
                  src={currentProfileImage}
                  alt="Profile Image"
                  className="size-16 rounded-lg"
                  width={50}
                  height={50}
                />
                <Button
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="absolute -top-3 -right-3 size-6"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profile Image has been uploaded!");
                }}
                onUploadError={(error) => {
                  console.log("Something went wrong", error);
                  toast.error(error.message);
                }}
                endpoint="imageUploader"
              />
            )}
            <p className="text-red-500 text-s">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes"></SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}

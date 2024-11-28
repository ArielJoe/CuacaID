import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Logo from "@/public/logo.jpg";
import { signIn } from "../lib/auth";
import { GoogleAuthButton } from "./SubmitButtons";
import { RainbowButton } from "@/components/ui/rainbow-button";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <RainbowButton className="text-lg p-3 w-full h-full">Schedule Now</RainbowButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogTitle>Sign in</DialogTitle>
        <DialogHeader className="flex flex-row justify-center items-center gap-2">
          <Image src={Logo} alt="Logo" className="size-10" />
          <p className="text-3xl font-semibold ml-3">CuacaID</p>
        </DialogHeader>
        <div className="flex flex-col mt-2">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="w-full"
          >
            <GoogleAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

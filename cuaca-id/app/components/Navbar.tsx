import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.jpg";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full p-7 flex justify-between items-center z-10 ">
      <Link href="/" className="flex items-center">
        <Image src={Logo} alt="Logo" className="size-10" />
        <h4 className="text-2xl font-semibold ml-4">CuacaID</h4>
      </Link>
      <div className="flex gap-3">
        <ThemeToggle />
      </div>
    </div>
  );
}

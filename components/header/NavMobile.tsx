import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Navbar from "./Navbar";
import Logo from "../shared/Logo";

const NavMobile = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Logo />
          <Separator className="border border-gray-50" />
          <Navbar />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavMobile;

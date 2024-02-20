import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Navbar from "./Navbar";
import NavMobile from "./NavMobile";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36 ml-1">
          <Image src="/light.png" height={40} width={120} alt="Summit Spot" />
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <Navbar />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3 mr-1">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <NavMobile />
          </SignedIn>

          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;

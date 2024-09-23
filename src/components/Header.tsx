import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import { Bell, LogOut } from "lucide-react";
import DateNow from "./DateNow";
import { getDateNow } from "@/utils";
import Link from "next/link";
import LogoutButton from "./LogoutButton";


const Header = () => {
  const currentDate = getDateNow();

  return (
    <div className="border-b sticky z-10 top-0 py-4 bg-white">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center">
          <Link href={"/"} passHref legacyBehavior>
            <Image
              className="cursor-pointer"
              priority
              alt="..."
              src={"/insw-logo.png"}
              width={100}
              height={100}
            />
          </Link>
          <div className="flex gap-2">
            <DateNow time={currentDate} />
            <Bell size={24} />
            <LogoutButton />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Header;

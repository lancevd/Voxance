"use client";
import NavBar from "@/app/components/site/NavBar";
import { usePathname } from "next/navigation";

const NavBarWrapper = () => {
  const pathname = usePathname();
  return !pathname.includes("dashboard") ? <NavBar /> : null;
};

export default NavBarWrapper;

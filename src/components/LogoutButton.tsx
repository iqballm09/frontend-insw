"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    router.replace(`/api/auth/signout`);
  };
  return <LogOut onClick={handleLogout} size={24} className="cursor-pointer" />;
};

export default LogoutButton;

"use client";

import { useAppState } from "@/provider/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function titleCase(text: string) {
  return text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export const Breadcumbs = ({ token, user }: any) => {
  const context = useAppState();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      // console.log({ user });
      context.setUserInfo(user);
      localStorage.setItem("access_token", token);
    }
  }, [context, token, user]);

  if (!user) {
    localStorage.clear();
    router.replace(`/api/auth/signout`);
  }
  return (
    <h1 className="my-4">
      {user.roleId == 2 ? "Shipping Line" : "Cargo Owner"} {`/ ${context.userInfo ? context.userInfo?.profile.details.full_name : "Loading..."}`} {`${context.isEditPage || (context.isShippingLineProcessing && context.containerIdActive) ? " / DO Process" : ""}`}
    </h1>
  );
};
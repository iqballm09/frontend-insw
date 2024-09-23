import { validateToken } from "@/utils/api";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("api/auth/signin");
  const { searchParams } = new URL(request.url);
  const access_token = searchParams.get("token");
  console.log({ access_token });

  if (!access_token) {
    return NextResponse.redirect(
      (process.env.NEXT_PUBLIC_API_URI as string) + "/"
    );
  }

  const isAuthenticated = await validateToken(access_token);

  if (!isAuthenticated) {
    return NextResponse.redirect(
      (process.env.NEXT_PUBLIC_API_URI as string) + "/"
    );
  }

  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Expires in 1 hour

  return NextResponse.redirect((process.env.WEB_URI as string) + "/", {
    headers: {
      "Set-Cookie": `access_token=${access_token}; HttpOnly; Path=/; Expires=${expires.toUTCString()}`,
    },
  });
}

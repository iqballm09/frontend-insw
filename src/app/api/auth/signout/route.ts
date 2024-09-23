import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  cookies().delete("access_token");

  redirect(`${process.env.NEXT_PUBLIC_API_URI}/auth/signout` as string);
}

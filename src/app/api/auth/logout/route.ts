import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(options);

  //   if (session) {
  //     // Clear the session cookies
  //     const response = NextResponse.json({ message: "Access token revoked" });

  //     response.cookies.set("__Secure-next-auth.session-token", "", { path: "/", expires: new Date(0), sameSite: "lax", secure: true });
  //     response.cookies.set("__Secure-next-auth.csrf-token", "", { path: "/", expires: new Date(0), sameSite: "lax", secure: true });

  //     // Optionally clear any other cookies or tokens
  //     response.cookies.set("next-auth.session-token", "", { path: "/", expires: new Date(0), sameSite: "lax", secure: true });
  //     response.cookies.set("next-auth.csrf-token", "", { path: "/", expires: new Date(0), sameSite: "lax", secure: true });

  //     console.log(session);
  //     return response;
  //   }

  return NextResponse.json({ message: session }, { headers: corsHeaders });
};

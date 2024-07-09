import { corsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: NextRequest) => {
  const response = NextResponse.json({ message: "Access Token reverted" }, { headers: corsHeaders });
  response.cookies.set("token", "", { httpOnly: true, path: "/", expires: new Date(0) }); // Clear the token cookie

  return response;
};

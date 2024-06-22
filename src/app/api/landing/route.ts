import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ message: "welcome" }, { headers: corsHeaders });
};

/** this route is mainly use when user is not authenticated */
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ message: "welcome" });
};

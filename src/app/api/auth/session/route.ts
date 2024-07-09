import { Session, getServerSession } from "next-auth";
import { options } from "../([...nextauth])/options";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  // const session = await getServerSession(options);

  // return Response.json(session);

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = await verifyAuth(token, process.env.JWT_KEY!);
    return NextResponse.json({ authenticated: true, user, accessToken: token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
};

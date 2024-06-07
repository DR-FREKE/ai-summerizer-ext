import { Session, getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  console.log("user sessions", session);

  return Response.json(session);
};

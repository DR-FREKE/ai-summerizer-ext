import { Session, getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(options);

  console.log("my session", session);

  return Response.json(session);
};

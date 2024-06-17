// export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { get_jwt_secret, verifyAuth } from "./lib/auth";

declare module "next/server" {
  interface NextRequest {
    currentUser?: UserPayload;
  }
}

interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export const middleware = async (req: NextRequest) => {
  //get the token from the request header
  const header = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!header) {
    return NextResponse.json({ message: "UnAuthorized Request" }, { status: 401 });
  }

  console.log("my token", header);
  const token = header.split(" ")[1];

  if (!token) {
    // if token does not exist, give a response
  }

  try {
    const user_data = await verifyAuth(token, get_jwt_secret());
    console.log(user_data);
  } catch (error) {
    console.log("my error", error);

    return NextResponse.json({ message: "Error Unauthorized Request" }, { status: 401 });
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/api/landing"],
};

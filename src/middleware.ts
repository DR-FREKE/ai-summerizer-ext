// export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

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
  const header = req.headers.get("authorization");

  if (!header) {
    return NextResponse.json({ message: "UnAuthorized Request" }, { status: 401 });
  }

  console.log("my token", header);
  const token = header;
  try {
    const user_data = <UserPayload>jwt.verify(token, process.env.JWT_KEY!);
    req.currentUser = user_data;
  } catch (error) {
    console.log("my error", error);

    return NextResponse.json({ message: "Error Unauthorized Request" }, { status: 401 });
  }
  // return NextResponse.next();
};

export const config = {
  matcher: ["/api/landing"],
};

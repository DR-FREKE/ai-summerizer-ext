import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { signJWT } from "@/lib/auth";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!, process.env.GOOGLE_CLIENT_SECRET!, `${process.env.APP_URL}/api/auth/callback`);

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") as string;
  let redirect_url = process.env.APP_URL;

  try {
    // Parse state parameter
    const state_param = searchParams.get("state");
    if (state_param) {
      const state = JSON.parse(decodeURIComponent(state_param));
      redirect_url = state.redirect || process.env.APP_URL;
    }

    console.log("state params: ", state_param);

    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const token = await signJWT({ name: payload?.name, email: payload?.email }, process.env.JWT_KEY!, { expiresIn: "1d" });

    const response = NextResponse.redirect(`${redirect_url}/`);
    response.cookies.set("token", token, { httpOnly: true, path: "/" });
    return response;
  } catch (error) {
    console.error("Error during authentication callback", error);
    return NextResponse.redirect(`${process.env.APP_URL}/login?error=callback_error`);
  }
};

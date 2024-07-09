import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!, process.env.GOOGLE_CLIENT_SECRET!, `${process.env.APP_URL}/api/auth/callback`);

export const GET = async (req: NextRequest) => {
  // get the redirect url...i.e the youtube video we were coming from on the extension and set in the state
  const redirect = req.nextUrl.searchParams.get("redirect") || process.env.APP_URL!;
  const state = encodeURIComponent(JSON.stringify({ redirect })); // cast redirect url to a uri type

  console.log("redirect URL is: ", redirect);

  /** use the google auth02 client to generate a auth url */
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    state,
  });
  return NextResponse.redirect(url);
};

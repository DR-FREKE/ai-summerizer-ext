/** this route is mainly use when user is not authenticated */
import { getVideoById } from "@/actions/video_actions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // get type and video_id from request body
  const { video_id, type, language } = Object.fromEntries(new URL(req.url).searchParams.entries());
  const regex_match = /^(insights|timestamp_summary)$/;
  let result;

  if (regex_match.test(type)) {
    const video = await getVideoById(video_id, type);
    result = video;

    console.log(result);
  }

  return NextResponse.json({ data: result });
};

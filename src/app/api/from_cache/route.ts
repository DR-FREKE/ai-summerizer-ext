/** this route is mainly use when user is not authenticated */
import { getVideoById, getVideoFromCache } from "@/actions/video_actions";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest) => {
  // get type and video_id from request body
  const { video_id, type, language } = Object.fromEntries(new URL(req.url).searchParams.entries());
  const regex_match = /^(insights|timestamp_summary)$/;
  let result;

  if (regex_match.test(type)) {
    /** TODO: get this from cache instead */
    const video = await getVideoFromCache(video_id, type);
    result = video;

    console.log(result);
  }

  return NextResponse.json({ data: result }, { headers: corsHeaders });
};

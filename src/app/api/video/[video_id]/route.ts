import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { getVideoFromCache } from "@/actions/video_actions";
import { redis } from "@/lib/redis";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest, context: any) => {
  const {
    params: { video_id },
  } = context; // get video_id from url path

  try {
    // check cache if video ID exist
    const video_exist = await redis.get(video_id);
    if (video_exist) {
      return NextResponse.json({ data: true, message: "welcome" }, { headers: corsHeaders });
    }

    // if video not in cache return a not found response
    return NextResponse.json({ message: "video not found" }, { status: 404, headers: corsHeaders });
  } catch (error: any) {
    console.error("error occured", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// TODO: use the transcript and the video ID to query chatgpt

import { corsHeaders } from "@/lib/cors";
import { getVideoTopComments } from "@/actions/youtube_actions";
import { NextRequest, NextResponse } from "next/server";
import { default_data_structure } from "@/lib/data";
import { fetchVideoData } from "@/service/transcript.service";

export const maxDuration = 50; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

/** TODO: will fix the structure of response later so we don't have to keep writing: return NextResponse.json({ data: result, message: "data retrieved successfully" }, { headers: corsHeaders }); */

export const GET = async (req: NextRequest) => {
  // get type and video_id from request body
  const { video_id, type, language } = Object.fromEntries(new URL(req.url).searchParams.entries());
  let result;

  try {
    // if type is equal to comment load real time data for top comment...we don't store comment in the database so we can always get real time data
    if (type == "comments") {
      const top_comments = await getVideoTopComments(video_id);
      result = { ...default_data_structure, comments: { tdlr: null, top_comments } };

      return NextResponse.json({ data: result, message: "data retrieved successfully" }, { headers: corsHeaders });
    }

    //fetch video data and process it
    result = await fetchVideoData(video_id, type);
    if (result) {
      return NextResponse.json({ data: result, message: "data retrieved successfully" }, { headers: corsHeaders });
    }

    return NextResponse.json({ message: "data not found" }, { status: 404, headers: corsHeaders });
  } catch (error: any) {
    console.error("error occured", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

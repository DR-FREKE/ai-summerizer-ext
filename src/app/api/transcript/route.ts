// TODO: use the transcript and the video ID to query chatgpt

import { corsHeaders } from "@/lib/cors";
import { getTranscript, getYouTubeData, getVideoTopComments } from "@/actions/youtube_actions";
import { runGTP } from "@/actions/gpt_actions";
import { addVideo, getVideoById } from "@/actions/video_actions";
import { NextRequest, NextResponse } from "next/server";
import { default_data_structure } from "@/lib/data";

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

    // check if video_id exist in the database by calling the getVideoById function
    const video = await getVideoById(video_id, type);
    if (video) {
      // if video exist, return the video but use the type passed from query query the object i.e if it insights or timestamp summary
      return NextResponse.json({ data: video, message: "data retrieved successfully" }, { headers: corsHeaders });
    }

    // if video does not exist, query chatgpt by calling gpt action and passing the transcript...when the result returns, add the result to the db and cache
    // NOTE: pass the transcript from the request body to the gpt action
    const transcript = await getTranscript(video_id);

    /**NOTE: cocurrently call youtube api with the video id and query chatgpt if the video doesn't exist */
    const [data1, data2] = await Promise.all([getYouTubeData(video_id), runGTP(transcript)]);

    /** if both data are available, transform data to save to Database */
    if (data1 && data2) {
      const video_data = { ...data1[0], ...data2 };
      await addVideo(video_data); // add video data to databse

      // change state of result
      result = { ...default_data_structure, summary: video_data.summary, [type]: video_data[type as keyof typeof video] };
    }
    return NextResponse.json({ data: result, message: "data retrieved successfully" }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("error occured", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

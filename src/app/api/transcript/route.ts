// TODO: use the transcript and the video ID to query chatgpt

import { getTranscript, getYouTubeData } from "@/actions/youtube_actions";
import { runGTP } from "@/actions/gpt_actions";
import { addVideo, getVideoById } from "@/actions/video_actions";
import { corsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import { default_data_structure } from "@/lib/data";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest) => {
  // get type and video_id from request body
  const { video_id, type, language } = Object.fromEntries(new URL(req.url).searchParams.entries());

  try {
    // check if video_id exist in the database by calling the getVideoById function
    const video = await getVideoById(video_id, type);
    if (video) {
      // if video exist, return the video but use the type passed from query query the object i.e if it insights or timestamp summary
      return NextResponse.json({ data: video });
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

      return NextResponse.json({ message: { ...default_data_structure, summary: video_data.summary, [type]: video_data[type as keyof typeof video] } }, { headers: corsHeaders });
    }
  } catch (error: any) {
    console.error("error occured", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

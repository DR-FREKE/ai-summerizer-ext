// TODO: use the transcript and the video ID to query chatgpt

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // get transcript and video_id from request body

  // check if video_id exist in the database by calling the getVideoById function

  // if video exist, return the video but use the type passed from query query the object i.e if it insights or timestamp summary

  // if video does not exist, query chatgpt by calling gpt action...when the result returns, add the result to the db and cache
  // NOTE: pass the transcript from the request body to the gpt action

  /**NOTE: cocurrently call youtube api with the video id and query chatgpt if the video doesn't exist */
  return NextResponse.json({ message: "welcome" });
}

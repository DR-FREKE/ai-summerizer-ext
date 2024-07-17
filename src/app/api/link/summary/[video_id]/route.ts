import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { getVideoById } from "@/actions/video_actions";
import prisma from "@/lib/db";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest, context: any) => {
  const SHARE_URL = "https://summerizer-ext.vercel.app";
  const {
    params: { video_id },
  } = context;

  try {
    const video_data = await prisma.video.findUnique({ where: { video_id }, select: { slug: true, category: true } });
    if (video_data) {
      const { slug, category } = video_data;
      const url = `${SHARE_URL}/share/video/${category}/${slug}`; // come back to get the actual pathname

      return NextResponse.json({ url }, { headers: corsHeaders });
    }
    throw new Error("sorry, couldn't get this video");
  } catch (error: any) {
    console.error("error occured", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

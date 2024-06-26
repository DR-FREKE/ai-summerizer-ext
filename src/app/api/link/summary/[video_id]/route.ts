import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { getVideoById } from "@/actions/video_actions";
import prisma from "@/lib/db";

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: NextRequest, context: any) => {
  const SHARE_URL = "http://localhost:3000";
  const {
    params: { video_id },
  } = context;

  const video_data = await prisma.video.findUnique({ where: { video_id }, select: { slug: true, category: true } });
  if (video_data) {
    const { slug, category } = video_data;
    const url = `${SHARE_URL}/share/video/${category}/${slug}`;

    return NextResponse.json({ url }, { headers: corsHeaders });
  }
  throw new Error("sorry, couldn't get this video");
};

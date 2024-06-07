"use server";

import { share_data } from "@/lib/data";
import prisma from "@/lib/db";

/** function to get a particular video using the ID */
export const getVideoById = async (video_id: string, type: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        video_id,
      },
      include: {
        timestamp_summary: true,
        insights: {
          include: {
            points: true,
          },
        },
      },
    });

    if (!video) {
      // maybe return an error
    }

    // else transform data using the type passed
    const result = {
      ...video,
      insights: type.match("insight") ? video?.insights : null,
      timestamp_summary: type.match("summary") ? video?.timestamp_summary : null,
    };

    /** store result in cache */

    return result;
  } catch (error) {
    console.error("Failed to retrieve video", error);
    return;
  }
};

/** function to get a video by the video name and possible the category */
export const getVideoByName = async (video_name: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        video_name,
        video_id: "",
      },
      include: {
        timestamp_summary: true,
        insights: {
          include: {
            points: true,
          },
        },
      },
    });
  } catch (error) {}
};

/** function to add a video to the database after data from chatgpt and youtube api gets merged */
export const addVideo = async (video_data: typeof share_data) => {
  const { timestamp_summary, insights } = video_data;
  try {
    const video = await prisma.video.create({
      data: {
        ...video_data,
        timestamp_summary: {
          create: timestamp_summary.map(ts => ({
            icon: ts.icon,
            tldr: ts.tldr,
            start_time: ts.start_time,
            key_ideas: {
              create: ts.key_ideas.map(idea => ({
                idea,
              })),
            },
          })),
        },
        insights: {
          create: {
            name: insights.name,
            points: {
              create: insights.points.map(point => ({
                icon: point.icon,
                title: point.title,
              })),
            },
          },
        },
      },
    });
    return video;
  } catch (error) {
    return { error };
  }
};

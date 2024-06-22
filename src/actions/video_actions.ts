"use server";

import { share_data } from "@/lib/data";
import prisma from "@/lib/db";
import { default_data_structure } from "@/lib/data";
import { NextResponse } from "next/server";
import { formatSlug } from "@/lib/utils";

/** function to get a particular video using the ID */
export const getVideoById = async (video_id: string, type: string) => {
  let result;
  try {
    const video = await prisma.video.findUnique({
      where: {
        video_id,
      },
      include: {
        timestamp_summary: {
          select: {
            icon: true,
            tldr: true,
            start_time: true,
            key_ideas: {
              select: {
                idea: true,
              },
            },
          },
        },
        insights: {
          select: {
            name: true,
            points: {
              select: {
                icon: true,
                title: true,
              },
            },
          },
          take: 1,
        },
        transcript: true,
      },
    });

    if (!video) {
      // maybe return an error
      result = null;
      return;
    }

    /** transform the look of key ideas */
    const timestamp_processor = () => {
      return video.timestamp_summary.map(summary => ({
        ...summary,
        key_ideas: summary.key_ideas.map(idea => idea.idea),
      }));
    };

    // else transform data using the type passed
    result = {
      ...default_data_structure,
      summary: video.summary,
      [type]: type == "timestamp_summary" ? timestamp_processor() : video[type as keyof typeof video],
    };

    /** store result in cache */

    return result;
  } catch (error) {
    console.error("Failed to retrieve video", error);
    return;
  }
};

/** function to get a video by the video name and possible the category */
export const getVideoByName = async (video_name: string, category: string) => {
  try {
    /** use INNER JOIN to query article and bring video data related to the article */
    const article = await prisma.article.findFirst({
      where: {
        video: {
          slug: video_name,
          category,
        },
      },
      include: {
        video: {
          include: {
            timestamp_summary: true,
            insights: {
              select: {
                name: true,
                points: {
                  select: {
                    icon: true,
                    title: true,
                  },
                },
              },
              take: 1,
            },
            video_thumbnail: true,
            question_and_answer: true,
          },
        },
        ratings: true,
      },
    });

    return article;
  } catch (error: any) {
    NextResponse.json({ message: error.message });
  }
};

/** function to add a video to the database after data from chatgpt and youtube api gets merged */
export const addVideo = async (video_data: typeof share_data) => {
  const { timestamp_summary, insights, video_thumbnail } = video_data;
  let transaction;
  try {
    /** following ACID priciple to add video so we can immediately add an article */
    transaction = await prisma.$transaction([
      prisma.video.create({
        data: {
          ...video_data,
          slug: formatSlug(video_data.general_topic),
          category: video_data.category?.toLowerCase(),
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
          video_thumbnail: {
            create: video_thumbnail.map(thmb => ({
              thumbnail_url: thmb.thumbnail_url,
            })),
          },
        },
      }),
    ]);

    /** when transaction is successful */
    const video = transaction[0];
    const article = await prisma.article.create({
      data: {
        video_id: video.video_id,
      },
    });

    return video;
  } catch (error: any) {
    /** if error occurs, rollback the transaction */
    if (transaction) {
      await prisma.$executeRaw`ROLLBACK;`;
    }
    throw new Error(error.message);
  } finally {
    // close transaction
    await prisma.$disconnect();
  }
};

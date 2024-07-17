"use server";

import { share_data } from "@/lib/data";
import prisma from "@/lib/db";
import { default_data_structure } from "@/lib/data";
import { NextResponse } from "next/server";
import { formatSlug } from "@/lib/utils";
import { redis } from "@/lib/redis";
import { addFormattedTranscript } from "./gpt_actions";

type TimestampPayload = {
  icon: string;
  key_ideas: {
    idea: string;
  }[];
  start_time: number;
  tldr: string;
};

type InsightPayload = {
  name: string;
  points: {
    icon: string;
    title: string;
  }[];
};

type PayloadType = {
  timestamp_summary: TimestampPayload[];
  insights: InsightPayload;
};

/** function to get video data from the cache rather than the DB...this helps request time */
export const getVideoFromCache = async (video_id: string, type: string, limit?: number) => {
  // query cache, if cache data exist, return that else run a prisma query
  const cache_value = await redis.get(video_id);
  const cache_data = JSON.parse(cache_value || "{}");

  // if no cache value or cache data doesn't match
  if (!cache_value || !cache_data[type]) return null;

  let result = cache_data[type]; // if no limit or limit wasn't set to true return the whole data

  if (limit) {
    const halfLength = Math.ceil((type === "timestamp_summary" ? result?.timestamp_summary : result?.insights.points).length / 2);
    const val = halfLength < limit ? halfLength : limit;
    result =
      type === "timestamp_summary"
        ? { ...result, timestamp_summary: result?.timestamp_summary.slice(0, val) }
        : { ...result, insights: { ...result.insights, points: result.insights.points.slice(0, val) } };
  }

  return result;
};

/** transform the look of key ideas */
const timestamp_processor = (summary: TimestampPayload) => ({
  ...summary,
  key_ideas: summary.key_ideas.map(idea => idea.idea),
});

/** transform how timestamp summary and insights are supposed to be sent to the user */
const processData = (video: any): PayloadType => ({
  timestamp_summary: video.timestamp_summary.map(timestamp_processor),
  insights: video.insights[0],
});

// function to store video data to the redis store
const storeCacheData = async (video_id: string, type: string, data: unknown) => {
  //retrieve data from cache using video id
  const cache_data = await redis.get(video_id);
  const parsed_cache_data = JSON.parse(cache_data || "{}");

  /** store result in cache */
  const cache_structure = { ...parsed_cache_data, [type]: data }; // openup previous data if any and add the new data to update the cache
  await redis.set(video_id, JSON.stringify(cache_structure));
};

/** function to get a particular video using the ID */
export const getVideoById = async (video_id: string, type: string, language?: string) => {
  let result;

  try {
    // check cache
    const cache_data = await getVideoFromCache(video_id, type);
    if (cache_data) return cache_data;

    console.log(process.env.POSTGRES_PRISMA_URL);

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
            key_ideas: { select: { idea: true } },
          },
        },
        insights: {
          select: {
            name: true,
            points: { select: { icon: true, title: true } },
          },
          take: 1,
        },
        transcript: true,
      },
    });

    if (!video) {
      // maybe return an error
      return null;
    }

    const type_data = processData(video);

    // else transform data using the type passed
    result = {
      ...default_data_structure,
      summary: video.summary,
      [type]: type_data[type as keyof PayloadType] || video[type as keyof typeof video],
    };

    // call function to store data to cache
    await storeCacheData(video_id, type, result);

    // return result to users
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
    throw new Error("error occured on the server");
  } finally {
    // close transaction
    await prisma.$disconnect();
  }
};

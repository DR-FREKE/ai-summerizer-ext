"use server";

import { ItemsType, CommentSortType, CommentType, VideoDataType } from "@/lib/types";
import { YoutubeTranscript, type TranscriptResponse } from "youtube-transcript";
import { makeRequest } from "@/lib/utils";

const API_KEY = process.env.API_KEY; // api key for youtube data api

/** function to get top comments for a particular video */
export const getVideoTopComments = async (video_id: string) => {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${video_id}&key=${API_KEY}&part=snippet&order=relevance`;
  const data = await makeRequest(url);

  return data.items
    .map((item: ItemsType<CommentType>) => {
      const {
        snippet: {
          topLevelComment: { snippet: comment_item },
        },
      } = item;

      return {
        author_channel_url: comment_item.authorChannelUrl,
        author_display_name: comment_item.authorDisplayName,
        author_profile_image_url: comment_item.authorProfileImageUrl,
        id: item.snippet.topLevelComment.id,
        like_count: comment_item.likeCount,
        published_at: comment_item.publishedAt,
        text_display: comment_item.textDisplay,
        total_reply_count: item.snippet.totalReplyCount,
        updated_at: comment_item.updatedAt,
      };
    })
    .sort((a: CommentSortType, b: CommentSortType) => b.like_count - a.like_count);
};

/** function to call youtube API */
export const getYouTubeData = async (video_id: string) => {
  // call api here
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${API_KEY}&part=snippet,contentDetails,statistics`;
  const data = await makeRequest(url);

  return data.items.map((item: ItemsType<VideoDataType>) => ({
    video_id: item.id,
    video_name: item.snippet.title,
    video_thumbnail: Object.keys(item.snippet.thumbnails).map(key => ({ thumbnail_url: item.snippet.thumbnails[key as keyof typeof item.snippet.thumbnails].url })),
    video_url: `https://www.youtube.com/watch?v=${item.id}`,
  }));
};

const decodeText = (text: string) => {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "#39;": "'",
    // Add more if needed
  };

  return text.replace(/&amp;#39;/g, "'");
};

export const getTranscript = async (video_id: string) => {
  try {
    // get the video transcript
    const transcripts = await YoutubeTranscript.fetchTranscript(video_id, { lang: "en" });
    return transcripts.map(transcript => ({ ...transcript, text: decodeText(transcript.text) }));
  } catch (error) {
    throw new Error("couldn't fetch transcript, please confirm the video ID is valid");
  }
};

import { addVideo, getVideoById } from "@/actions/video_actions";
import { getTranscript, getYouTubeData } from "@/actions/youtube_actions";
import { runGTP, addFormattedTranscript } from "@/actions/gpt_actions";
import { default_data_structure } from "@/lib/data";

export const fetchVideoData = async (video_id: string, type: string, language?: string) => {
  // check if video_id exist in the database by calling the getVideoById function
  const video = await getVideoById(video_id, type);
  if (video) {
    // if video exist, return the video but use the type passed from query query the object i.e if it insights or timestamp summary
    return video;
  }

  // if video does not exist, query chatgpt by calling gpt action and passing the transcript...when the result returns, add the result to the db and cache
  // NOTE: pass the transcript from the request body to the gpt action
  const transcript = await getTranscript(video_id);

  /**NOTE: cocurrently call youtube api with the video id and query chatgpt if the video doesn't exist */
  const [youtube_data, gpt_data] = await Promise.all([getYouTubeData(video_id), runGTP(transcript)]);

  /** if both data are available, transform data to save to Database */
  if (youtube_data && gpt_data) {
    const video_data = { ...youtube_data[0], ...gpt_data };
    await addVideo(video_data); // add video data to databse
    await addFormattedTranscript(transcript, video_id); // add a formatted transcript

    // change state of result
    const result = { ...default_data_structure, summary: video_data.summary, [type]: video_data[type as keyof typeof video] };

    return result;
  }

  return null;
};

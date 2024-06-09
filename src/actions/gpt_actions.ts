import { YoutubeTranscript, type TranscriptResponse } from "youtube-transcript";

interface CategorySnippet {
  title: string;
}

interface Category {
  id: string;
  snippet: CategorySnippet;
}
interface CategoryResponse {
  kind: string;
  etag: string;
  items: Category[];
}

const API_KEY = process.env.API_KEY; // api key for youtube data api

/** utility function to make request */
const makeRequest = async (url: string, method?: string, body?: any) => {
  const res = await fetch(url);
  if (res.ok) {
    // return the data
    return await res.json();
  } else {
    const error_details = await res.text();
    throw new Error(`Request failed with status ${res.status}`);
  }
};

/** function to get video category */
export const getVideoCategory = async (category_id: string): Promise<CategoryResponse> => {
  const data = await makeRequest(`https://www.googleapis.com/youtube/v3/videoCategories?id=${category_id}&key=${API_KEY}&part=snippet`);
  return data;
};

/** function to call youtube API */
export const getYouTubeData = async (video_id: string) => {
  // call api here
  const data = await makeRequest(`https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${API_KEY}&part=snippet,contentDetails,statistics`);
  if (data.items.length > 0) {
    const category_id = data.items[0].snippet.categoryId;
    const category_data = await getVideoCategory(category_id);
    data.items[0].snippet.category_name = category_data.items.find(item => item.id == category_id)?.snippet.title; // get the title and add it as the category name
    return data; // TODO: transform data
  }
};

export const getTranscript = async (video_id: string) => {
  try {
    // get the video transcript
    const transcript = await YoutubeTranscript.fetchTranscript(video_id);
    return transcript;
  } catch (error) {
    throw new Error("couldn't fetch transcript");
  }
};

export const queryGPT = async (transcript: TranscriptResponse[]) => {
  if (transcript && transcript.length !== 0) {
    // run query
    return transcript;
  }
};

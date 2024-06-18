export type Snippet = {
  title: string;
};

export type CommentType = {
  topLevelComment: {
    snippet: {
      authorChannelUrl: string;
      authorDisplayName: string;
      authorProfileImageUrl: string;
      likeCount: number;
      publishedAt: string;
      textDisplay: string;
      updatedAt: Date;
    };
    id: string;
  };
  totalReplyCount: number;
};

export type VideoDataType = {
  publishedAt: string;
  title: string;
  thumbnails: {
    default: {
      url: string;
    };
    medium: {
      url: string;
    };
  };
};

export type ItemsType<T> = {
  id: string;
  snippet: T;
  statistics?: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
};

export type CommentSortType = {
  author_channel_url: string;
  author_display_name: string;
  author_profile_image_url: string;
  id: string;
  like_count: number;
  published_at: string;
  text_display: string;
  total_reply_count: number;
  updated_at: string;
};
// export type YoutubeResponseType = {
//   kind: string;
//   etag: string;
//   items: ItemsType[];
// };

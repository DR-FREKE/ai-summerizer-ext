import { getVideoByName } from "@/actions/video_actions";
import { ShareHeader } from "@/components/share/header";
import { ShareSummary } from "@/components/share/share.summary";
import { YoutubeVideoComp } from "@/components/share/youtube";
import prisma from "@/lib/db";

/**const video_data = await prisma.video.findMany({
    where: {
      video_id: {
        contains: "vid",
      },
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      // this is similar to something mongoose has where you can select the data you want to return
      video_name: true,
    },
    skip: 10,
    take: 10,
  }); */

type ParamsType = {
  params: {
    tube: string[];
  };
};

const SharePage = async ({ params }: ParamsType) => {
  const [category, video_name] = params.tube;
  const article = await getVideoByName(video_name, category);
  const video_data = article?.video;
  const video_count = await prisma.video.count();

  const thumbnails = video_data?.video_thumbnail.map(thumbnail => thumbnail.thumbnail_url);

  if (params.tube.length !== 2) {
    return <div>Not Found Route...</div>;
  }

  if (!video_data) {
    return <div>The Item you are looking for does not exist</div>;
  }

  return (
    <div className="m-[0_auto] md:max-w-[1232px] max-w-full p-[0_16px_32px] text-left box-border">
      <ShareHeader />
      <div className="flex flex-wrap sm:flex-row flex-col justify-between mb-[85px]">
        <ShareSummary data={video_data} />
        <div className="md:w-[32%] sticky top-[32px] h-full md:flex md:flex-col hidden">
          <YoutubeVideoComp name={video_data.video_name} thumbnails={thumbnails!} url={video_data.video_url!} />
          video {video_count}
        </div>
      </div>
    </div>
  );
};

export default SharePage;

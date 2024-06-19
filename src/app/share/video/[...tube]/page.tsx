import { getVideoByName } from "@/actions/video_actions";
import { AnimatedDiv } from "@/components/animated_div";
import { AppButton } from "@/components/button";
import { ShareHeader } from "@/components/share/header";
import { RateArticle } from "@/components/share/rate";
import { ShareSummary } from "@/components/share/share.summary";
import { SummerizeVidComp, YoutubeVideoComp } from "@/components/share/youtube";
import prisma from "@/lib/db";
import { FaRegFlag } from "react-icons/fa";

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
  const rate_count = await prisma.ratings.count({ where: { article_id: article?.id } });
  const thumbnails = video_data?.video_thumbnail.map(thumbnail => thumbnail.thumbnail_url);
  const rate_agg = await prisma.ratings.aggregate({ where: { article_id: article?.id }, _avg: { rate: true } });

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
          <YoutubeVideoComp name={video_data.video_name} thumbnails={thumbnails!} url={video_data.video_id} />
          <SummerizeVidComp />
          <RateArticle id={article.id} count={rate_count} aggregate={rate_agg._avg.rate || 0} />
          <AppButton name="Report the article" className="self-start text-[#000000] bg-brand-gray mt-[16px]" icon={<FaRegFlag size={18} />} />
        </div>
      </div>
    </div>
  );
};

export default SharePage;

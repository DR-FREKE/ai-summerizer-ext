import { ShareHeader } from "@/components/share/header";
import { ShareSummary } from "@/components/share/share.summary";
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
  const video_data = await prisma.video.findUnique({
    where: {
      video_name: "",
      // add video category as well
    },

    select: {
      // this is similar to something mongoose has where you can select the data you want to return
      video_name: true,
    },
  });
  const video_count = await prisma.video.count();

  if (params.tube.length !== 2) {
    return <div>Not Found Route...</div>;
  }
  return (
    <div className="m-[0_auto] md:max-w-[1232px] max-w-full p-[0_16px_32px] text-left box-border">
      <ShareHeader />
      <div className="flex flex-wrap sm:flex-row flex-col justify-between mb-[85px]">
        <ShareSummary />
        <div className="">video {video_count}</div>
      </div>
    </div>
  );
};

export default SharePage;

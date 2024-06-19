import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FlatList, DataProps } from "../list";
import { QandA_data, share_data } from "../../lib/data";
import { InsightComp } from "../insight";
import { QandAComp } from "../questionandanswer";
import { TimestampComp } from "../timestamp";
import clsx from "clsx";
import { Apple } from "iconsax-react";
import { YoutubeVideoComp } from "./youtube";
import { AnimatedDiv, SliderImage } from "../animated_div";
import { DownloadBtn } from "../button";

const convertUnicodeToEmoji = (unicode: string) => JSON.parse(`"${unicode}"`);

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
};

const processTimestamp = (data: { icon: any; tldr: string; start_time: number }) => ({
  icon: data.icon,
  start_time: formatTime(data.start_time),
  tldr: data.tldr,
});

const SummaryText = ({ text }: { text?: string | ReactNode }) => (
  <p className="text-base sm:text-2xl text-white font-extrabold leading-5 sm:leading-7 tracking-[-0.12px] max-w-[136px] sm:max-w-[280px]">
    <span>{text || <>Summarize any video by&nbsp;yourself</>}</span>
  </p>
);

interface RenderProps {
  item: any;
  index: number;
}

export const ShareSummary = ({ data }: { data: any }) => {
  // render Insight items
  const renderItem = ({ item, index }: RenderProps) => <InsightComp {...item} />;

  // render questions and answers
  const renderQandA = ({ item, index }: RenderProps) => <QandAComp {...item} />;

  // render timestamp summary
  const renderTimestampSum = ({ item, index }: { item: any; index: number }) => <TimestampComp {...item} />;

  const timestamp_summary = data.timestamp_summary.map(processTimestamp);

  return (
    <div className="sm:w-[57.5%] flex flex-col">
      <div>
        <h1 className="md:text-[48px] text-[32px] font-extrabold md:leading-[1.08] leading-[1.19] mb-[24px] md:tracking-[-0.48px] tracking-[-0.32px]">{data.general_topic}</h1>
        <div className="sm:hidden flex">{/* <YoutubeVideoComp name={data.video_name} /> */}</div>
      </div>
      <div className="text-2xl font-semibold leading-[1.4]">
        <span className="font-extrabold tracking-[0.96px] text-black/15">TLDR</span> <span className="font-lora-font">{data.summary}</span>
      </div>
      <div className="my-[24px]">
        <div className="cursor-pointer relative bg-[#141414] overflow-hidden p-[8px_8px_8px_16px] sm:p-[18px_24px] rounded-lg sm:rounded-xl">
          <div className="">
            <SliderImage width="700" height={700} />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex gap-3 sm:gap-4 items-center">
              <picture>
                <Image src={"https://eightify.app/seo-static/sparkles-mono.svg"} alt="" width="80" height="80" quality={"95"} priority={true} className="sm:w-[56px] sm:h-[56px] w-[32px] h-[32px]" />
              </picture>
              <SummaryText />
            </div>
            <DownloadBtn />
          </div>
        </div>
      </div>
      <section className="mt-4">
        <h3 className="text-[26px] mb-5">{data.insights[0].name}</h3>
        <FlatList data={data.insights[0].points} renderItem={renderItem} className="gap-[24px]" />
        <h3 className="text-[26px] mb-5 mt-8">Potential of Neuralink Technology</h3>
        {/* <FlatList /> */}
      </section>
      <section className="mb-12">
        <h2 className="text-[32px] font-extrabold leading-5 mb-6">Q&A</h2>
        <FlatList data={QandA_data} renderItem={renderQandA} className="gap-[24px]" />
      </section>
      <section className="mb-12">
        <h2 className="text-[32px] font-extrabold leading-5 mb-6">Timestamped Summary</h2>
        <FlatList data={timestamp_summary} renderItem={renderTimestampSum} className="gap-[24px]" />
      </section>
      <AnimatedDiv>
        <div className="flex flex-col items-center gap-[28px] z-10 my-[32px]">
          <picture>
            <Image src={"https://eightify.app/seo-static/sparkles-mono.svg"} alt="" width="80" height="80" quality={"95"} priority={true} className="" />
          </picture>
          <p className="text-white text-center text-[32px] font-extrabold leading-[36px] max-w-custom"> Summarize any video by yourself </p>
          <div className="flex-1 relative flex flex-col items-center md:max-w-auto max-w-[680px] gap-[12px]">
            <DownloadBtn className="!p-[16px_24px]" width={32} height={32} />
            <div className="flex gap-[12px] items-center">
              <span className="md:hidden block text-brand-white text-center">Also:</span>
              <span className="md:block hidden text-brand-white text-center">Other options:</span>
              <Link href="" target="_blank" className="flex gap-[4px] items-center text-brand-white02">
                <Apple variant="Bulk" size={22} />
                <span>IOS</span>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedDiv>
    </div>
  );
};

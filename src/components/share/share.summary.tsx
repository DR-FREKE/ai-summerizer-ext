import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FlatList, DataProps } from "../list";
import { share_data } from "../../../lib/data";
import { InsightComp } from "../insight";

const DownloadBtn = () => (
  <Link
    href={""}
    target="_blank"
    className="sm:rounded-xl rounded-lg sm:p-[10px_20px] p-[6px_12px_6px_10px] flex sm:gap-[10px] gap-2 justify-center items-center bg-white sm:max-w-none max-w-[140px] shadow-md border-[0.5px] border-black/15"
  >
    <Image
      src={"https://eightify.app/seo-static/Chrome_icon.svg"}
      alt=""
      width={"28"}
      height={"28"}
    />
    <p className="text-[#000] sm:text-[18px] text-[10px] sm:font-semibold sm:leading-[22px] leading-3 sm:tracking-[-0.18px] tracking-[0.1px]">
      <span>Install&nbsp;on </span>
      <span className="lbs-button__browser-name">Chrome</span>
    </p>
  </Link>
);

const SummaryText = ({ text }: { text?: string | ReactNode }) => (
  <p className="text-base sm:text-2xl text-white font-extrabold leading-5 sm:leading-7 tracking-[-0.12px] max-w-[136px] sm:max-w-[280px]">
    <span>{text || <>Summarize any video by&nbsp;yourself</>}</span>
  </p>
);

export const ShareSummary = () => {
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <InsightComp {...item} />
  );
  return (
    <div className="sm:w-[57.5%] flex flex-col">
      <div>
        <h1 className="md:text-[48px] text-[32px] font-extrabold md:leading-[1.08] leading-[1.19] mb-[24px] md:tracking-[-0.48px] tracking-[-0.32px]">
          Appreciating Flaws, AI Synergy & Hygiene: Joe Rogan & Elon Musk
        </h1>
        <div className="sm:hidden flex">Video Component for mobile view</div>
      </div>
      <div className="text-2xl font-semibold leading-[1.4]">
        <span className="font-extrabold tracking-[0.96px] text-black/15">
          TLDR
        </span>{" "}
        <span className="font-lora-font">
          The coronavirus pandemic has highlighted the need to appreciate our
          flaws, form a symbiotic relationship with AI, and take proper hygiene
          precautions to protect ourselves and those at risk.
        </span>
      </div>
      <div className="my-[24px]">
        <div className="cursor-pointer relative bg-[#141414] overflow-hidden p-[8px_8px_8px_16px] sm:p-[18px_24px] rounded-lg sm:rounded-xl">
          <div className="">
            <Image
              src="https://eightify.app/shared/static/lights-banner/blue.svg"
              alt=""
              width="80"
              height="100"
              className="absolute h-[700%] w-[100%] sm:scale-[10] animate-moving-blue left-[-50%]"
            />
            <Image
              src="https://eightify.app/shared/static/lights-banner/violet.svg"
              alt=""
              width="80"
              height="100"
              className="absolute h-[700%] w-[100%] transform sm:scale-[10] animate-moving-violet left-[-50%]"
            />
            <Image
              src="https://eightify.app/shared/static/lights-banner/yellow.svg"
              alt=""
              width="80"
              height="100"
              className="absolute h-[700%] w-[100%] transform sm:scale-[10] animate-moving-yellow left-[-50%]"
            />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex gap-3 sm:gap-4 items-center">
              <picture>
                <Image
                  src={"https://eightify.app/seo-static/sparkles-mono.svg"}
                  alt=""
                  width="80"
                  height="80"
                  quality={"95"}
                  priority={true}
                  className="sm:w-[56px] sm:h-[56px] w-[32px] h-[32px]"
                />
              </picture>
              <SummaryText />
            </div>
            <DownloadBtn />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-[26px] mb-5">
          Future of Technology and Human Interface
        </h3>
        <FlatList data={share_data.insights.points} renderItem={renderItem} />
      </div>
    </div>
  );
};

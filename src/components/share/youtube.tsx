"use client";

import { Youtube } from "iconsax-react";
import Image from "next/image";
import { useState } from "react";
import { AnimatedDiv } from "../animated_div";
import { DownloadBtn } from "../button";
import { FaYoutube } from "react-icons/fa6";

type YoutubeType = { name?: string; thumbnails: string[]; url?: string };

export const YoutubeVideoComp = ({ name, thumbnails, url }: YoutubeType) => {
  const thumbnail = thumbnails[3];
  const [isIframe, setIsIframe] = useState(false);

  return (
    <div className="flex flex-col items-start flex-wrap gap-[10px] m-0">
      <div className="w-full box-border rounded-[12px] overflow-hidden border-[2px] border-black aspect-[16/9] relative cursor-pointer">
        {!isIframe ? (
          <>
            <div className=""></div>
            <div className="relative w-full h-full flex justify-center items-center">
              <Image className="absolute flex justify-center object-cover h-full w-full m-0" alt="Play video" width={1000} height={1000} src={thumbnail} loading="eager" />
              <FaYoutube className="relative" size={68} color="red" onClick={() => setIsIframe(true)} />
            </div>
          </>
        ) : (
          <iframe
            className="w-full h-full absolute flex justify-center object-cover"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            width={640}
            height={360}
            src={`https://www.youtube.com/embed/${url}?autoplay=1&playsinline=1&rel=0&enablejsapi=1&origin=https%3A%2F%2Feightify.app&widgetid=1`}
          ></iframe>
        )}
      </div>

      <div className="flex-1 text-sm leading-[1.43] min-h-[56px] text-brand-gray02">This article is a summary of a YouTube video {name}</div>
    </div>
  );
};

export const SummerizeVidComp = () => {
  return (
    <AnimatedDiv className="p-[16px_20px_20px_20px] !rounded-2xl">
      <div className="relative flex flex-col items-start gap-[16px]">
        <p className="text-white text-[24px] font-extrabold leading-[28px]"> Summarize any video by yourself </p>
        <DownloadBtn />
      </div>
    </AnimatedDiv>
  );
};

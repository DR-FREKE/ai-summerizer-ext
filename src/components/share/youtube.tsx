"use client";

import { Youtube } from "iconsax-react";
import Image from "next/image";
import { useState } from "react";

type YoutubeType = { name?: string; thumbnails: string[]; url?: string };

export const YoutubeVideoComp = ({ name, thumbnails, url }: YoutubeType) => {
  const [isIframe, setIsIframe] = useState(false);
  const thumbnail = thumbnails[3];
  return (
    <div className="flex flex-col items-start flex-wrap gap-[10px] m-0">
      <div className="w-full box-border rounded-[12px] overflow-hidden border-[2px] border-black aspect-[16/9] relative cursor-pointer">
        {!isIframe ? (
          <>
            <div className=""></div>
            <div className="relative w-full h-full flex justify-center items-center">
              <Image className="absolute flex justify-center object-cover h-full w-full m-0" alt="Play video" width={1000} height={1000} src={thumbnail} loading="eager" />
              <Youtube variant="Bold" className="relative" size={68} color="red" />
            </div>
          </>
        ) : (
          <iframe></iframe>
        )}
      </div>

      <div className="flex-1 text-sm leading-[1.43] min-h-[56px] text-brand-gray02">This article is a summary of a YouTube video {name}</div>
    </div>
  );
};

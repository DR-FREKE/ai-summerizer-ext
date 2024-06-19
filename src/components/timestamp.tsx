"use client";

import { ReactNode } from "react";
import { share_data } from "../lib/data";

export type TimestampProps = (typeof share_data.timestamp_summary)[number];

export const TimestampComp = ({ icon, tldr, start_time }: TimestampProps) => {
  const handlePlayback = () => {
    alert(start_time);
  };

  return (
    <li className="flex gap-[8px] text-[18px] leading-[1.56] tracking-[0.032px]">
      <div>{icon}</div>
      <div className="">
        <span className="text-[#007AFF] cursor-pointer font-inter-font" onClick={handlePlayback}>
          {start_time}
        </span>
        <span className="ml-2">{tldr}</span>
      </div>
    </li>
  );
};

import { ReactNode } from "react";
import { share_data } from "../lib/data";

export type InsightProps = (typeof share_data.insights.points)[number];

export const InsightComp = ({ icon, title }: InsightProps) => (
  <li className="flex gap-[8px] mn-[16px] font-lora-font text-[18px] leading-[1.56] tracking-[0.032px]">
    <div>{icon}</div>
    <div>{title}</div>
  </li>
);

import { ReactNode } from "react";
import { QandA_data } from "../lib/data";

export type QandAProps = (typeof QandA_data)[number];

export const QandAComp = ({ question, answer }: QandAProps) => (
  <li className="flex flex-col gap-2">
    <p className="text-2xl font-semibold leading-[1.4] mb-2">{question}</p>
    <p className="font-lora-font text-[18px] leading-[1.56] flex gap-2">
      <span className="text-black/45">—</span>
      <span>{answer}</span>
    </p>
  </li>
);

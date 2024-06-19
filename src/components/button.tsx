"use client";

import React from "react";
import { clsx } from "clsx";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";

type ButtonPropsType = {
  name: string;
  onPress?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: JSX.Element;
  className?: string;
};

export const AppButton = ({ name, onPress, icon, className }: ButtonPropsType) => {
  const { pending } = useFormStatus();
  return (
    <button className={clsx(`py-2 px-5 cursor-pointer rounded-md bg-blue-500 disabled:bg-opacity-50 flex gap-3 items-center`, className)} onClick={onPress}>
      {icon}
      {name}
    </button>
  );
};

export const DownloadBtn = ({ className, width = 28, height = 28 }: { className?: React.ReactNode; width?: number; height?: number }) => (
  <Link
    href={""}
    target="_blank"
    className={clsx(
      "sm:rounded-xl rounded-lg sm:p-[10px_20px] p-[6px_12px_6px_10px] flex sm:gap-[10px] gap-2 justify-center items-center bg-white sm:max-w-none max-w-[140px] shadow-md border-[0.5px] border-black/15",
      className
    )}
  >
    <Image src={"https://eightify.app/seo-static/Chrome_icon.svg"} alt="" width={width} height={height} />
    <p className="text-[#000] sm:text-[18px] text-[10px] sm:font-semibold sm:leading-[22px] leading-3 sm:tracking-[-0.18px] tracking-[0.1px]">
      <span>Install&nbsp;on </span>
      <span className="lbs-button__browser-name">Chrome</span>
    </p>
  </Link>
);

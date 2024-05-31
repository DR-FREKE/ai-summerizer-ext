import Image from "next/image";
import Link from "next/link";

export const ShareHeader = () => {
  return (
    <div
      className="top-[-100%] m-[0_auto] py-[12px] mb-4 flex justify-between items-center sticky z-[1000]"
      id="share-header"
    >
      <Link href={"/"}>
        <Image
          src={"https://eightify.app/seo-static/logo.svg"}
          alt=""
          width={"123"}
          height={"30"}
          quality={"95"}
          priority={true}
        />
      </Link>
      <Link
        href={""}
        className="bg-brand-gray w-[32%] box-border sm:flex hidden gap-[8px] items-center justify-center rounded-xl text-[#000000] text-lg font-semibold leading-[1.55] tracking-[-0.18px] p-[10px_24px]"
      >
        <Image
          src={"https://eightify.app/seo-static/Chrome_icon.svg"}
          alt=""
          width={"20"}
          height={"20"}
        />
        <span>Install Chrome extension</span>
      </Link>
    </div>
  );
};

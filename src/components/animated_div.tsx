import clsx from "clsx";
import Image from "next/image";

export const SliderImage = ({ width, height }: { width: string; height: number }) => (
  <>
    <Image src="https://eightify.app/shared/static/lights-banner/blue.svg" alt="" width={100} height={height} className={`absolute w-[100%] blur-[5rem] sm:scale-[10] animate-moving-blue`} />
    <Image
      src="https://eightify.app/shared/static/lights-banner/violet.svg"
      alt=""
      width={100}
      height={height}
      className="absolute w-[100%] blur-[5rem] transform sm:scale-[10] animate-moving-violet"
    />
    <Image
      src="https://eightify.app/shared/static/lights-banner/yellow.svg"
      alt=""
      width={100}
      height={height}
      className="absolute w-[100%] blur-[5rem] transform sm:scale-[10] animate-moving-yellow"
    />
  </>
);

export const AnimatedDiv = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className="my-[24px]">
    <div className={clsx("md:rounded-[24px] cursor-pointer relative flex justify-center rounded-[20px] bg-[#141414] overflow-hidden", className)}>
      <div className="md:bg-lbl-background md:bg-lbl-background-position md:bg-lbl-background-size md:bg-no-repeat absolute top-0 left-0 w-full h-full translate-x-[-4px]">
        <SliderImage width="300" height={300} />
      </div>
      {children}
    </div>
  </div>
);

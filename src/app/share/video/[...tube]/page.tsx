import { ShareHeader } from "@/components/share/header";
import { ShareSummary } from "@/components/share/share.summary";

type ParamsType = {
  params: {
    tube: string[];
  };
};

const SharePage = ({ params }: ParamsType) => {
  if (params.tube.length !== 2) {
    throw new Error("error occured");
  }
  return (
    <div className="m-[0_auto] md:max-w-[1232px] max-w-full p-[0_16px_32px] text-left box-border">
      <ShareHeader />
      <div className="flex flex-wrap sm:flex-row flex-col justify-between mb-[85px]">
        <ShareSummary />
        <div className="">video</div>
      </div>
    </div>
  );
};

export default SharePage;

import clsx from "clsx";
import React, { ReactNode } from "react";

type FooterSectionProp = {
  sections: any[][];
  renderItem: ({ item, index }: { item: any; index: number }) => ReactNode;
  className?: string;
  containerClassName?: string;
};

const FooterSection = ({ sections, renderItem, className, containerClassName }: FooterSectionProp) => {
  return (
    <>
      {sections?.map((content, index) => (
        <div key={index} className={clsx(`w-full flex justify-between flex-grow flex-wrap items-start md:gap-6 gap-4`, containerClassName)}>
          <ul className={clsx("min-w-[160px] list-none", className)}>
            {content?.map((item, index) => (
              <React.Fragment key={index}>{renderItem({ item, index })}</React.Fragment>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default FooterSection;

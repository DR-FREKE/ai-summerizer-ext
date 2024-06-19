import Image from "next/image";
import FooterSection from "./footer_section";
import Link from "next/link";

export const Footer = () => {
  const column_one = [
    { name: "Contact us", href: "" },
    { name: "Terms of use", href: "" },
    { name: "Privacy Policy", href: "" },
    { name: "How to summerize", href: "" },
    { name: "How to download transcript", href: "" },
    { name: "YouTube video summerizer", href: "" },
  ];
  const column_two = [
    { name: "Youtube Summary AI", href: "" },
    { name: "YouTube summary with ChatGPT", href: "" },
    { name: "Subtitles Downloader", href: "" },
    { name: "How to", href: "" },
  ];
  const column_three = [
    { name: "Twitter", href: "" },
    { name: "Instagram", href: "" },
    { name: "Linkedin", href: "" },
    { name: "Facebook", href: "" },
    { name: "Youtube", href: "" },
  ];
  const column_four = [{ name: "English", href: "" }];

  const sections = [column_one, column_two, column_three, column_four];

  // render list item for section
  const renderItem = ({ item, index }: { item: (typeof column_one)[number]; index: number }) => (
    <li className="mb-[8px] max-w-[180px]">
      <Link href={item.href} className="text-[18px] leading-[1.22] text-brand-gray02 transition-colors duration-[0.12s] ease hover:text-[#000]">
        {item.name}
      </Link>
    </li>
  );

  return (
    <footer className="md:p-[24px_10px_32px] p-[24px_16px_32px] border-t border-brand-gray03 block mt-[80px]">
      <div className="flex gap-x-[24px] gap-y-[32px] max-w-[1200px] m-[0_auto]">
        <div className="font-inter-font text-[18px] leading-[1.22] text-[#000] min-w-[384px] flex items-start">
          <div className="flex items-center">
            <Image width={48} height={41} src={"https://eightify.app/shared/static/footer/footer-logo.svg"} alt="" className="mr-[12px] mt-[4px]" />
            <div>
              <p className="mt-0 mb-[4px]">Rational Expressions, Inc</p>
            </div>
          </div>
        </div>
        <FooterSection sections={sections} renderItem={renderItem} />
      </div>
    </footer>
  );
};

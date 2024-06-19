"use client";

import { rateArticle } from "@/actions/rating_actions";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import { Star1 } from "iconsax-react";
import { FaStar } from "react-icons/fa6";

const StyleRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#fcd93a", // Change filled star color
  },
  "& .MuiRating-iconHover": {
    color: "#fcd93a", // Change hover color
  },
  "& .MuiRating-iconEmpty": {
    color: "#dcdcdc", // Change empty star color
  },
});

export const RateArticle = ({ id, count, aggregate }: { id: number; count: number; aggregate?: number }) => {
  const [value, setValue] = useState<number | null>(aggregate!);

  const handleChange = (event: any, newValue: number | null) => {
    setValue(newValue);
    rateArticle(id, newValue!);
  };

  return (
    <div className="flex items-center">
      <div className="p-[5px]">
        <span className="text-[12.4px] font-bold text-[#555555]">
          {aggregate?.toFixed(1)} ({count} votes)
        </span>
      </div>
      <div className="p-[5px]">
        <div className="flex items-center justify-center flex-wrap">
          <StyleRating onChange={handleChange} value={value} icon={<FaStar fontSize={26} />} emptyIcon={<FaStar fontSize={26} />} className="flex gap-1" />
        </div>
      </div>
    </div>
  );
};

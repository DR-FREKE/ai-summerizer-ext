import React, { ReactNode } from "react";

export type DataProps = {
  [x: string]: ReactNode | string;
};

export type ItemProps = {
  item: DataProps;
  index: number;
};

type FlatListProps = {
  data: DataProps[];
  renderItem: (items: ItemProps) => ReactNode;
  className?: string;
};
export const FlatList = ({ data, renderItem, className }: FlatListProps) => {
  return (
    <ul className={`flex flex-col items-start self-stretch ${className}`}>
      {data?.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}
    </ul>
  );
};

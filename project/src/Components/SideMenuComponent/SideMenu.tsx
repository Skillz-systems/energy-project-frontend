import { useState } from "react";
import { Link } from "react-router-dom";

export type SideMenuType = {
  navigationList: {
    title: string;
    link: string;
    count: string | number;
  }[];
};

export const SideMenu = (props: SideMenuType) => {
  const { navigationList } = props;
  const [active, setActive] = useState<number>(0);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 gap-4 w-[216px] border border-strokeGreyThree rounded-[20px]">
      {navigationList.map((item, index) => (
        <Link
          to={item.link}
          key={index}
          className={`flex group items-center justify-between w-full h-[24px] pl-2 pr-1 py-1 rounded-full cursor-pointer transition-all
            ${
              active === index
                ? "bg-primaryGradient"
                : "bg-white hover:bg-[#F6F8FA]"
            }`}
          onClick={() => setActive(index)}
        >
          <p
            className={`text-xs font-medium transition-all ${
              active === index
                ? "text-white"
                : "text-textGrey group-hover:font-thin"
            }`}
          >
            {item.title}
          </p>
          <span
            className={`flex items-center justify-center max-w-max px-1 border-[0.2px] text-xs rounded-full transition-all
            ${
              active === index
                ? "bg-[#FEF5DA] text-textDarkBrown border-textDarkBrown"
                : "bg-[#EAEEF2] text-textDarkGrey border-strokeGrey group-hover:bg-[#FEF5DA] group-hover:text-textDarkBrown group-hover:border-textDarkBrown"
            }`}
          >
            {item.count}
          </span>
        </Link>
      ))}
    </div>
  );
};

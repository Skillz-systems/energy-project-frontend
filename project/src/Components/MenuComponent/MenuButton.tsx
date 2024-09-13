import { useState } from "react";
import buttonIcon from "../../assets/menu/menu.svg";
import { Link } from "react-router-dom";

export type MenuButtonType = {
  buttonStyle: string;
  sections: { title: string; icon: string; link: string }[];
};

export const MenuButton = (props: MenuButtonType) => {
  const { buttonStyle, sections } = props;
  const [dialog, setDialog] = useState<boolean>(false);

  return (
    <div className="relative">
      <div
        className={`${buttonStyle}
        flex items-center justify-center w-8 h-8 p-1 rounded-full 
        border-[0.2px] border-strokeGreyTwo hover:cursor-pointer
        transition-all duration-300 bg-white shadow-innerCustom
        `}
        onClick={() => setDialog(!dialog)}
      >
        <img
          src={buttonIcon}
          alt="Menu Icon"
          width="16px"
          height="16px"
          color="red"
        />
      </div>
      {dialog && (
        <div className="absolute top-12 left-0 z-50 flex flex-col w-full bg-white p-4 gap-[10px] max-w-[200px] rounded-[20px] shadow-menuCustom">
          {sections.map((section, index) => (
            <div key={index}>
              <div className="flex items-center w-full h-[28px] px-2 py-2 gap-1 border-[0.6px] border-strokeGreyThree rounded-full transition-all hover:cursor-pointer hover:bg-primaryGradient text-textGrey hover:text-white">
                <div dangerouslySetInnerHTML={{ __html: section.icon }} />
                <Link to={section.link} className="">
                  {section.title}
                </Link>
              </div>

              {(index + 1) % 3 === 0 && index !== sections.length - 1 && (
                <div
                  className="w-full h-[1px] mt-[0.6em] border-t border-dashed"
                  style={{ borderColor: "#E0E0E0" }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

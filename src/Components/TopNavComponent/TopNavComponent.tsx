import { useState } from "react";
import logoplain from "../../assets/logoplain.svg";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "../MenuComponent/MenuButton";
import UserProfile from "../UserPill";
import { useFormattedCurrentDate } from "../../hooks/useFormattedCurrentDate";
import notification from "../../assets/notification.svg";
import search from "../../assets/search.svg";
import edit from "../../assets/edit.svg";
import close from "../../assets/close.svg";
import { DropDown } from "../DropDownComponent/DropDown";

const TopNavComponent = () => {
  const navigate = useNavigate();
  const currentDate = useFormattedCurrentDate();
  const [showSearchInput, setSearchInput] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    console.log(query);
    setSearchInput(false);
  };

  const dropDownList = {
    items: ["My Profile", "Logout"],
    onClickLink: (index: number) => {
      console.log("INDEX:", index);
    },
    customButton: (
      <div className="relative flex items-center justify-center w-[32px] h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom">
        <img src={edit} alt="Edit" className="w-[16px] cursor-pointer" />
      </div>
    ),
  };

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center w-max gap-2">
        <img
          src={logoplain}
          alt="Logo"
          width="51px"
          className="cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
        <MenuButton />
        <UserProfile />
      </div>
      <div className="flex items-center w-max max-w-[350px] gap-4">
        {showSearchInput ? null : (
          <>
            <span className="flex items-center justify-center bg-[#F6F8FA] h-[32px] px-2 py-1 text-xs text-textDarkGrey border-[0.6px] border-strokeGreyThree rounded-full">
              {currentDate}
            </span>
            <div className="relative flex items-center justify-center w-[32px] h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom">
              <img
                src={notification}
                alt="Notification"
                className="w-[16px] cursor-pointer"
              />
              <span className="animate-ping -top-1.5 -right-1 absolute flex items-center justify-center bg-[#FEF5DA] text-[8px] text-center font-medium min-w-4 min-h-4 p-[1px] border border-[#A58730] rounded-full shadow-innerCustom"></span>
              <span className="-top-1.5 -right-1 absolute flex items-center justify-center bg-[#FEF5DA] text-[8px] text-center font-medium min-w-4 min-h-4 p-[1px] border border-[#A58730] rounded-full shadow-innerCustom">
                7
              </span>
            </div>
          </>
        )}
        {showSearchInput ? (
          <div className="flex w-full items-center gap-2">
            <input
              type="search"
              className="text-xs font-medium text-textDarkGrey w-full h-[32px] pl-2 pr-1 py-1 border-[0.6px] border-strokeGreyThree rounded-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              autoFocus
              placeholder="Enter your query"
            />
          </div>
        ) : (
          <div
            className="relative flex items-center justify-center w-[32px] h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom"
            onClick={() => setSearchInput(true)}
          >
            <img
              src={search}
              alt="Search"
              className="w-[16px] cursor-pointer"
            />
          </div>
        )}
        {showSearchInput ? (
          <div
            className="flex items-center justify-center w-[40px] h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom"
            onClick={() => setSearchInput(false)}
          >
            <img src={close} alt="Close" className="w-[20px] h-[20px] cursor-pointer" />
          </div>
        ) : (
          <DropDown {...dropDownList} />
        )}
      </div>
    </header>
  );
};

export default TopNavComponent;

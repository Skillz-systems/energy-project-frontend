import { Routes, Route, useLocation } from "react-router-dom";
import { SideMenu } from "../../Components/SideMenuComponent/SideMenu";
import Profile from "../../Components/Settings/Profile";
import LoadingSpinner from "../../Components/Loaders/LoadingSpinner";
import { Suspense, lazy } from "react";
// import { TitlePill } from "../../Components/TitlePillComponent/TitlePill";
import settings from "../../assets/settings/settings.svg";
import ActionButton from "../../Components/ActionButtonComponent/ActionButton";
import circleAction from "../../assets/settings/addCircle.svg";
import threedots from "../../assets/settings/3dots.svg";
import { DropDown } from "../../Components/DropDownComponent/DropDown";

const RoleAndPermissions = lazy(
  () => import("../../Components/Settings/RoleAndPermissions")
);
const ChangePassword = lazy(
  () => import("../../Components/Settings/ChangePassword")
);
const Users = lazy(() => import("../../Components/Settings/Users"));

const Settings = () => {
  const location = useLocation();
  const navigationList = [
    {
      title: "Profile",
      link: "/settings/profile",
    },
    {
      title: "Role and Permissions",
      link: "/settings/role-permissions",
    },
    {
      title: "Change Password",
      link: "/settings/change-password",
    },
    {
      title: "Users",
      link: "/settings/users",
      count: "42",
    },
  ];

  const dropDownList = {
    items: ["Add new user", "Export List"],
    onClickLink: (index: number) => {
      console.log("INDEX:", index);
    },
    customButton: (
      <img
        src={threedots}
        alt="Edit Modal"
        width="32px"
        className="cursor-pointer"
      />
    ),
  };

  return (
    <main className="flex flex-col items-center w-full overflow-hidden">
      <div className="w-full max-w-[1440px]">
        <header className="flex items-center justify-between px-8 py-4">
          PLACE TOP NAV COMPONENT HERE
        </header>
        <section className="flex items-center justify-between px-8 py-4">
          PLACE HEADER BADGE COMPONENT HERE
        </section>
        {location.pathname === "/settings/users" ? (
          <section className="flex items-center justify-between w-full bg-paleGrayGradient px-8 py-4 h-[64px]">
            <TitlePill
              parentClass="w-full max-w-[172px]"
              icon={settings}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="USERS"
              value="120"
            />
            <div className="flex items-center gap-2">
              <ActionButton
                label="New User"
                icon={<img src={circleAction} />}
              />
              <DropDown {...dropDownList} />
            </div>
          </section>
        ) : null}
        <div className="flex w-full p-8 gap-4">
          <aside className="w-max">
            <SideMenu navigationList={navigationList} />
          </aside>
          <section className="relative items-start justify-center flex min-h-[415px] w-full">
            <Suspense
              fallback={
                <LoadingSpinner parentClass="absolute top-[50%] w-full" />
              }
            >
              <Routes>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route
                  path="role-permissions"
                  element={<RoleAndPermissions />}
                />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="users" element={<Users />} />
              </Routes>
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;

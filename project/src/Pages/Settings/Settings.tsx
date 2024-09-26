import { Routes, Route } from "react-router-dom";
import { SideMenu } from "../../Components/SideMenuComponent/SideMenu";
import Profile from "../../Components/Settings/Profile";
import LoadingSpinner from "../../Components/Loaders/LoadingSpinner";
import { Suspense, lazy } from "react";
import React from "react";

const RoleAndPermissions = lazy(
  () => import("../../Components/Settings/RoleAndPermissions")
);
const ChangePassword = lazy(
  () => import("../../Components/Settings/ChangePassword")
);
const Users = lazy(() => import("../../Components/Settings/Users"));

const Settings = () => {
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

  return (
    <main className="flex flex-col items-center w-full">
      <div className="w-full max-w-[1440px]">
        <header className="flex items-center justify-between px-8 py-4">
          PLACE TOP NAV COMPONENT HERE
        </header>
        <section className="flex items-center justify-between px-8 py-4">
          PLACE HEADER BADGE COMPONENT HERE
        </section>
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

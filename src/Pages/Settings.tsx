import { Routes, Route, useLocation } from "react-router-dom";
import useGlobalErrorBoundary from "@/hooks/useGlobalErrorBoundary";
import { SideMenu } from "../Components/SideMenuComponent/SideMenu";
import Profile from "../Components/Settings/Profile";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { Suspense, lazy, useState } from "react";
import { TitlePill } from "../Components/TitlePillComponent/TitlePill";
import settings from "../assets/settings/settings.svg";
import ActionButton from "../Components/ActionButtonComponent/ActionButton";
import circleAction from "../assets/settings/addCircle.svg";
import { DropDown } from "../Components/DropDownComponent/DropDown";
import settingsbadge from "../assets/settings/settingsbadge.png";
import { useGetRequest } from "../utils/useApiCall";
import { observer } from "mobx-react-lite";
import rootStore from "../stores/rootStore";
import PageLayout from "./PageLayout";
import CreateNewUserModal from "@/Components/Settings/CreateNewUserModal";

const RoleAndPermissions = lazy(
  () => import("../Components/Settings/RoleAndPermissions")
);
const ChangePassword = lazy(
  () => import("../Components/Settings/ChangePassword")
);
const Users = lazy(() => import("../Components/Settings/Users"));

const Settings = observer(() => {
  const { settingsStore } = rootStore;
  const { handleErrorBoundary } = useGlobalErrorBoundary();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const userlocation = useLocation();
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
      count: settingsStore.noOfUsers,
    },
  ];

  const dropDownList = {
    items: ["Add new user", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setIsOpen(true);
          break;
        case 1:
          console.log(index);
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };

  const fetchAllRoles = useGetRequest("/v1/roles", true, 60000);
  const fetchAllUsers = useGetRequest("/v1/users", true, 60000);

  const rolesList = fetchAllRoles.data?.map((item) => ({
    label: item.role,
    value: item.id,
  }));

  if (fetchAllRoles.error)
    handleErrorBoundary(fetchAllRoles.error, fetchAllUsers.isNetworkError);
  if (fetchAllUsers.error)
    handleErrorBoundary(fetchAllUsers.error, fetchAllUsers.isNetworkError);

  // const tersoo = true;
  // let rolesList;
  // let fetchAllRoles;
  // let fetchAllUsers;

  // if (tersoo) {
  //   fetchAllRoles = useGetRequest("/v1/roles", true, 60000);
  //   fetchAllUsers = useGetRequest("/v1/users", true, 60000);

  //   rolesList = fetchAllRoles.data?.map((item) => ({
  //     label: item.role,
  //     value: item.id,
  //   }));

  //   if (fetchAllRoles.error)
  //     handleErrorBoundary(fetchAllRoles.error, fetchAllUsers.isNetworkError);
  //   if (fetchAllUsers.error)
  //     handleErrorBoundary(fetchAllUsers.error, fetchAllUsers.isNetworkError);
  // }

  return (
    <>
      <PageLayout pageName="Settings" badge={settingsbadge}>
        {userlocation.pathname === "/settings/users" ? (
          <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
            <TitlePill
              icon={settings}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="USERS"
              value={settingsStore.noOfUsers || 0}
            />
            <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-start">
              <ActionButton
                label="New User"
                icon={<img src={circleAction} />}
                onClick={() => setIsOpen(true)}
              />
              <DropDown {...dropDownList} />
            </div>
          </section>
        ) : null}
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative items-start justify-center flex min-h-[415px] w-full overflow-hidden">
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
                  element={
                    <RoleAndPermissions
                      allRoles={fetchAllRoles.data}
                      allRolesLoading={fetchAllRoles.isLoading}
                      allRolesError={fetchAllRoles.error}
                      allRolesRefresh={fetchAllRoles.mutate}
                      rolesList={rolesList}
                    />
                  }
                />
                <Route path="change-password" element={<ChangePassword />} />
                <Route
                  path="users"
                  element={
                    <Users
                      rolesList={rolesList}
                      data={fetchAllUsers.data}
                      isLoading={fetchAllUsers.isLoading}
                      refreshTable={fetchAllUsers.mutate}
                    />
                  }
                />
              </Routes>
            </Suspense>
          </section>F
        </div>
      </PageLayout>
      <CreateNewUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        allRolesLoading={fetchAllRoles.isLoading}
        rolesList={rolesList}
        allUsersRefresh={fetchAllRoles.mutate}
      />
    </>
  );
});

export default Settings;

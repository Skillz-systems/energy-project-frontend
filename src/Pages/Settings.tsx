import { Routes, Route, useLocation } from "react-router-dom";
import { SideMenu } from "../Components/SideMenuComponent/SideMenu";
import Profile from "../Components/Settings/Profile";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { Suspense, lazy, useState } from "react";
import { TitlePill } from "../Components/TitlePillComponent/TitlePill";
import settings from "../assets/settings/settings.svg";
import ActionButton from "../Components/ActionButtonComponent/ActionButton";
import circleAction from "../assets/settings/addCircle.svg";
import edit from "../assets/edit.svg";
import { DropDown } from "../Components/DropDownComponent/DropDown";
import HeaderBadge from "../Components/HeaderBadgeComponent/HeaderBadge";
import settingsbadge from "../assets/settings/settingsbadge.png";
import TopNavComponent from "../Components/TopNavComponent/TopNavComponent";
import { Modal } from "../Components/ModalComponent/Modal";
import { Input, SelectInput } from "../Components/InputComponent/Input";
import ProceedButton from "../Components/ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall, useGetRequest } from "../utils/useApiCall";
import { observer } from "mobx-react-lite";
import rootStore from "../stores/rootStore";

const RoleAndPermissions = lazy(
  () => import("../Components/Settings/RoleAndPermissions")
);
const ChangePassword = lazy(
  () => import("../Components/Settings/ChangePassword")
);
const Users = lazy(() => import("../Components/Settings/Users"));

const Settings = observer(() => {
  const { settingsStore } = rootStore;
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    role: "",
    location: "",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
    customButton: (
      <div className="relative flex items-center justify-center w-[32px] h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom transition-all hover:bg-[#E2E4EB]">
        <img src={edit} alt="Edit" className="w-[16px] cursor-pointer" />
      </div>
    ),
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formData) return;
    try {
      const response = await apiCall({
        endpoint: "/v1/auth/add-user",
        method: "post",
        data: formData,
        successMessage: "User created successfully!",
      });
      console.log("User creation response:", response);
    } catch (error) {
      console.error("User creation failed:", error);
    }
    setLoading(false);
    setIsOpen(false);
    setFormData({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      role: "",
      location: "",
    });
  };

  const { email, password, firstname, lastname, phone, role, location } =
    formData;

  const isFormFilled =
    email || password || firstname || lastname || phone || role || location;

  const {
    data: allRoles,
    isLoading: allRolesLoading,
    error: allRolesError,
    mutate: allRolesRefresh,
  } = useGetRequest("/v1/roles");

  const rolesList = allRoles?.map((item) => ({
    label: item.role,
    value: item.id,
  }));

  if (allRolesError) return <div>Oops! Something wrong</div>;

  return (
    <>
      <main className="relative flex flex-col items-center w-full pt-[67px] min-h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center w-full max-w-[1440px]">
          <TopNavComponent />
          <HeaderBadge pageName="Settings" image={settingsbadge} />
          {userlocation.pathname === "/settings/users" ? (
            <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
              <TitlePill
                parentClass="w-full max-w-none sm:max-w-[172px]"
                icon={settings}
                iconBgColor="bg-[#FDEEC2]"
                topText="All"
                bottomText="USERS"
                value={settingsStore.noOfUsers}
              />
              <div className="flex w-full items-center justify-between gap-2 sm:w-max sm:justify-start">
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
                  <Route index element={<Profile rolesList={rolesList} />} />
                  <Route
                    path="profile"
                    element={<Profile rolesList={rolesList} />}
                  />
                  <Route
                    path="role-permissions"
                    element={
                      <RoleAndPermissions
                        allRoles={allRoles}
                        allRolesLoading={allRolesLoading}
                        allRolesError={allRolesError}
                        allRolesRefresh={allRolesRefresh}
                        rolesList={rolesList}
                      />
                    }
                  />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route
                    path="users"
                    element={<Users rolesList={rolesList} />}
                  />
                </Routes>
              </Suspense>
            </section>
          </div>
        </div>
      </main>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layout="right"
        bodyStyle="pb-[100px]"
      >
        <form
          className="flex flex-col items-center bg-white"
          onSubmit={handleSubmit}
        >
          <div
            className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${
              isFormFilled
                ? "bg-paleCreamGradientLeft"
                : "bg-paleGrayGradientLeft"
            }`}
          >
            <h2
              style={{ textShadow: "1px 1px grey" }}
              className="text-xl text-textBlack font-semibold font-secondary"
            >
              New User
            </h2>
          </div>
          {allRolesLoading ? (
            <LoadingSpinner parentClass="absolute top-[50%] w-full" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
              <Input
                type="text"
                name="firstname"
                label="FIRST NAME"
                value={firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
              <Input
                type="text"
                name="lastname"
                label="LAST NAME"
                value={lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
              <Input
                type="email"
                name="email"
                label="EMAIL"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
              <Input
                type="text"
                name="phone"
                label="PHONE NUMBER"
                value={phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />

              <SelectInput
                label="Role"
                name="role"
                options={rolesList}
                value={role}
                onChange={handleInputChange}
                required={true}
                placeholder="Select a role"
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
              <Input
                type="text"
                name="location"
                label="LOCATION"
                value={location}
                onChange={handleInputChange}
                placeholder="Location"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
            </div>
          )}
          <ProceedButton
            type="submit"
            loading={loading}
            variant={isFormFilled ? "gradient" : "gray"}
          />
        </form>
      </Modal>
    </>
  );
});

export default Settings;

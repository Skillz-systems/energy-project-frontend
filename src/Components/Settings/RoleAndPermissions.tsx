import React, { useState } from "react";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import addCircleGold from "../../assets/settings/addCircleGold.svg";
import { GoDotFill } from "react-icons/go";
import { Modal } from "../ModalComponent/Modal";
import { Input, ToggleInput } from "../InputComponent/Input";
import oblongedit from "../../assets/settings/oblongedit.svg";
import { formatNumberWithSuffix } from "../../hooks/useFormatNumberWithSuffix";
import role from "../../assets/table/role.svg";
import roletwo from "../../assets/table/roletwo.svg";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import LoadingSpinner from "../Loaders/LoadingSpinner";
import axios from "axios";
import useTokens from "../../hooks/useTokens";
import { formatDateTime } from "../../utils/helpers";

const columnList = ["TITLE", "ASSIGNED USERS", "PERMISSIONS", "ACTIONS"];
const columnWidth = ["w-[15%]", "w-[22.5%]", "w-[50%]", "w-[12.5%]"];

const usersColumnList = ["USER", "DATE ASSIGNED", "ACTIONS"];
const userColumnWidth = ["w-[55%]", "w-[30%]", "w-[15%]"];

const RoleAndPermissions = ({ allRoles, allRolesLoading, allRolesError }) => {
  const { token } = useTokens();
  const { apiCall } = useApiCall();

  const {
    data: allPermissions,
    isLoading: allPermissionsLoading,
    error: allPermissionsError,
  } = useGetRequest("/v1/permissions");

  const getSingleRoleData = async (id: string) => {
    let data;

    try {
      const response = await axios.get(
        `https://energy-project-backend.onrender.com/api/v1/roles/more_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      data = response;
    } catch (error) {
      console.log(error);
    }

    return {
      data,
    };
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<string | any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<number>(0);
  const [singleRoleData, setSingleRoleData] = useState<any>(null);

  const handlePermissionChange = (checked: boolean, id: string) => {
    if (checked) {
      // Add the id to the array if checked
      setPermissionIds((prev) => [...prev, id]);
    } else {
      // Remove the id from the array if unchecked
      setPermissionIds((prev) =>
        prev.filter((permissionId) => permissionId !== id)
      );
    }
  };

  const PermissionComponent = ({ permission }: { permission: any }) => {
    // Check if the permission ID is in the array
    const isChecked = permissionIds.includes(permission.id);

    return (
      <div className="flex items-center justify-between w-full">
        <p className="flex items-center justify-center bg-[#F6F8FA] p-2 h-6 text-xs rounded-full capitalize">
          {permission.subject}
        </p>
        <ToggleInput
          defaultChecked={isChecked}
          onChange={(checked: boolean) =>
            handlePermissionChange(checked, permission.id)
          }
        />
      </div>
    );
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };

  // Handle form submission
  const handleSubmitRoleCreation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedRole) return;

    try {
      const response = await apiCall({
        endpoint: "/v1/roles",
        method: "post",
        data: {
          role: selectedRole,
          active: true,
          permissionIds,
        },
        successMessage: "Role created successfully!",
      });

      console.log("Role creation response:", response);
    } catch (error) {
      console.error("Role creation failed:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
      setSelectedRole("");
      setPermissionIds([]);
    }
  };

  const DetailComponent = ({
    label,
    value,
    parentClass,
    labelClass,
    valueClass,
    icon,
  }: {
    label: string;
    value: string | number;
    parentClass?: string;
    labelClass?: string;
    valueClass?: string;
    icon?: string;
  }) => {
    return (
      <div
        className={`${parentClass} flex items-center justify-between bg-white w-full p-2.5 text-textDarkGrey text-xs rounded-full border-[0.6px] border-strokeGreyThree`}
      >
        <span
          className={`${labelClass} flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full`}
        >
          {label}
        </span>
        <div className="flex items-center gap-1">
          {icon && <img src={icon} alt="Icon" />}
          <span
            className={`${valueClass} text-xs font-bold text-textDarkGrey capitalize`}
          >
            {value}
          </span>
        </div>
      </div>
    );
  };

  const userCount = singleRoleData?.users?.length;
  const isFormFilled = selectedRole;

  if (allRolesError) return <div>Failed to fetch allRole.</div>;

  console.log(singleRoleData);

  return !allRolesLoading ? (
    <>
      <div className="relative flex flex-col justify-end bg-white p-2 sm:p-4 w-full lg:max-w-[700px] min-h-[414px] border-[0.6px] border-strokeGreyThree rounded-[20px] overflow-x-auto max-w-full">
        <img
          src={lightCheckeredBg}
          alt="Light Checkered Background"
          className="absolute top-0 left-0 w-full"
        />
        <div className="z-10 flex justify-end min-w-[575px]">
          <img
            src={addCircleGold}
            alt="Edit Button"
            className="w-[24px] h-[24px] hover:cursor-pointer"
            onClick={() => {
              setModalInfo("edit-permissions");
              setIsOpen(true);
            }}
          />
        </div>
        <div className="z-10 flex flex-col gap-4 mt-[60px] md:mt-[80px] p-[16px_16px_0px_16px] border-[0.6px] border-strokeGreyThree rounded-[20px] min-w-[575px]">
          <div className="flex items-center justify-between w-full">
            {columnList.map((column, index) => (
              <span
                key={index}
                className={`flex items-center ${
                  index === 3 ? "justify-center" : "justify-start"
                } gap-1 ${
                  columnWidth[index]
                } text-xs font-light text-textDarkGrey`}
              >
                <GoDotFill color="#E0E0E0" />
                {column}
              </span>
            ))}
          </div>
          <div className="flex flex-col">
            {allRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between w-full border-t-[0.2px] border-t-strokeGreyThree"
              >
                <p
                  className={`py-2 text-xs text-textBlack font-semibold capitalize ${columnWidth[0]}`}
                >
                  {role.role}
                </p>
                <p
                  className={`py-2 text-xs text-textDarkGrey ${columnWidth[1]}`}
                >
                  {role?._count?.users}
                </p>
                <div
                  className={`flex items-center flex-wrap gap-2.5 py-2 ${columnWidth[2]}`}
                >
                  {role.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 text-xs uppercase text-textDarkGrey border-[0.4px] border-strokeGreyThree rounded-full"
                    >
                      <GoDotFill color="#9BA4BA" />
                      {permission.subject}
                    </span>
                  ))}
                </div>
                <div
                  className={`flex items-center justify-center ${columnWidth[3]}`}
                >
                  <span
                    className="flex items-center justify-center px-2 pt-[1px] text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-[32px] shadow-innerCustom cursor-pointer hover:bg-gold"
                    onClick={async () => {
                      const { data } = await getSingleRoleData(role.id);
                      setSingleRoleData(data.data);
                      setIsOpen(true);
                      setModalInfo("view-permissions");
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} layout="right">
        {modalInfo === "edit-permissions" ? (
          <form
            className="flex flex-col bg-white"
            onSubmit={handleSubmitRoleCreation}
          >
            <div
              className={`flex items-center justify-center px-4 min-h-[64px] bg-paleGrayGradientLeft border-b-[0.6px] border-strokeGreyThree ${
                isFormFilled
                  ? "bg-paleCreamGradientLeft"
                  : "bg-paleGrayGradientLeft"
              }`}
            >
              <h2
                style={{ textShadow: "1px 1px grey" }}
                className="text-xl text-textBlack font-semibold font-secondary"
              >
                New Role & Permissions
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 p-10">
              <Input
                type="text"
                name="role"
                label="ROLE NAME"
                value={selectedRole}
                onChange={handleRoleChange}
                placeholder="Role Name"
                required={true}
                style={`${
                  isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                }`}
              />
              <div className="relative flex flex-col w-full gap-0.5 p-5 border-[0.6px] border-strokeGreyTwo rounded-[20px]">
                <span
                  className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeGreyTwo rounded-[200px] transition-opacity duration-500 ease-in-out opacity-100`}
                >
                  PERMISSIONS
                </span>
                {allPermissionsLoading ? (
                  <LoadingSpinner parentClass="flex items-center justify-center w-full h-full" />
                ) : allPermissionsError ? (
                  <p className="text-textDarkGrey">{allPermissionsError}</p>
                ) : (
                  allPermissions?.map((permission) => (
                    <PermissionComponent
                      key={permission.id}
                      permission={permission}
                    />
                  ))
                )}
              </div>
              <div className="flex items-center justify-center w-full pt-10 pb-5">
                <ProceedButton
                  type="submit"
                  loading={loading}
                  variant={isFormFilled ? "gradient" : "gray"}
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white">
            <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
              <p className="flex items-center justify-center bg-[#EFF2FF] text-xs text-textBlack font-semibold p-2 rounded-full h-[24px] capitalize">
                {singleRoleData?.role}
              </p>
              <button>
                <img src={oblongedit} alt="Oblong edit" />
              </button>
            </header>
            <div className="w-full px-4 py-2">
              <div className="flex items-center p-0.5 w-max border-[0.6px] border-strokeGreyThree rounded-full">
                {["Roles Details", "Permissions", "Assigned Users"].map(
                  (item, index) => (
                    <span
                      key={index}
                      className={`group flex items-center justify-center gap-3 px-2 py-1 min-h-[24px] rounded-full text-xs font-medium hover:cursor-pointer ${
                        activeNav === index
                          ? "bg-primaryGradient text-white"
                          : "bg-white text-textGrey"
                      }`}
                      onClick={() => setActiveNav(index)}
                    >
                      {item}
                      {index === 2 ? (
                        <span
                          className={`flex items-center justify-center max-w-max px-1 border-[0.2px] text-xs rounded-full transition-all
                          ${
                            activeNav === index
                              ? "bg-[#FEF5DA] text-textDarkBrown border-textDarkBrown"
                              : "bg-[#EAEEF2] text-textDarkGrey border-strokeGrey group-hover:bg-[#FEF5DA] group-hover:text-textDarkBrown group-hover:border-textDarkBrown"
                          }`}
                        >
                          {formatNumberWithSuffix(userCount)}
                        </span>
                      ) : null}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col w-full px-4 py-4 gap-4">
              {activeNav === 0 ? (
                <>
                  <DetailComponent
                    label="Role Title"
                    value={singleRoleData?.role}
                  />
                  <div className="flex flex-col w-full p-2.5 gap-2 rounded-[20px] border-[0.6px] border-strokeGreyThree">
                    <p className="flex gap-1 w-max text-xs text-textLightGrey font-medium pb-2">
                      <img src={role} alt="Role Icon" width="16px" />
                      ROLE DETAILS
                    </p>
                    <DetailComponent
                      label="Created By"
                      value="Moses Bliss"
                      parentClass="border-none p-0"
                      valueClass="bg-[#EFF2FF] px-2 py-1 rounded-full"
                      icon={roletwo}
                    />
                    <DetailComponent
                      label="Designation"
                      value="Super Admin"
                      parentClass="border-none p-0"
                    />
                    <DetailComponent
                      label="Date Created"
                      value={formatDateTime(
                        "datetime",
                        singleRoleData?.created_at
                      )}
                      parentClass="border-none p-0"
                    />
                  </div>
                  <DetailComponent label="Assigned Users" value={userCount} />
                </>
              ) : activeNav === 1 ? (
                <>
                  <DetailComponent
                    label="No of Permissions"
                    value={singleRoleData?.permissions?.length}
                  />
                  <div className="flex items-center justify-between w-full p-2.5 gap-2 rounded-[20px] border-[0.6px] border-strokeGreyThree">
                    <div className="w-[40%]">
                      <span className="bg-[#EFF2FF] text-xs px-2 py-1 rounded-full text-[#3951B6]">
                        Permissions
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-4 w-[60%]">
                      {singleRoleData?.permissions?.length > 0 ? (
                        singleRoleData?.permissions?.map(
                          (permission, index) => (
                            <span
                              key={index}
                              className="flex w-max items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 text-xs text-textDarkGrey border-[0.4px] border-strokeGreyThree rounded-full uppercase"
                            >
                              <GoDotFill color="#9BA4BA" />
                              {permission?.subject}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-xs text-textDarkGrey uppercase">
                          No permission assigned
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col w-full p-2.5 gap-2 rounded-[20px] border-[0.6px] border-strokeGreyThree">
                  {singleRoleData?.users?.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between w-full">
                        {usersColumnList.map((column, index) => (
                          <span
                            key={index}
                            className={`flex items-center ${
                              index === 2 ? "justify-center" : "justify-start"
                            } gap-1 ${
                              userColumnWidth[index]
                            } text-xs font-light text-textDarkGrey`}
                          >
                            <GoDotFill color="#E0E0E0" />
                            {column}
                          </span>
                        ))}
                      </div>
                      {singleRoleData?.users?.map((user) => (
                        <div key={user.id} className="flex items-center w-full">
                          <div
                            className={`flex items-center gap-1 ${userColumnWidth[0]}`}
                          >
                            <img src={roletwo} alt="icon" />
                            <span className="bg-[#EFF2FF] px-2 py-1 text-xs text-textBlack font-semibold rounded-full capitalize">
                              {user.firstname} {user.lastname}
                            </span>
                          </div>
                          <div className={`${userColumnWidth[1]}`}>
                            <div className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 w-max border-[0.4px] border-strokeGreyTwo rounded-full">
                              <p className="text-xs text-textDarkGrey font-semibold">
                                {formatDateTime("date", user?.createdAt)}
                              </p>
                              <GoDotFill color="#E2E4EB" />
                              <p className="text-xs text-textDarkGrey">
                                {formatDateTime("time", user?.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`flex items-center justify-center ${userColumnWidth[2]}`}
                          >
                            <span
                              className="flex w-max items-center justify-center px-2 pt-[1px] text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-[32px] shadow-innerCustom cursor-pointer"
                              onClick={() => {
                                setModalInfo("view-permissions");
                                setIsOpen(true);
                              }}
                            >
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-textDarkGrey uppercase">
                      No users assigned
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  ) : (
    <LoadingSpinner parentClass="absolute top-[50%] w-full" />
  );
};

export default RoleAndPermissions;

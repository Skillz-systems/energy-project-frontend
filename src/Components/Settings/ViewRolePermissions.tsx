import React, { useState } from "react";
import TabComponent from "../TabComponent/TabComponent";
import { DropDown } from "../DropDownComponent/DropDown";
import { GoDotFill } from "react-icons/go";
import role from "../../assets/table/role.svg";
import roletwo from "../../assets/table/roletwo.svg";
import { formatDateTime } from "@/utils/helpers";
import { DataStateWrapper } from "../Loaders/DataStateWrapper";
import { useGetRequest } from "@/utils/useApiCall";

const usersColumnList = ["USER", "DATE ASSIGNED", "ACTIONS"];
const userColumnWidth = ["w-[50%]", "w-[35%]", "w-[15%]"];

const ViewRolePermissions = ({
  singlePermissionId,
  setUserID,
  setIsOpen,
  setIsUserOpen,
}: {
  singlePermissionId: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [tabContent, setTabContent] = useState<string>("roleDetails");

  const fetchSingleRoleData = useGetRequest(
    `/v1/roles/more_details/${singlePermissionId}`,
    true
  );
  const dropDownList = {
    items: ["Edit Role & Permissions", "Assign New User"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log(index);
          break;
        case 1:
          console.log(index);
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const userCount = fetchSingleRoleData?.data?.users?.length;

  const tabNames = [
    { name: "Roles Details", key: "roleDetails", count: null },
    { name: "Permissions", key: "permissions", count: null },
    {
      name: "Assigned Users",
      key: "assignedUsers",
      count: userCount,
    },
  ];
  return (
    <DataStateWrapper
      isLoading={fetchSingleRoleData.isLoading}
      error={fetchSingleRoleData.error}
      errorStates={fetchSingleRoleData.errorStates}
      refreshData={fetchSingleRoleData.mutate}
      errorMessage="Failed to fetch single role information."
    >
      <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
        <p className="flex items-center justify-center bg-[#EFF2FF] text-xs text-textBlack font-semibold p-2 rounded-full h-[24px] capitalize">
          {fetchSingleRoleData?.data?.role}
        </p>
        <DropDown {...dropDownList} />
      </header>

      <div className="flex flex-col w-full gap-4 px-4 py-2">
        <TabComponent
          tabs={tabNames.map(({ name, key, count }) => ({
            name,
            key,
            count,
          }))}
          onTabSelect={(key) => setTabContent(key)}
          tabsContainerClass="p-2 rounded-[20px]"
        />
        {tabContent === "roleDetails" ? (
          <>
            <DetailComponent
              label="Role Title"
              value={fetchSingleRoleData?.data?.role}
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
                  fetchSingleRoleData?.data?.created_at
                )}
                parentClass="border-none p-0"
              />
            </div>
            <DetailComponent label="Assigned Users" value={userCount} />
          </>
        ) : tabContent === "permissions" ? (
          <>
            <DetailComponent
              label="No of Permissions"
              value={fetchSingleRoleData?.data?.permissions?.length}
            />
            <div className="flex items-center justify-between w-full p-2.5 gap-2 rounded-[20px] border-[0.6px] border-strokeGreyThree">
              <div className="w-[40%]">
                <span className="bg-[#EFF2FF] text-xs px-2 py-1 rounded-full text-[#3951B6]">
                  Permissions
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-4 w-[60%]">
                {fetchSingleRoleData?.data?.permissions?.length > 0 ? (
                  fetchSingleRoleData?.data?.permissions?.map(
                    (permission: any, index: number) => (
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
            {fetchSingleRoleData?.data?.users?.length > 0 ? (
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
                {fetchSingleRoleData?.data?.users?.map((user: any) => (
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
                          setUserID(user.id);
                          setIsOpen(false);
                          setIsUserOpen(true);
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
    </DataStateWrapper>
  );
};

export default ViewRolePermissions;

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

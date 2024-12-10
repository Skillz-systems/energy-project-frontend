import React, { useState } from "react";
import { Input, ToggleInput } from "../InputComponent/Input";
import { DataStateWrapper } from "../Loaders/DataStateWrapper";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";

const EditPermissions = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { apiCall } = useApiCall();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const isFormFilled = selectedRole;

  const {
    data: allPermissions,
    isLoading: allPermissionsLoading,
    error: allPermissionsError,
    errorStates: allPermissionsErrorStates,
    mutate: allPermissionsRefresh,
  } = useGetRequest("/v1/permissions", true);

  const handleSubmitRoleCreation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!selectedRole) return;

    try {
      await apiCall({
        endpoint: "/v1/roles",
        method: "post",
        data: {
          role: selectedRole,
          active: true,
          permissionIds,
        },
        successMessage: "Role created successfully!",
      });
      setIsOpen(false);
      setSelectedRole("");
      setPermissionIds([]);
    } catch (error) {
      console.error("Role creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataStateWrapper
      isLoading={allPermissionsLoading}
      error={allPermissionsError}
      errorStates={allPermissionsErrorStates}
      refreshData={allPermissionsRefresh}
      errorMessage="Failed to fetch permissions."
    >
      <form className="flex flex-col bg-white pb-8">
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
            onChange={(e) => setSelectedRole(e.target.value)}
            placeholder="Role Name"
            required={true}
          />
          <div className="relative flex flex-col w-full gap-0.5 p-5 border-[0.6px] border-strokeGreyTwo rounded-[20px]">
            <span
              className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeGreyTwo rounded-[200px] transition-opacity duration-500 ease-in-out opacity-100`}
            >
              PERMISSIONS
            </span>
            <DataStateWrapper
              isLoading={allPermissionsLoading}
              error={allPermissionsError}
              errorStates={allPermissionsErrorStates}
              refreshData={allPermissionsRefresh}
              errorMessage="Failed to fetch permissions list"
            >
              {allPermissions?.map((permission: any) => (
                <PermissionComponent
                  key={permission.id}
                  permission={permission}
                  permissionIds={permissionIds}
                  setPermissionIds={setPermissionIds}
                />
              ))}
            </DataStateWrapper>
          </div>
          {isFormFilled && (
            <div className="flex items-center justify-center w-full pt-6 pb-5">
              <ProceedButton
                type="submit"
                variant={isFormFilled ? "gradient" : "gray"}
                loading={loading}
                disabled={!isFormFilled}
                onClick={handleSubmitRoleCreation}
              />
            </div>
          )}
        </div>
      </form>
    </DataStateWrapper>
  );
};

export default EditPermissions;

const PermissionComponent = ({
  permission,
  permissionIds,
  setPermissionIds,
}: {
  permission: any;
  permissionIds: string[];
  setPermissionIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  // Check if the permission ID is in the array
  const isChecked = permissionIds.includes(permission.id);
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

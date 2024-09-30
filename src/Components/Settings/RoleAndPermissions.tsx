import React, { useState } from "react";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import addCircleGold from "../../assets/settings/addCircleGold.svg";
import { GoDotFill } from "react-icons/go";
import { Modal } from "../ModalComponent/Modal";
import { SelectInput, ToggleInput } from "../InputComponent/Input";
import sampleButton from "../../assets/settings/samplebutton.svg";

const columnList = ["TITLE", "ASSIGNED USERS", "PERMISSIONS", "ACTIONS"];
const columnWidth = ["w-[15%]", "w-[22.5%]", "w-[50%]", "w-[12.5%]"];

const rolesList = [
  { label: "Super Admin", value: "superAdmin" },
  { label: "Admin", value: "admin" },
  { label: "Accounts", value: "accounts" },
  { label: "Sales", value: "sales" },
  { label: "Support", value: "support" },
  { label: "Inventory", value: "inventory" },
];

// const permissionList = [
//   "sales",
//   "agents",
//   "customers",
//   "inventory",
//   "accounts",
//   "admin",
//   "products",
//   "contracts",
//   "support",
//   "communication",
// ];

const permissionsStateInitial = {
  sales: false,
  agents: false,
  customers: false,
  inventory: false,
  accounts: false,
  admin: false,
  products: false,
  contracts: false,
  support: false,
  communication: false,
};

const RoleAndPermissions = () => {
  type Permission = keyof typeof permissionsState;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<string | any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [permissionsState, setPermissionsState] = useState(
    permissionsStateInitial
  );

  // Handle permission toggle change
  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      [permission]: checked,
    }));
    console.log("Permission changed:", permission, "to", checked);
  };

  // Handle role change
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Log the role and permissions state
    console.log("Selected Role:", selectedRole);
    console.log("Permissions:", permissionsState);
  };

  const PermissionComponent = ({ permission }: { permission: string }) => {
    return (
      <div className="flex items-center justify-between w-full">
        <p className="flex items-center justify-center bg-[#F6F8FA] p-2 h-6 text-xs rounded-full capitalize">
          {permission}
        </p>
        <ToggleInput
          defaultChecked={permissionsState[permission as Permission]}
          onChange={(checked: boolean) =>
            handlePermissionChange(permission as Permission, checked)
          }
        />
      </div>
    );
  };

  return (
    <>
      <div className="relative flex flex-col justify-end bg-white p-4 w-full max-w-[610px] md:max-w-[700px] min-h-[414px] border-[0.6px] border-strokeGreyThree rounded-[20px] overflow-x-auto">
        <img
          src={lightCheckeredBg}
          alt="Light Checkered Background"
          className="absolute top-0 left-0 w-full"
        />
        <div className="z-10 flex justify-end">
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
        <div className="z-10 flex flex-col gap-4 mt-[60px] md:mt-[160px] p-[16px_16px_0px_16px] border-[0.6px] border-strokeGreyThree rounded-[20px]">
          <div className="flex items-center justify-between w-full ">
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
            {rolesData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full border-t-[0.2px] border-t-strokeGreyThree"
              >
                <p
                  className={`py-2 text-xs text-textBlack font-semibold ${columnWidth[0]}`}
                >
                  {item.title}
                </p>
                <p
                  className={`py-2 text-xs text-textDarkGrey ${columnWidth[1]}`}
                >
                  {item.assignedUsers}
                </p>
                <div
                  className={`flex items-center flex-wrap gap-2.5 py-2 ${columnWidth[2]}`}
                >
                  {item.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 text-xs text-textDarkGrey border-[0.4px] border-strokeGreyThree rounded-full"
                    >
                      <GoDotFill color="#9BA4BA" />
                      {permission.toLocaleUpperCase()}
                    </span>
                  ))}
                </div>
                <div
                  className={`flex items-center justify-center ${columnWidth[3]}`}
                >
                  <span
                    className="flex items-center justify-center px-2 pt-[1px] text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-[32px] shadow-innerCustom cursor-pointer"
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
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} layout="right">
        {modalInfo === "edit-permissions" ? (
          <form className="flex flex-col bg-white" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center px-4 min-h-[64px] bg-paleGrayGradientLeft border-b-[0.6px] border-strokeGreyThree">
              <h2
                style={{ textShadow: "1px 1px grey" }}
                className="text-xl text-textBlack font-semibold font-secondary"
              >
                New Role & Permissions
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 p-10">
              <SelectInput
                label="Role Name"
                name="role"
                options={rolesList}
                value={selectedRole}
                onChange={handleRoleChange}
                required={true}
                placeholder="Select a role"
                style="max-w-none border-strokeGreyTwo"
              />
              <div className="relative flex flex-col w-full gap-0.5 p-5 border-[0.6px] border-strokeGreyTwo rounded-[20px]">
                <span
                  className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeGreyTwo rounded-[200px] transition-opacity duration-500 ease-in-out opacity-100`}
                >
                  PERMISSIONS
                </span>
                {Object.keys(permissionsState).map((permission) => (
                  <PermissionComponent
                    key={permission}
                    permission={permission}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center w-full pt-10 pb-5">
                <button type="submit" className="cursor-pointer">
                  <img src={sampleButton} alt="Submit" width="54px" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white">
            <p>VIEW PERMISSIONS</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RoleAndPermissions;

const rolesData = [
  {
    title: "Super Admin",
    assignedUsers: 2,
    permissions: [
      "sales",
      "agents",
      "customers",
      "inventory",
      "accounts",
      "admin",
      "products",
      "contracts",
      "support",
      "communication",
    ],
  },
  {
    title: "Admin",
    assignedUsers: 4,
    permissions: [
      "sales",
      "agents",
      "customers",
      "inventory",
      "accounts",
      "admin",
      "products",
      "contracts",
      "support",
      "communication",
    ],
  },
  {
    title: "Accounts",
    assignedUsers: 3,
    permissions: ["sales", "agents", "customers", "inventory", "accounts"],
  },
  {
    title: "Sales",
    assignedUsers: 42,
    permissions: ["sales", "customers", "inventory", "products", "contracts"],
  },
  {
    title: "Support",
    assignedUsers: 19,
    permissions: ["sales", "agents", "customers", "support", "communication"],
  },
  {
    title: "Inventory",
    assignedUsers: 27,
    permissions: ["inventory", "products"],
  },
];

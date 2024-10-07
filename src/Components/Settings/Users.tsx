import { Table } from "../TableComponent/Table";
import role from "../../assets/table/role.svg";
import clock from "../../assets/table/clock.svg";
import { GoDotFill } from "react-icons/go";
import { useGetRequest } from "../../utils/useApiCall";
import { observer } from "mobx-react-lite";
import rootStore from "../../stores/rootStore";
import UserModal from "./UserModal";
import { useEffect, useState } from "react";

interface UserEntries {
  id: string;
  no: number;
  name: string;
  email: string;
  location: string | null;
  role: string;
  status: string;
}

// Helper function to map the API data to the desired format
const generateUserEntries = (data: any): UserEntries[] => {
  const entries: UserEntries[] = data?.users.map((user: any, index: number) => {
    return {
      id: user?.id,
      no: index + 1,
      name: `${user?.firstname} ${user?.lastname}`,
      email: user?.email,
      location: user?.location || "N/A",
      role: user?.role?.role.toUpperCase(),
      status: user?.status.toUpperCase(),
    };
  });

  return entries;
};

const Users = observer(({ rolesList }: { rolesList: any }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userID, setUserID] = useState<string>("");
  const { settingsStore } = rootStore;
  const { data, isLoading, mutate: refreshTable } = useGetRequest("/v1/users");

  useEffect(() => {
    if (data?.total) {
      settingsStore.updateUserCount(data.total);
    }
  }, [data?.total, settingsStore]);

  const filterList = [
    {
      name: "All Roles",
      items: [
        "All Roles",
        "Super Admin",
        "Admin",
        "Support",
        "Inventory",
        "Account",
        "Sales",
      ],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Search",
      onSearch: (query: string) => {
        console.log("Query:", query);
      },
      isSearch: true,
    },
  ];

  const columnList = [
    { title: "S/N", key: "no" },
    { title: "NAME", key: "name" },
    { title: "EMAIL", key: "email" },
    { title: "LOCATION", key: "location" },
    {
      title: "ROLE",
      key: "role",
      valueIsAComponent: true,
      customValue: (value: any) => {
        return (
          <span className="flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
            <GoDotFill />
            {value}
          </span>
        );
      },
      rightIcon: <img src={role} alt="role icon" className="ml-auto" />,
    },
    {
      title: "STATUS",
      key: "status",
      valueIsAComponent: true,
      customValue: (value: any) => {
        let style: string = "";

        if (value === "ACTIVE") {
          style = "text-success";
        } else {
          style = "text-errorTwo";
        }

        return (
          <span
            className={`${style} flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}
          >
            <GoDotFill />
            {value}
          </span>
        );
      },
      rightIcon: <img src={clock} alt="clock icon" className="ml-auto" />,
    },
    {
      title: "ACTIONS",
      key: "actions",
      valueIsAComponent: true,
      customValue: (value, rowData) => {
        return (
          <span
            className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer transition-all hover:bg-gold"
            onClick={() => {
              setUserID(rowData.id);
              setIsOpen(true);
            }}
          >
            View
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <Table
          tableTitle="USERS"
          filterList={filterList}
          columnList={columnList}
          loading={isLoading}
          tableData={generateUserEntries(data)}
        />
      </div>
      <UserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userID={userID}
        refreshTable={refreshTable}
        rolesList={rolesList}
      />
    </>
  );
});

export default Users;

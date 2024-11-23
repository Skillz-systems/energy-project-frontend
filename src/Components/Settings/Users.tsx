import { useEffect, useState } from "react";
import { Table } from "../TableComponent/Table";
import role from "../../assets/table/role.svg";
import clock from "../../assets/table/clock.svg";
import { GoDotFill } from "react-icons/go";
import { useApiCall } from "../../utils/useApiCall";
import { observer } from "mobx-react-lite";
import UserModal from "./UserModal";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { KeyedMutator } from "swr";
import rootStore from "../../stores/rootStore";

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

const Users = observer(
  ({
    rolesList,
    data,
    isLoading,
    refreshTable,
  }: {
    rolesList: any;
    data: any;
    isLoading: boolean;
    refreshTable: KeyedMutator<any>;
  }) => {
    const { settingsStore } = rootStore;
    const { apiCall } = useApiCall();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [userID, setUserID] = useState<string>("");
    const [queryValue, setQueryValue] = useState<string>("");
    const [queryData, setQueryData] = useState<any>(null);
    const [queryLoading, setQueryLoading] = useState<boolean>(false);
    const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);

    // const buildQueryString = () => {
    //   const endpoint = `/v1/users?search=${encodeURIComponent(query)}`;
    //   return endpoint;
    // };
    
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
          ...(rolesList
            ? rolesList.map((role) => capitalizeFirstLetter(role.label))
            : []),
        ],
        onClickLink: async (index: number) => {
          setIsSearchQuery(false);
          let roleId = "";
          if (index !== 0) {
            const selectedRole = rolesList[index - 1];
            roleId = selectedRole?.value;
            setQueryValue(roleId);
          } else {
            setQueryValue("");
          }
          setQueryLoading(true);
          try {
            const response = await apiCall({
              endpoint:
                index === 0 ? "/v1/users" : `/v1/users?roleId=${roleId}`,
              method: "get",
              showToast: false,
            });
            setQueryData(response.data);
          } catch (error) {
            console.error(error);
          } finally {
            setQueryLoading(false);
          }
          return;
        },
      },
      {
        name: "Search",
        onSearch: async (query: string) => {
          setIsSearchQuery(true);
          if (queryData) setQueryData(null);
          setQueryLoading(true);
          setQueryValue(query);
          try {
            const response = await apiCall({
              endpoint: `/v1/users?search=${encodeURIComponent(query)}`,
              method: "get",
              successMessage: "",
              showToast: false,
            });
            setQueryData(response.data);
          } catch (error) {
            console.error(error);
          } finally {
            setQueryLoading(false);
          }
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

    const getTableData = () => {
      if (queryValue && queryData) {
        return generateUserEntries(queryData);
      } else return generateUserEntries(data);
    };

    return (
      <>
        <div className="w-full">
          <Table
            tableTitle="USERS"
            filterList={filterList}
            columnList={columnList}
            loading={queryLoading || isLoading}
            tableData={getTableData()}
            refreshTable={async () => {
              await refreshTable();
              setQueryData(null);
            }}
            queryValue={isSearchQuery ? queryValue : ""}
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
  }
);

export default Users;

// Ability to do nested query searches. Add later

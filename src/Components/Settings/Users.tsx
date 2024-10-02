import { Table } from "../TableComponent/Table";
import role from "../../assets/table/role.svg";
import clock from "../../assets/table/clock.svg";
import { GoDotFill } from "react-icons/go";
import { generateUserEntries } from "../TableComponent/sampleData";
import { useEffect, useState } from "react";

const Users = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any>(null);

  // Simulate data fetch delay
  const fetchData = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTableData(generateUserEntries(50));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      customValue: () => {
        return (
          <span className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer transition-all hover:bg-gold">
            View
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Table
        tableTitle="USERS"
        filterList={filterList}
        columnList={columnList}
        loading={loading}
        tableData={tableData}
      />
    </div>
  );
};

export default Users;

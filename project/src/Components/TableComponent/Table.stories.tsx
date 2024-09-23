import { Meta, StoryFn } from "@storybook/react";
import { Table, TableType } from "./Table";

export default {
  title: "Components/Table",
  component: Table,
  decorators: [(Story) => <Story />],
} as Meta;

const TableTemplate: StoryFn<TableType> = (args) => {
  return <Table {...args} />;
};

export const table = TableTemplate.bind({});
table.args = {
  tableTitle: "ALL CUSTOMERS",
  filterList: [
    {
      name: "Location",
      items: ["All Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Product",
      items: ["Product Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Product Type",
      items: ["Type Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "All Status",
      items: ["All Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Search",
      items: [
        "All Status",
        "Active Agents",
        "Reported Agents",
        "Barred Agents",
      ],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
      isSearch: true,
    },
    {
      onDateClick: (date: string) => {
        console.log("Date:", date);
      },
      isDate: true,
    },
  ],
  columnList: [
    { title: "S/N", key: "no" },
    { title: "NAME", key: "name" },
    { title: "EMAIL", key: "email" },
    { title: "LOCATION", key: "location" },
    {
      title: "PRODUCT",
      key: "product",
      valueIsAComponent: true,
      customValue: (value: any) => {
        return (
          <span className="px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
            {value}
          </span>
        );
      },
    },
    {
      title: "STATUS",
      key: "status",
      valueIsAComponent: true,
      customValue: (value: any) => {
        let style: string = "";

        switch (true) {
          case value.includes("DUE"):
            style = "text-brightBlue";
            break;
          case value.includes("NONE"):
            style = "";
            break;
          case value.includes("DEFAULTED"):
            style = "text-errorTwo";
            break;
          case value.includes("COMPLETED"):
            style = "text-success";
            break;
          default:
            style = "";
        }

        return (
          <div
            className={`${style} px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}
          >
            {value}
          </div>
        );
      },
    },
    { title: "ACTIONS", key: "actions" },
  ],
  tableData: [
    {
      no: 1,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "DUE: SEPT 11 2024",
    },
    {
      no: 2,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "NONE",
    },
    {
      no: 3,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "DEFAULTED: 29 DAYS",
    },
    {
      no: 4,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "COMPLETED",
    },
    {
      no: 5,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "NONE",
    },
    {
      no: 6,
      name: "Naomi Gambo",
      email: "naomigambo@gmail.com",
      location: "Asaba",
      product: "01",
      status: "DUE: SEPT 11 2024",
    },
  ],
};

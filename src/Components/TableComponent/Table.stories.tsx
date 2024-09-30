import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Table, TableType } from "./Table";
import { GoDotFill } from "react-icons/go";
import moneyBag from "../../assets/table/moneybag.svg";
import statusIcon from "../../assets/table/status.svg";
import { generateCustomerEntries, generateAgentEntries } from "./sampleData";
import smile from "../../assets/table/smile.svg";
import ongoing from "../../assets/table/ongoing.svg";
import inventory from "../../assets/table/inventory.svg";
import customer from "../../assets/table/customer.svg";
import call from "../../assets/table/call.svg";
import message from "../../assets/table/message.svg";
import setting from "../../assets/table/setting.svg";
import React from 'react';

export default {
  title: "Components/Table",
  component: Table,
  decorators: [(Story) => <Story />],
} as Meta;

const TableTemplate: StoryFn<TableType> = (args) => {
  return <Table {...args} />;
};

export const defaultStyle = TableTemplate.bind({});
defaultStyle.args = {
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
      onSearch: (query: string) => {
        console.log("Query:", query);
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
      rightIcon: <img src={moneyBag} alt="product icon" className="ml-auto" />,
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
          <span
            className={`${style} flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}
          >
            <GoDotFill />
            {value}
          </span>
        );
      },
      rightIcon: <img src={statusIcon} alt="status icon" className="ml-auto" />,
    },
    {
      title: "ACTIONS",
      key: "actions",
      valueIsAComponent: true,
      customValue: () => {
        return (
          <span className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer">
            View
          </span>
        );
      },
    },
  ],
  tableData: generateCustomerEntries(50),
};

export const cardStyle = TableTemplate.bind({});
cardStyle.args = {
  tableTitle: "ALL AGENTS",
  filterList: [
    {
      name: "All Status",
      items: ["All Status", "Recharge", "One-Time", "Installment"],
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
    {
      onDateClick: (date: string) => {
        console.log("Date:", date);
      },
      isDate: true,
    },
  ],
  tableClassname: "flex flex-wrap items-center gap-4",
  tableData: generateAgentEntries(50),
  tableType: "card",
  cardComponent: (
    data: {
      name: string;
      status: string;
      onGoingSales: number;
      inventoryInPossession: number;
      sales: number;
      registeredCustomers: number;
    }[]
  ) => {
    return data.map((item) => <AgentsCard {...item} />);
  },
};

const AgentsCard = ({
  name,
  status,
  onGoingSales,
  inventoryInPossession,
  sales,
  registeredCustomers,
}: {
  name: string;
  status: string;
  onGoingSales: number;
  inventoryInPossession: number;
  sales: number;
  registeredCustomers: number;
}) => {
  return (
    <div className="flex flex-col w-[32%] bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
      <div className="flex items-center justify-between p-2">
        <span className="flex items-center gap-0.5">
          <img src={smile} alt="Smile Icon" />
          <p className="flex items-center justify-center bg-paleLightBlue text-xs px-2 text-textBlack font-semibold rounded-full h-[24px]">
            {name}
          </p>
        </span>
        <span
          className={`flex items-center text-xs justify-center gap-0.5 bg-[#F6F8FA] px-2 py-1 border-[0.4px] border-strokeGreyTwo h-[24px] rounded-full ${status === "active"
              ? "text-success"
              : status === "barred"
                ? "text-errorTwo"
                : "text-brightBlue"
            }`}
        >
          <GoDotFill /> {status.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-successTwo rounded-full h-[24px]">
            <img src={ongoing} />
            On-Going Sales
          </p>
          <span className="text-xs font-bold text-textDarkGrey">
            {onGoingSales}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-successTwo rounded-full h-[24px]">
            <img src={inventory} />
            Inventory in Possession
          </p>
          <span className="text-xs font-bold text-textDarkGrey">
            {inventoryInPossession}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
            <img src={inventory} />
            Total Sales
          </p>
          <span className="text-xs font-bold text-textDarkGrey">{sales}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
            <img src={customer} />
            Registered Customers
          </p>
          <span className="text-xs font-bold text-textDarkGrey">
            {registeredCustomers}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#F6F8FA] p-2 h-[40px] border-t-[0.6px] border-t-strokeGreyThree rounded-b-[20px]">
        <div className="flex items-center gap-2">
          <img src={call} alt="call" className="cursor-pointer" />
          <img src={message} alt="message" className="cursor-pointer" />
        </div>
        <img src={setting} alt="setting" className="cursor-pointer" />
      </div>
    </div>
  );
};

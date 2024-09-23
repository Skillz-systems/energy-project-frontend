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
};

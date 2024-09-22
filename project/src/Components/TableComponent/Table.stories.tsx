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
  tableTitle: "ALL CUSTOMERS"
};

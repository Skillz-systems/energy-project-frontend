import { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import TabComponent from "./TabComponent";
import { TabComponentProps, Tab } from "./TabComponent";
import { MemoryRouter } from "react-router-dom";

const tabNames = [
  { name: "Product Details", key: "productDetails" },
  { name: "Stats", key: "stats" },
  { name: "Inventory Details", key: "inventoryDetails" },
  { name: "Customers", key: "customers" },
];

// Sample data fetched from endpoint
const fetchedData = {
  productDetails: [
    {
      id: 1,
      name: "Product A",
      description: "High-quality widget",
      price: "$10.99",
    },
    {
      id: 2,
      name: "Product B",
      description: "Affordable gadget",
      price: "$5.49",
    },
  ],
  stats: [
    { metric: "Views", value: 340 },
    { metric: "Sales", value: 120 },
    { metric: "Returns", value: 10 },
  ],
  inventoryDetails: [
    { item: "Product A", stock: 150, location: "Warehouse 1" },
    { item: "Product B", stock: 200, location: "Warehouse 2" },
    { item: "Product C", stock: 50, location: "Warehouse 3" },
  ],
  customers: [
    {
      id: 101,
      name: "Uche",
      email: "uche@example.com",
      purchaseHistory: ["Product A", "Product B"],
    },
  ],
};

export default {
  title: "Components/Tab",
  component: TabComponent,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn<TabComponentProps> = (args) => {
  const [data, setData] = useState<any>(args.tabs[0]?.data);

  const handleTabSelect = (tab: Tab) => {
    setData(tab.data);
    if (args.onTabSelect) args.onTabSelect(tab);
  };

  return (
    <div className="flex flex-col gap-2">
      <TabComponent {...args} onTabSelect={handleTabSelect} />
      <div className="mt-4">
        <h4>Selected Tab Data:</h4>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  tabs: tabNames.map(({ name, key }) => ({
    name,
    data: fetchedData[key],
    count: fetchedData[key].length,
  })),
  onTabSelect: (tab: Tab) => console.log("Selected tab:", tab),
};

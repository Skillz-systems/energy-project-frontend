import { Meta, StoryFn } from "@storybook/react";
import { CardComponent, CardComponentProps } from "./CardComponent";

export default {
  title: "Components/Cards",
  component: CardComponent,
} as Meta;

const CardTemplate: StoryFn<CardComponentProps> = (args) => (
  <CardComponent {...args} />
);

export const agentCard = CardTemplate.bind({});
agentCard.args = {
  variant: "agent",
  handleCallClick: () => {},
  handleWhatsAppClick: () => {},
  dropDownList: {
    items: ["View Agent Profile", "Barr Agent"],
    onClickLink: (index: number) => {
      console.log(index);
    },
    defaultStyle: true,
    showCustomButton: true,
  },
  name: "Tersoo",
  status: "active",
  onGoingSales: 15,
  inventoryInPossession: 20,
  sales: 30,
  registeredCustomers: 25,
};

export const customerCard = CardTemplate.bind({});
customerCard.args = {
  variant: "customer",
  handleCallClick: () => {},
  handleWhatsAppClick: () => {},
  dropDownList: {
    items: ["View Customer"],
    onClickLink: (index: number) => {
      console.log(index);
    },
    defaultStyle: true,
    showCustomButton: true,
  },
  name: "Tersoo",
  productTag: "EAAS",
  productType: "Recharge",
  paymentStatus: "Defaulted",
  daysDue: 29,
};

export const transactionsCard = CardTemplate.bind({});
transactionsCard.args = {
  variant: "transactions",
  dropDownList: {
    items: ["View Transaction"],
    onClickLink: (index: number) => {
      console.log(index);
    },
    defaultStyle: true,
    showCustomButton: true,
  },
  transactionId: "72634823729",
  transactionStatus: "Successful",
  datetime: "2024-11-07T22:43:08.271156Z",
  productTag: "EAAS",
  productType: "Recharge",
  transactionAmount: 2000,
};

export const salesCard = CardTemplate.bind({});
salesCard.args = {
  variant: "sales",
  dropDownList: {
    items: ["View Sale Details", "Cancel Sale"],
    onClickLink: (index: number) => {
      console.log(index);
    },
    defaultStyle: true,
    showCustomButton: true,
  },
  saleId: "72634823729",
  productStatus: "IN CONTRACT",
  productTag: "SHS",
  productId: "124242",
  name: "Tersoo",
  installment: 29,
};

export const productNoImageCard = CardTemplate.bind({});
productNoImageCard.args = {
  variant: "product-no-image",
  dropDownList: {
    items: ["View Product", "Cancel Product"],
    onClickLink: (index: number) => {
      console.log(index);
    },
    defaultStyle: true,
    showCustomButton: true,
  },
  productTag: "EAAS",
  productId: "124242",
  productPrice: 4000,
};

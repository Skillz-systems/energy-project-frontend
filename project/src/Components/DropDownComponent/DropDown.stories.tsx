import { Meta, StoryFn } from "@storybook/react";
import { DropDown, DropDownType } from "./DropDown";

export default {
  title: "Components/DropDown",
  component: DropDown,
  decorators: [(Story) => <Story />],
} as Meta;

const DropDownTemplate: StoryFn<DropDownType> = (args) => {
  return (
    <div className="flex items-center justify-center">
      <p className="mr-4">Click on the dropdown</p>
      <DropDown {...args} />
    </div>
  );
};

export const dropDown = DropDownTemplate.bind({});
dropDown.args = {
  items: ["All Status", "Recharge", "One-Time", "Installment"],
  onClickLink: (index: number) => {
    console.log("INDEX:", index);
  },
  buttonImgStyle: "",
  dropDownContainerStyle: "",
};

import { Meta, StoryFn } from "@storybook/react";
import { DropDown, DropDownType } from "./DropDown";
<<<<<<< HEAD:project/src/Components/DropDownComponent/DropDown.stories.tsx
import React from "react";
=======
import React from 'react';
>>>>>>> fc08606f7be0fc0b11f32e2803ee43d632dcb724:src/Components/DropDownComponent/DropDown.stories.tsx

export default {
  title: "Components/DropDown",
  component: DropDown,
  decorators: [(Story) => <Story />],
} as Meta;

const DropDownTemplate: StoryFn<DropDownType> = (args) => {
  return (
    <div className="flex items-center justify-center">
      <DropDown {...args} />
    </div>
  );
};

export const dropDown = DropDownTemplate.bind({});
dropDown.args = {
  name: "Location",
  items: ["All Status", "Recharge", "One-Time", "Installment"],
  onClickLink: (index: number) => {
    console.log("INDEX:", index);
  },
  buttonImgStyle: "",
  dropDownContainerStyle: "",
};

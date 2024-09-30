import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import React from 'react';
import {
  Input,
  InputType,
  RadioInput,
  RadioInputType,
  SelectInput,
  SelectInputType,
  ToggleInput,
  ToggleInputType,
} from "./Input";

export default {
  title: "Components/Inputs",
  component: Input,
} as Meta;

const InputTemplate: StoryFn<InputType> = (args) => <Input {...args} />;
const RadioTemplate: StoryFn<RadioInputType> = (args) => (
  <RadioInput {...args} />
);
const SelectTemplate: StoryFn<SelectInputType> = (args) => (
  <SelectInput {...args} />
);
const ToggleTemplate: StoryFn<ToggleInputType> = (args) => (
  <ToggleInput {...args} />
);

export const GenericInput = InputTemplate.bind({});
GenericInput.args = {
  type: "password",
  name: "name",
<<<<<<< HEAD:project/src/Components/InputComponent/Input.stories.tsx
  label: "Password",
  value: "hdgsgsdd",
  onChange: () => {},
=======
  label: "Firstname",
  value: "",
  onChange: () => { },
>>>>>>> fc08606f7be0fc0b11f32e2803ee43d632dcb724:src/Components/InputComponent/Input.stories.tsx
  required: false,
  style: "",
};

export const CustomRadioInput = RadioTemplate.bind({});
CustomRadioInput.args = {
  name: "name",
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Radio Value:", event.target.value);
  },
  required: false,
  radioOptions: [
    {
      label: "One-off",
      value: "oneoff",
      bgColour: "",
      color: "",
    },
    {
      label: "Installment",
      value: "installment",
      bgColour: "",
      color: "",
    },
  ],
  radioLayout: "row",
  radioParentStyle: "",
  radioSelectedStyle: "",
};

export const CustomSelectInput = SelectTemplate.bind({});
CustomSelectInput.args = {
  label: "Name",
  name: "name",
  options: [
    {
      label: "One-off",
      value: "oneoff",
    },
    {
      label: "Installment",
      value: "installment",
    },
  ],
  value: "Tersoo",
  onChange: () => { },
  required: false,
  style: "",
};

export const CustomToggleInput = ToggleTemplate.bind({});
CustomToggleInput.args = {
  defaultChecked: false,
  onChange: (checked: boolean) => {
    console.log("Toggle value:", checked);
  },
  disabled: false,
};

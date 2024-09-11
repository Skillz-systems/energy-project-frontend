// Input.stories.tsx
import { Meta, StoryFn } from "@storybook/react"; // Import Story from Storybook
import { Input, InputType } from "./Input";
import "../../index.css";

export default {
  title: "Components/Inputs",
  component: Input,
} as Meta;

// Create a template for the Input component
const InputTemplate: StoryFn<InputType> = (args) => <Input {...args} />;

// Input story
export const InputComponent = InputTemplate.bind({});
InputComponent.args = {
  type: "text", // Default type
  name: "inputComponent",
  placeholder: "Enter text",
  label: "Text Input",
  value: "",
  disabled: false,
};

import { MemoryRouter } from "react-router-dom";
import { Meta, StoryFn } from "@storybook/react";
import { MenuButton, MenuButtonType } from "./MenuButton";
import { navData } from "./navData";

export default {
  title: "Components/Menu",
  component: MenuButton,
} as Meta;

const MenuTemplate: StoryFn<MenuButtonType> = (args) => (
  <MemoryRouter>
    <MenuButton {...args} />
  </MemoryRouter>
);

export const menuButton = MenuTemplate.bind({});
menuButton.args = {
  buttonStyle: "",
  sections: navData,
};

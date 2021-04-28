import React, { ComponentProps } from "react";

import { Story } from "@storybook/react";
import { CButton } from "./CButton";

export default {
  title: "CommentsFront/버튼 컴포넌트",
  component: CButton,
};

const Template: Story<ComponentProps<typeof CButton>> = (args) => (
  <CButton {...args} />
);

export const Normal = Template.bind({});
Normal.args = {
  disabled: false,
  label: "하이!",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  label: "하이! (disabled)",
};

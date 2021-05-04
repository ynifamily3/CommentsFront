import React, { ReactNode } from "react";
import "./cbutton.css";
export interface CButtonProps {
  backgroundColor?: string;
  disabled?: boolean;
  onClick?: () => void;
  label: ReactNode;
  color?: string;
}
const CButton: React.VFC<CButtonProps> = (props) => {
  const { disabled, onClick, backgroundColor, label, color } = props;
  return (
    <button
      disabled={disabled === undefined ? false : disabled}
      onClick={onClick}
      style={{ backgroundColor, color }}
      className={[`storybook-cbutton`].join(" ")}
    >
      {label}
    </button>
  );
};

export { CButton };

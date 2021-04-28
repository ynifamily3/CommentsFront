import React from "react";
import "./cbutton.css";
export interface CButtonProps {
  backgroundColor?: string;
  disabled?: boolean;
  onClick?: () => void;
  label: string;
}
const CButton: React.VFC<CButtonProps> = (props) => {
  const { disabled, onClick, backgroundColor, label } = props;
  console.log(disabled);
  return (
    <button
      disabled={disabled === undefined ? false : disabled}
      onClick={onClick}
      style={{ backgroundColor }}
      className={[`storybook-cbutton`].join(" ")}
    >
      {label}
    </button>
  );
};

export { CButton };

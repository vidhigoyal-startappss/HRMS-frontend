import React from "react";

interface ButtonProps {
  name: string;
  onHandleClick?: () => void;
  cls: string;
}

const Button: React.FC<ButtonProps> = ({ name, onHandleClick, cls }) => {
  return (
    <button onClick={onHandleClick} className={cls}>
      {name}
    </button>
  );
};

export default Button;

import { useRouter } from "next/router";
import React from "react";

interface ButtonProps {
  text: string;
  className: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  path?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  type,
  onClick,
  path,
  disabled,
}) => {
  const router = useRouter();

  // const handleClick = () => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (path) {
      router.push(path);
    } else if (onClick) {
      onClick?.(e);
    }
  };

  return (
    <button
      className={`${className} text-sm md:text-base whitespace-nowrap lg:py-[10px] py-[4px] px-4 md:px-[10px] lg:px-[18px] h-[36px] md:h-[40px] lg:h-[44px] flex items-center justify-center`}
      type={type || "button"}
      onClick={handleClick}
      disabled={disabled && disabled}
    >
      {text}
    </button>
  );
};

export default Button;

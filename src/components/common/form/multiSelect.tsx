import React, { useEffect, useRef, useState } from "react";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Image from "next/image";

interface MultiSelectDropDownProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  errors?: any;
  touched?: any;
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  value?: string[];
}

const MultiSelectDropDown: React.FC<MultiSelectDropDownProps> = ({
  label,
  name,
  id,
  placeholder,
  errors,
  touched,
  onChange,
  options,
  value = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popup = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: { value: string; label: string }) => {
    let newValue;
    if (value.includes(option.value)) {
      newValue = value.filter((val) => val !== option.value);
    } else {
      newValue = [...value, option.value];
    }
    onChange(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className="text-darkBlack text-sm font-semibold">
        {label}
      </label>
      <div
        id={id}
        className={`border mt-2 rounded-[8px] py-[13px] px-[16px] h-[48px] relative flex items-center justify-between cursor-pointer ${
          isOpen ? "open" : ""
        } ${
          errors && touched && errors[name] && touched[name]
            ? "border-red"
            : "border-[#B9C0D4]"
        }`}
        onClick={handleToggle}
      >
        <div className="truncate text-darkBlack">
          {value.length > 0
            ? options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : placeholder}
        </div>
        <Image
          src={Ic_chevron_down}
          className={`${isOpen ? "rotate-180" : ""}`}
          alt="arrow"
        />
      </div>
      {isOpen && (
        <div
          className="absolute bg-white w-full shadow-shadow1 max-h-48 overflow-auto"
          style={{ zIndex: 999 }}
          ref={popup}
        >
          <ul>
            {options.map((option, index) => (
              <div className="px-4 py-2.5">
                <label
                  className={`container container_darkgray
                  truncate cursor-pointer w-full flex items-center gap-2 ${
                    value.includes(option.value) ? "font-medium" : ""
                  }`}
                  key={index}
                >
                  <span className="text-darkBlack text-sm laptop:text-base truncate">
                    {option.label}
                  </span>
                  <input
                    type="checkbox"
                    id={option.label}
                    value={option.label}
                    checked={value.includes(option.value)}
                    onChange={() => handleSelect(option)}
                    className="mr-2"
                  />

                  <span className="checkmark checkmark_darkgray"></span>
                </label>
              </div>
            ))}
          </ul>
        </div>
      )}
      {errors && touched && errors[name] && touched[name] && (
        <div className="error-message">{errors[name]}</div>
      )}
    </div>
  );
};

export default MultiSelectDropDown;

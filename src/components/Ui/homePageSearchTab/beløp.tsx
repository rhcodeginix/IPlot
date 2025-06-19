import React, { useState, useRef } from "react";
import Image from "next/image";
import Ic_Search2 from "@/public/images/Ic_Search2.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import { useRouter } from "next/router";

const BeløpTab = () => {
  const [formData, setFormData] = useState({
    amount: "",
  });

  const [errors, setErrors] = useState<{
    amount: boolean;
  }>({
    amount: false,
  });

  const router = useRouter();

  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const handleKartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");

    if (rawValue) {
      const formattedValue = new Intl.NumberFormat("no-NO").format(
        Number(rawValue)
      );
      setFormData((prev) => ({ ...prev, amount: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, amount: "" }));
    }

    setErrors((prev) => ({ ...prev, amount: false }));
  };

  const handleClearKartInput = () => {
    setFormData((prev) => ({ ...prev, amount: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData?.amount) {
      setErrors((prev) => ({ ...prev, amount: true }));
      hasError = true;
    }

    if (hasError) return;

    router.push(
      `housemodell-plot?pris=${formData?.amount.replace(/\s+/g, "")}`
    );
    const currIndex = 0;
    localStorage.setItem("currIndex", currIndex.toString());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="lg:h-[80px] bg-white border-gray3 border rounded-[8px] lg:rounded-[98px] flex flex-col lg:flex-row lg:items-center relative justify-between"
        style={{
          boxShadow: "0px 32px 82px -12px #10182812",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
            <div className="w-[92%]">
              <div className="text-[#30374F] mb-2 text-xs md:text-sm">
                Hvor mye vil du bruke totalt for både tomt og bolig?
              </div>
              <input
                ref={kartInputRef}
                className={`focus:outline-none text-black text-sm md:text-base desktop:text-lg font-medium bg-transparent w-full
                  ${errors.amount ? "border border-red-500" : ""}`}
                placeholder="Fyll inn beløp i NOK"
                onChange={handleKartInputChange}
                value={formData?.amount}
                type="text"
                inputMode="numeric"
              />
            </div>
            {formData?.amount && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearKartInput}
                fetchPriority="auto"
              />
            )}
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">Beløp kreves.</p>
          )}
        </div>

        <div className="border-t border-gray3 w-full lg:hidden"></div>

        <button
          className={`p-3 lg:px-5 lg:py-4 cursor-pointer flex justify-center items-center bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] rounded-[40px] transition-all duration-300 ease-out h-[40px] lg:h-[56px] m-4 gap-2 ${
            !formData?.amount ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!formData?.amount}
        >
          <Image
            src={Ic_Search2}
            alt="search"
            className="w-5 h-5"
            fetchPriority="auto"
          />
          <span className="text-white font-medium text-base">Søk</span>
        </button>
      </div>
    </form>
  );
};

export default BeløpTab;

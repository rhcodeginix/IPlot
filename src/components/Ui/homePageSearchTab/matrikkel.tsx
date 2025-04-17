import React, { useState, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import { useRouter } from "next/router";

const MatrikkelTab = () => {
  const [formData, setFormData] = useState({
    kommune: "",
    Gårsnummer: "",
    Bruksnummer: "",
    Seksjonsnummer: "",
  });

  const [errors, setErrors] = useState<{
    Gårsnummer: boolean;
    kommune: boolean;
    Bruksnummer: boolean;
  }>({
    Gårsnummer: false,
    kommune: false,
    Bruksnummer: false,
  });

  const kartInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleKartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, kommune: value }));
    setErrors((prev) => ({ ...prev, kommune: false }));
  };

  const handleClearKartInput = () => {
    setFormData((prev) => ({ ...prev, kommune: "" }));
  };

  const GårsnummerInputRef = useRef<HTMLInputElement | null>(null);

  const handleGårsnummerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, Gårsnummer: value }));
    setErrors((prev) => ({ ...prev, Gårsnummer: false }));
  };

  const handleClearGårsnummerInput = () => {
    setFormData((prev) => ({ ...prev, Gårsnummer: "" }));
  };
  const BruksnummerInputRef = useRef<HTMLInputElement | null>(null);

  const handleBruksnummerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, Bruksnummer: value }));
    setErrors((prev) => ({ ...prev, Bruksnummer: false }));
  };

  const handleClearBruksnummerInput = () => {
    setFormData((prev) => ({ ...prev, Bruksnummer: "" }));
  };

  const SeksjonsnummerInputRef = useRef<HTMLInputElement | null>(null);

  const handleSeksjonsnummerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, Seksjonsnummer: value }));
  };

  const handleClearSeksjonsnummerInput = () => {
    setFormData((prev) => ({ ...prev, Seksjonsnummer: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData?.Gårsnummer) {
      setErrors((prev) => ({ ...prev, Gårsnummer: true }));
      hasError = true;
    }
    if (!formData?.kommune) {
      setErrors((prev) => ({ ...prev, kommune: true }));
      hasError = true;
    }
    if (!formData?.Bruksnummer) {
      setErrors((prev) => ({ ...prev, Bruksnummer: true }));
      hasError = true;
    }

    if (hasError) return;

    router.push(
      `/regulations?kommunenummer=${formData?.kommune}&gardsnummer=${formData?.Gårsnummer}&bruksnummer=${formData?.Bruksnummer}${formData?.Seksjonsnummer && `&kommunenavn=${formData?.Seksjonsnummer}`}`
    );
    const currIndex = 0;
    localStorage.setItem("currIndex", currIndex.toString());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="lg:h-[80px] bg-[#F9F9FB] border-gray3 border rounded-[8px] lg:rounded-[100px] flex flex-col lg:flex-row lg:items-center relative justify-between"
        style={{
          boxShadow: "0px 32px 82px -12px #10182812",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          <div className="lg:w-1/4">
            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
              <div className="w-[92%] lg:w-auto">
                <div className="text-[#30374F] mb-2 text-xs md:text-sm">
                  Kommunenummer
                </div>
                <input
                  ref={kartInputRef}
                  type="number"
                  className={`focus:outline-none text-black text-sm md:text-base desktop:text-lg font-medium bg-transparent w-full
                  ${errors.kommune ? "border border-red-500" : ""}`}
                  placeholder="Velg kommune"
                  onChange={handleKartInputChange}
                  value={formData?.kommune}
                />
              </div>
              {formData?.kommune && (
                <Image
                  src={Ic_close}
                  alt="close"
                  className="cursor-pointer"
                  onClick={handleClearKartInput}
                  fetchPriority="auto"
                />
              )}
            </div>
            {errors.kommune && (
              <p className="text-red-500 text-xs mt-1">kommune er påkrevd.</p>
            )}
          </div>
          <div className="border-b lg:border-b-0 lg:border-l border-[#7D89B0] w-full lg:w-[1px] lg:h-[37px] border-opacity-30"></div>
          <div className="lg:w-1/4">
            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
              <div className="w-[92%] lg:w-auto">
                <div className="text-darkBlack mb-1 text-sm">Gårsnummer</div>
                <input
                  ref={GårsnummerInputRef}
                  type="number"
                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full
                  ${errors.Gårsnummer ? "border border-red-500" : ""}`}
                  placeholder="Skriv Gnr."
                  onChange={handleGårsnummerInputChange}
                  value={formData?.Gårsnummer}
                />
              </div>
              {formData?.Gårsnummer && (
                <Image
                  src={Ic_close}
                  alt="close"
                  className="cursor-pointer"
                  onClick={handleClearGårsnummerInput}
                  fetchPriority="auto"
                />
              )}
            </div>
            {errors.Gårsnummer && (
              <p className="text-red-500 text-xs mt-1">
                Gårsnummer er påkrevd.
              </p>
            )}
          </div>
          <div className="border-b lg:border-b-0 lg:border-l border-[#7D89B0] w-full lg:w-[1px] lg:h-[37px] border-opacity-30"></div>
          <div className="lg:w-1/4">
            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
              <div className="w-[92%] lg:w-auto">
                <div className="text-darkBlack mb-1 text-sm">Bruksnummer</div>
                <input
                  ref={BruksnummerInputRef}
                  type="number"
                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full
                  ${errors.Bruksnummer ? "border border-red-500" : ""}`}
                  placeholder="Skriv Bnr."
                  onChange={handleBruksnummerInputChange}
                  value={formData?.Bruksnummer}
                />
              </div>
              {formData?.Bruksnummer && (
                <Image
                  src={Ic_close}
                  alt="close"
                  className="cursor-pointer"
                  onClick={handleClearBruksnummerInput}
                  fetchPriority="auto"
                />
              )}
            </div>
            {errors.Bruksnummer && (
              <p className="text-red-500 text-xs mt-1">
                Bruksnummer er påkrevd.
              </p>
            )}
          </div>
          <div className="border-b lg:border-b-0 lg:border-l border-[#7D89B0] w-full lg:w-[1px] lg:h-[37px] border-opacity-30"></div>
          <div className="lg:w-1/4">
            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative">
              <div className="w-[92%] lg:w-auto">
                <div className="text-darkBlack mb-1 text-sm">
                  Seksjonsnummer
                </div>
                <input
                  ref={SeksjonsnummerInputRef}
                  type="number"
                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full`}
                  placeholder="Velg Seksjonsnummer"
                  onChange={handleSeksjonsnummerInputChange}
                  value={formData?.Seksjonsnummer}
                />
              </div>
              {formData?.Seksjonsnummer && (
                <Image
                  src={Ic_close}
                  alt="close"
                  className="cursor-pointer"
                  onClick={handleClearSeksjonsnummerInput}
                  fetchPriority="auto"
                />
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray3 w-full lg:hidden"></div>

        <button
          className={`p-3 lg:px-5 lg:py-4 cursor-pointer flex justify-center items-center bg-greenBtn rounded-[40px] transition-all duration-300 ease-out h-[40px] lg:h-[56px] my-4 md:my-[22px] mx-4 md:mx-6 gap-2 ${
            !formData?.Gårsnummer ||
            !formData?.kommune ||
            !formData?.Bruksnummer
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          type="submit"
          disabled={
            !formData?.Gårsnummer ||
            !formData?.kommune ||
            !formData?.Bruksnummer
          }
        >
          <Image
            src={Ic_search}
            alt="search"
            className="w-6 h-6"
            fetchPriority="auto"
          />
        </button>
      </div>
    </form>
  );
};

export default MatrikkelTab;

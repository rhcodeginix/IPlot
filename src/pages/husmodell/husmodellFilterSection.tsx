import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import { useState } from "react";
import { Slider, styled } from "@mui/material";
import Button from "@/components/common/button";

const CustomSlider = styled(Slider)({
  color: "#6941C6",
  height: 9,
  padding: 0,
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#6941C6",
    border: "6px solid #fff",
  },
  "& .MuiSlider-rail": {
    color: "#B9C0D4",
    opacity: 1,
    height: 9,
  },
  "& .MuiSlider-thumb::after": {
    height: 24,
    width: 24,
  },
  "& .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb:hover": {
    boxShadow: "none",
  },
  "& .css-cp2j25-MuiSlider-thumb::before": {
    boxShadow: "none",
  },
  "& .MuiSlider-valueLabel.css-14gyywz-MuiSlider-valueLabel": {
    color: "#111322",
    backgroundColor: "white",
    boxShadow: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 500,
  },
});
type FormDataType = {
  address: string;
  Eiendomstype: string[];
  TypeHusmodell: string[];
  AntallSoverom: string[];
  minRangeForHusmodell: number;
  maxRangeForHusmodell: number;
  Tomtetype: string[];
};

const HusmodellFilterSection: React.FC<{
  setFormData: any;
  formData: FormDataType;
  maxRangeData: number;
}> = ({ setFormData, formData, maxRangeData }) => {
  const [maxHousePrice, setMaxHousePrice] = useState(
    String(
      new Intl.NumberFormat("no-NO").format(
        Number(formData?.maxRangeForHusmodell)
      )
    )
  );
  const [openIndex, setOpenIndex] = useState<string[]>([
    "Eiendomstype",
    "Type husmodell",
    "Antall soverom",
    "Tomtetype",
    "Pris på husmodell",
  ]);

  const handleToggleAccordion = (type: string) => {
    setOpenIndex((prevOpenIndex) =>
      prevOpenIndex.includes(type)
        ? prevOpenIndex.filter((section) => section !== type)
        : [...prevOpenIndex, type]
    );
  };
  const EiendomstypeArray: any = [
    { name: "Bolig", value: "Bolig" },
    { name: "Hytte", value: "Hytte" },
  ];
  const TypeHusmodellArray: any = [
    { name: "Funkis", value: "Funkis" },
    { name: "Moderne", value: "Moderne" },
    { name: "Herskapelig", value: "Herskapelig" },
    { name: "Tradisjonelt", value: "Tradisjonelt" },
    { name: "Tomannsbolig", value: "Tomannsbolig" },
    { name: "Med utleiedel", value: "Med utleiedel" },
    { name: "Ett plan", value: "Ett plan" },
    { name: "Med garasje", value: "Med garasje" },
  ];
  const AntallSoveromArray: any = [
    { name: "1 Soverom", value: "1 Soverom" },
    { name: "2 Soverom", value: "2 Soverom" },
    { name: "3 Soverom", value: "3 Soverom" },
    { name: "4 Soverom", value: "4 Soverom" },
    { name: "5 Soverom", value: "5 Soverom" },
    { name: "6 Soverom", value: "6 Soverom" },
  ];
  const TomtetypeArray: any = [
    { name: "Flat", value: "Flat" },
    { name: "Skrånet", value: "Skrånet" },
  ];

  return (
    <>
      <div className="sticky top-[86px] bg-[#F9F5FF] rounded-[12px]">
        <div className="p-6 flex items-center justify-between gap-3 border-b border-[#7D89B04D]">
          <h4 className="text-darkBlack font-medium text-base md:text-lg lg:text-xl desktop:text-2xl">
            Filter
          </h4>
          <h5
            className="text-blue text-sm md:text-base font-medium cursor-pointer"
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                address: "",
                Eiendomstype: [],
                TypeHusmodell: [],
                AntallSoverom: [],
                minRangeForHusmodell: 0,
                Tomtetype: [],
                maxRangeForHusmodell: maxRangeData,
              }));
            }}
          >
            Tilbakestill
          </h5>
        </div>
        <div className="px-6 py-5 h-auto max-h-[600px] overflow-y-auto overFlowYAuto overflow-x-hidden">
          <div
            className="border border-gray3 rounded-[48px] p-1 pl-5 flex items-center justify-between gap-3 bg-white mb-5"
            style={{
              boxShadow:
                "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
            }}
          >
            <input
              type="text"
              className={`focus:outline-none text-black text-base bg-transparent w-full`}
              placeholder="Søk på fritekst"
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev: any) => ({ ...prev, address: value }));
              }}
              value={formData?.address ?? ""}
            />
            <div>
              <button
                className={`p-1.5 lg:p-[10px] cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[32px] w-[32px] lg:h-[40px] lg:w-[40px]`}
              >
                <Image
                  src={Ic_search}
                  alt="search"
                  className="w-6 h-6"
                  fetchPriority="auto"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Eiendomstype")}
              >
                Eiendomstype
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Eiendomstype") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Eiendomstype") && (
                <>
                  <div className="my-4 border-t border-[#DCDFEA]"></div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {EiendomstypeArray.map((data: any, index: number) => (
                      <label
                        className="container container_darkgray_withPurple"
                        htmlFor={data.name}
                        key={index}
                      >
                        <span className="text-darkBlack text-sm md:text-base">
                          {data.name}
                        </span>
                        <input
                          type="checkbox"
                          id={data.name}
                          value={data.name}
                          checked={formData?.Eiendomstype.includes(data.name)}
                          onChange={() => {
                            setFormData((prev: any) => {
                              const updatedSet: any = new Set(
                                prev.Eiendomstype
                              );
                              updatedSet.has(data.name)
                                ? updatedSet.delete(data.name)
                                : updatedSet.add(data.name);
                              return {
                                ...prev,
                                Eiendomstype: Array.from(updatedSet),
                              };
                            });
                          }}
                          className="mr-2"
                        />

                        <span className="checkmark checkmark_darkgray_withPurple"></span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Type husmodell")}
              >
                Type husmodell
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Type husmodell") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Type husmodell") && (
                <>
                  <div className="my-4 border-t border-[#DCDFEA]"></div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {TypeHusmodellArray.map((data: any, index: number) => (
                      <label
                        className="container container_darkgray_withPurple"
                        htmlFor={data.name}
                        key={index}
                      >
                        <span className="text-darkBlack text-sm md:text-base">
                          {data.name}
                        </span>
                        <input
                          type="checkbox"
                          id={data.name}
                          value={data.name}
                          checked={formData?.TypeHusmodell.includes(data.name)}
                          onChange={() => {
                            setFormData((prev: any) => {
                              const updatedSet: any = new Set(
                                prev.TypeHusmodell
                              );
                              updatedSet.has(data.name)
                                ? updatedSet.delete(data.name)
                                : updatedSet.add(data.name);
                              return {
                                ...prev,
                                TypeHusmodell: Array.from(updatedSet),
                              };
                            });
                          }}
                          className="mr-2"
                        />

                        <span className="checkmark checkmark_darkgray_withPurple"></span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Antall soverom")}
              >
                Antall soverom
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Antall soverom") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Antall soverom") && (
                <>
                  <div className="my-4 border-t border-[#DCDFEA]"></div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {AntallSoveromArray.map((data: any, index: number) => (
                      <label
                        className="container container_darkgray_withPurple"
                        htmlFor={data.name}
                        key={index}
                      >
                        <span className="text-darkBlack text-sm md:text-base">
                          {data.name}
                        </span>
                        <input
                          type="checkbox"
                          id={data.name}
                          value={data.name}
                          checked={formData?.AntallSoverom.includes(data.name)}
                          onChange={() => {
                            setFormData((prev: any) => {
                              const updatedSet: any = new Set(
                                prev.AntallSoverom
                              );
                              updatedSet.has(data.name)
                                ? updatedSet.delete(data.name)
                                : updatedSet.add(data.name);
                              return {
                                ...prev,
                                AntallSoverom: Array.from(updatedSet),
                              };
                            });
                          }}
                          className="mr-2"
                        />

                        <span className="checkmark checkmark_darkgray_withPurple"></span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Tomtetype")}
              >
                Tomtetype
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Tomtetype") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Tomtetype") && (
                <>
                  <div className="my-4 border-t border-[#DCDFEA]"></div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {TomtetypeArray.map((data: any, index: number) => (
                      <label
                        className="container container_darkgray_withPurple"
                        htmlFor={data.name}
                        key={index}
                      >
                        <span className="text-darkBlack text-sm md:text-base">
                          {data.name}
                        </span>
                        <input
                          type="checkbox"
                          id={data.name}
                          value={data.name}
                          checked={formData?.Tomtetype.includes(data.name)}
                          onChange={() => {
                            setFormData((prev: any) => {
                              const updatedSet: any = new Set(prev.Tomtetype);
                              updatedSet.has(data.name)
                                ? updatedSet.delete(data.name)
                                : updatedSet.add(data.name);
                              return {
                                ...prev,
                                Tomtetype: Array.from(updatedSet),
                              };
                            });
                          }}
                          className="mr-2"
                        />

                        <span className="checkmark checkmark_darkgray_withPurple"></span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Pris på husmodell")}
              >
                Pris på husmodell
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Pris på husmodell") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Pris på husmodell") && (
                <>
                  <div className="my-4 border-t border-[#DCDFEA]"></div>
                  <div className="mx-1">
                    <CustomSlider
                      value={[
                        formData?.minRangeForHusmodell,
                        formData?.maxRangeForHusmodell,
                      ]}
                      onChange={(_event: any, newValue: any) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          minRangeForHusmodell: newValue[0],
                          maxRangeForHusmodell: newValue[1],
                        }));
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      min={0}
                      max={maxRangeData}
                      step={100}
                    />
                  </div>
                  <div className="flex items-center justify-between h-[30px] mt-2">
                    <div className="text-grayText text-sm lg:text-base">
                      {formData?.minRangeForHusmodell} NOK
                    </div>
                    <div className="text-grayText text-sm lg:text-base">
                      {formData?.maxRangeForHusmodell} NOK
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter Pris"
                      className="border border-gray2 rounded-lg px-3 py-2 focus-within:outline-none w-full"
                      value={maxHousePrice}
                      onChange={(e: any) => {
                        const rawValue = e.target.value.replace(/\D/g, "");

                        if (rawValue) {
                          const formattedValue = new Intl.NumberFormat(
                            "no-NO"
                          ).format(Number(rawValue));
                          setMaxHousePrice(formattedValue);
                        } else {
                          setMaxHousePrice("");
                        }
                      }}
                    />

                    <Button
                      text="Save"
                      className="border border-[#6941C6] bg-[#6941C6] text-white md:text-sm rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-semibold relative desktop:px-4 desktop:py-2"
                      type="button"
                      onClick={() => {
                        setFormData((prev: any) => ({
                          ...prev,
                          maxRangeForHusmodell: Math.floor(
                            Number(maxHousePrice.replace(/\s+/g, ""))
                          ),
                        }));
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HusmodellFilterSection;

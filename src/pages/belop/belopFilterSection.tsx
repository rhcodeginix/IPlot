import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import { useEffect, useState } from "react";
import { Slider, styled } from "@mui/material";
import { useRouter } from "next/router";

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
  maxRangeForPlot: number;
  minRangeForPlot: number;
};

const BelopFilterSection: React.FC<{
  setFormData: any;
  formData: FormDataType;
}> = ({ setFormData, formData }) => {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const queryPrice: any = queryParams.get("pris");
    setMaxPrice(queryPrice);
  }, []);

  const [openIndex, setOpenIndex] = useState<string[]>([
    "Eiendomstype",
    "Type husmodell",
    "Antall soverom",
    "Pris på tomt",
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

  const { pathname, query } = router;

  const updatedQuery = { ...query };

  return (
    <>
      <div className="sticky top-[86px] bg-[#F9F5FF] rounded-[12px]">
        <div className="p-6 flex items-center justify-between gap-3 border-b border-[#7D89B04D]">
          <h4 className="text-[#111322] font-medium text-base md:text-lg lg:text-xl desktop:text-2xl">
            Filter
          </h4>
          <h5
            className="text-blue text-sm md:text-base font-medium cursor-pointer"
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                AntallSoverom: [],
                Eiendomstype: [],
                TypeHusmodell: [],
                minRangeForPlot: 0,
                minRangeForHusmodell: 0,
                maxRangeForPlot: Number(maxPrice) * 0.4,
                maxRangeForHusmodell: Number(maxPrice) * 0.6,
              }));
              delete updatedQuery.maxRangeHusmodell;
              delete updatedQuery.maxRangePlot;

              router.replace({ pathname, query: updatedQuery }, undefined, {
                shallow: true,
              });
            }}
          >
            Tilbakestill
          </h5>
        </div>
        <div className="px-6 py-5 h-auto max-h-[600px] overflow-y-auto overFlowYAuto">
          <div
            className="border border-[#EFF1F5] rounded-[48px] p-1 pl-5 flex items-center justify-between gap-3 bg-white mb-5"
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
            <div className="w-full">
              <p
                className={`text-red font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
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
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                  {EiendomstypeArray.map((data: any, index: number) => (
                    <label
                      className="container container_darkgray"
                      htmlFor={data.name}
                      key={index}
                    >
                      <span className="text-[#111322] text-sm md:text-base">
                        {data.name}
                      </span>
                      <input
                        type="checkbox"
                        id={data.name}
                        value={data.name}
                        checked={formData?.Eiendomstype.includes(data.name)}
                        onChange={() => {
                          setFormData((prev: any) => {
                            const updatedSet: any = new Set(prev?.Eiendomstype);
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

                      <span className="checkmark checkmark_darkgray"></span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#7D89B0] w-full border-opacity-30"></div>
            <div className="w-full">
              <p
                className={`text-red font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
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
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                  {TypeHusmodellArray.map((data: any, index: number) => (
                    <label
                      className="container container_darkgray"
                      htmlFor={data.name}
                      key={index}
                    >
                      <span className="text-[#111322] text-sm md:text-base">
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
                              prev?.TypeHusmodell
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

                      <span className="checkmark checkmark_darkgray"></span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#7D89B0] w-full border-opacity-30"></div>
            <div className="w-full">
              <p
                className={`text-[#111322] font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
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
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                  {AntallSoveromArray.map((data: any, index: number) => (
                    <label
                      className="container container_darkgray"
                      htmlFor={data.name}
                      key={index}
                    >
                      <span className="text-[#111322] text-sm md:text-base">
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
                              prev?.AntallSoverom
                            );
                            updatedSet.has(data.name)
                              ? updatedSet.delete(data.name)
                              : updatedSet.add(data.name);

                            localStorage.setItem(
                              "soverom",
                              JSON.stringify(Array.from(updatedSet))
                            );
                            setTimeout(() => {
                              router.push(
                                {
                                  pathname: router.pathname,
                                  query: {
                                    ...router.query,
                                    soverom: new Date().toISOString(),
                                  },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }, 2000);
                            return {
                              ...prev,
                              AntallSoverom: Array.from(updatedSet),
                            };
                          });
                        }}
                        className="mr-2"
                      />

                      <span className="checkmark checkmark_darkgray"></span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#7D89B0] w-full border-opacity-30"></div>
            <div className="w-full">
              <p
                className={`text-[#111322] font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Pris på tomt")}
              >
                Pris på tomt
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={
                    openIndex.includes("Pris på tomt") ? "rotate-180" : ""
                  }
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Pris på tomt") && (
                <div className="mt-8">
                  <div className="mx-1">
                    <CustomSlider
                      value={[
                        formData?.minRangeForPlot,
                        formData?.maxRangeForPlot,
                      ]}
                      onChange={(_event: any, newValue: any) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          minRangeForPlot: newValue[0],
                          maxRangeForPlot: newValue[1],
                        }));
                        setTimeout(() => {
                          router.push(
                            {
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                maxRangePlot: Math.floor(newValue[1]),
                              },
                            },
                            undefined,
                            { shallow: true }
                          );
                        }, 2000);
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      min={formData?.minRangeForPlot}
                      step={100}
                      max={Number(maxPrice)}
                    />
                  </div>
                  <div className="flex items-center justify-between h-[30px] mt-2">
                    <div className="text-grayText text-sm lg:text-base">
                      {formData?.minRangeForPlot.toFixed(2)} NOK
                    </div>
                    <div className="text-grayText text-sm lg:text-base">
                      {maxPrice} NOK
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#7D89B0] w-full border-opacity-30"></div>
            <div className="w-full">
              <p
                className={`text-[#111322] font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
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
                <div className="mt-8">
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
                        setTimeout(() => {
                          router.push(
                            {
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                maxRangeHusmodell: Math.floor(newValue[1]),
                              },
                            },
                            undefined,
                            { shallow: true }
                          );
                        }, 2000);
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      min={formData?.minRangeForHusmodell}
                      max={Number(maxPrice)}
                      step={100}
                    />
                  </div>
                  <div className="flex items-center justify-between h-[30px] mt-2">
                    <div className="text-grayText text-sm lg:text-base">
                      {formData?.minRangeForHusmodell.toFixed(2)} NOK
                    </div>
                    <div className="text-grayText text-sm lg:text-base">
                      {maxPrice} NOK
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BelopFilterSection;

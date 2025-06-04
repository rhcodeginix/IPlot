import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import { useEffect, useState } from "react";
import { Slider, styled } from "@mui/material";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { convertCurrencyFormat } from "@/pages/housemodell-plot/Tilpass";

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
  maxRangeForPlot: number;
  minRangeForPlot: number;
  Område: string[];
  SubOmråde: string[];
};

const PlotFilterSection: React.FC<{
  setFormData: any;
  formData: FormDataType;
}> = ({ setFormData, formData }) => {
  const router = useRouter();
  const maxPrice = 10000000;
  const minPrice = 0;

  const [openIndex, setOpenIndex] = useState<string[]>([
    "Område",
    "Pris på tomt",
  ]);

  const handleToggleAccordion = (type: string) => {
    setOpenIndex((prevOpenIndex) =>
      prevOpenIndex.includes(type)
        ? prevOpenIndex.filter((section) => section !== type)
        : [...prevOpenIndex, type]
    );
  };

  const { pathname, query } = router;

  const updatedQuery = { ...query };
  const [OmrådeArray, setOmrådeArray] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const citiesCollectionRef = collection(db, "cities");
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedCities: any = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        setOmrådeArray(fetchedCities);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setOmrådeArray([]);
      }
    };

    fetchProperty();
  }, [router.asPath]);
  return (
    <>
      <div className="sticky top-[86px] bg-[#F9F5FF] rounded-[12px]">
        <div className="p-4 laptop:p-6 flex items-center justify-between gap-3 border-b border-[#7D89B04D]">
          <h4 className="text-darkBlack font-medium text-base md:text-lg lg:text-xl desktop:text-2xl">
            Filter
          </h4>
          <h5
            className="text-blue text-sm md:text-base font-medium cursor-pointer"
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                minRangeForPlot: 0,
                maxRangeForPlot: Number(maxPrice),
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
        <div className="p-4 laptop:px-6 laptop:py-5 h-auto max-h-[600px] overflow-y-auto overFlowYAuto overflow-x-hidden">
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
                className={`p-1.5 lg:p-[10px] cursor-pointer flex justify-center items-center bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] rounded-[40px] gap-[10px] transition-all duration-300 ease-out h-[32px] w-[32px] lg:h-[40px] lg:w-[40px]`}
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
          <div className="flex flex-col gap-4 lg:gap-6">
            <div
              className="w-full bg-white p-4 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <p
                className={`text-darkBlack font-semibold text-base lg:text-lg flex items-center justify-between cursor-pointer`}
                onClick={() => handleToggleAccordion("Område")}
              >
                Område
                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  className={openIndex.includes("Område") ? "rotate-180" : ""}
                  fetchPriority="auto"
                />
              </p>

              {openIndex.includes("Område") && (
                <>
                  <div className="my-2.5 md:my-4 border-t border-[#DCDFEA]"></div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                    {OmrådeArray.map((data: any, index: number) => {
                      return (
                        <div key={index}>
                          <label
                            className="container container_darkgray_withPurple truncate"
                            htmlFor={data.name}
                          >
                            <span
                              className={`text-darkBlack text-sm laptop:text-base ${formData?.Område.includes(data.name) && "font-semibold"}`}
                            >
                              {data.name}
                            </span>
                            <input
                              type="checkbox"
                              id={data.name}
                              value={data.name}
                              checked={formData?.Område.includes(data.name)}
                              onChange={() => {
                                setFormData((prev: any) => {
                                  const updatedOmradeSet = new Set(
                                    prev?.Område
                                  );
                                  const isSelected = updatedOmradeSet.has(
                                    data.name
                                  );

                                  if (isSelected) {
                                    updatedOmradeSet.delete(data.name);
                                  } else {
                                    updatedOmradeSet.add(data.name);
                                  }

                                  let updatedSubOmrade = [...prev?.SubOmråde];
                                  if (
                                    isSelected &&
                                    data.kommunerList?.length > 0
                                  ) {
                                    const kommunerNames = data.kommunerList.map(
                                      (k: any) => k.name
                                    );
                                    updatedSubOmrade = updatedSubOmrade.filter(
                                      (sub: string) =>
                                        !kommunerNames.includes(sub)
                                    );
                                  }

                                  localStorage.setItem(
                                    "city",
                                    JSON.stringify(Array.from(updatedOmradeSet))
                                  );
                                  localStorage.setItem(
                                    "subcity",
                                    JSON.stringify(updatedSubOmrade)
                                  );

                                  setTimeout(() => {
                                    router.push(
                                      {
                                        pathname: router.pathname,
                                        query: {
                                          ...router.query,
                                          omrade: new Date().toISOString(),
                                          hasReload: "true",
                                        },
                                      },
                                      undefined,
                                      { shallow: true }
                                    );
                                  }, 2000);

                                  return {
                                    ...prev,
                                    Område: Array.from(updatedOmradeSet),
                                    SubOmråde: updatedSubOmrade,
                                  };
                                });
                              }}
                              className="mr-2"
                            />
                            <span className="checkmark checkmark_darkgray_withPurple"></span>
                          </label>
                          {formData?.Område.includes(data.name) && (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-2.5 h-full max-h-52 overflow-y-auto overFlowYAuto">
                              {data?.kommunerList &&
                                data?.kommunerList.length > 0 &&
                                data?.kommunerList?.map(
                                  (kom: any, komIndex: any) => {
                                    return (
                                      <label
                                        className="container container_darkgray_withPurple"
                                        htmlFor={kom.name}
                                        key={komIndex}
                                      >
                                        <span
                                          className={`text-darkBlack text-sm laptop:text-base ${formData?.SubOmråde.includes(kom.name) && "font-semibold"}`}
                                        >
                                          {kom.name}
                                        </span>
                                        <input
                                          type="checkbox"
                                          id={kom.name}
                                          value={kom.name}
                                          checked={formData?.SubOmråde.includes(
                                            kom.name
                                          )}
                                          onChange={() => {
                                            setFormData((prev: any) => {
                                              const updatedSet: any = new Set(
                                                prev?.SubOmråde
                                              );
                                              updatedSet.has(kom.name)
                                                ? updatedSet.delete(kom.name)
                                                : updatedSet.add(kom.name);

                                              localStorage.setItem(
                                                "subcity",
                                                JSON.stringify(
                                                  Array.from(updatedSet)
                                                )
                                              );
                                              setTimeout(() => {
                                                router.push(
                                                  {
                                                    pathname: router.pathname,
                                                    query: {
                                                      ...router.query,
                                                      omrade:
                                                        new Date().toISOString(),
                                                      hasReload: "true",
                                                    },
                                                  },
                                                  undefined,
                                                  { shallow: true }
                                                );
                                              }, 2000);
                                              return {
                                                ...prev,
                                                SubOmråde:
                                                  Array.from(updatedSet),
                                              };
                                            });
                                          }}
                                          className="mr-2"
                                        />
                                        <span className="checkmark checkmark_darkgray_withPurple"></span>
                                      </label>
                                    );
                                  }
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                <>
                  <div className="my-2.5 md:my-4 border-t border-[#DCDFEA]"></div>
                  <div className="mx-2">
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
                                minRangePlot: Math.floor(newValue[0]),
                                maxRangePlot: Math.floor(newValue[1]),
                                hasReload: "true",
                              },
                            },
                            undefined,
                            { shallow: true }
                          );
                        }, 2000);
                      }}
                      valueLabelDisplay="on"
                      aria-labelledby="range-slider"
                      min={minPrice}
                      step={100}
                      max={Number(maxPrice)}
                    />
                  </div>
                  <div className="flex items-center justify-between h-[30px] mt-2">
                    <div className="text-grayText text-sm lg:text-base">
                      {convertCurrencyFormat(minPrice)}
                    </div>
                    <div className="text-grayText text-sm lg:text-base">
                      {convertCurrencyFormat(maxPrice)}
                    </div>
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

export default PlotFilterSection;

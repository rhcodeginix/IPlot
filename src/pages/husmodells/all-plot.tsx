import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_chevron_down_gray from "@/public/images/Ic_chevron_down_gray.svg";
import Ic_sort_of from "@/public/images/Ic_sort_of.svg";
import { Slider, styled } from "@mui/material";
import HouseModelAllProperty from "@/components/Ui/Husmodell/allProperty";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import { useRouter } from "next/router";

const bedroomOptions = [
  "1+ soverom",
  "2+ soverom",
  "3+ soverom",
  "4+ soverom",
  "5+ soverom",
];

const facilityOptions = [
  "Balkong/Terrasse (10)",
  "Garasje/P-plass (10)",
  "Lademulighet (3 334)",
  "Peis/Ildsted (8)",
];
const shoerOfOptions = [
  "Relevans",
  "Areal høy-lav",
  "Areal lav-høy",
  "Pris høy-lav",
  "Pris lav-høy",
];

const CustomSlider = styled(Slider)({
  color: "#7F56D9",
  height: 8,
  padding: 0,
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
  },
  "& .MuiSlider-rail": {
    color: "#D0D5DD",
    opacity: 1,
    height: 8,
  },
  "& .MuiSlider-thumb::after": {
    height: 16,
    width: 16,
  },
  "& .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb:hover": {
    boxShadow: "none",
  },
});

const AllPlot = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [bedroomFilters, setBedroomFilters] = useState<string[]>([]);
  const [facilityFilters, setFacilityFilters] = useState<string[]>([]);
  const [selectAllBedrooms, setSelectAllBedrooms] = useState(false);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedSortBy, setSelectedSortBy] = useState("Relevans");
  const router = useRouter();

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleBedroomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (value === "All") {
      setSelectAllBedrooms(checked);
      setBedroomFilters(checked ? bedroomOptions : []);
    } else {
      setSelectAllBedrooms(false);
      setBedroomFilters((prev) =>
        checked ? [...prev, value] : prev.filter((filter) => filter !== value)
      );
    }
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setFacilityFilters((prev) =>
      checked ? [...prev, value] : prev.filter((filter) => filter !== value)
    );
  };

  const handleSortChange = (option: string) => {
    setSelectedSortBy(option);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );

      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [priceRange, setPriceRange] = useState([1.1, 5.1]);
  const handlePriceRangeChange = (_event: any, newValue: any) => {
    setPriceRange(newValue);
  };

  const [sizeRange, setSizeRange] = useState([0, 220]);
  const handleSizeRangeChange = (_event: any, newValue: any) => {
    setSizeRange(newValue);
  };

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const handleLoginCheckboxChange = () => {
    setIsLoginChecked(!isLoginChecked);
  };

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
    }
  }, []);

  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);
  const handleLoginSubmit = async () => {
    router.push("/login");
  };
  return (
    <>
      <SideSpaceContainer>
        <div className="my-[54px] relative">
          <div className="flex items-center justify-between mb-[54px]">
            <div className="flex items-center gap-3">
              <div
                ref={(ref: any) =>
                  (dropdownRefs.current["bedroom_number"] = ref)
                }
              >
                <div
                  className="border-gray2 border rounded-[8px] py-2 px-3 flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleDropdown("bedroom_number")}
                >
                  <div className="text-black text-base flex items-center gap-1">
                    Antall soverom{" "}
                    {bedroomFilters.length > 0 && (
                      <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {bedroomFilters.length}
                      </span>
                    )}
                  </div>
                  <Image
                    fetchPriority="auto"
                    src={Ic_chevron_down_gray}
                    alt="arrow"
                  />
                </div>
                {openDropdown === "bedroom_number" && (
                  <div className="absolute mt-2 bg-white rounded-[8px] shadow-shadow3 w-[250px]">
                    <div>
                      <label className="py-2 px-3 flex items-center gap-2 text-sm text-secondary container container_gray">
                        <input
                          type="checkbox"
                          id="select_all_bedroom"
                          value="All"
                          checked={selectAllBedrooms}
                          onChange={handleBedroomChange}
                        />
                        All
                        <span className="checkmark checkmark_gray"></span>
                      </label>
                      {bedroomOptions.map((filter) => (
                        <label
                          key={filter}
                          className="py-2 px-3 flex items-center gap-2 text-sm text-secondary container container_gray"
                        >
                          <input
                            type="checkbox"
                            value={filter}
                            checked={bedroomFilters.includes(filter)}
                            onChange={handleBedroomChange}
                          />
                          {filter}
                          <span className="checkmark checkmark_gray"></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={(ref: any) => (dropdownRefs.current["facility"] = ref)}>
                <div
                  className="border-gray2 border rounded-[8px] py-2 px-3 flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleDropdown("facility")}
                >
                  <div className="text-black text-base flex items-center gap-1">
                    Fasiliteter{" "}
                    {facilityFilters.length > 0 && (
                      <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {facilityFilters.length}
                      </span>
                    )}
                  </div>
                  <Image
                    fetchPriority="auto"
                    src={Ic_chevron_down_gray}
                    alt="arrow"
                  />
                </div>
                {openDropdown === "facility" && (
                  <div className="absolute mt-2 bg-white rounded-[8px] shadow-shadow3 w-[250px]">
                    <div>
                      {facilityOptions.map((filter) => (
                        <label
                          key={filter}
                          className="py-2 px-3 flex items-center gap-2 text-sm text-secondary container container_gray"
                        >
                          <input
                            type="checkbox"
                            value={filter}
                            checked={facilityFilters.includes(filter)}
                            onChange={handleFacilityChange}
                          />
                          {filter}
                          <span className="checkmark checkmark_gray"></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={(ref: any) => (dropdownRefs.current["pris"] = ref)}>
                <div
                  className="border-gray2 border rounded-[8px] py-2 px-3 flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleDropdown("pris")}
                >
                  <div className="text-black text-base flex items-center gap-1">
                    Pris
                  </div>
                  <Image
                    fetchPriority="auto"
                    src={Ic_chevron_down_gray}
                    alt="arrow"
                  />
                </div>
                {openDropdown === "pris" && (
                  <div className="absolute mt-2 bg-white rounded-[8px] shadow-shadow3 w-[270px]">
                    <div className="py-2 px-3">
                      <div className="mb-1 text-black font-medium text-sm">
                        Price{" "}
                        <span className="text-secondary">(byggekost)</span>
                      </div>
                      <div className="mx-2">
                        <CustomSlider
                          value={priceRange}
                          onChange={handlePriceRangeChange}
                          valueLabelDisplay="on"
                          aria-labelledby="range-slider"
                          min={1.1}
                          max={5.1}
                          step={0.1}
                        />
                      </div>
                      <div className="flex items-center justify-between h-[30px] mt-2">
                        <div className="border-gray2 border rounded-[8px] py-2 px-[14px] flex items-center justify-center text-secondary text-xs">
                          {priceRange[0]} MNOK
                        </div>
                        <div className="border-gray2 border rounded-[8px] py-2 px-[14px] flex items-center justify-center text-secondary text-xs">
                          {priceRange[1]} MNOK
                        </div>
                      </div>
                    </div>

                    <div className="py-2 px-3">
                      <div className="mb-1 text-black font-medium text-sm">
                        Størrelse{" "}
                        <span className="text-secondary">(bruksareal)</span>
                      </div>
                      <div className="mx-2">
                        <CustomSlider
                          value={sizeRange}
                          onChange={handleSizeRangeChange}
                          valueLabelDisplay="on"
                          aria-labelledby="range-slider"
                          min={0}
                          max={220}
                          step={1}
                        />
                      </div>
                      <div className="flex items-center justify-between h-[30px] mt-2">
                        <div className="border-gray2 border rounded-[8px] py-2 px-[14px] flex items-center justify-center text-secondary text-xs">
                          Fra {sizeRange[0]} m<sup>2</sup>
                        </div>
                        <div className="border-gray2 border rounded-[8px] py-2 px-[14px] flex items-center justify-center text-secondary text-xs">
                          Til {sizeRange[1]} m<sup>2</sup>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              ref={(ref: any) => (dropdownRefs.current["short_of"] = ref)}
              className="relative"
            >
              <div
                className="border-gray2 border rounded-[8px] py-2 px-3 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleDropdown("short_of")}
              >
                <Image fetchPriority="auto" src={Ic_sort_of} alt="sort_of" />
                <div className="text-black text-base flex items-center gap-1">
                  kort av: <span className="font-medium">{selectedSortBy}</span>
                </div>
                <Image
                  fetchPriority="auto"
                  src={Ic_chevron_down_gray}
                  alt="arrow"
                />
              </div>
              {openDropdown === "short_of" && (
                <div className="absolute mt-2 bg-white rounded-[8px] shadow-shadow3 w-full">
                  <div>
                    {shoerOfOptions.map((option) => (
                      <label
                        key={option}
                        className={`py-2 px-3 flex items-center gap-2 text-sm ${selectedSortBy === option ? "text-black font-semibold" : "text-secondary"} container container_gray`}
                      >
                        <input
                          type="radio"
                          name="sortOption"
                          value={option}
                          checked={selectedSortBy === option}
                          onChange={() => handleSortChange(option)}
                        />
                        {option}
                        <span className="checkmark checkmark_gray"></span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <HouseModelAllProperty />
        </div>
        {!loginUser && (
          <div
            className="absolute top-0 h-full w-full left-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
            }}
          ></div>
        )}
      </SideSpaceContainer>

      {isPopupOpen && !loginUser && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-full w-full">
          <div
            className="bg-white p-8 rounded-[8px] w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <h2 className="text-black text-[24px] font-semibold mb-2 text-center">
              Registrer deg
            </h2>
            <p className="text-secondary text-base text-center mb-2">
              Logg inn med{" "}
              <span className="font-semibold text-black">Vipps</span> for å få
              se{" "}
              <span className="font-semibold text-black">
                alle bestemmelser og finne <br />
                boliger som passer på denne eiendommen
              </span>
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <label className="flex items-center gap-[12px] container w-max">
                      <Field
                        type="checkbox"
                        name="terms_condition"
                        checked={isLoginChecked}
                        onChange={() => {
                          setFieldValue(
                            "terms_condition",
                            !values.terms_condition
                          );
                          handleLoginCheckboxChange();
                        }}
                      />
                      <span className="checkmark checkmark_primary"></span>

                      <div className="text-secondary text-base">
                        Jeg aksepterer{" "}
                        <span className="text-primary">Vilkårene</span> og har
                        lest{" "}
                        <span className="text-primary">
                          Personvernerklæringen
                        </span>
                      </div>
                    </label>
                    {errors.terms_condition && touched.terms_condition && (
                      <div className="text-red text-sm">
                        {errors.terms_condition}
                      </div>
                    )}
                    <div className="flex justify-end mt-6">
                      <button
                        className="
                            text-sm md:text-base whitespace-nowrap lg:py-[10px] py-[4px] px-2 md:px-[10px] lg:px-[18px] h-[36px] md:h-[40px] lg:h-[44px] flex items-center gap-[12px] justify-center border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                      >
                        Fortsett med{" "}
                        <Image fetchPriority="auto" src={Ic_vapp} alt="logo" />
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default AllPlot;

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Ic_Search2 from "@/public/images/Ic_Search2.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/router";

const HusmodellTab = () => {
  const [formData, setFormData] = useState({
    Kommue: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ Kommue: boolean }>({
    Kommue: false,
  });

  const [Cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [allCity, setAllCity] = useState([]);
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const citiesCollectionRef = collection(db, "cities");

      try {
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedProperties: any = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));
        setAllCity(fetchedProperties);

        const mergedCities = fetchedProperties.flatMap((property: any) =>
          Array.isArray(property.kommunerList) ? property.kommunerList : []
        );
        const sortedCities = mergedCities.sort((a: any, b: any) =>
          a.name.localeCompare(b.name, "no", { sensitivity: "base" })
        );
        setCities(sortedCities);
        setFilteredCities(sortedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = Cities.filter((city: any) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(Cities);
    }
  }, [searchTerm, Cities]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, Kommue: option }));
    setErrors((prev) => ({ ...prev, Kommue: false }));
    setIsOpen(false);
    setSearchTerm(option);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData?.Kommue) {
      setErrors((prev) => ({ ...prev, Kommue: true }));
      hasError = true;
    }

    if (hasError) return;
    formData.Kommue = formData?.Kommue.replace(/ Kommune/, "");

    const matchedCities: any = allCity.find((city: any) =>
      city.kommunerList.find((kom: any) => formData?.Kommue === kom.name)
    );

    router.push(
      `husmodells?Kommue=${formData?.Kommue}&city=${matchedCities?.name}`
    );
    const currIndex = 0;
    localStorage.setItem("currIndex", currIndex.toString());
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <strong className="font-bold">
          {text.slice(index, index + query.length)}
        </strong>
        {text.slice(index + query.length)}
      </>
    );
  };

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="lg:h-[80px] bg-white border-gray3 border rounded-[8px] lg:rounded-[98px] flex flex-col lg:flex-row lg:items-center relative justify-between"
        style={{
          boxShadow: "0px 32px 82px -12px #10182812",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[80px]">
          <div
            className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex lg:justify-between relative"
            ref={dropdownRef}
          >
            <div className="w-full">
              <div className="text-[#30374F] mb-2 text-xs md:text-sm">
                Se hvilke husmodeller som tilbys i kommunen der du ønsker å
                bygge:
              </div>
              <div className="relative flex items-center gap-2">
                {/* <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={toggleDropdown}
                  placeholder="Søk opp kommune"
                  className="w-full bg-white rounded-md text-sm md:text-base desktop:text-lg focus:outline-none"
                /> */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  onClick={toggleDropdown}
                  onKeyDown={(e) => {
                    if (!isOpen) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedIndex((prev) =>
                        Math.min(prev + 1, filteredCities.length - 1)
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === "Enter" && highlightedIndex >= 0) {
                      e.preventDefault();
                      const selectedCity: any =
                        filteredCities[highlightedIndex];
                      handleSelect(`${selectedCity.name} Kommune`);
                    }
                  }}
                  placeholder="Søk opp kommune"
                  className="w-full bg-white rounded-md text-sm md:text-base desktop:text-lg focus:outline-none"
                />

                <Image
                  src={Ic_chevron_down}
                  alt="arrow"
                  onClick={toggleDropdown}
                />
              </div>

              {isOpen && (
                <ul
                  className="absolute top-20 left-0 w-full bg-white rounded-[8px] overflow-hidden max-h-[238px] overflow-y-auto"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                    zIndex: 99999,
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="px-3 md:px-4 py-2 md:py-[14px]">
                        <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="px-3 md:px-4 py-2 md:py-[14px]">
                        <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="px-3 md:px-4 py-2 md:py-[14px]">
                        <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="px-3 md:px-4 py-2 md:py-[14px]">
                        <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="px-3 md:px-4 py-2 md:py-[14px]">
                        <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                    </>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.map((city: any, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(`${city.name} Kommune`)}
                        className={`text-xs md:text-sm text-darkBlack px-3 md:px-4 py-2 md:py-[14px] cursor-pointer 
                        ${highlightedIndex === index ? "bg-[#E4E7EC]" : ""}
                        ${
                          formData?.Kommue === `${city.name} Kommune`
                            ? "bg-[#F9F5FF] font-semibold"
                            : "bg-white"
                        }`}
                        ref={
                          highlightedIndex === index
                            ? (el) => el?.scrollIntoView({ block: "nearest" })
                            : null
                        }
                      >
                        <span>
                          {highlightMatch(city.name, searchTerm)}{" "}
                          <span className="text-grayText font-normal">
                            Kommune
                          </span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 px-4 py-[14px]">
                      Ingen resultater funnet.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {errors.Kommue && (
            <p className="text-red-500 text-xs mt-1">
              Valgt Kommue er påkrevd.
            </p>
          )}
        </div>
        <div className="border-t border-gray3 w-full lg:hidden"></div>

        <button
          className={`p-3 lg:px-5 lg:py-4 cursor-pointer flex justify-center items-center bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] rounded-[40px] transition-all duration-300 ease-out h-[40px] lg:h-[56px] m-4 gap-2 ${
            !formData?.Kommue ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!formData?.Kommue}
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

export default HusmodellTab;

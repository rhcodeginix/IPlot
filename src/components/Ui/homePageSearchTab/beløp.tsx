import React, { useState, useRef } from "react";
import Image from "next/image";
import Ic_Search2 from "@/public/images/Ic_Search2.svg";
import Ic_close from "@/public/images/Ic_close.svg";
// import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "@/config/firebaseConfig";
// import Loading from "@/components/Loading";
import { useRouter } from "next/router";

const BeløpTab = () => {
  const [formData, setFormData] = useState({
    amount: "",
    // selectedCountry: "Agder (210)",
  });

  // const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{
    // selectedCountry: boolean;
    amount: boolean;
  }>({
    // selectedCountry: false,
    amount: false,
  });

  // const [Cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchProperty = async () => {
  //     setIsLoading(true);
  //     const citiesCollectionRef = collection(db, "cities");

  //     try {
  //       const citiesSnapshot = await getDocs(citiesCollectionRef);
  //       const fetchedProperties: any = citiesSnapshot.docs.map((doc) => ({
  //         propertyId: doc.id,
  //         ...doc.data(),
  //       }));
  //       setCities(fetchedProperties);
  //     } catch (error) {
  //       console.error("Error fetching cities:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProperty();
  // }, [db]);

  // const options = Cities.map((city: any) => ({
  //   name: city?.name,
  //   count: city?.total_entries,
  // }));

  // const dropdownRef = useRef<HTMLDivElement>(null);
  const kartInputRef = useRef<HTMLInputElement | null>(null);

  // const toggleDropdown = () => setIsOpen(!isOpen);

  // const handleSelect = (option: string) => {
  //   setFormData((prev) => ({ ...prev, selectedCountry: option }));
  //   setErrors((prev) => ({ ...prev, selectedCountry: false }));
  //   setIsOpen(false);
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

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

    // if (!formData?.selectedCountry) {
    //   setErrors((prev) => ({ ...prev, selectedCountry: true }));
    //   hasError = true;
    // }
    if (!formData?.amount) {
      setErrors((prev) => ({ ...prev, amount: true }));
      hasError = true;
    }

    if (hasError) return;

    // router.push(
    //   `housemodell-plot?city=${formData?.selectedCountry}&pris=${formData?.amount.replace(/\s+/g, "")}`
    // );
    router.push(
      `housemodell-plot?pris=${formData?.amount.replace(/\s+/g, "")}`
    );
    const currIndex = 0;
    localStorage.setItem("currIndex", currIndex.toString());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="lg:h-[100px] bg-white border-gray3 border rounded-[8px] lg:rounded-[98px] flex flex-col lg:flex-row lg:items-center relative justify-between"
        style={{
          boxShadow: "0px 32px 82px -12px #10182812",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-11/12 lg:h-[100px]">
          {/* <div className="relative min-w-[30%] w-auto h-full" ref={dropdownRef}>
            <div
              className={`bg-[#F4EBFF] py-3 px-2 lg:py-4 lg:px-5 desktop:px-8 h-full flex flex-col justify-center lg:rounded-l-[98px] overflow-hidden ${
                errors.selectedCountry ? "border border-red-500" : ""
              }`}
            >
              <div className="text-secondary2 md-1.5 md:mb-2 text-xs md:text-sm">
                Velg fylke fra <span className="font-bold">TomteBanken</span>
              </div>
              <button
                type="button"
                onClick={toggleDropdown}
                className="text-darkBlack text-sm md:text-base font-medium flex items-center justify-between w-full"
              >
                {formData?.selectedCountry || "Velg et alternativ"}
                <Image src={Ic_chevron_down} alt="arrow" fetchPriority="auto" />
              </button>
            </div>
            {errors.selectedCountry && (
              <p className="text-red-500 text-xs mt-1">
                Valgt land er obligatorisk.
              </p>
            )}
            {isOpen && (
              <ul
                className="absolute left-0 w-full bg-white rounded-[8px] overflow-hidden h-auto max-h-[238px] overflow-y-auto overFlowYAuto"
                style={{
                  boxShadow:
                    "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  zIndex: 99999,
                }}
              >
                {isLoading ? (
                  <div className="relative h-[100px]">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {options.map((option, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSelect(`${option.name} (${option.count})`)
                        }
                        className={`text-sm text-darkBlack px-4 py-[14px] cursor-pointer 
                      ${
                        formData?.selectedCountry ===
                        `${option.name} (${option.count})`
                          ? "bg-[#F9F5FF] font-semibold"
                          : "bg-white"
                      }`}
                      >
                        <span>{option.name}</span>
                        <span className="text-[#4A5578]">
                          {" "}
                          ({option.count})
                        </span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}
          </div> */}

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
          className={`p-3 lg:px-5 lg:py-4 cursor-pointer flex justify-center items-center bg-greenBtn rounded-[40px] transition-all duration-300 ease-out h-[40px] lg:h-[56px] my-4 md:my-[22px] mx-4 md:mx-6 gap-2 ${
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

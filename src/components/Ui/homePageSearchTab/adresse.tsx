import React, { useState, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Link from "next/link";
import { useAddress } from "@/context/addressContext";
import ApiUtils from "@/api";

const AdresseTab = () => {
  const { setStoreAddress } = useAddress();
  const [formData, setFormData] = useState({
    address: "",
  });

  const [errors, setErrors] = useState<{ address: boolean }>({
    address: false,
  });
  const [addressData, setAddressData] = useState<any>(null);

  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, address: value }));
    setErrors((prev) => ({ ...prev, address: false }));

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAddressData(json.adresser);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleClearKartInput = () => {
    setFormData((prev) => ({ ...prev, address: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.address) {
      setErrors((prev) => ({ ...prev, address: true }));
      hasError = true;
    }

    if (hasError) return;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:h-[80px] bg-[#F9F9FB] border-[#EFF1F5] border rounded-[8px] lg:rounded-[100px] flex flex-col sm:flex-row sm:items-center relative justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center lg:justify-between w-full sm:w-11/12 lg:h-[80px]">
          <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex sm:justify-between relative">
            <div className="w-[92%] sm:w-auto">
              <div className="text-[#111322] mb-1 text-sm">
                Vet du hvilken adresse du vil bygge på?
              </div>
              <input
                ref={kartInputRef}
                type="text"
                className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full
                  ${errors.address ? "border border-red-500" : ""}`}
                placeholder="Fyll inn ønsket adresse"
                onChange={handleKartInputChange}
                value={formData.address}
              />
            </div>
            {formData.address && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearKartInput}
                fetchPriority="auto"
              />
            )}
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">Adresse er påkrevd.</p>
          )}
        </div>
        {formData.address && addressData && addressData.length > 0 && (
          <div
            className="absolute top-[100px] desktop:top-[80px] left-0 bg-white rounded-[8px] py-[12px] p-2.5 desktop:px-[16px] w-full h-auto max-h-[400px] overflow-y-auto overFlowYAuto"
            style={{
              zIndex: 999,
              boxShadow:
                "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
            }}
          >
            {addressData &&
              addressData.map((address: any, index: number) => (
                <Link
                  href={`/regulations?kommunenummer=${address.kommunenummer}&gardsnummer=${address.gardsnummer}&bruksnummer=${address.bruksnummer}&kommunenavn=${address.kommunenavn}`}
                  className="p-2 desktop:p-3 flex items-center gap-2.5 desktop:gap-4 hover:bg-lightGreen"
                  key={index}
                  onClick={() => {
                    localStorage.setItem(
                      "IPlot_Address",
                      JSON.stringify(address)
                    );
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    setStoreAddress(address);
                  }}
                >
                  <Image
                    src={Ic_search_location}
                    alt="location"
                    fetchPriority="auto"
                  />
                  <div>
                    <span className="text-secondary text-sm desktop:text-base font-medium">
                      Adresse:
                    </span>{" "}
                    <span className="text-black font-medium text-base desktop:text-lg">
                      {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                        "N/A"}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        )}

        <button
          className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2 ${
            !formData.address ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!formData.address}
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

export default AdresseTab;

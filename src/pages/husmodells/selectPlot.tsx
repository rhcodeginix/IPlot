import SideSpaceContainer from "@/components/common/sideSpace";
import React, { useEffect, useRef, useState } from "react";
import Img_No_plot from "@/public/images/Img_No_plot.png";
import Img_already_plot from "@/public/images/Img_already_plot.png";
import Ic_Search_purple from "@/public/images/Ic_Search_purple.svg";
import Image from "next/image";
import Button from "@/components/common/button";
import ApiUtils from "@/api";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import { useAddress } from "@/context/addressContext";
import { useRouter } from "next/router";

const SelectPlot: React.FC<{
  HouseModelData: any;
  setIsPlot: any;
  handleNext: any;
  setLamdaDataFromApi: any;
  setCadastreDataFromApi: any;
  setAdditionalData: any;
}> = ({
  HouseModelData,
  setIsPlot,
  handleNext,
  setLamdaDataFromApi,
  setCadastreDataFromApi,
  setAdditionalData,
}) => {
  const { setStoreAddress } = useAddress();
  const router = useRouter();

  const [formData, setFormData] = useState({
    address: "",
  });
  const [addressData, setAddressData] = useState<any>(null);

  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, address: value }));

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

  useEffect(() => {
    if (!router.isReady) return;
    const { pathname, query } = router;
    const updatedQuery = { ...query };

    if (updatedQuery.kommunenummer) delete updatedQuery.kommunenummer;
    if (updatedQuery.bruksnummer) delete updatedQuery.bruksnummer;
    if (updatedQuery.gardsnummer) delete updatedQuery.gardsnummer;
    if (updatedQuery.kommunenavn) delete updatedQuery.kommunenavn;
    if (updatedQuery.empty) delete updatedQuery.empty;
    if (updatedQuery.plotId) delete updatedQuery.plotId;
    if (updatedQuery.omrade) delete updatedQuery.omrade;
    if (updatedQuery.hasReload) delete updatedQuery.hasReload;
    if (updatedQuery.noPlot) delete updatedQuery.noPlot;
    router.replace({ pathname, query: updatedQuery }, undefined, {
      shallow: true,
    });
  }, [router.isReady]);

  return (
    <div className="relative py-8">
      <SideSpaceContainer>
        <h3 className="text-darkBlack text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] font-medium mb-6 md:mb-[38px]">
          Vet du hvor du vil bygge {HouseModelData?.Husdetaljer?.husmodell_name}
          ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 justify-center gap-4">
          <div className="border border-[#DCDFEA] p-5 rounded-lg shadow-shadow1">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-6">
              <Image src={Img_already_plot} alt="plot" />
              <div>
                <h4 className="text-[#30374F] font-medium text-sm mb-2">
                  Ja, jeg vil søke opp tomten
                </h4>
                <h3 className="text-secondary2 text-xs">
                  Søk opp adressen om du vet hvor du vil bygge{" "}
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>
                  .
                </h3>
              </div>
            </div>
            <div
              className="relative flex items-center gap-2 py-2.5 px-4 rounded-[48px]"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <Image alt="search" src={Ic_Search_purple} />
              <input
                type="text"
                placeholder="Søk opp adressen"
                className="focus:outline-none w-full"
                ref={kartInputRef}
                onChange={handleKartInputChange}
                value={formData?.address}
              />
              {formData?.address && addressData && addressData.length > 0 && (
                <div
                  className="absolute top-[45px] left-0 bg-white rounded-[8px] w-full h-auto max-h-[300px] overflow-y-auto overFlowYAuto"
                  style={{
                    zIndex: 999,
                    boxShadow:
                      "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
                  }}
                >
                  {addressData &&
                    addressData?.map((address: any, index: number) => (
                      <div
                        className="p-2 desktop:p-3 flex items-center gap-2 hover:bg-lightGreen cursor-pointer"
                        key={index}
                        onClick={() => {
                          setLamdaDataFromApi(null);
                          setCadastreDataFromApi(null);
                          setAdditionalData(null);
                          localStorage.setItem(
                            "IPlot_Address",
                            JSON.stringify(address)
                          );
                          setStoreAddress(address);
                          // handleNext();
                          router.push(
                            `${router.asPath}&kommunenummer=${address.kommunenummer}&gardsnummer=${address.gardsnummer}&bruksnummer=${address.bruksnummer}&kommunenavn=${address.kommunenavn}`
                          );
                        }}
                      >
                        <Image
                          src={Ic_search_location}
                          alt="location"
                          fetchPriority="auto"
                          className="w-6 h-6 md:w-auto md:h-auto"
                        />
                        <div>
                          <span className="text-black font-medium text-sm md:text-base">
                            {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="border border-[#DCDFEA] p-5 rounded-lg shadow-shadow1">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-6">
              <Image src={Img_No_plot} alt="plot" />
              <div>
                <h4 className="text-[#30374F] font-medium text-sm mb-2">
                  Nei, men jeg vil finne en tomt
                </h4>
                <h3 className="text-secondary2 text-xs">
                  Velg å gå videre uten tomt om du vil se på tomt på et senere
                  tidspunkt.
                </h3>
              </div>
            </div>
            <Button
              text="Gå videre uten tomt"
              className="border border-primary bg-primary hover:bg-[#7A5AF8] hover:border-[#7A5AF8] focus:bg-[#5925DC] focus:border-[#5925DC] text-white sm:text-base rounded-[40px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
                setLamdaDataFromApi(null);
                setCadastreDataFromApi(null);
                setAdditionalData(null);
                router.push(`${router.asPath}&noPlot=true`);
              }}
            />
          </div>
          <div className="border border-[#DCDFEA] p-5 rounded-lg shadow-shadow1">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-6">
              <Image src={Img_No_plot} alt="plot" />
              <div>
                <h4 className="text-[#30374F] font-medium text-sm mb-2">
                  Nei, men jeg vil finne en tomt
                </h4>
                <h3 className="text-secondary2 text-xs">
                  Jeg vil utforske 1.923 mulige hyttetomter for å bygge{" "}
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>
                  .
                </h3>
              </div>
            </div>
            <Button
              text="Se tomter"
              className="border border-primary bg-primary hover:bg-[#7A5AF8] hover:border-[#7A5AF8] focus:bg-[#5925DC] focus:border-[#5925DC] text-white sm:text-base rounded-[40px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                setIsPlot(true);
                setLamdaDataFromApi(null);
                setCadastreDataFromApi(null);
                setAdditionalData(null);
              }}
            />
          </div>
        </div>
      </SideSpaceContainer>
    </div>
  );
};

export default SelectPlot;

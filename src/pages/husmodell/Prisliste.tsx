import React from "react";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Image from "next/image";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { useCustomizeHouse } from "@/context/selectHouseContext";

const Prisliste: React.FC<{ husmodellData: any }> = ({ husmodellData }) => {
  const Byggekostnader = husmodellData?.Byggekostnader;

  const Tomtekost = husmodellData?.Tomtekost;

  const totalPrisOfTomtekost = Tomtekost
    ? Tomtekost.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumber = totalPrisOfTomtekost;
  const { customizeHouse: custHouse } = useCustomizeHouse();

  const totalCustPris = custHouse
    ? custHouse?.reduce(
        (sum: any, item: any) =>
          sum + Number(item?.product?.pris.replace(/\s/g, "")),
        0
      )
    : 0;

  const totalPrisOfByggekostnader = Byggekostnader
    ? Byggekostnader.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return (
          acc + (numericValue ? parseFloat(numericValue) : 0) + totalCustPris
        );
      }, 0)
    : 0;
  const formattedNumberOfByggekostnader = totalPrisOfByggekostnader;
  return (
    <>
      <div
        style={{
          boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
        }}
        className="flex flex-col md:flex-row"
      >
        <div className="w-full md:1/2">
          <div className="text-center py-2 md:py-4 text-black font-medium text-sm md:text-base desktop:text-lg bg-lightBlue">
            BYGGEKOSTNADER
          </div>

          <div className="flex flex-col gap-2 md:gap-4 p-3 lg:p-5">
            {Byggekostnader &&
              Byggekostnader?.length > 0 &&
              Byggekostnader
                // sort((a: any, b: any) => {
                //   const aPris =
                //     parseInt(String(a?.pris)?.replace(/\D/g, "")) || 0;
                //   const bPris =
                //     parseInt(String(b?.pris)?.replace(/\D/g, "")) || 0;

                //   const aHasPris = !!a?.pris;
                //   const bHasPris = !!b?.pris;

                //   if (aHasPris && !bHasPris) return -1;
                //   if (!aHasPris && bHasPris) return 1;

                //   return bPris - aPris;
                // }).
                ?.map((item: any, index: number) => {
                  return (
                    <div
                      className="flex items-center gap-2 justify-between"
                      key={index}
                    >
                      <div className="flex items-center gap-1 md:gap-2">
                        <Image
                          src={Ic_info_circle}
                          alt="icon"
                          className="w-3.5 h-3.5 md:w-auto md:h-auto"
                        />
                        <p className="text-secondary2 text-xs md:text-sm">
                          {item?.Headline}
                        </p>
                      </div>
                      <h4 className="text-black font-medium text-sm md:text-base whitespace-nowrap">
                        {item?.pris ? `kr ${item.pris}` : "inkl. i tilbud"}
                      </h4>
                    </div>
                  );
                })}
            <div className="flex items-center gap-2 justify-between bg-gray3 py-2 px-3 rounded-[4px]">
              <div className="flex items-center gap-1 md:gap-2">
                <Image
                  src={Ic_info_circle}
                  alt="icon"
                  className="w-3.5 h-3.5 md:w-auto md:h-auto"
                />
                <p className="text-secondary2 text-xs md:text-sm">
                  Dine tilvalg
                </p>
              </div>
              <h4 className="text-black font-medium text-sm md:text-base whitespace-nowrap border flex items-center border-darkGray rounded-lg h-[40px] py-[10px] px-3 bg-white">
                {totalCustPris ? formatCurrency(totalCustPris) : "kr 0"}
              </h4>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1 md:gap-2">
                <Image
                  fetchPriority="auto"
                  src={Ic_info_circle}
                  alt="icon"
                  className="w-3.5 h-3.5 md:w-auto md:h-auto"
                />
                <p className="text-secondary text-sm md:text-base font-bold">
                  Sum byggkostnader
                </p>
              </div>
              <h4 className="text-black font-bold text-sm md:text-base">
                {formattedNumberOfByggekostnader
                  ? formatCurrency(formattedNumberOfByggekostnader)
                  : "kr 0"}
              </h4>
            </div>
          </div>
        </div>
        <div className="w-full md:1/2">
          <div className="text-center py-2 md:py-4 text-black font-medium text-sm md:text-base desktop:text-lg bg-lightBlue">
            TOMTEKOSTNADER
          </div>
          <div className="flex flex-col gap-2 md:gap-4 p-3 lg:p-5">
            {Tomtekost &&
              Tomtekost?.length > 0 &&
              Tomtekost
                // sort((a: any, b: any) => {
                //   const aPris =
                //     parseInt(String(a?.pris)?.replace(/\D/g, "")) || 0;
                //   const bPris =
                //     parseInt(String(b?.pris)?.replace(/\D/g, "")) || 0;

                //   const aHasPris = !!a?.pris;
                //   const bHasPris = !!b?.pris;

                //   if (aHasPris && !bHasPris) return -1;
                //   if (!aHasPris && bHasPris) return 1;

                //   return bPris - aPris;
                // })
                // .
                ?.map((item: any, index: number) => {
                  return (
                    <div
                      className="flex items-center gap-2 justify-between"
                      key={index}
                    >
                      <div className="flex items-center gap-1 md:gap-2">
                        <Image
                          src={Ic_info_circle}
                          alt="icon"
                          className="w-3.5 h-3.5 md:w-auto md:h-auto"
                        />
                        <p className="text-secondary2 text-xs md:text-sm">
                          {item?.Headline}
                        </p>
                      </div>
                      <h4 className="text-black font-medium text-sm md:text-base whitespace-nowrap">
                        {item?.pris ? `kr ${item.pris}` : "inkl. i tilbud"}
                      </h4>
                    </div>
                  );
                })}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1 md:gap-2">
                <Image
                  fetchPriority="auto"
                  src={Ic_info_circle}
                  alt="icon"
                  className="w-3.5 h-3.5 md:w-auto md:h-auto"
                />
                <p className="text-secondary text-sm md:text-base font-bold">
                  Sum tomtekostnader
                </p>
              </div>
              <h4 className="text-black font-bold text-sm md:text-base">
                {formattedNumber ? formatCurrency(formattedNumber) : "kr 0"}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prisliste;

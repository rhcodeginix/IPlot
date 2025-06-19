import Image from "next/image";
import Ic_wishlist_heart from "@/public/images/Ic_wishlist_heart.svg";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import NorkartMap from "@/components/map";

export function formatPrice(price: any) {
  if (typeof price === "string" && /[\s\u00A0]/.test(price)) {
    return "Kr " + price;
  }

  const num = typeof price === "number" ? price : parseInt(price, 10);
  const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return "kr " + formatted;
}

const BelopProperty: React.FC<{
  isLoading: any;
  HouseModelProperty: any;
}> = ({ HouseModelProperty, isLoading }) => {
  const router = useRouter();

  const [supplierData, setSupplierData] = useState<{ [key: string]: any }>({});

  const getData = async (supplierId: string) => {
    try {
      const supplierDocRef = doc(db, "suppliers", supplierId);
      const docSnap: any = await getDoc(supplierDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No document found for ID:", supplierId);
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap: { [key: string]: any } = {};

      await Promise.all(
        HouseModelProperty.map(async (property: any) => {
          const supplierId = property?.house?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            supplierMap[supplierId] = await getData(supplierId);
          }
        })
      );

      setSupplierData(supplierMap);
    };

    fetchSupplierDetails();
  }, [HouseModelProperty]);

  return (
    <>
      <div>
        {isLoading ? (
          <div className="relative flex flex-col gap-4 lg:gap-6 desktop:gap-8">
            {Array.from({ length: 8 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="border border-gray3 rounded-[8px] p-3 laptop:p-5 shadow-shadow4 hover:shadow-shadow1"
                >
                  <div className="mb-2 md:mb-3 desktop:mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="w-[250px] h-[20px] rounded-lg custom-shimmer mb-2"></div>
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-2"></div>
                    </div>
                    <div className="w-6 h-6 rounded-lg custom-shimmer"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 laptop:gap-4">
                    <div className="flex gap-2 w-full sm:w-1/2">
                      <div className="w-[63%] h-[160px] relative">
                        <div className="w-full h-full rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="w-[37%] rounded-[8px] overflow-hidden h-[160px]">
                        <div className="w-full h-full rounded-lg custom-shimmer"></div>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <div className="flex gap-2 md:gap-3 lg:gap-1.5 laptop:gap-3 items-center">
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                      <div className="gap-4 md:gap-5 lg:gap-6 flex items-center mb-2 md:mb-3 desktop:mb-4">
                        <div className="w-1/2">
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        </div>
                        <div className="w-1/2">
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        </div>
                      </div>
                      <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                        <div>
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                          <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                        </div>
                        <div className="w-[120px] h-[40px] rounded-lg custom-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:gap-6 desktop:gap-8">
            {HouseModelProperty && HouseModelProperty.length > 0 ? (
              HouseModelProperty.map((property: any, index: any) => {
                const supplierId = property?.house?.Husdetaljer?.Leverandører;
                const data = supplierData[supplierId] || null;
                return (
                  <div
                    key={index}
                    className="border border-gray3 rounded-[8px] p-3 laptop:p-5 cursor-pointer shadow-shadow4 hover:shadow-shadow1"
                    // style={{
                    //   boxShadow:
                    //     "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                    // }}
                    onClick={() => {
                      router.push(
                        `${router.asPath}&propertyId=${property?.plot?.id}&husmodellId=${property?.house?.id}&emptyPlot=true`
                      );
                      const currIndex = 0;
                      localStorage.setItem("currIndex", currIndex.toString());
                    }}
                  >
                    <div className="mb-2 md:mb-3 desktop:mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-darkBlack text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 one_line_elipse">
                          <span className="font-bold">
                            {property?.house?.Husdetaljer?.husmodell_name}
                          </span>{" "}
                          bygget i{" "}
                          <span className="font-bold">
                            {
                              property?.plot?.CadastreDataFromApi
                                ?.presentationAddressApi?.response?.item
                                ?.formatted?.line1
                            }
                          </span>{" "}
                          <span className="text-[#10182899]">
                            (
                            {
                              property?.plot?.CadastreDataFromApi
                                ?.presentationAddressApi?.response?.item?.street
                                ?.municipality?.municipalityName
                            }
                            )
                          </span>
                        </h4>
                        <p className="text-grayText text-xs md:text-sm">
                          {
                            property?.plot?.CadastreDataFromApi
                              ?.presentationAddressApi?.response?.item
                              ?.formatted?.line2
                          }
                        </p>
                      </div>
                      <Image
                        src={Ic_wishlist_heart}
                        alt="heart"
                        fetchPriority="auto"
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 laptop:gap-4">
                      <div className="flex gap-2 w-full sm:w-1/2">
                        <div className="w-[63%] h-[160px] relative">
                          <img
                            src={property?.house?.Husdetaljer?.photo}
                            alt="husmodell"
                            className="w-full h-full rounded-[8px] object-cover"
                          />
                          <img
                            src={data?.photo}
                            alt="product-logo"
                            className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                          />
                        </div>
                        <div className="w-[37%] rounded-[8px] overflow-hidden h-[160px]">
                          {property?.plot?.lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates && (
                            <NorkartMap
                              coordinates={
                                property?.plot?.lamdaDataFromApi?.coordinates
                                  ?.convertedCoordinates
                              }
                              MAX_ZOOM={20}
                            />
                          )}
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <div className="flex gap-2 md:gap-3 lg:gap-1.5 laptop:gap-3 items-center">
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {
                              property?.plot?.additionalData?.answer
                                ?.bya_calculations?.results
                                ?.available_building_area
                            }{" "}
                            <span className="text-[#4A5578] font-normal">
                              m²
                            </span>
                          </div>
                          <div className="border-l border-[#EAECF0] h-[12px]"></div>
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {property?.house?.Husdetaljer?.Soverom}{" "}
                            <span className="text-[#4A5578] font-normal">
                              soverom
                            </span>
                          </div>
                          <div className="border-l border-[#EAECF0] h-[12px]"></div>
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {property?.house?.Husdetaljer?.Bad}{" "}
                            <span className="text-[#4A5578] font-normal">
                              bad
                            </span>
                          </div>
                          <div className="text-darkBlack text-xs md:text-sm font-semibold ml-auto">
                            {
                              property?.plot?.additionalData?.answer
                                ?.bya_calculations?.input?.plot_size
                            }{" "}
                            <span className="text-[#4A5578] font-normal">
                              m²
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                        <div className="gap-4 md:gap-5 lg:gap-6 flex items-center mb-2 md:mb-3 desktop:mb-4">
                          <div className="w-1/2">
                            <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                              Pris for{" "}
                              <span className="font-semibold">
                                {property?.house?.Husdetaljer?.husmodell_name}
                              </span>
                            </p>
                            <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                              {property?.house?.Husdetaljer?.pris
                                ? formatPrice(
                                    Math.round(
                                      property?.house?.Husdetaljer?.pris.replace(
                                        /\s/g,
                                        ""
                                      )
                                    )
                                  )
                                : "kr 0"}
                            </h6>
                          </div>
                          <div className="w-1/2">
                            <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                              Pris for{" "}
                              <span className="font-semibold">tomten</span>
                            </p>
                            <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                              {property?.plot?.pris
                                ? formatPrice(Math.round(property?.plot?.pris))
                                : "kr 0"}
                            </h6>
                          </div>
                        </div>
                        <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                          <div>
                            <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                              Totalpris med tomt
                            </p>
                            <h6 className="text-base font-semibold desktop:text-xl">
                              {formatPrice(
                                (property?.house?.Husdetaljer?.pris
                                  ? Math.round(
                                      property?.house?.Husdetaljer?.pris.replace(
                                        /\s/g,
                                        ""
                                      )
                                    )
                                  : 0) +
                                  (property?.plot?.pris
                                    ? Math.round(property?.plot?.pris)
                                    : 0)
                              )}
                            </h6>
                          </div>
                          <Button
                            text="Utforsk"
                            className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white text-sm md:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                            onClick={() => {
                              router.push(
                                `${router.asPath}&propertyId=${property?.plot?.id}&husmodellId=${property?.house?.id}&emptyPlot=true`
                              );
                              const currIndex = 0;
                              localStorage.setItem(
                                "currIndex",
                                currIndex.toString()
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold text-gray-600">
                No Property found!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BelopProperty;

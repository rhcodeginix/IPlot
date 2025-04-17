import Loading from "@/components/Loading";
import Image from "next/image";
import Ic_wishlist_heart from "@/public/images/Ic_wishlist_heart.svg";
import Button from "@/components/common/button";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { formatPrice } from "../belop/belopProperty";
import { useRouter } from "next/router";

const HusmodellProperty: React.FC<{
  isLoading: any;
  HouseModelProperty: any;
}> = ({ HouseModelProperty, isLoading }) => {
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap: { [key: string]: any } = {};

      await Promise.all(
        HouseModelProperty.map(async (property: any) => {
          const supplierId = property?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            supplierMap[supplierId] = await getData(supplierId);
          }
        })
      );

      setSupplierData(supplierMap);
    };

    fetchSupplierDetails();
  }, [HouseModelProperty]);

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
  return (
    <>
      <div>
        {isLoading ? (
          <div className="relative">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:gap-6 desktop:gap-8">
            {HouseModelProperty && HouseModelProperty.length > 0 ? (
              HouseModelProperty.map((property: any, index: any) => {
                const supplierId = property?.Husdetaljer?.Leverandører;
                const data = supplierData[supplierId] || null;

                return (
                  <div
                    key={index}
                    className="border border-gray3 rounded-[8px] p-3 md:p-5"
                    style={{
                      boxShadow:
                        "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                    }}
                  >
                    <div className="mb-2 md:mb-3 desktop:mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-darkBlack text-sm md:text-base lg:text-lg lg:leading-[30px] one_line_elipse">
                          <span className="font-bold text-lg md:text-xl desktop:text-2xl desktop:leading-[30px]">
                            {property?.Husdetaljer?.husmodell_name}
                          </span>{" "}
                          fra{" "}
                          <span className="font-bold">
                            {data?.company_name}
                          </span>
                        </h4>
                      </div>
                      <Image
                        src={Ic_wishlist_heart}
                        alt="heart"
                        fetchPriority="auto"
                        className="cursor-pointer h-6 w-6 md:w-auto md:h-auto"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
                      <div className="flex gap-2 w-full sm:w-[40%] relative">
                        <img
                          key={index}
                          src={property?.Husdetaljer?.photo}
                          alt="image"
                          className="w-full h-[180px] rounded-[8px] object-cover"
                        />
                        <div className="absolute bottom-[12px] right-[12px] rounded-[8px] w-[74px] h-[74px] bg-white">
                          <img
                            src={property?.Husdetaljer?.PlantegningerFasader[0]}
                            alt="product-map"
                            className="p-1.5 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-[60%]">
                        <h5 className="text-darkBlack font-medium text-sm md:text-lg mb-1 one_line_elipse">
                          {property?.Husdetaljer?.Hustittel}
                        </h5>
                        <h5 className="text-[#4A5578] text-xs md:text-sm mb-2 md:mb-4 two_line_elipse">
                          {property?.Husdetaljer?.OmHusmodellen}
                        </h5>
                        <div className="flex gap-3 items-center">
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {property?.Husdetaljer?.BRATotal}{" "}
                            <span className="text-[#4A5578] font-normal">
                              m²
                            </span>
                          </div>
                          <div className="border-l border-[#EAECF0] h-[12px]"></div>
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {property?.Husdetaljer?.Soverom}{" "}
                            <span className="text-[#4A5578] font-normal">
                              soverom
                            </span>
                          </div>
                          <div className="border-l border-[#EAECF0] h-[12px]"></div>
                          <div className="text-darkBlack text-xs md:text-sm font-semibold">
                            {property?.Husdetaljer?.Bad}{" "}
                            <span className="text-[#4A5578] font-normal">
                              bad
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                        <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                          <div>
                            <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                              Pris for{" "}
                              <span className="font-semibold">
                                {property?.Husdetaljer?.husmodell_name}
                              </span>{" "}
                              fra
                            </p>
                            <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                              {property?.Husdetaljer?.pris
                                ? formatPrice(
                                    Math.round(
                                      property?.Husdetaljer?.pris.replace(
                                        /\s/g,
                                        ""
                                      )
                                    )
                                  )
                                : "0 NOK"}
                            </h6>
                          </div>
                          <Button
                            text="Utforsk"
                            className="border border-greenBtn bg-greenBtn text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                            onClick={() => {
                              router.push(
                                `${router.asPath}&husodellId=${property?.id}`
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

export default HusmodellProperty;

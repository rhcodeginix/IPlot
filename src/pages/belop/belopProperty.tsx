import Loading from "@/components/Loading";
import Image from "next/image";
import Img_plot from "@/public/images/Img_plot.png";
import Ic_wishlist_heart from "@/public/images/Ic_wishlist_heart.svg";
import GoogleMapComponent from "@/components/Ui/map";
import Img_plot_image1 from "@/public/images/Img_plot_image1.png";
import Button from "@/components/common/button";

const BelopProperty: React.FC<{
  isLoading: any;
  HouseModelProperty: any;
}> = ({ HouseModelProperty, isLoading }) => {
  function formatPrice(price: any) {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formatted + " NOK";
  }
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
              HouseModelProperty.map((property: any, index: any) => (
                <div
                  key={index}
                  className="border border-[#EFF1F5] rounded-[8px] p-5"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                >
                  <div className="mb-2 md:mb-3 desktop:mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2">
                        <span className="font-bold">Almgård</span> bygget i{" "}
                        <span className="font-bold">
                          {
                            property?.CadastreDataFromApi
                              ?.presentationAddressApi?.response?.item
                              ?.formatted?.line1
                          }
                        </span>{" "}
                        <span className="text-[#10182899]">
                          (
                          {
                            property?.CadastreDataFromApi
                              ?.presentationAddressApi?.response?.item?.street
                              ?.municipality?.municipalityName
                          }
                          )
                        </span>
                      </h4>
                      <p className="text-grayText text-xs md:text-sm">
                        {
                          property?.CadastreDataFromApi?.presentationAddressApi
                            ?.response?.item?.formatted?.line2
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
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 w-1/2">
                      <div className="w-[63%] h-[160px]">
                        <Image
                          key={index}
                          src={index % 2 === 0 ? Img_plot : Img_plot_image1}
                          alt="image"
                          className="w-full h-full rounded-[8px] object-cover"
                          fetchPriority="auto"
                        />
                      </div>
                      <div className="w-[37%] rounded-[8px] overflow-hidden">
                        <GoogleMapComponent
                          coordinates={
                            property?.lamdaDataFromApi?.coordinates
                              ?.convertedCoordinates
                          }
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-3 items-center">
                        <div className="text-[#111322] text-xs md:text-sm font-semibold">
                          {
                            property?.additionalData?.answer?.bya_calculations
                              ?.results?.available_building_area
                          }{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
                        </div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="text-[#111322] text-xs md:text-sm font-semibold">
                          5{" "}
                          <span className="text-[#4A5578] font-normal">
                            soverom
                          </span>
                        </div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="text-[#111322] text-xs md:text-sm font-semibold">
                          3{" "}
                          <span className="text-[#4A5578] font-normal">
                            bad
                          </span>
                        </div>
                        <div className="border-l-2 border-[#7F56D9] h-[12px] mx-4"></div>
                        <div className="text-[#111322] text-xs md:text-sm font-semibold">
                          {
                            property?.additionalData?.answer?.bya_calculations
                              ?.input?.plot_size
                          }{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
                        </div>
                      </div>
                      <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                      <div className="gap-4 md:gap-5 lg:gap-6 flex items-center mb-2 md:mb-3 desktop:mb-4">
                        <div className="w-1/2">
                          <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                            Pris for{" "}
                            <span className="font-semibold">Almgård</span>
                          </p>
                          <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                            {/* 2.800.00 NOK */}
                            {property.pris
                              ? formatPrice(Math.round(property.pris * 0.4))
                              : "0 NOK"}
                          </h6>
                        </div>
                        <div className="w-1/2">
                          <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                            Pris for{" "}
                            <span className="font-semibold">tomten</span>
                          </p>
                          <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                            {/* {property.pris ? `${property.pris} NOK` : 0} */}

                            {property.pris
                              ? // ? `${Math.round(property.pris * 0.6)} NOK`
                                formatPrice(Math.round(property.pris * 0.6))
                              : "0 NOK"}
                          </h6>
                        </div>
                      </div>
                      <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                        <div>
                          <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                            Totalpris med tomt
                          </p>
                          <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                            {/* {property.pris
                              ? `${(280000 + parseInt(property.pris)).toLocaleString()} NOK`
                              : "2.800.00 NOK"} */}
                            {property.pris ? formatPrice(property.pris) : 0}
                          </h6>
                        </div>
                        <Button
                          text="Utforsk"
                          className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
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

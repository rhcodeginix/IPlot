import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Loader from "@/components/Loader";
import Link from "next/link";
// import HouseDetailsection from "@/components/Ui/houseDetail/houseDetailSection";
import Ic_close from "@/public/images/Ic_close.svg";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import { useCustomizeHouse } from "@/context/selectHouseContext";

const Tilpass: React.FC<any> = ({
  handleNext,
  handlePrevious,
  loading,
  HouseModelData,
  lamdaDataFromApi,
  supplierData,
  pris,
}) => {
  const Huskonfigurator =
    HouseModelData?.Huskonfigurator?.hovedkategorinavn || [];
  const { updateCustomizeHouse } = useCustomizeHouse();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".swiper-pagination")?.classList.add("active");
    }, 100);
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerProduct, setSelectedDrawerProduct] = useState<any>(null);

  const openDrawer = (product: any) => {
    setSelectedDrawerProduct(product);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerProduct(null);
  };
  const textareaRef = useRef<any>(null);
  useEffect(() => {
    setSelectedCategory(0);
  }, [selectedTab]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [selectedDrawerProduct]);
  const [selectedProductsArray, setSelectedProductsArray] = useState<any[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<any>({});

  useEffect(() => {
    if (Huskonfigurator?.length > 0) {
      const defaultSelectedProducts: any = {};
      const defaultSelectedProductsArray: any[] = [];

      const selectedTab = Huskonfigurator.find(
        (tabItem: any) => tabItem.isSelected
      );

      if (selectedTab && selectedTab.Kategorinavn?.length > 0) {
        selectedTab.Kategorinavn.forEach(
          (categoryItem: any, categoryIndex: number) => {
            if (categoryItem.produkter?.length > 0) {
              const product = categoryItem.produkter[0];
              const key = `0-${categoryIndex}`;

              defaultSelectedProducts[key] = {
                category: 0,
                subCategory: categoryIndex,
                product,
                index: 0,
              };

              defaultSelectedProductsArray.push({
                category: 0,
                subCategory: categoryIndex,
                product,
                index: 1,
              });
            }
          }
        );
      }

      setSelectedProducts(defaultSelectedProducts);
      setSelectedProductsArray(defaultSelectedProductsArray);
    }
  }, [Huskonfigurator]);

  useEffect(() => {
    const stored = localStorage.getItem("customizeHouse");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const mappedProducts: any = {};
          parsed.forEach((item) => {
            const key = `${item.category}-${item.subCategory}`;
            mappedProducts[key] = item;
          });

          setSelectedProductsArray(parsed);
          setSelectedProducts(mappedProducts);
        }
      } catch (error) {
        console.error(
          "Failed to parse customizeHouse from localStorage:",
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    if (selectedProductsArray) {
      localStorage.setItem(
        "customizeHouse",
        JSON.stringify(selectedProductsArray)
      );
      updateCustomizeHouse(selectedProductsArray);
    }
  }, [selectedProductsArray]);

  const handleSelectProduct = (
    product: any,
    categoryIndex: number,
    index: number
  ) => {
    const key = `${selectedTab}-${categoryIndex}`;

    setSelectedProducts((prev: any) => ({
      ...prev,
      [key]: {
        category: selectedTab,
        subCategory: categoryIndex,
        product,
        index,
      },
    }));

    setSelectedProductsArray((prevArray) => {
      const filteredArray = prevArray.filter(
        (item) =>
          !(item.category === selectedTab && item.subCategory === categoryIndex)
      );

      return [
        ...filteredArray,
        { category: selectedTab, subCategory: categoryIndex, product, index },
      ];
    });
  };
  if (loading) {
    <Loader />;
  }
  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-lightPurple2 py-4">
            <SideSpaceContainer>
              <div className="flex items-center gap-1 mb-6">
                <Link href={"/"} className="text-[#7839EE] text-sm font-medium">
                  Hjem
                </Link>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-[#7839EE] text-sm font-medium cursor-pointer"
                  onClick={() => {
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Husmodell
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <span className="text-secondary2 text-sm">Tilpass</span>
              </div>
              <PropertyHouseDetails
                HouseModelData={HouseModelData}
                lamdaDataFromApi={lamdaDataFromApi}
                supplierData={supplierData}
                pris={pris}
              />
            </SideSpaceContainer>
          </div>
          {/* <HouseDetailsection
            HouseModelData={HouseModelData}
            loading={loading}
          /> */}
          <div className="py-8">
            <SideSpaceContainer>
              <h3 className="text-darkBlack text-2xl font-semibold mb-[22px]">
                La oss begynne å tilpasse drømmehuset ditt
              </h3>
              {Huskonfigurator?.length > 0 ? (
                <div className="flex gap-6 relative">
                  <div className="w-[27%] flex flex-col gap-3 min-h-max max-h-[calc(100vh-200px)] sticky top-[88px] overflow-y-auto overFlowYAuto">
                    {Huskonfigurator.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer border-2 font-medium rounded-lg flex items-start gap-2 ${
                          selectedTab === index
                            ? "border-[#6927DA]"
                            : "border-transparent"
                        }`}
                        onClick={() => setSelectedTab(index)}
                        style={{
                          boxShadow:
                            "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                        }}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1 ${
                            selectedTab === index
                              ? "bg-[#00359E] text-white"
                              : "bg-[#ECE9FE] text-darkBlack"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <span className="text-black text-sm font-medium mb-2">
                            {item?.navn}
                          </span>
                          <p className="text-secondary2 text-sm">
                            {item?.Beskrivelse}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-[73%] border h-max border-[#DCDFEA] rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between gap-3 p-5 border-b border-[#DCDFEA]">
                      <h3 className="text-darkBlack text-xl font-semibold">
                        {Huskonfigurator[selectedTab]?.navn}
                      </h3>
                      {selectedTab < Huskonfigurator.length - 1 && (
                        <Button
                          text="Hopp over steget"
                          className={`border-2 border-[#7839EE] text-[#7839EE] sm:text-sm md:text-sm rounded-[40px] w-max h-[36px] md:h-[36px] lg:h-[36px] font-semibold relative`}
                          onClick={() => {
                            setSelectedTab(selectedTab + 1);
                          }}
                        />
                      )}
                    </div>
                    {Huskonfigurator[selectedTab]?.Kategorinavn?.length > 0 ? (
                      <>
                        <div className="bg-[#F9F9FB] border-[#EFF1F5] border rounded-lg m-6 p-[6px] flex items-center gap-2">
                          {Huskonfigurator[selectedTab]?.Kategorinavn.map(
                            (catItem: any, catIndex: number) => {
                              return (
                                <div
                                  key={catIndex}
                                  className={`py-2 px-3 text-sm rounded-lg cursor-pointer ${
                                    selectedCategory === catIndex
                                      ? "bg-white text-[#7839EE] font-medium shadow-shadow4"
                                      : "bg-transparent text-black"
                                  }`}
                                  onClick={() => setSelectedCategory(catIndex)}
                                >
                                  {catItem?.navn}
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className="grid grid-cols-3 big:grid-cols-4 gap-6 p-6 pt-0">
                          {Huskonfigurator[selectedTab]?.Kategorinavn[
                            selectedCategory
                          ]?.produkter?.length > 0 &&
                            Huskonfigurator[selectedTab]?.Kategorinavn[
                              selectedCategory
                            ]?.produkter.map((product: any, index: number) => {
                              const key = `${selectedTab}-${selectedCategory}`;
                              const isSelected =
                                selectedProducts[key]?.product?.Produktnavn ===
                                  product.Produktnavn &&
                                selectedProducts[key]?.product?.pris ===
                                  product.pris &&
                                selectedProducts[key]?.product
                                  ?.IncludingOffer === product.IncludingOffer &&
                                selectedProducts[key]?.product
                                  ?.Produktbeskrivelse ===
                                  product.Produktbeskrivelse;

                              return (
                                <div
                                  key={index}
                                  className="bg-gray3 rounded-lg p-3"
                                >
                                  <div className="w-full h-[158px] mb-3 relative">
                                    {product?.Hovedbilde?.length > 0 && (
                                      <Swiper
                                        navigation={
                                          product?.Hovedbilde?.length > 1
                                        }
                                        modules={[Navigation, Pagination]}
                                        className="custom-swiper w-full h-[158px] relative"
                                        pagination={
                                          product?.Hovedbilde?.length > 1
                                            ? {
                                                el: ".swiper-pagination",
                                                clickable: false,
                                              }
                                            : false
                                        }
                                        style={{ zIndex: 99 }}
                                      >
                                        {product?.Hovedbilde.map(
                                          (img: string, index: number) => (
                                            <SwiperSlide
                                              key={index}
                                              className="w-full h-[158px]"
                                            >
                                              <img
                                                src={img}
                                                alt="image"
                                                className="h-full w-full object-cover rounded-lg"
                                              />
                                            </SwiperSlide>
                                          )
                                        )}
                                        <div className="swiper-pagination"></div>
                                      </Swiper>
                                    )}
                                    <div
                                      className="w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer absolute top-2 right-2 bg-white"
                                      style={{ zIndex: 9999 }}
                                      onClick={() => openDrawer(product)}
                                    >
                                      <Image src={Ic_info_circle} alt="icon" />
                                    </div>
                                  </div>
                                  <p className="text-darkBlack text-sm two_line_elipse mb-3">
                                    {product?.Produktbeskrivelse}
                                  </p>
                                  <div className="flex items-center gap-2 justify-between">
                                    <div>
                                      <span className="text-secondary2 text-xs mb-1">
                                        Pris fra:
                                      </span>
                                      <h5 className="text-black font-medium text-base">
                                        {product?.IncludingOffer === true
                                          ? "Standard"
                                          : formatCurrency(product?.pris)}
                                      </h5>
                                    </div>
                                    <Button
                                      text={isSelected ? "Valgt" : "Velg"}
                                      className={`border-2 text-[#7839EE] ${
                                        isSelected
                                          ? "border-[#7839EE] bg-[#ECE9FE]"
                                          : "border-[#B9C0D4]"
                                      } sm:text-sm md:text-sm rounded-[40px] w-max h-[36px] md:h-[36px] lg:h-[36px] font-semibold relative`}
                                      onClick={() =>
                                        handleSelectProduct(
                                          product,
                                          selectedCategory,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray">
                        Ingen kategorier tilgjengelig
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center py-3 text-lg">
                  Du har ikke noe alternativ.
                </p>
              )}
            </SideSpaceContainer>
          </div>
          <div
            className="sticky bottom-0 bg-white py-6"
            style={{
              boxShadow:
                "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
              zIndex: 9999,
            }}
          >
            <SideSpaceContainer>
              <div className="flex justify-end gap-4 items-center">
                <Button
                  text="Tilbake"
                  className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    handlePrevious();
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                  }}
                />
                <Button
                  text="Neste: Velg tomt"
                  className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    handleNext();
                  }}
                />
              </div>
            </SideSpaceContainer>
          </div>
        </>
      )}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-40 visible" : "opacity-0 invisible"
        }`}
        style={{ zIndex: 999999 }}
        onClick={closeDrawer}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-1/2 bg-white shadow-lg transition-transform duration-700 transform z-[999999] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedDrawerProduct && (
          <div>
            <div className="py-5 px-8 flex items-center justify-between gap-6 border-b border-[#DCDFEA]">
              <h2 className="text-xl font-semibold text-darkBlack">
                {selectedDrawerProduct?.Produktnavn}
              </h2>
              <button onClick={closeDrawer}>
                <Image src={Ic_close} alt="close" />
              </button>
            </div>
            <div className="py-5 px-8">
              <img
                src={selectedDrawerProduct?.Hovedbilde[0]}
                alt="image"
                className="w-[254px] h-[161px] mb-6"
              />
              <textarea
                value={selectedDrawerProduct?.Produktbeskrivelse}
                className="text-base text-secondary h-full focus-within:outline-none resize-none w-full"
                ref={textareaRef}
                readOnly
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tilpass;

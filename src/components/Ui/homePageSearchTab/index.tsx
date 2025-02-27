import { useEffect, useState } from "react";
import BeløpTab from "./beløp";
import AdresseTab from "./adresse";
import HusmodellTab from "./husmodell";
import MatrikkelTab from "./matrikkel";
import Image from "next/image";
import Img_main_bg from "@/public/images/Img_main_bg.png";
import Img_map from "@/public/images/Img_map.png";
import Img_plot from "@/public/images/Img_plot.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loading from "@/components/Loading";
import GoogleMapComponent from "../map";

const tabs = [
  { id: "beløp", label: ["Start med", "beløp"] },
  { id: "adresse", label: ["Start med", "adresse"] },
  { id: "husmodell", label: ["Start med", "husmodell"] },
  { id: "matrikkel", label: ["Start med", "matrikkel"] },
];

const adresseProperties = [
  {
    id: 1,
    title: "Sokkabekkveien 77",
    address: "3478 Nærsnes",
    imgMap: Img_map,
    description: "Herskapelige Almgaard er en drømmebolig for familien",
    size: 233,
    BYA: 25,
    Tilbudpris: "8.300.000 NOK",
    imageText: "Rammetillatelse",
  },
  {
    id: 2,
    title: "Sokkabekkveien 77",
    address: "3478 Nærsnes",
    imgMap: Img_map,
    description: "Herskapelige Almgaard er en drømmebolig for familien",
    size: 233,
    BYA: 25,
    Tilbudpris: "8.300.000 NOK",
    imageText: "Rammetillatelse",
  },
  {
    id: 3,
    title: "Sokkabekkveien 77",
    address: "3478 Nærsnes",
    imgMap: Img_map,
    description: "Herskapelige Almgaard er en drømmebolig for familien",
    size: 233,
    BYA: 25,
    Tilbudpris: "8.300.000 NOK",
    imageText: "Rammetillatelse",
  },
];
const husmodellProperties = [
  {
    name: "Dokka",
    manufacturer: "Systemhus",
    description: "Arealeffektive Dokka med uteleied",
    area: 177,
    bedrooms: 3,
    bathrooms: 2,
    price: 5100000,
    currency: "NOK",
    imagePath: Img_plot,
  },
  {
    name: "Almgård",
    manufacturer: "BoligPartner",
    description: "Herskapelige Almgaard er en drømmebolig for familien",
    area: 233,
    bedrooms: 5,
    bathrooms: 3,
    price: 8300000,
    currency: "NOK",
    imagePath: Img_plot,
  },
  {
    name: "Utsyn",
    manufacturer: "Mesterhus",
    description: "Kompakte og moderne Utsyn med utebod",
    area: 201,
    bedrooms: 5,
    bathrooms: 2,
    price: 7350000,
    currency: "NOK",
    imagePath: Img_plot,
  },
];

const HomePageSearchTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("beløp");
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const propertiesCollectionRef = collection(db, "empty_plot");
      const propertiesQuery = query(propertiesCollectionRef, limit(3));

      try {
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const fetchedProperties: any = propertiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));
        setHouseModelProperty(fetchedProperties);
      } catch (error) {
        console.error("Error fetching user's properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db]);

  return (
    <>
      <div className="relative">
        <SideSpaceContainer>
          <div
            className="w-full flex flex-col justify-center items-center mb-[40px] md:mb-[52px] lg:mb-[68px] py-4 px-3 lg:p-8 border border-[#EFF1F5] rounded-[8px] md:rounded-[12px] bg-white relative"
            style={{
              zIndex: 999,
              boxShadow:
                "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
            }}
          >
            <div className="flex justify-center gap-2 md:gap-[40px] items-center border-b border-[#EFF1F5] mb-5 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`pb-3 text-xs md:text-sm border-b-[4px] font-base transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-[#6941C6] text-blue"
                      : "border-transparent text-grayText"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label[0]}{" "}
                  <span className="font-semibold">{tab.label[1]}</span>
                </button>
              ))}
            </div>

            <div className="w-full">
              {activeTab === "beløp" && <BeløpTab />}
              {activeTab === "adresse" && <AdresseTab />}
              {activeTab === "husmodell" && <HusmodellTab />}
              {activeTab === "matrikkel" && <MatrikkelTab />}
            </div>
          </div>
          <div
            className="absolute lg:-bottom-9 desktop:-bottom-14 big:bottom-[-100px] left-0 w-full hidden lg:block"
            style={{ zIndex: 9 }}
          >
            <Image src={Img_main_bg} alt="image" className="w-full " />
          </div>
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "beløp" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære kombinasjoner i{" "}
            <span className="font-bold text-blue">Akershus</span>
          </h2>
          {isLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {HouseModelProperty.map((property: any, index) => (
                <div
                  key={index}
                  className="border border-[#EFF1F5] rounded-[8px] p-5"
                  style={{
                    boxShadow:
                      "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                  }}
                >
                  <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2">
                    <span className="font-bold">Almgård</span> bygget i{" "}
                    <span className="font-bold">
                      {
                        property?.CadastreDataFromApi?.presentationAddressApi
                          ?.response?.item?.formatted?.line1
                      }
                    </span>{" "}
                    <span className="text-[#10182899]">
                      (
                      {
                        property?.lamdaDataFromApi?.eiendomsInformasjon
                          ?.kommune_info?.kommune
                      }
                      )
                    </span>
                  </h4>
                  <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                    {
                      property?.CadastreDataFromApi?.presentationAddressApi
                        ?.response?.item?.formatted?.line2
                    }
                  </p>
                  <div className="flex gap-2 mb-2 md:mb-3 desktop:mb-4">
                    <div className="w-[63%]">
                      <Image
                        src={Img_plot}
                        alt="image"
                        className="w-full h-full rounded-[8px]"
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
                  <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                    {property.description}
                  </h5>
                  <div className="flex gap-3 items-center">
                    <div className="text-[#111322] text-xs md:text-sm font-semibold">
                      {
                        property?.lamdaDataFromApi?.eiendomsInformasjon
                          ?.basisInformasjon?.areal_beregnet
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
                      3 <span className="text-[#4A5578] font-normal">bad</span>
                    </div>
                  </div>
                  <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                  <div className="gap-4 md:gap-5 lg:gap-6 flex items-center mb-2 md:mb-3 desktop:mb-4">
                    <div className="w-1/2">
                      <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                        Pris for <span className="font-semibold">Almgård</span>
                      </p>
                      <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                        2.800.00 NOK
                      </h6>
                    </div>
                    <div className="w-1/2">
                      <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                        Pris for <span className="font-semibold">tomten</span>
                      </p>
                      <h6 className="text-xs md:text-sm font-semibold desktop:text-base">
                        {property.pris ? `${property.pris} NOK` : 0}
                      </h6>
                    </div>
                  </div>
                  <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                    <div>
                      <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                        Totalpris med tomt
                      </p>
                      <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                        {property.pris
                          ? `${(280000 + parseInt(property.pris)).toLocaleString()} NOK`
                          : "2.800.00 NOK"}
                      </h6>
                    </div>
                    <Button
                      text="Utforsk"
                      className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "adresse" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære tomter i{" "}
            <span className="font-bold text-blue">Akershus</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {adresseProperties.map((property, index) => (
              <div
                key={index}
                className="border border-[#EFF1F5] rounded-[8px] p-5"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                }}
              >
                <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 font-bold">
                  {property.title}
                </h4>
                <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                  {property.address}
                </p>
                <div className="relative mb-2 md:mb-3 desktop:mb-4">
                  <Image
                    src={property.imgMap}
                    alt="image"
                    className="w-full h-[234px] rounded-[8px]"
                  />
                  <span className="text-xs bg-[#FFFFFFB2] rounded-[32px] py-1 px-2 font-medium absolute top-3 left-3">
                    {property.imageText}
                  </span>
                </div>
                <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                  {property.description}
                </h5>
                <div className="flex gap-3 items-center">
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.size}{" "}
                    <span className="text-[#4A5578] font-normal">m²</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.BYA}{" "}
                    <span className="text-[#4A5578] font-normal">BYA</span>
                  </div>
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                  <div>
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                      Tilbudpris
                    </p>
                    <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                      {property.Tilbudpris}
                    </h6>
                  </div>
                  <Button
                    text="Utforsk"
                    className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "husmodell" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære husmodeller i{" "}
            <span className="font-bold text-blue">Asker</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {husmodellProperties.map((property, index) => (
              <div
                key={index}
                className="border border-[#EFF1F5] rounded-[8px] p-5"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                }}
              >
                <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-3">
                  <span className="font-bold">{property.name}</span> fra{" "}
                  <span className="font-bold">{property.manufacturer}</span>
                </h4>
                <Image
                  src={property.imagePath}
                  alt="image"
                  className="w-full h-[374px] rounded-[8px] mb-2 md:mb-3 desktop:mb-4"
                />
                <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                  {property.description}
                </h5>
                <div className="flex gap-3 items-center">
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.area}{" "}
                    <span className="text-[#4A5578] font-normal">m²</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.bedrooms}{" "}
                    <span className="text-[#4A5578] font-normal">BYA</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.bathrooms}{" "}
                    <span className="text-[#4A5578] font-normal">bad</span>
                  </div>
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                  <div>
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                      Pris for{" "}
                      <span className="font-semibold">{property.name}</span>
                    </p>
                    <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                      {property.price}
                    </h6>
                  </div>
                  <Button
                    text="Utforsk"
                    className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </SideSpaceContainer>
      </div>
      <div className={`${activeTab === "matrikkel" ? "block" : "hidden"}`}>
        <SideSpaceContainer>
          <h2 className="text-black text-[24px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
            Populære tomter i <span className="font-bold text-blue">Asker</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {adresseProperties.map((property, index) => (
              <div
                key={index}
                className="border border-[#EFF1F5] rounded-[8px] p-5"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                }}
              >
                <h4 className="text-[#111322] text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 font-bold">
                  {property.title}
                </h4>
                <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                  {property.address}
                </p>
                <div className="relative mb-2 md:mb-3 desktop:mb-4">
                  <Image
                    src={property.imgMap}
                    alt="image"
                    className="w-full h-[234px] rounded-[8px]"
                  />
                  <span className="text-xs bg-[#FFFFFFB2] rounded-[32px] py-1 px-2 font-medium absolute top-3 left-3">
                    {property.imageText}
                  </span>
                </div>
                <h5 className="text-[#111322] font-medium text-sm md:text-base mb-2">
                  {property.description}
                </h5>
                <div className="flex gap-3 items-center">
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.size}{" "}
                    <span className="text-[#4A5578] font-normal">m²</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-[#111322] text-xs md:text-sm font-semibold">
                    {property.BYA}{" "}
                    <span className="text-[#4A5578] font-normal">BYA</span>
                  </div>
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                  <div>
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                      Tilbudpris
                    </p>
                    <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                      {property.Tilbudpris}
                    </h6>
                  </div>
                  <Button
                    text="Utforsk"
                    className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HomePageSearchTab;

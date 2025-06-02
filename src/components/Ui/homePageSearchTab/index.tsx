import { useEffect, useState } from "react";
import BeløpTab from "./beløp";
import AdresseTab from "./adresse";
import HusmodellTab from "./husmodell";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/belop/belopProperty";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { FileUser } from "lucide-react";
import NorkartMap from "@/components/map";

const tabs = [
  {
    id: "beløp",
    label: ["Start med", "beløp"],
    description: "Vet du hvor mye du vil bruke på tomt og",
    description2: "hytte?",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    id: "adresse",
    label: ["Start med", "adresse"],
    description: "Har du egen tomt eller bare vil se en konkret adresse?",
    icon: <FileUser />,
  },
  {
    id: "husmodell",
    label: ["Start med", "husmodell"],
    description: "Vet du hvor mye du vil bruke på tomt og",
    icon: <MapsHomeWorkIcon />,
  },
];
const HomePageSearchTab: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("beløp");

  const [data, setData] = useState<any>({
    houseModels: [],
    houseModelProperty: [],
    belopProperty: [],
    cities: [],
    supplierData: {},
    isLoading: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setData((prev: any) => ({ ...prev, isLoading: true }));

      try {
        const citiesSnapshot = await getDocs(collection(db, "cities"));
        const fetchedCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const filterProperty: any = fetchedCities.find(
          (p: any) => p.name === "Akershus"
        );
        const kommuneNumbers = filterProperty?.kommunenummer
          ? Object.values(filterProperty.kommunenummer)
              .map((val: any) => parseInt(val.toString(), 10))
              .filter((num) => !isNaN(num))
          : [];

        const houseModelSnapshot = await getDocs(
          query(
            collection(db, "house_model"),
            where("Husdetaljer.TilgjengeligBolig", "==", "Ja")
          )
        );
        const houseModels = houseModelSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const priceA = parseInt(
              a?.Husdetaljer?.pris?.replace(/\s/g, "") || "0",
              10
            );
            const priceB = parseInt(
              b?.Husdetaljer?.pris?.replace(/\s/g, "") || "0",
              10
            );
            return priceA - priceB;
          });

        const filteredHouseModels = houseModels.filter((house: any) =>
          house?.Husdetaljer?.pris
            ? parseInt(house.Husdetaljer.pris.replace(/\s/g, ""), 10)
            : false
        );

        let allPlots: any = [];
        if (kommuneNumbers.length) {
          const plotPromises = [];
          for (let i = 0; i < kommuneNumbers.length; i += 10) {
            plotPromises.push(
              getDocs(
                query(
                  collection(db, "empty_plot"),
                  where(
                    "lamdaDataFromApi.searchParameters.kommunenummer",
                    "in",
                    kommuneNumbers.slice(i, i + 10)
                  )
                )
              )
            );
          }
          const plotSnapshots = await Promise.all(plotPromises);
          allPlots = plotSnapshots.flatMap((snapshot) =>
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter(
                (plot: any) => plot?.CadastreDataFromApi?.presentationAddressApi
              )
          );
        }

        setData({
          houseModels: houseModels.slice(0, 3),
          houseModelProperty: allPlots.slice(0, 3),
          belopProperty: allPlots
            .flatMap((plot: any) =>
              filteredHouseModels.map((house) => ({ plot, house }))
            )
            .slice(0, 3),
          cities: fetchedCities,
          supplierData: {},
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching properties:", error);
        setData((prev: any) => ({ ...prev, isLoading: false }));
      }
    };

    fetchProperty();
  }, []);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap = { ...data.supplierData };

      await Promise.all(
        data.belopProperty.map(async (property: any) => {
          const supplierId = property?.house?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            try {
              const supplierDocRef = doc(db, "suppliers", supplierId);
              const docSnap = await getDoc(supplierDocRef);
              supplierMap[supplierId] = docSnap.exists()
                ? docSnap.data()
                : null;
            } catch (error) {
              console.error("Error fetching supplier data:", error);
            }
          }
        })
      );

      setData((prev: any) => ({ ...prev, supplierData: supplierMap }));
    };

    if (data.belopProperty.length) {
      fetchSupplierDetails();
    }
  }, [data.belopProperty]);

  return (
    <>
      <div className="relative pb-[40px] md:pb-[52px] lg:pb-[60px]">
        <SideSpaceContainer>
          <div
            className="w-full relative laptop:px-16"
            style={{
              zIndex: 999,
            }}
          >
            <div className="flex flex-col lg:justify-center lg:items-center">
              <div className="flex lg:justify-center gap-2 lg:items-center border border-gray3 mb-6 overflow-x-auto bg-gray3 p-[6px] rounded-lg overFlowScrollHidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center md:items-start gap-3 ${
                      activeTab === tab.id ? "bg-white" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div
                      className={`h-6 w-6 ${
                        activeTab === tab.id
                          ? "text-blue bg-white"
                          : "text-[#30374F]"
                      }`}
                    >
                      {tab.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <div
                        className={`text-xs md:text-sm whitespace-nowrap font-base ${
                          activeTab === tab.id
                            ? "text-blue bg-white"
                            : "text-[#30374F]"
                        }`}
                      >
                        {tab.label[0]}{" "}
                        <span className="font-semibold">{tab.label[1]}</span>
                      </div>
                      <div
                        className={`mt-1 text-secondary text-xs w-48 text-left hidden md:block`}
                      >
                        {tab.description}{" "}
                        <span className="font-semibold">
                          {tab.description2}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full">
              {activeTab === "beløp" && <BeløpTab />}
              {activeTab === "adresse" && <AdresseTab />}
              {activeTab === "husmodell" && <HusmodellTab />}
            </div>
          </div>
        </SideSpaceContainer>
      </div>
      <div className="bg-lightPurple2 py-[48px] lg:py-[60px]">
        <SideSpaceContainer>
          {data.isLoading ? (
            <div className="relative">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5">
              <h5 className="text-darkBlack font-semibold text-sm md:text-base">
                Tomte<span className="text-purple2">Banken</span>:
              </h5>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {data.cities.map((city: any, index: number) => (
                  <div
                    key={index}
                    className="border border-[#ECE9FE] bg-white rounded-[50px] text-xs md:text-sm py-[7px] px-3 cursor-pointer"
                    onClick={() => {
                      router.push(
                        `tomtbaken?city=${`${city.name} (${city?.total_entries})`}`
                      );
                    }}
                  >
                    <span className="text-[#30374F]">{city?.name}</span>{" "}
                    <span className="text-secondary2">
                      ({city?.total_entries})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SideSpaceContainer>
      </div>
      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <div className={`${activeTab === "beløp" ? "block" : "hidden"}`}>
          <SideSpaceContainer>
            <h2 className="text-darkBlack text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
              Populære kombinasjoner i{" "}
              <span className="font-bold text-purple2">Akershus</span>
            </h2>
            {data.isLoading ? (
              <div className="relative">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {data.belopProperty.map((property: any, index: number) => {
                  const supplierId = property?.house?.Husdetaljer?.Leverandører;
                  const finalData = data.supplierData[supplierId] || null;

                  return (
                    <div
                      key={index}
                      className="border border-gray3 rounded-[8px] p-3 md:p-5 cursor-pointer"
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                      onClick={() => {
                        router.push(
                          `housemodell-plot?propertyId=${property?.plot?.id}&husmodellId=${property?.house?.id}&emptyPlot=true&homePage=true`
                        );
                        const currIndex = 0;
                        localStorage.setItem("currIndex", currIndex.toString());
                      }}
                    >
                      <h4 className="text-darkBlack text-sm md:text-base lg:text-lg lg:leading-[30px] two_line_elipse">
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
                      </h4>
                      <div className="text-[#10182899] mb-2 text-sm md:text-base lg:text-lg lg:leading-[30px]">
                        (
                        {
                          property?.plot?.CadastreDataFromApi
                            ?.presentationAddressApi?.response?.item?.street
                            ?.municipality?.municipalityName
                        }
                        )
                      </div>
                      <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                        {
                          property?.plot?.CadastreDataFromApi
                            ?.presentationAddressApi?.response?.item?.formatted
                            ?.line2
                        }
                      </p>
                      <div className="flex gap-2 mb-3 desktop:mb-4 h-[160px] sm:h-[185px]">
                        <div className="w-[63%] relative">
                          <img
                            src={property?.house?.Husdetaljer?.photo}
                            alt="husmodell"
                            className="w-full h-full rounded-[8px] object-cover"
                          />
                          <img
                            src={finalData?.photo}
                            alt="product-logo"
                            className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                          />
                        </div>
                        <div className="w-[37%] rounded-[8px] overflow-hidden h-full">
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
                      <h5 className="text-darkBlack font-medium text-sm md:text-base mb-2">
                        {property.description}
                      </h5>
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex gap-3 items-center">
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
                        </div>
                        <div className="text-darkBlack text-xs md:text-sm font-semibold">
                          {
                            property?.plot?.lamdaDataFromApi
                              ?.eiendomsInformasjon?.basisInformasjon
                              ?.areal_beregnet
                          }{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
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
                          className="border border-greenBtn bg-greenBtn text-white hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                          onClick={() => {
                            router.push(
                              `housemodell-plot?propertyId=${property?.plot?.id}&husmodellId=${property?.house?.id}&emptyPlot=true&homePage=true`
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
                  );
                })}
              </div>
            )}
          </SideSpaceContainer>
        </div>
        <div className={`${activeTab === "adresse" ? "block" : "hidden"}`}>
          <SideSpaceContainer>
            <h2 className="text-darkBlack text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
              Populære tomter i{" "}
              <span className="font-bold text-purple2">Akershus</span>
            </h2>
            {data?.isLoading ? (
              <div className="relative">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {data?.houseModelProperty.map(
                  (property: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray3 rounded-[8px] p-3 md:p-5 cursor-pointer"
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                      onClick={() => {
                        router.push(
                          `/regulations?kommunenummer=${property?.lamdaDataFromApi?.searchParameters?.kommunenummer}&gardsnummer=${property?.lamdaDataFromApi?.searchParameters?.gardsnummer}&bruksnummer=${property?.lamdaDataFromApi?.searchParameters?.bruksnummer}`
                        );
                        const currIndex = 0;
                        localStorage.setItem("currIndex", currIndex.toString());
                      }}
                    >
                      <h4 className="text-darkBlack text-sm md:text-base lg:text-lg lg:leading-[30px] mb-2 font-bold">
                        {
                          property?.CadastreDataFromApi?.presentationAddressApi
                            ?.response?.item?.formatted?.line1
                        }
                      </h4>
                      <p className="text-grayText text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                        {
                          property?.CadastreDataFromApi?.presentationAddressApi
                            ?.response?.item?.formatted?.line2
                        }
                      </p>
                      <div className="relative mb-3 desktop:mb-4">
                        <div className="w-full h-[200px] md:h-[234px] rounded-[8px] overflow-hidden">
                          {property?.lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates && (
                            <NorkartMap
                              coordinates={
                                property?.lamdaDataFromApi?.coordinates
                                  ?.convertedCoordinates
                              }
                              MAX_ZOOM={20}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="text-darkBlack text-xs md:text-sm font-semibold">
                          {
                            property?.lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet
                          }{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
                        </div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="text-darkBlack text-xs md:text-sm font-semibold">
                          {
                            property?.additionalData?.answer?.bya_calculations
                              ?.input?.bya_percentage
                          }
                          %{" "}
                          <span className="text-[#4A5578] font-normal">
                            BYA
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                      <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                        <div>
                          <p className="text-[#4A5578] text-xs md:text-sm mb-1">
                            Tilbudpris
                          </p>
                          <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                            {property.pris ? formatPrice(property.pris) : 0}
                          </h6>
                        </div>
                        <Button
                          text="Utforsk"
                          className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                          onClick={() => {
                            router.push(
                              `/regulations?kommunenummer=${property?.lamdaDataFromApi?.searchParameters?.kommunenummer}&gardsnummer=${property?.lamdaDataFromApi?.searchParameters?.gardsnummer}&bruksnummer=${property?.lamdaDataFromApi?.searchParameters?.bruksnummer}`
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
                  )
                )}
              </div>
            )}
          </SideSpaceContainer>
        </div>
        <div className={`${activeTab === "husmodell" ? "block" : "hidden"}`}>
          <SideSpaceContainer>
            <h2 className="text-darkBlack text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-5 lg:mb-[20px] text-center desktop:tracking-[-1px] md:mb-[32px] desktop:mb-[40px]">
              Populære husmodeller i{" "}
              <span className="font-bold text-purple2">Asker</span>
            </h2>
            {data.isLoading ? (
              <div className="relative">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {data.houseModels.map((property: any, index: number) => {
                  // const supplierId = property?.Husdetaljer?.Leverandører;
                  // const finalData = data.supplierData[supplierId] || null;
                  return (
                    <div
                      key={index}
                      className="border border-gray3 rounded-[8px] p-3 md:p-5 cursor-pointer"
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                      onClick={() => {
                        router.push(
                          `husmodells?husmodellId=${property?.id}&city=Akershus`
                        );
                        const currIndex = 0;
                        localStorage.setItem("currIndex", currIndex.toString());
                      }}
                    >
                      <h4 className="text-darkBlack text-sm md:text-base lg:text-lg lg:leading-[30px] mb-3">
                        <span className="font-bold">
                          {property?.Husdetaljer?.husmodell_name}
                        </span>{" "}
                        {/* fra{" "}
                        <span className="font-bold">
                          {finalData?.company_name}
                        </span> */}
                      </h4>
                      <img
                        src={property?.Husdetaljer?.photo}
                        alt="image"
                        className="w-full h-[230px] md:h-[304px] rounded-[8px] mb-3 desktop:mb-4 object-cover"
                      />
                      <h5 className="text-[#4A5578] font-medium text-sm md:text-base mb-2 two_line_elipse">
                        {property?.Husdetaljer?.OmHusmodellen}
                      </h5>
                      <div className="flex gap-3 items-center">
                        <div className="text-darkBlack text-xs md:text-sm font-semibold">
                          {property?.Husdetaljer?.BRATotal}{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
                        </div>
                        <div className="border-l border-[#EAECF0] h-[12px]"></div>
                        <div className="text-darkBlack text-xs md:text-sm font-semibold">
                          {property?.Husdetaljer?.BebygdAreal}{" "}
                          <span className="text-[#4A5578] font-normal">
                            BYA
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
                            </span>
                          </p>
                          <h6 className="text-sm md:text-base font-semibold desktop:text-xl">
                            {property?.Husdetaljer?.pris
                              ? formatPrice(property?.Husdetaljer?.pris)
                              : 0}
                          </h6>
                        </div>
                        <Button
                          text="Utforsk"
                          className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                          onClick={() => {
                            router.push(
                              `husmodells?husmodellId=${property?.id}&city=Akershus`
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
                  );
                })}
              </div>
            )}
          </SideSpaceContainer>
        </div>
      </div>
    </>
  );
};

export default HomePageSearchTab;

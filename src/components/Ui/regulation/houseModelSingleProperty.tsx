import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Ic_check from "@/public/images/Ic_check.svg";
import Ic_x_close from "@/public/images/Ic_x_close.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_right from "@/public/images/Ic_chevron_right.svg";
import Button from "@/components/common/button";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import GoogleMapNearByComponent from "@/components/Ui/map/nearbyBuiildingMap";
import GoogleMapComponent from "@/components/Ui/map";
import Eierinformasjon from "@/components/Ui/regulationChart/Eierinformasjon";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
import {
  Building,
  Building2,
  ClipboardList,
  FileText,
  FileUser,
  House,
} from "lucide-react";
import HouseDetailPage from "@/components/Ui/houseDetail";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const HouseModelSingleProperty: React.FC<{
  handleNext: any;
  handlePrevious: any;
  loadingAdditionalData: any;
  loginUser: any;
  loadingLamdaData: any;
  supplierData: any;
  CadastreDataFromApi: any;
  HouseModelData: any;
  askData: any;
  lamdaDataFromApi: any;
  user: any;
}> = ({
  handleNext,
  HouseModelData,
  loadingAdditionalData,
  loginUser,
  loadingLamdaData,
  supplierData,
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  user,
}) => {
  const router = useRouter();
  const { homePage } = router.query;
  const { pathname, query: routequery } = router;
  const updatedQuery = { ...routequery };

  const [dropdownState, setDropdownState] = useState({
    Tomteopplysninger: false,
    KommunaleData: false,
    Eiendomsstatus: false,
    Parkeringsinformasjon: false,
    YtterligereEiendomsforhold: false,
    SpesielleRegistreringer: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownState((prevState: any) =>
          Object.keys(prevState).reduce(
            (acc: any, key) => {
              acc[key] = false;
              return acc;
            },
            {} as { [key: string]: boolean }
          )
        );
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (key: any) => {
    setDropdownState((prevState: any) => {
      const newState = Object.keys(prevState).reduce(
        (acc: any, currKey: any) => {
          acc[currKey] = currKey === key ? !prevState[key] : false;
          return acc;
        },
        {}
      );
      return newState;
    });
  };

  function formatDateToDDMMYYYY(dateString: any) {
    const dateObject: any = new Date(dateString);

    if (isNaN(dateObject)) {
      return "Invalid Date";
    }

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const BBOXData =
    CadastreDataFromApi?.cadastreApi?.response?.item?.geojson?.bbox;

  const isValidBBOX = Array.isArray(BBOXData) && BBOXData.length === 4;
  const scrollContainerRef: any = useRef(null);

  const scrollByAmount = 90;

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollByAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollByAmount,
        behavior: "smooth",
      });
    }
  };
  const adjustedBBOX: any = isValidBBOX && [
    BBOXData[0] - 30,
    BBOXData[1] - 30,
    BBOXData[2] + 30,
    BBOXData[3] + 30,
  ];
  const [featureInfo, setFeatureInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatureInfo = async () => {
      const url = `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&QUERY_LAYERS=Planomrade_02,Arealformal_02&LAYERS=Planomrade_02,Arealformal_02&INFO_FORMAT=text/html&CRS=EPSG:25833&BBOX=${BBOXData[0]},${BBOXData[1]},${BBOXData[2]},${BBOXData[3]}&WIDTH=800&HEIGHT=600&I=400&J=300`;

      try {
        const response = await fetch(url);
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const images = doc.querySelectorAll("img");
        images.forEach((img) => img.remove());
        const cleanedHTML = doc.body.innerHTML;
        setFeatureInfo(cleanedHTML);
      } catch (error) {
        console.error("Error fetching feature info:", error);
        setFeatureInfo("<p>Error loading data</p>");
      }
    };
    if (isValidBBOX) {
      fetchFeatureInfo();
    }
  }, [isValidBBOX, BBOXData]);

  const images = isValidBBOX
    ? [
        {
          id: 1,
          src: `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Planomrade_02,Arealformal_02,Grenser_og_juridiske_linjer_02&STYLES=default,default,default&CRS=EPSG:25833&BBOX=${adjustedBBOX[0]},${adjustedBBOX[1]},${adjustedBBOX[2]},${adjustedBBOX[3]}&WIDTH=800&HEIGHT=600&FORMAT=image/png`,
          alt: "Reguleringsplan image",
        },
        {
          id: 2,
          src: `https://wms.geonorge.no/skwms1/wms.matrikkelkart?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=MatrikkelKart&STYLES=default&CRS=EPSG:25833&BBOX=${adjustedBBOX[0]},${adjustedBBOX[1]},${adjustedBBOX[2]},${adjustedBBOX[3]}&WIDTH=1024&HEIGHT=768&FORMAT=image/png`,
          alt: "Matrikkelkart image",
        },
      ]
    : [];

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!selectedImage && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);
  const handleImageClick = (image: any) => {
    if (selectedImage?.id === image.id) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    setSelectedImage(image);
  };
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const tabs: any = [
    {
      id: "Eiendomsinformasjon",
      label: "Eiendomsinformasjon",
      icon: <Building2 />,
    },
    {
      id: `house`,
      label: `${HouseModelData?.Husdetaljer?.husmodell_name} fra ${supplierData?.company_name}`,
      icon: <House />,
    },
  ];
  const plotTabs: any = [
    { id: "Regulering", label: "Regulering", icon: <FileText /> },
    { id: "Eierinformasjon", label: "Eierinformasjon", icon: <FileUser /> },
    { id: "Bygninger", label: "Bygninger", icon: <Building /> },
    { id: "Plandokumenter", label: "Plandokumenter", icon: <ClipboardList /> },
  ];
  const [PlotActiveTab, setPlotActiveTab] = useState<string>(plotTabs[0].id);
  const [activeTab, setActiveTab] = useState<string>(tabs[1].id);

  const id = router.query["husodellId"];
  const plotId = router.query["plotId"];

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !id) return;

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      const currentLeadId = queryParams.get("leadId");
      queryParams.delete("leadId");

      try {
        let plotCollectionRef = collection(
          db,
          isEmptyPlot === "true" ? "empty_plot" : "plot_building"
        );

        const allLeadsSnapshot = await getDocs(query(plotCollectionRef));
        if (allLeadsSnapshot.empty) {
          console.warn("No leads found in the collection.");
          return;
        }

        let correctPlotId: string | null = null;
        for (const doc of allLeadsSnapshot.docs) {
          if (doc.id) {
            correctPlotId = doc.id;
            break;
          }
        }

        if (!correctPlotId) {
          console.error("No valid plotId found.");
          return;
        }

        const [plotDocSnap, husmodellDocSnap] = await Promise.all([
          getDoc(doc(plotCollectionRef, correctPlotId)),
          getDoc(doc(db, "house_model", String(id))),
        ]);

        const finalData = {
          plot: { id: correctPlotId, ...plotDocSnap.data() },
          husmodell: { id: String(id), ...husmodellDocSnap.data() },
        };

        const leadsQuerySnapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.plot.id", "==", correctPlotId),
            where("finalData.husmodell.id", "==", id)
          )
        );

        if (!leadsQuerySnapshot.empty) {
          const existingLeadId = leadsQuerySnapshot.docs[0].id;
          if (currentLeadId !== existingLeadId) {
            queryParams.set("leadId", existingLeadId);
            router.replace({
              pathname: router.pathname,
              query: Object.fromEntries(queryParams),
            });
          }
          return;
        }

        const newDocRef = await addDoc(collection(db, "leads"), {
          finalData,
          user,
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          IsEmptyPlot: isEmptyPlot === "true",
        });

        queryParams.set("leadId", newDocRef.id);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    fetchData();
  }, [plotId, id, user]);

  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-[#7839EE] text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
              }}
            >
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            {!homePage && (
              <>
                <div
                  className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
                  onClick={() => {
                    delete updatedQuery.propertyId;
                    delete updatedQuery.husodellId;
                    delete updatedQuery.leadId;
                    delete updatedQuery.emptyPlot;

                    router.push(
                      {
                        pathname: router.pathname,
                        query: updatedQuery,
                      },
                      undefined,
                      { shallow: true }
                    );
                    const currIndex = 1;
                    localStorage.setItem("currIndex", currIndex.toString());
                  }}
                >
                  Hva kan du bygge?
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              </>
            )}
            <span className="text-secondary2 text-xs md:text-sm">Detaljer</span>
          </div>
          <PropertyHouseDetails
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            supplierData={supplierData}
          />
        </SideSpaceContainer>
      </div>
      <PropertyDetails
        askData={askData}
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
      />
      <SideSpaceContainer>
        <LeadsBox />
      </SideSpaceContainer>
      <div id="regulationDocument">
        <div
          className="border-b border-gray3 py-6 pb-8"
          id="logoDiv"
          style={{ display: "none" }}
        >
          <SideSpaceContainer>
            <Image
              fetchPriority="auto"
              src={Ic_logo}
              alt="logo"
              className="w-[100px] lg:w-auto"
            />
          </SideSpaceContainer>
        </div>

        <SideSpaceContainer className="relative pt-[38px] pb-[46px]">
          <div>
            <div className="flex border border-gray3 rounded-lg w-max bg-gray3 p-[6px] mb-[38px]">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-base transition-colors duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-white font-medium text-[#7839EE]"
                      : "text-black"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              className={`${activeTab === "Eiendomsinformasjon" ? "block" : "hidden"}`}
            >
              <div className="rounded-lg border border-[#EFF1F5]">
                <div
                  className="flex items-center justify-between gap-2 cursor-pointer p-5"
                  onClick={toggleAccordion}
                >
                  <h3 className="text-black text-2xl font-semibold">
                    Eiendomsinformasjon
                  </h3>
                  {isOpen ? (
                    <Image
                      fetchPriority="auto"
                      src={Ic_chevron_up}
                      alt="arrow"
                    />
                  ) : (
                    <Image
                      fetchPriority="auto"
                      src={Ic_chevron_up}
                      alt="arrow"
                      className="rotate-180"
                    />
                  )}
                </div>
                <div
                  className={`${isOpen ? "block border-t border-[#EFF1F5] p-5" : "hidden"}`}
                >
                  <div className="flex gap-6 justify-between">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Tomteopplysninger
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() =>
                                toggleDropdown("Tomteopplysninger")
                              }
                            />
                            {dropdownState.Tomteopplysninger && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Areal beregnet
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.areal_beregnet ? (
                                <>
                                  {
                                    lamdaDataFromApi?.eiendomsInformasjon
                                      ?.basisInformasjon?.areal_beregnet
                                  }{" "}
                                  m<sup>2</sup>
                                </>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Etableringsårs dato
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.etableringsdato
                                ? formatDateToDDMMYYYY(
                                    lamdaDataFromApi?.eiendomsInformasjon
                                      ?.basisInformasjon?.etableringsdato
                                  )
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Sist oppdatert
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.sist_oppdatert
                                ? formatDateToDDMMYYYY(
                                    lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon?.sist_oppdatert.split(
                                      "T"
                                    )[0]
                                  )
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Tomtens totale BYA
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {askData?.bya_calculations?.results
                                ?.total_allowed_bya ? (
                                <>
                                  {
                                    askData?.bya_calculations?.results
                                      ?.total_allowed_bya
                                  }{" "}
                                  m<sup>2</sup>
                                </>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Er registrert land
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .isRegisteredLand === "Ja" ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .isRegisteredLand === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Festenummer</p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.festenummer
                                ? lamdaDataFromApi?.eiendomsInformasjon
                                    ?.basisInformasjon?.festenummer
                                : "-"}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Kommunale data
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() => toggleDropdown("KommunaleData")}
                            />
                            {dropdownState.KommunaleData && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Kommune</p>
                            <h5 className="text-base text-black font-medium">
                              {
                                CadastreDataFromApi?.presentationAddressApi
                                  ?.response?.item?.municipality
                                  ?.municipalityName
                              }
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Kommunenummer
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.kommune_info?.kommunenr
                                ? lamdaDataFromApi?.eiendomsInformasjon
                                    ?.kommune_info?.kommunenr
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Gårdsnummer</p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.kommune_info?.gaardsnummer
                                ? lamdaDataFromApi?.eiendomsInformasjon
                                    ?.kommune_info?.gaardsnummer
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Bruksnummer</p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.kommune_info?.bruksnummer
                                ? lamdaDataFromApi?.eiendomsInformasjon
                                    ?.kommune_info?.bruksnummer
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Seksjonsnummer
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.kommune_info?.seksjonsnr
                                ? lamdaDataFromApi?.eiendomsInformasjon
                                    ?.kommune_info?.seksjonsnr
                                : "-"}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Fylke</p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .municipality?.regionName
                                ? CadastreDataFromApi?.cadastreApi?.response
                                    ?.item.municipality?.regionName
                                : "-"}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Eiendomsstatus
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() => toggleDropdown("Eiendomsstatus")}
                            />
                            {dropdownState.Eiendomsstatus && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Kan selges</p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .canBeSold === true ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .canBeSold === "Ja" ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Kan belånes</p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .canBeMortgaged === true ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .canBeMortgaged === "Ja" ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Har bygning</p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasBuilding === true ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasBuilding === "Ja" ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Har fritidsbolig
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasHolidayHome === true ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasHolidayHome === "Ja" ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Har bolig</p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasHousing === true ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasHousing === "Ja" ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Parkeringsinformasjon
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() =>
                                toggleDropdown("Parkeringsinformasjon")
                              }
                            />
                            {dropdownState.Parkeringsinformasjon && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Parkering reservert plass
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {askData?.bya_calculations?.results?.parking
                                ?.required_spaces ? (
                                <>
                                  {
                                    askData?.bya_calculations?.results?.parking
                                      ?.required_spaces
                                  }{" "}
                                  stk
                                </>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Parkering område per plass
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {askData?.bya_calculations?.results?.parking
                                ?.area_per_space ? (
                                <>
                                  {
                                    askData?.bya_calculations?.results?.parking
                                      ?.area_per_space
                                  }{" "}
                                  m<sup>2</sup>
                                </>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Totalt parkeringsområde
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {askData?.bya_calculations?.results?.parking
                                ?.total_parking_area ? (
                                <>
                                  {
                                    askData?.bya_calculations?.results?.parking
                                      ?.total_parking_area
                                  }{" "}
                                  m<sup>2</sup>
                                </>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Parkering er usikker
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {askData?.bya_calculations?.results?.parking
                                ?.is_uncertain === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Ytterligere eiendomsforhold
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() =>
                                toggleDropdown("YtterligereEiendomsforhold")
                              }
                            />
                            {dropdownState.YtterligereEiendomsforhold && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Har forurensning
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasSoilContamination === "Ja" ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasSoilContamination === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Har aktive festegrunner
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasActiveLeasedLand === "Ja" ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .hasActiveLeasedLand === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Inngår i samlet eiendom
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .includedInTotalRealEstate === "Ja" ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .includedInTotalRealEstate === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Kulturminner registrert
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.kulturminner_registrert === "Ja" ||
                              lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.kulturminner_registrert === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Grunnforurensning
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.grunnforurensning === "Ja" ||
                              lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.grunnforurensning === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4">
                        <h2 className="text-black text-lg font-semibold flex items-center gap-2">
                          Spesielle registreringer
                          <div className="relative">
                            <Image
                              fetchPriority="auto"
                              src={Ic_info_circle}
                              alt="info"
                              className="notShow cursor-pointer"
                              onClick={() =>
                                toggleDropdown("SpesielleRegistreringer")
                              }
                            />
                            {dropdownState.SpesielleRegistreringer && (
                              <div
                                className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-72 dropdown-arrow"
                                style={{
                                  boxShadow:
                                    "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                                  zIndex: 999999999,
                                  transform: "translateX(-50%)",
                                  left: "50%",
                                }}
                                ref={dropdownRef}
                              >
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the indo.
                              </div>
                            )}
                          </div>
                        </h2>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Sammenslåtte tomter
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {CadastreDataFromApi?.cadastreApi?.response?.item
                                .numberOfPlots === "Ja" ||
                              CadastreDataFromApi?.cadastreApi?.response?.item
                                .numberOfPlots === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Tinglyst</p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.tinglyst === "Ja" ||
                              lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.tinglyst === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">Ugyldig</p>
                            <h5 className="text-base text-black font-medium">
                              <Image
                                fetchPriority="auto"
                                src={Ic_check}
                                alt="check"
                              />
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Oppmåling ikke fullført
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.oppmaling_ikke_fullfort === "Ja" ||
                              lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.oppmaling_ikke_fullfort === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Mangler grenseoppmerking
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.mangler_grensepunktmerking === "Ja" ||
                              lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.mangler_grensepunktmerking === true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm text-grayText">
                              Under sammenslåing
                            </p>
                            <h5 className="text-base text-black font-medium">
                              {lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.under_sammenslaing === "Ja" ||
                              (lamdaDataFromApi?.eiendomsInformasjon?.status
                                ?.under_sammenslaing ===
                                "Ja") ===
                                true ? (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_check}
                                  alt="check"
                                />
                              ) : (
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_x_close}
                                  alt="check"
                                />
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[12px] overflow-hidden w-[407px]">
                      <GoogleMapComponent
                        coordinates={
                          lamdaDataFromApi?.coordinates?.convertedCoordinates
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-[44px]">
                <div className="flex border border-gray3 rounded-lg w-max bg-gray3 p-[6px]">
                  {plotTabs.map((tab: any) => (
                    <button
                      key={tab.id}
                      onClick={() => setPlotActiveTab(tab.id)}
                      className={`px-4 py-2 text-base transition-colors duration-300 flex items-center gap-2 ${
                        PlotActiveTab === tab.id
                          ? "bg-white font-medium text-[#7839EE]"
                          : "text-black"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="pt-8">
                  {PlotActiveTab === "Regulering" && (
                    <>
                      {loadingLamdaData ? (
                        <Loader />
                      ) : (
                        <>
                          <div className="relative">
                            {loadingAdditionalData ? (
                              <Loading />
                            ) : (
                              <div className="flex gap-[60px]">
                                <div className="relative w-1/2">
                                  <div>
                                    <div className="flex justify-between items-center mb-6">
                                      <h2 className="text-black text-2xl font-semibold">
                                        Reguleringsplan
                                      </h2>
                                      <Image
                                        fetchPriority="auto"
                                        src={Ic_generelt}
                                        alt="image"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                      <>
                                        {askData &&
                                          askData?.conclusion?.map(
                                            (a: any, index: number) => (
                                              <div
                                                className="flex items-start gap-3 text-secondary text-base"
                                                key={index}
                                              >
                                                <Image
                                                  fetchPriority="auto"
                                                  src={Ic_check_true}
                                                  alt="image"
                                                />
                                                <span>{a}</span>
                                              </div>
                                            )
                                          )}
                                      </>
                                    </div>
                                  </div>
                                  <div className="w-full flex flex-col gap-8 items-center mt-[55px]">
                                    <div className="rounded-[12px] overflow-hidden w-full relative border border-[#7D89B0] h-[590px]">
                                      {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
                                          <div className="spinner-border animate-spin border-t-4 border-b-4 border-blue-500 w-12 h-12 border-solid rounded-full"></div>
                                        </div>
                                      )}
                                      <img
                                        src={selectedImage?.src}
                                        alt={selectedImage?.alt}
                                        className="h-full w-full"
                                        onLoad={() => setLoading(false)}
                                        onError={() => setLoading(false)}
                                      />
                                      <div
                                        className="absolute top-0 left-[4px] flex items-center justify-center h-full"
                                        style={{
                                          zIndex: 99999,
                                        }}
                                      >
                                        <div
                                          className={`bg-white h-[44px] w-[44px] rounded-full flex items-center justify-center ${selectedImage?.id === images[0]?.id ? "opacity-50" : "opacity-100"}`}
                                          style={{
                                            boxShadow:
                                              "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                                          }}
                                          onClick={() => {
                                            if (
                                              selectedImage?.id !==
                                              images[0]?.id
                                            ) {
                                              const currentIndex =
                                                images.findIndex(
                                                  (img) =>
                                                    img.id === selectedImage.id
                                                );
                                              setLoading(true);

                                              const nextIndex =
                                                currentIndex - 1;
                                              if (nextIndex >= 0) {
                                                setSelectedImage(
                                                  images[nextIndex]
                                                );
                                                handleScrollUp();
                                              }
                                            }
                                          }}
                                        >
                                          <Image
                                            fetchPriority="auto"
                                            src={Ic_chevron_right}
                                            alt="arrow"
                                            className={`${selectedImage?.id !== images[0]?.id && "cursor-pointer"} rotate-180`}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        className={`absolute bottom-0 right-[4px] flex items-center justify-center h-full`}
                                        style={{
                                          zIndex: 99999,
                                        }}
                                      >
                                        <div
                                          className={`bg-white h-[44px] w-[44px] rounded-full flex items-center justify-center ${selectedImage?.id === images[images.length - 1]?.id ? "opacity-50" : "opacity-100"}`}
                                          style={{
                                            boxShadow:
                                              "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                                          }}
                                          onClick={() => {
                                            if (
                                              selectedImage?.id !==
                                              images[images.length - 1]?.id
                                            ) {
                                              const currentIndex =
                                                images.findIndex(
                                                  (img) =>
                                                    img.id === selectedImage.id
                                                );
                                              setLoading(true);

                                              const nextIndex =
                                                currentIndex + 1;
                                              if (nextIndex < images.length) {
                                                setSelectedImage(
                                                  images[nextIndex]
                                                );
                                              }
                                              handleScrollDown();
                                            }
                                          }}
                                        >
                                          <Image
                                            fetchPriority="auto"
                                            src={Ic_chevron_right}
                                            alt="arrow"
                                            className={`${selectedImage?.id !== images[images.length - 1]?.id && "cursor-pointer"}`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative w-full flex justify-center">
                                      <div
                                        className="gap-8 flex overflow-x-auto overFlowScrollHidden"
                                        ref={scrollContainerRef}
                                      >
                                        {images.map((image, index) => (
                                          <div
                                            className="relative min-w-[90px] max-w-[90px]"
                                            key={index}
                                          >
                                            <img
                                              src={image.src}
                                              alt={image.alt}
                                              className={`h-[90px] w-full rounded-[12px] cursor-pointer ${selectedImage?.id === image?.id ? "border-2 border-primary" : "border border-[#7D89B033]"}`}
                                              style={{
                                                zIndex: 999,
                                              }}
                                              onClick={() =>
                                                handleImageClick(image)
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      {images.length > 5 && (
                                        <div
                                          className="absolute top-0 right-0 h-[90px] w-[90px]"
                                          style={{
                                            zIndex: 9999,
                                            background:
                                              "linear-gradient(-90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 90.63%)",
                                          }}
                                        ></div>
                                      )}
                                      {images.length > 5 && (
                                        <div
                                          className="absolute top-0 left-0 h-[90px] w-[90px]"
                                          style={{
                                            zIndex: 9999,
                                            background:
                                              "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 90.63%)",
                                          }}
                                        ></div>
                                      )}
                                      {images.length > 5 && (
                                        <div
                                          className="absolute top-0 left-0 flex items-center justify-center h-full"
                                          style={{
                                            zIndex: 99999,
                                          }}
                                        >
                                          <Image
                                            fetchPriority="auto"
                                            src={Ic_chevron_right}
                                            alt="arrow"
                                            className={`${selectedImage?.id !== images[0]?.id ? "cursor-pointer opacity-100" : "opacity-50"} rotate-180`}
                                            onClick={() => {
                                              if (
                                                selectedImage?.id !==
                                                images[0]?.id
                                              ) {
                                                const currentIndex =
                                                  images.findIndex(
                                                    (img) =>
                                                      img.id ===
                                                      selectedImage.id
                                                  );
                                                setLoading(true);

                                                const nextIndex =
                                                  currentIndex - 1;
                                                if (nextIndex >= 0) {
                                                  setSelectedImage(
                                                    images[nextIndex]
                                                  );
                                                  handleScrollUp();
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                      )}
                                      {images.length > 5 && (
                                        <div
                                          className="absolute top-0 right-0 flex items-center justify-center h-full"
                                          style={{
                                            zIndex: 99999,
                                          }}
                                        >
                                          <Image
                                            fetchPriority="auto"
                                            src={Ic_chevron_right}
                                            alt="arrow"
                                            className={`${selectedImage?.id !== images[images.length - 1]?.id ? "cursor-pointer opacity-100" : "opacity-50"}`}
                                            onClick={() => {
                                              if (
                                                selectedImage?.id !==
                                                images[images.length - 1]?.id
                                              ) {
                                                const currentIndex =
                                                  images.findIndex(
                                                    (img) =>
                                                      img.id ===
                                                      selectedImage.id
                                                  );
                                                setLoading(true);

                                                const nextIndex =
                                                  currentIndex + 1;
                                                if (nextIndex < images.length) {
                                                  setSelectedImage(
                                                    images[nextIndex]
                                                  );
                                                }
                                                handleScrollDown();
                                              }
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="relative w-1/2">
                                  <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-black text-2xl font-semibold">
                                      Kommuneplan for Asker
                                    </h2>
                                    <Image
                                      fetchPriority="auto"
                                      src={Ic_generelt}
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    {askData &&
                                      askData?.applicable_rules?.map(
                                        (a: any, index: number) => (
                                          <div
                                            className="flex items-start gap-3 text-secondary text-base"
                                            key={index}
                                          >
                                            <Image
                                              fetchPriority="auto"
                                              src={Ic_check_true}
                                              alt="image"
                                            />
                                            <div>
                                              {a.rule}{" "}
                                              <span className="text-primary font-bold">
                                                {a.section}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {PlotActiveTab === "Eierinformasjon" && (
                    <Eierinformasjon data={lamdaDataFromApi?.latestOwnership} />
                  )}
                  {PlotActiveTab === "Bygninger" && (
                    <>
                      {loadingLamdaData ? (
                        <div className="relative">
                          <Loading />
                        </div>
                      ) : (
                        <>
                          {CadastreDataFromApi?.buildingsApi?.response?.items
                            .length > 0 ? (
                            <>
                              <div className="grid grid-cols-4 gap-6 mb-16">
                                {CadastreDataFromApi?.buildingsApi?.response?.items.map(
                                  (item: any, index: number) => (
                                    <div
                                      className="bg-gray3 rounded-[8px] p-5 flex flex-col gap-4"
                                      key={index}
                                    >
                                      <div className="flex flex-col gap-4">
                                        <div className="w-full h-[177px] rounded-[8px]">
                                          <GoogleMapNearByComponent
                                            coordinates={
                                              item?.position?.geometry
                                                ?.coordinates
                                            }
                                          />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <h3 className="text-black font-semibold text-lg one_line_elipse">
                                            {item?.typeOfBuilding?.text}
                                          </h3>
                                          <p className="text-sm text-grayText">
                                            {item?.buildingStatus?.text}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-[2px]">
                                        <div className="text-grayText text-sm">
                                          Antall etasjer:{" "}
                                          <span className="text-black font-medium text-base">
                                            {item?.numberOfFloors}
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Bruksareal:{" "}
                                          <span className="text-black font-medium text-base">
                                            {item?.totalFloorSpace} m
                                            <sup>2</sup>
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Rammetillatelse:{" "}
                                          <span className="text-black font-medium text-base">
                                            {formatDateToDDMMYYYY(
                                              item?.registeredApprovedDate
                                                ?.timestamp
                                            )}
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Igangsettelse:{" "}
                                          <span className="text-black font-medium text-base">
                                            {formatDateToDDMMYYYY(
                                              item?.approvedDate?.timestamp
                                            )}
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Midleritidg bruk:{" "}
                                          <span className="text-black font-medium text-base">
                                            {formatDateToDDMMYYYY(
                                              item?.usedDate?.timestamp
                                            )}
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Ferdigattest:{" "}
                                          <span className="text-black font-medium text-base">
                                            {formatDateToDDMMYYYY(
                                              item?.buildingStatusHistory[0]
                                                ?.buildingStatusRegisteredDate
                                                ?.timestamp
                                            )}
                                          </span>
                                        </div>
                                        <div className="text-grayText text-sm">
                                          Bebygd areal (BYA):{" "}
                                          <span className="text-black font-medium text-base">
                                            {item?.builtUpArea} m<sup>2</sup>
                                          </span>
                                        </div>
                                        <div className="text-grayText font-bold text-sm">
                                          Bygningen utgjør{" "}
                                          {(() => {
                                            const builtUpArea =
                                              item?.builtUpArea;
                                            const totalAllowedBya =
                                              askData?.bya_calculations?.results
                                                ?.total_allowed_bya;

                                            if (
                                              builtUpArea &&
                                              totalAllowedBya > 0
                                            ) {
                                              return `${(
                                                (builtUpArea /
                                                  totalAllowedBya) *
                                                100
                                              ).toFixed(2)} %`;
                                            }

                                            return "0";
                                          })()}{" "}
                                          av BYA
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          ) : (
                            <p>Ingen bygningsdata funnet.</p>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {PlotActiveTab === "Plandokumenter" && (
                    <>
                      {loadingLamdaData ? (
                        <div className="relative">
                          <Loading />
                        </div>
                      ) : (
                        <>
                          {isValidBBOX && featureInfo && (
                            <div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: featureInfo,
                                }}
                                style={{
                                  width: "100%",
                                  height: "820px",
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={`${activeTab === "house" ? "block" : "hidden"}`}>
              <HouseDetailPage />
            </div>
          </div>
          {!loginUser && (
            <div
              className="absolute top-0 h-full w-full left-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
              }}
            ></div>
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
                delete updatedQuery.propertyId;
                delete updatedQuery.husodellId;
                delete updatedQuery.leadId;
                delete updatedQuery.emptyPlot;
                delete updatedQuery.empty;

                router.replace({ pathname, query: updatedQuery }, undefined, {
                  shallow: true,
                });
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
              }}
            />
            <Button
              text="Neste: Tilpass"
              className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                if (!loadingLamdaData && !loadingAdditionalData) {
                  handleNext();
                }
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default HouseModelSingleProperty;

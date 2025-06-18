import React, { useEffect, useRef, useState } from "react";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Image from "next/image";
import Ic_check from "@/public/images/Ic_check.svg";
import Ic_x_close from "@/public/images/Ic_x_close.svg";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_right from "@/public/images/Ic_chevron_right.svg";
import GoogleMapNearByComponent from "@/components/Ui/map/nearbyBuiildingMap";
import Eierinformasjon from "@/components/Ui/regulationChart/Eierinformasjon";
import { Building, ClipboardList, FileText, FileUser } from "lucide-react";
import NorkartMap from "@/components/map";

const PlotDetailPage: React.FC<{
  loadingAdditionalData: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
}> = ({
  lamdaDataFromApi,
  loadingAdditionalData,
  askData,
  loadingLamdaData,
  CadastreDataFromApi,
}) => {
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

  const plotTabs: any = [
    { id: "Regulering", label: "Regulering", icon: <FileText /> },
    { id: "Eierinformasjon", label: "Eierinformasjon", icon: <FileUser /> },
    { id: "Bygninger", label: "Bygninger", icon: <Building /> },
    { id: "Plandokumenter", label: "Plandokumenter", icon: <ClipboardList /> },
  ];
  const [PlotActiveTab, setPlotActiveTab] = useState<string>(plotTabs[0].id);

  return (
    <>
      <div className="rounded-lg border border-[#EFF1F5] w-full">
        <div
          className="flex items-center justify-between gap-2 cursor-pointer p-4 md:p-5"
          onClick={toggleAccordion}
        >
          <h3 className="text-black text-lg md:text-xl desktop:text-2xl font-semibold">
            Eiendomsinformasjon
          </h3>
          {isOpen ? (
            <Image fetchPriority="auto" src={Ic_chevron_up} alt="arrow" />
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
          className={`${isOpen ? "block border-t border-[#EFF1F5] p-3.5 md:p-5" : "hidden"}`}
        >
          <div className="flex flex-col desktop:flex-row gap-4 lg:gap-6 justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 desktop:gap-6">
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
                  Tomteopplysninger
                  <div className="relative">
                    <Image
                      fetchPriority="auto"
                      src={Ic_info_circle}
                      alt="info"
                      className="notShow cursor-pointer"
                      onClick={() => toggleDropdown("Tomteopplysninger")}
                    />
                    {dropdownState.Tomteopplysninger && (
                      <div
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Areal beregnet
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.areal_beregnet ? (
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Etableringsårs dato
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.etableringsdato
                          ? formatDateToDDMMYYYY(
                              lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.etableringsdato
                            )
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Sist oppdatert
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.sist_oppdatert
                          ? formatDateToDDMMYYYY(
                              lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon?.sist_oppdatert.split(
                                "T"
                              )[0]
                            )
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Tomtens totale BYA
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Er registrert land
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Festenummer
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.festenummer
                          ? lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.festenummer
                          : "-"}
                      </h5>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
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
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">Kommune</p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {
                          CadastreDataFromApi?.presentationAddressApi?.response
                            ?.item?.municipality?.municipalityName
                        }
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Kommunenummer
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.kommunenr
                          ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                              ?.kommunenr
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Gårdsnummer
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.gaardsnummer
                          ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                              ?.gaardsnummer
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Bruksnummer
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.bruksnummer
                          ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                              ?.bruksnummer
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Seksjonsnummer
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                          ?.seksjonsnr
                          ? lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                              ?.seksjonsnr
                          : "-"}
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">Fylke</p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {CadastreDataFromApi?.cadastreApi?.response?.item
                          .municipality?.regionName
                          ? CadastreDataFromApi?.cadastreApi?.response?.item
                              .municipality?.regionName
                          : "-"}
                      </h5>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
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
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Kan selges
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Kan belånes
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Har bygning
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Har fritidsbolig
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Har bolig
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
                  Parkeringsinformasjon
                  <div className="relative">
                    <Image
                      fetchPriority="auto"
                      src={Ic_info_circle}
                      alt="info"
                      className="notShow cursor-pointer"
                      onClick={() => toggleDropdown("Parkeringsinformasjon")}
                    />
                    {dropdownState.Parkeringsinformasjon && (
                      <div
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Parkering reservert plass
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Parkering område per plass
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Totalt parkeringsområde
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Parkering er usikker
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
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
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Har forurensning
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Har aktive festegrunner
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Inngår i samlet eiendom
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Kulturminner registrert
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Grunnforurensning
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray3 rounded-lg p-3.5 md:p-5 flex flex-col gap-3 md:gap-4">
                <h2 className="text-black text-sm md:text-base desktop:text-lg font-semibold flex items-center gap-1 md:gap-2">
                  Spesielle registreringer
                  <div className="relative">
                    <Image
                      fetchPriority="auto"
                      src={Ic_info_circle}
                      alt="info"
                      className="notShow cursor-pointer"
                      onClick={() => toggleDropdown("SpesielleRegistreringer")}
                    />
                    {dropdownState.SpesielleRegistreringer && (
                      <div
                        className="flex flex-col gap-2 absolute text-grayText font-normal text-sm p-3 rounded-[8px] bg-white w-48 dropdown-arrow"
                        style={{
                          boxShadow:
                            "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
                          zIndex: 999999999,
                          transform: "translateX(-50%)",
                          left: "50%",
                        }}
                        ref={dropdownRef}
                      >
                        Info kommer
                      </div>
                    )}
                  </div>
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Sammenslåtte tomter
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">Tinglyst</p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        {lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.tinglyst === "Ja" ||
                        lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.tinglyst === true ? (
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">Ugyldig</p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
                        <Image
                          fetchPriority="auto"
                          src={Ic_check}
                          alt="check"
                        />
                      </h5>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Oppmåling ikke fullført
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Mangler grenseoppmerking
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-grayText">
                      Under sammenslåing
                    </p>
                    {loadingAdditionalData ? (
                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-sm md:text-base text-black font-medium">
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
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg sm:rounded-[12px] overflow-hidden w-full h-[300px] desktop:h-auto desktop:w-[407px]">
              {loadingAdditionalData ? (
                <div className="w-full h-full rounded-lg custom-shimmer"></div>
              ) : (
                <>
                  {lamdaDataFromApi?.coordinates?.convertedCoordinates && (
                    <NorkartMap
                      coordinates={
                        lamdaDataFromApi?.coordinates?.convertedCoordinates
                      }
                      MAX_ZOOM={18}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-[44px]">
        <div className="w-full md:w-max">
          <div className="flex flex-nowrap border border-gray3 rounded-lg bg-gray3 p-[6px] mb-6 md:mb-[38px] overflow-x-auto overFlowScrollHidden">
            {plotTabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setPlotActiveTab(tab.id)}
                className={`min-w-max whitespace-nowrap px-2 lg:px-4 py-2 text-sm lg:text-base transition-colors duration-300 flex items-center gap-2 ${
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
        </div>
        <div>
          {PlotActiveTab === "Regulering" && (
            <>
              <div className="flex flex-col md:flex-row gap-5 lg:gap-9 desktop:gap-[60px]">
                <div className="relative w-full md:w-1/2">
                  <div>
                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                      <h2 className="text-black text-base md:text-lg lg:text-xl desktop:text-2xl font-semibold">
                        Reguleringsplan
                      </h2>
                      <Image
                        fetchPriority="auto"
                        src={Ic_generelt}
                        alt="image"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3">
                      <>
                        {loadingAdditionalData ? (
                          <>
                            <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                            <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                            <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                          </>
                        ) : (
                          <>
                            {askData &&
                              askData?.conclusion?.map(
                                (a: any, index: number) => (
                                  <div
                                    className="flex items-start gap-2 md:gap-3 text-secondary text-sm lg:text-base"
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
                        )}
                      </>
                    </div>
                  </div>
                  {loadingAdditionalData ? (
                    <div className="w-full h-[400px] lg:h-[590px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <div className="w-full flex flex-col gap-5 md:gap-6 lg:gap-8 items-center mt-[36px] md:mt-[46px] lg:mt-[55px]">
                      <div className="rounded-[12px] overflow-hidden w-full relative border border-[#7D89B0] h-[400px] lg:h-[590px]">
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
                            className={`bg-white h-[36px] w-[36px] md:h-[44px] md:w-[44px] rounded-full flex items-center justify-center ${selectedImage?.id === images[0]?.id ? "opacity-50" : "opacity-100"}`}
                            style={{
                              boxShadow:
                                "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                            }}
                            onClick={() => {
                              if (selectedImage?.id !== images[0]?.id) {
                                const currentIndex = images.findIndex(
                                  (img) => img.id === selectedImage.id
                                );
                                setLoading(true);

                                const nextIndex = currentIndex - 1;
                                if (nextIndex >= 0) {
                                  setSelectedImage(images[nextIndex]);
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
                            className={`bg-white h-[36px] w-[36px] md:h-[44px] md:w-[44px] rounded-full flex items-center justify-center ${selectedImage?.id === images[images.length - 1]?.id ? "opacity-50" : "opacity-100"}`}
                            style={{
                              boxShadow:
                                "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                            }}
                            onClick={() => {
                              if (
                                selectedImage?.id !==
                                images[images.length - 1]?.id
                              ) {
                                const currentIndex = images.findIndex(
                                  (img) => img.id === selectedImage.id
                                );
                                setLoading(true);

                                const nextIndex = currentIndex + 1;
                                if (nextIndex < images.length) {
                                  setSelectedImage(images[nextIndex]);
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
                          className="gap-4 md:gap-6 lg:gap-8 flex overflow-x-auto overFlowScrollHidden"
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
                                onClick={() => handleImageClick(image)}
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
                                if (selectedImage?.id !== images[0]?.id) {
                                  const currentIndex = images.findIndex(
                                    (img) => img.id === selectedImage.id
                                  );
                                  setLoading(true);

                                  const nextIndex = currentIndex - 1;
                                  if (nextIndex >= 0) {
                                    setSelectedImage(images[nextIndex]);
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
                                  const currentIndex = images.findIndex(
                                    (img) => img.id === selectedImage.id
                                  );
                                  setLoading(true);

                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < images.length) {
                                    setSelectedImage(images[nextIndex]);
                                  }
                                  handleScrollDown();
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative w-full md:w-1/2">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h2 className="text-black text-base md:text-lg lg:text-xl desktop:text-2xl font-semibold">
                      Kommuneplan for{" "}
                      {
                        CadastreDataFromApi?.presentationAddressApi?.response
                          ?.item?.municipality?.municipalityName
                      }
                    </h2>
                    <Image fetchPriority="auto" src={Ic_generelt} alt="image" />
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3">
                    {loadingAdditionalData ? (
                      <>
                        <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                        <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                        <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                        <div className="w-full h-[25px] rounded-lg custom-shimmer"></div>
                      </>
                    ) : (
                      <>
                        {askData &&
                          askData?.applicable_rules?.map(
                            (a: any, index: number) => (
                              <div
                                className="flex items-start gap-2 md:gap-3 text-secondary text-sm lg:text-base"
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {PlotActiveTab === "Eierinformasjon" && (
            <Eierinformasjon
              data={lamdaDataFromApi?.latestOwnership}
              loadingAdditionalData={loadingLamdaData}
            />
          )}
          {PlotActiveTab === "Bygninger" && (
            <>
              {CadastreDataFromApi?.buildingsApi?.response?.items.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {loadingAdditionalData ? (
                      <div className="w-full h-[300px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <>
                        {CadastreDataFromApi?.buildingsApi?.response?.items.map(
                          (item: any, index: number) => (
                            <div
                              className="bg-gray3 rounded-[8px] p-4 md:p-5 flex flex-col gap-4"
                              key={index}
                            >
                              <div className="flex flex-col gap-4">
                                <div className="w-full h-[177px] rounded-[8px]">
                                  <GoogleMapNearByComponent
                                    coordinates={
                                      item?.position?.geometry?.coordinates
                                    }
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h3 className="text-black font-semibold text-sm md:text-base desktop:text-lg one_line_elipse">
                                    {item?.typeOfBuilding?.text}
                                  </h3>
                                  <p className="text-xs md:text-sm text-grayText">
                                    {item?.buildingStatus?.text}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-[2px]">
                                <div className="text-grayText text-xs md:text-sm">
                                  Antall etasjer:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {item?.numberOfFloors}
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  Bruksareal:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {item?.totalFloorSpace} m<sup>2</sup>
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  Rammetillatelse:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {formatDateToDDMMYYYY(
                                      item?.registeredApprovedDate?.timestamp
                                    )}
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  Igangsettelse:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {formatDateToDDMMYYYY(
                                      item?.approvedDate?.timestamp
                                    )}
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  Midleritidg bruk:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {formatDateToDDMMYYYY(
                                      item?.usedDate?.timestamp
                                    )}
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  Ferdigattest:{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {formatDateToDDMMYYYY(
                                      item?.buildingStatusHistory[0]
                                        ?.buildingStatusRegisteredDate
                                        ?.timestamp
                                    )}
                                  </span>
                                </div>
                                <div className="text-grayText text-xs md:text-sm">
                                  BRA-e (eksternt bruksareal):{" "}
                                  <span className="text-black font-medium text-sm md:text-base">
                                    {item?.builtUpArea} m<sup>2</sup>
                                  </span>
                                </div>
                                <div className="text-grayText font-bold text-sm">
                                  Bygningen utgjør{" "}
                                  {(() => {
                                    const builtUpArea = item?.builtUpArea;
                                    const totalAllowedBya =
                                      askData?.bya_calculations?.results
                                        ?.total_allowed_bya;

                                    if (builtUpArea && totalAllowedBya > 0) {
                                      return `${(
                                        (builtUpArea / totalAllowedBya) *
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
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p>Ingen bygningsdata funnet.</p>
              )}
            </>
          )}
          {PlotActiveTab === "Plandokumenter" && (
            <>
              {isValidBBOX && featureInfo && (
                <div>
                  {loadingAdditionalData ? (
                    <div className="w-full h-[600px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: featureInfo,
                      }}
                      style={{
                        width: "100%",
                        height: "820px",
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PlotDetailPage;

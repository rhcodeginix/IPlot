import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import Ic_garaje from "@/public/images/Ic_garaje.svg";
import Ic_house from "@/public/images/Ic_house.svg";
import Ic_ofc from "@/public/images/Ic_ofc.svg";
import Ic_pergola from "@/public/images/Ic_pergola.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_cabin from "@/public/images/Ic_cabin.svg";
import Button from "@/components/common/button";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Loader from "@/components/Loader";
import LoginForm from "../login/loginForm";
import { useRouter } from "next/router";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import Link from "next/link";
import PropertyDetail from "@/components/Ui/stepperUi/propertyDetail";
import PlotDetailPage from "@/components/Ui/plotDetail";
import VippsButton from "@/components/vipps";

const buildOption: any = [
  {
    icon: Ic_garaje,
    name: "Garasje eller carport",
  },
  {
    icon: Ic_house,
    name: "Hagestue, bod eller drivhus",
  },
  {
    icon: Ic_ofc,
    name: "Verksted, atelier eller kontor",
  },
  {
    icon: Ic_pergola,
    name: "Frittliggende pergola",
  },
  {
    icon: Ic_cabin,
    name: "Hytte, fritidsbolig eller anneks",
  },
];

const Tomt: React.FC<{
  loginUser: any;
  loadingAdditionalData: any;
  handleNext: any;
  lamdaDataFromApi: any;
  isPopupOpen: any;
  setIsPopupOpen: any;
  setIsCall: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  loadingAdditionalData,
  askData,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  loadingLamdaData,
  CadastreDataFromApi,
}) => {
  const router = useRouter();
  const popup = useRef<HTMLDivElement>(null);

  const [loginPopup, setLoginPopup] = useState(false);

  const [isBuild, setIsBuild] = useState(false);

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}&login_popup=true`);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsBuild(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  const [selectedBuildIndex, setSelectedBuildIndex] = useState<number | null>(
    null
  );

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
            <span className="text-secondary2 text-xs md:text-sm">Tomt</span>
          </div>
          <PropertyDetail
            CadastreDataFromApi={CadastreDataFromApi}
            lamdaDataFromApi={lamdaDataFromApi}
          />
        </SideSpaceContainer>
      </div>
      <PropertyDetails
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
        loading={loadingLamdaData}
      />

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
            <PlotDetailPage
              lamdaDataFromApi={lamdaDataFromApi}
              loadingAdditionalData={loadingAdditionalData}
              askData={askData}
              loadingLamdaData={loadingLamdaData}
              CadastreDataFromApi={CadastreDataFromApi}
            />
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
        className="sticky bottom-0 bg-white py-4"
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
              className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              path="/"
            />
            <Button
              text="Neste: Se hva du kan bygge"
              className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                if (!loadingLamdaData && !loadingAdditionalData) {
                  if (
                    CadastreDataFromApi?.buildingsApi?.response?.items?.length >
                    0
                  ) {
                    setIsBuild(true);
                  } else {
                    handleNext();
                    router.push(`${router.asPath}`);
                  }
                }
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
      {isPopupOpen && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black bg-opacity-50"
          style={{
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px] relative"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <button
              className="absolute top-2 md:top-3 right-0 md:right-3"
              onClick={() => {
                setIsPopupOpen(false);
                router.push("/");
              }}
            >
              <Image src={Ic_close} alt="close" />
            </button>
            <div className="flex justify-center w-full mb-[46px]">
              <Image src={Img_vipps_login} alt="vipps login" />
            </div>
            <h2 className="text-black text-[24px] md:text-[32px] desktop:text-[40px] font-extrabold mb-2 text-center">
              Din <span className="text-primary">Min</span>Tomt-profil
            </h2>
            <p className="text-black text-xs md:text-sm desktop:text-base text-center mb-4">
              Logg inn for å få tilgang til alt{" "}
              <span className="font-bold">MinTomt x Fjellheimhytta</span> har å
              by på.
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({}) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex justify-end">
                      <VippsButton />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-secondary text-sm md:text-base mt-[46px] text-center">
              Når du går videre, aksepterer du <br /> våre vilkår for{" "}
              <a
                className="underline"
                target="__blank"
                href="https://mintomt.no/vilkaar-personvern/brukervilkaar"
              >
                bruk
              </a>{" "}
              og{" "}
              <a
                className="underline"
                target="__blank"
                href="https://mintomt.no/vilkaar-personvern/personvaern"
              >
                personvern
              </a>
            </p>
          </div>
        </div>
      )}

      {loginPopup && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{ zIndex: 9999999 }}
        >
          <LoginForm
            path={`${router.pathname}?${queryString}`}
            setLoginPopup={setLoginPopup}
            setIsCall={setIsCall}
          />
        </div>
      )}

      {isBuild && !loadingAdditionalData && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-[#00000080]"
          style={{
            zIndex: 999999999,
          }}
        >
          <div
            className="bg-white rounded-[8px] w-[90%] laptop:w-[80%] relative max-h-[90%] sm:max-h-[80%] overflow-y-auto"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
            ref={popup}
          >
            <h2 className="text-black text-lg md:text-xl desktop:text-2xl font-semibold mb-4 md:mb-6 text-center pt-4 md:pt-6 px-4 md:px-6">
              Hva vil du bygge?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6 desktop:mb-[40px] px-4 md:px-6">
              {buildOption.map((build: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedBuildIndex(index)}
                    className={`rounded-[8px] p-3 md:p-5 flex flex-col gap-2 md:gap-4 cursor-pointer border-2 ${
                      selectedBuildIndex === index
                        ? "border-primary bg-lightPurple"
                        : "border-gray bg-gray3"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-[40px] md:w-[60px] h-[40px] md:h-[60px] rounded-full bg-lightPurple customShadow flex items-center justify-center">
                        <Image
                          fetchPriority="auto"
                          src={build.icon}
                          alt="garaje"
                        />
                      </div>
                      <h5 className="text-black text-sm md:text-base desktop:text-lg font-semibold">
                        {build.name}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="flex items-center gap-1">
                        <p className="text-grayText text-xs md:text-sm">
                          BYA Inntil:
                        </p>
                        <h6 className="text-black font-medium text-sm md:text-base">
                          {(() => {
                            const data =
                              CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                                (item: any) => item?.builtUpArea
                              ) ?? [];

                            if (
                              data.length >= 2 &&
                              askData?.bya_calculations?.results
                                ?.total_allowed_bya
                            ) {
                              const totalData = data.reduce(
                                (acc: number, currentValue: number) =>
                                  acc + currentValue,
                                0
                              );

                              return (
                                <>
                                  {(
                                    askData?.bya_calculations?.results
                                      ?.total_allowed_bya - totalData
                                  ).toFixed(2)}
                                  m<sup>2</sup>
                                </>
                              );
                            } else {
                              return "0";
                            }
                          })()}
                        </h6>
                      </div>
                      <div className="text-grayText text-xs sm:text-sm font-bold">
                        Du har{" "}
                        {(() => {
                          const data =
                            CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                              (item: any) => item?.builtUpArea
                            ) ?? [];

                          if (
                            data.length >= 2 &&
                            askData?.bya_calculations?.results
                              ?.total_allowed_bya
                          ) {
                            const totalData = data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            );

                            const result =
                              (totalData /
                                lamdaDataFromApi?.eiendomsInformasjon
                                  ?.basisInformasjon?.areal_beregnet) *
                              100;
                            const formattedResult: any = result.toFixed(2);

                            return `${(
                              askData?.bya_calculations?.input?.bya_percentage -
                              formattedResult
                            ).toFixed(2)} %`;
                          } else {
                            return "0";
                          }
                        })()}{" "}
                        tilgjengelig BYA
                      </div>
                    </div>
                    <Button
                      text="Velg"
                      className="border-2 border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white text-sm sm:text-base w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[40px]"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 justify-end sticky bottom-0 bg-white px-4 md:px-6 py-4 shadow-shadow1">
              <Button
                text="Tilbake"
                className="border-2 border-primary text-primary hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[40px]"
                onClick={() => setIsBuild(false)}
              />
              <Button
                text="Neste"
                className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                  router.push(`${router.asPath}`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tomt;

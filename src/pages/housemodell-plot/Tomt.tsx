import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import Button from "@/components/common/button";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Loader from "@/components/Loader";
import LoginForm from "../login/loginForm";
import { useRouter } from "next/router";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
import { Building2, House } from "lucide-react";
import HouseDetailPage from "@/components/Ui/houseDetail";
import PlotDetailPage from "@/components/Ui/plotDetail";
import VippsButton from "@/components/vipps";

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
  HouseModelData: any;
  supplierData: any;
  pris: any;
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
  HouseModelData,
  supplierData,
  pris,
}) => {
  const router = useRouter();
  const { homePage } = router.query;
  const { pathname, query } = router;
  const updatedQuery = { ...query };

  const [loginPopup, setLoginPopup] = useState(false);

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  // const [isLoginChecked, setIsLoginChecked] = useState(false);
  // const handleLoginCheckboxChange = () => {
  //   setIsLoginChecked(!isLoginChecked);
  // };

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

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  const tabs: any = [
    {
      id: "Eiendomsinformasjon",
      label: "Eiendomsinformasjon",
      icon: <Building2 className="w-4 h-4 lg:w-6 lg:h-6" />,
    },
    {
      id: `house`,
      label: `${HouseModelData?.Husdetaljer?.husmodell_name} fra ${supplierData?.company_name}`,
      icon: <House className="w-4 h-4 lg:w-6 lg:h-6" />,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex flex-wrap items-center gap-1 mb-6">
            <Link
              href={"/"}
              className="text-[#7839EE] text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            {!homePage && (
              <>
                <Link
                  href={"/"}
                  className="text-[#7839EE] text-xs md:text-sm font-medium"
                  onClick={() => {
                    delete updatedQuery.propertyId;
                    delete updatedQuery.husmodellId;
                    delete updatedQuery.leadId;
                    delete updatedQuery.emptyPlot;
                    delete updatedQuery.empty;

                    router.replace(
                      { pathname, query: updatedQuery },
                      undefined,
                      {
                        shallow: true,
                      }
                    );
                  }}
                >
                  Start med tomt og husmodell
                </Link>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              </>
            )}
            <span className="text-secondary2 text-xs md:text-sm">
              Husmodell og tomt
            </span>
          </div>
          <PropertyHouseDetails
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            supplierData={supplierData}
            pris={pris}
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
          <div className="flex flex-col items-start">
            <div className="w-full sm:w-max">
              <div className="flex flex-nowrap border border-gray3 rounded-lg bg-gray3 p-[6px] mb-6 md:mb-[38px] overflow-x-auto overFlowScrollHidden">
                {tabs.map((tab: any) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-max whitespace-nowrap px-2 lg:px-4 py-2 text-sm lg:text-base transition-colors duration-300 flex items-center gap-2 ${
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
            </div>

            <div
              className={`w-full ${activeTab === "Eiendomsinformasjon" ? "block" : "hidden"}`}
            >
              <PlotDetailPage
                lamdaDataFromApi={lamdaDataFromApi}
                loadingAdditionalData={loadingAdditionalData}
                askData={askData}
                loadingLamdaData={loadingLamdaData}
                CadastreDataFromApi={CadastreDataFromApi}
              />
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
        className="sticky bottom-0 bg-white py-4 md:py-6"
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
                delete updatedQuery.husmodellId;
                delete updatedQuery.leadId;
                delete updatedQuery.emptyPlot;
                delete updatedQuery.empty;

                router.replace({ pathname, query: updatedQuery }, undefined, {
                  shallow: true,
                });
              }}
            />
            <Button
              text="Neste: Tilpass"
              className="border border-greenBtn bg-greenBtn text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                if (!loadingLamdaData && !loadingAdditionalData) {
                  handleNext();
                }
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>

      {isPopupOpen && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <div className="flex justify-center w-full mb-[46px]">
              <Image src={Img_vipps_login} alt="vipps login" />
            </div>
            <h2 className="text-black text-[24px] md:text-[32px] desktop:text-[40px] font-extrabold mb-2 text-center">
              Din <span className="text-primary">Min</span>Tomt-profil
            </h2>
            <p className="text-black text-xs md:text-sm desktop:text-base text-center mb-4">
              Logg inn for å få tilgang til alt{" "}
              <span className="font-bold">MinTomt</span> har å by på.
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
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/brukervilkaar"
              >
                bruk
              </a>{" "}
              og{" "}
              <a
                className="underline"
                target="__blank"
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/personvaern"
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
    </div>
  );
};

export default Tomt;

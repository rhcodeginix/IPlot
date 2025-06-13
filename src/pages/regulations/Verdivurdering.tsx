import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Ic_close from "@/public/images/Ic_close.svg";
import Loader from "@/components/Loader";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Ic_contact2 from "@/public/images/Ic_contact2.svg";
import Ic_Info_gray from "@/public/images/Ic_Info_gray.svg";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import Modal from "@/components/common/modal";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";

const Verdivurdering: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  loading: any;
  supplierData: any;
}> = ({
  // handleNext,
  lamdaDataFromApi,
  askData,
  CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  loading,
  supplierData,
}) => {
  const router = useRouter();
  // const Husdetaljer = HouseModelData?.Husdetaljer;

  const { noPlot } = router.query;

  const validationSchema = Yup.object().shape({
    IsEie: Yup.boolean().nullable().required("This field is required"),
  });
  const [value, setValue] = useState<any>(null);

  const leadId = router.query["leadId"];

  const handleSubmit = async (values: any) => {
    if (values.helpWithFinancing === null) {
      return;
    }
    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          IsEie: values.IsEie,
          updatedAt: new Date(),
        });
        if (values.IsEie == true) {
          handlePopup();
          toast.success("Lead sent successfully.", { position: "top-right" });
        }
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handlePopup = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-lightBlue py-2 md:py-4">
            <SideSpaceContainer>
              <div className="flex items-center flex-wrap gap-1">
                <Link
                  href={"/"}
                  className="text-primary text-xs md:text-sm font-bold"
                >
                  Hjem
                </Link>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Hyttemodell
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 1;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Tilpass
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 2;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Tomt
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 3;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Tilbud
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 4;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Finansiering
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <span className="text-secondary2 text-xs md:text-sm">
                  Verdivurdering
                </span>
              </div>
              <div className="mt-4 md:mt-6">
                <PropertyHouseDetails
                  HouseModelData={HouseModelData}
                  lamdaDataFromApi={lamdaDataFromApi}
                  CadastreDataFromApi={CadastreDataFromApi}
                  supplierData={supplierData}
                />
              </div>
            </SideSpaceContainer>
          </div>
          {!noPlot && (
            <PropertyDetails
              askData={askData}
              CadastreDataFromApi={CadastreDataFromApi}
              lamdaDataFromApi={lamdaDataFromApi}
              HouseModelData={HouseModelData}
            />
          )}

          <div className="pt-6 pb-8 mb-12">
            <SideSpaceContainer>
              <div className="my-5 md:my-8">
                <Formik
                  initialValues={{
                    IsEie: null,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setTouched }) => {
                    if (values.IsEie === null) {
                      setTouched({ IsEie: true });
                    }
                    handleSubmit(values);
                  }}
                >
                  {({ values, setFieldValue, errors, touched }) => {
                    useEffect(() => {
                      (async () => {
                        try {
                          const docSnap = await getDoc(
                            doc(db, "leads", String(leadId))
                          );

                          if (docSnap.exists()) {
                            const data = docSnap.data();

                            if (data && data?.IsEie) {
                              setFieldValue("IsEie", data?.IsEie);
                            }
                          }
                        } catch (error) {
                          console.error("Error fetching IsEie status:", error);
                        }
                      })();
                    }, [leadId]);
                    return (
                      <Form>
                        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-[24px]">
                          <div className="w-full lg:w-[38%]">
                            <div className="rounded-lg p-3 md:p-5 bg-lightBlue">
                              <h3 className="text-black text-base md:text-xl desktop:text-lg font-semibold mb-3">
                                Vil du vite hva boligen er verdt?
                              </h3>
                              <p className="text-[#555D5C] text-xs md:text-sm mb-6">
                                Vi kobler deg med Eie{" "}
                                <span className="font-bold">
                                  Eiendomsmegling
                                </span>
                                , som kjenner {supplierData?.company_name} og
                                deres husmodeller. Du får en rask og
                                uforpliktende vurdering.
                              </p>
                              <div className="flex items-center gap-4">
                                <div
                                  onClick={() => {
                                    setFieldValue("IsEie", true);
                                    setValue(true);
                                  }}
                                  className={`cursor-pointer bg-white h-[40px] md:h-[48px] rounded-lg py-3 md:py-3.5 px-3 md:px-4 flex items-center justify-center w-1/2 text-xs md:text-sm text-black border-2 ${
                                    values.IsEie === true
                                      ? "border-primary font-semibold"
                                      : "border-transparent"
                                  }`}
                                >
                                  Få hjelp med finansiering
                                </div>
                                <div
                                  onClick={() => {
                                    setFieldValue("IsEie", false);
                                    setValue(false);
                                  }}
                                  className={`cursor-pointer bg-white h-[40px] md:h-[48px] rounded-lg py-3 md:py-3.5 px-3 md:px-4 flex items-center justify-center w-1/2 text-xs md:text-sm text-black border-2 ${
                                    values.IsEie === false
                                      ? "border-primary font-semibold"
                                      : "border-transparent"
                                  }`}
                                >
                                  Nei, jeg ordner det selv
                                </div>
                              </div>
                              {touched.IsEie && errors.IsEie && (
                                <div className="text-red text-sm mt-2">
                                  {errors.IsEie}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full lg:w-[62%]">
                            <h2 className="text-base md:text-lg desktop:text-xl text-black font-semibold mb-4">
                              Få en verdivurdering – viktig for finansiering
                            </h2>
                            <div
                              className="rounded-[8px] border border-[#DCDFEA]"
                              style={{
                                boxShadow:
                                  "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                              }}
                            >
                              <div className="flex items-center justify-between border-b border-[#DCDFEA] p-3 md:p-5 gap-1">
                                <h2 className="text-xs md:text-sm desktop:text-base text-black font-semibold">
                                  Send forespørsel til:
                                </h2>
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_contact2}
                                  alt="icon"
                                  className="w-[40px] md:w-auto"
                                />
                              </div>
                              <div className="p-3 md:p-5">
                                <div className="flex items-start gap-2 md:gap-3">
                                  <Image
                                    fetchPriority="auto"
                                    src={Ic_Info_gray}
                                    alt="icon"
                                  />
                                  <p className="text-[#667085] text-xs md:text-sm">
                                    En forhåndstakst av prosjektet er ofte
                                    nødvendig for å få byggelånsfinansiering. En
                                    eiendomsmegler vil vurdere verdien av
                                    boligen ved ferdigstillelse, og dersom den
                                    er høyere enn bygge- og tomtekostnadene, kan
                                    differansen brukes som egenkapital. Det kan
                                    øke sjansen for å få lån.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </SideSpaceContainer>
          </div>

          <div
            className="fixed w-full bottom-0 bg-white py-4"
            style={{
              boxShadow:
                "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
              zIndex: 9999,
            }}
          >
            <SideSpaceContainer>
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <p className="text-sm md:text-base font-light">
                  En innsending er{" "}
                  <span className="font-medium">uforpliktende</span> og du vil
                  bli <br className="hidden md:block" />
                  <span className="font-medium">
                    kontaktet av en hyttekonsulent
                  </span>
                </p>
                <div className="flex flex-row gap-4 sm:items-center">
                  <Button
                    text="Tilbake"
                    className="border-2 border-primary text-primary hover:border-[#28AA6C] hover:text-[#28AA6C] focus:border-[#09723F] focus:text-[#09723F] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                    onClick={() => {
                      handlePrevious();
                    }}
                  />
                  <Button
                    text={
                      value === false
                        ? "Send til Eie Eiendomsmegling"
                        : "Fullfør"
                    }
                    className="border border-greenBtn bg-greenBtn hover:bg-[#28AA6C] hover:border-[#28AA6C] focus:bg-[#09723F] focus:border-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                    onClick={() => {
                      setTimeout(() => {
                        document.querySelector("form")?.requestSubmit();
                      }, 0);
                    }}
                  />
                </div>
              </div>
            </SideSpaceContainer>
          </div>
        </>
      )}

      {isOpen && (
        <Modal isOpen={true} onClose={handlePopup}>
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            <h3 className="text-darkBlack text-center text-base md:text-lg desktop:text-xl font-semibold lg:px-2 mb-4">
              Takk for at du registrerte deg som interessert i husmodellen vår.{" "}
              Noen fra teamet vårt vil kontakte deg.
            </h3>
            <div className="flex justify-center">
              <Button
                text="Ok"
                className="border border-primary bg-primary hover:bg-[#28AA6C] hover:border-[#28AA6C] focus:bg-[#09723F] focus:border-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Verdivurdering;

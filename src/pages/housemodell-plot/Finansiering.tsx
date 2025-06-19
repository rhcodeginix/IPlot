import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import Ic_Info_gray from "@/public/images/Ic_Info_gray.svg";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import Prisliste from "../husmodell/Prisliste";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";

const Finansiering: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  pris: any;
  supplierData: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  askData,
  loadingLamdaData,
  CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  pris,
  supplierData,
}) => {
  const [custHouse, setCusHouse] = useState<any>(null);
  useEffect(() => {
    const customizeHouse = localStorage.getItem("customizeHouse");
    if (customizeHouse) {
      setCusHouse(JSON.parse(customizeHouse));
    }
  }, []);

  const totalCustPris = custHouse?.reduce(
    (sum: any, item: any) =>
      sum + Number(item?.product?.pris.replace(/\s/g, "")),
    0
  );

  const router = useRouter();

  const [value, setValue] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    equityAmount: Yup.number()
      .typeError("Must be a number")
      .min(1, "Amount must be greater than 0")
      .optional(),
    helpWithFinancing: Yup.boolean()
      .nullable()
      .required("This field is required"),
  });

  const leadId = router.query["leadId"];

  const handleSubmit = async (values: any) => {
    const bankValue = values;
    if (values.helpWithFinancing === null) {
      return;
    }

    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          updatedAt: new Date(),
          bankValue,
        });
        toast.success("Update Lead successfully.", { position: "top-right" });
        handleNext();
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  const Byggekostnader = HouseModelData?.Prisliste?.Byggekostnader;

  const Tomtekost = HouseModelData?.Prisliste?.Tomtekost;

  const totalPrisOfTomtekost = Tomtekost
    ? Tomtekost.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return acc + (numericValue ? parseFloat(numericValue) : 0);
      }, 0)
    : 0;
  const formattedNumber = totalPrisOfTomtekost;

  const totalPrisOfByggekostnader = Byggekostnader
    ? Byggekostnader.reduce((acc: any, prod: any) => {
        const numericValue = prod.pris
          ?.replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".");
        return (
          acc + (numericValue ? parseFloat(numericValue) : 0) + totalCustPris
        );
      }, 0)
    : 0;
  const formattedNumberOfByggekostnader = totalPrisOfByggekostnader;

  // const [isOpen, setIsOpen] = useState(false);

  // const handlePopup = () => {
  //   if (isOpen) {
  //     setIsOpen(false);
  //   } else {
  //     setIsOpen(true);
  //   }
  // };
  const { noPlot } = router.query;

  return (
    <div className="relative">
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1">
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
                handlePrevious();
              }}
            >
              Tomt og husmodell
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
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
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 2;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tilbud
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Finansiering
            </span>
          </div>
          <div className="mt-4 md:mt-6">
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              supplierData={supplierData}
              CadastreDataFromApi={CadastreDataFromApi}
              pris={pris}
              loading={loadingLamdaData}
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
          loading={loadingLamdaData}
        />
      )}

      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <div className="my-5 md:my-8">
            <Formik
              initialValues={{
                equityAmount: "",
                helpWithFinancing: null,
              }}
              validationSchema={validationSchema}
              // onSubmit={handleSubmit}
              onSubmit={(values, { setTouched }) => {
                if (values.helpWithFinancing === null) {
                  setTouched({ helpWithFinancing: true });
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

                        const value = data?.bankValue;

                        if (value) {
                          setFieldValue("equityAmount", value?.equityAmount);
                          setFieldValue(
                            "helpWithFinancing",
                            value?.helpWithFinancing
                          );
                        }
                      }
                    } catch (error) {
                      console.error(
                        "Error fetching IsoptForBank status:",
                        error
                      );
                    }
                  })();
                }, [leadId]);
                return (
                  <Form>
                    <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-[24px]">
                      <div className="w-full lg:w-[38%]">
                        <div className="rounded-lg p-3 md:p-5 bg-lightBlue">
                          <h3 className="text-black text-base md:text-xl desktop:text-lg font-semibold mb-3">
                            Trenger du hjelp med finansiering?
                          </h3>
                          <p className="text-[#555D5C] text-xs md:text-sm mb-6">
                            Vi setter deg i kontakt med{" "}
                            <span className="font-bold">
                              SpareBank 1 Hallingdal Valdres
                            </span>
                            , vår strategiske partner på byggelånsfinansiering.
                            De kjenner {supplierData?.company_name}
                            og alle deres husmodeller – og gir deg rask og trygg
                            hjelp med finansieringsprosessen.
                          </p>
                          <div className="flex items-center gap-4">
                            <div
                              onClick={() => {
                                setFieldValue("helpWithFinancing", true);
                                setValue(true);
                              }}
                              className={`cursor-pointer bg-white h-[40px] md:h-[48px] rounded-lg py-3 md:py-3.5 px-3 md:px-4 flex items-center justify-center w-1/2 text-xs md:text-sm text-black border-2 ${
                                values.helpWithFinancing === true
                                  ? "border-primary font-semibold"
                                  : "border-transparent"
                              }`}
                            >
                              Få hjelp med finansiering
                            </div>
                            <div
                              onClick={() => {
                                setFieldValue("helpWithFinancing", false);
                                setValue(false);
                              }}
                              className={`cursor-pointer bg-white h-[40px] md:h-[48px] rounded-lg py-3 md:py-3.5 px-3 md:px-4 flex items-center justify-center w-1/2 text-xs md:text-sm text-black border-2 ${
                                values.helpWithFinancing === false
                                  ? "border-primary font-semibold"
                                  : "border-transparent"
                              }`}
                            >
                              Nei, jeg ordner det selv
                            </div>
                          </div>
                          {touched.helpWithFinancing &&
                            errors.helpWithFinancing && (
                              <div className="text-red text-sm mt-2">
                                {errors.helpWithFinancing}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="w-full lg:w-[62%]">
                        <div
                          className="rounded-[8px] border border-[#DCDFEA]"
                          style={{
                            boxShadow:
                              "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                          }}
                        >
                          <div className="flex items-center justify-between border-b border-[#DCDFEA] p-3 md:p-5 gap-1">
                            <h2 className="text-xs md:text-sm desktop:text-base text-black font-semibold">
                              Beregn ditt byggelån hos:
                            </h2>
                            <Image
                              fetchPriority="auto"
                              src={Ic_spareBank}
                              alt="icon"
                              className="w-[90px] sm:w-auto sm:h-auto h-[30px]"
                            />
                          </div>
                          <div className="flex flex-col gap-2 md:gap-4 p-3 md:p-5">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[#555D5C] text-xs md:text-sm font-medium">
                                Totale bygge- og tomtekostnader (inkl. mva)
                              </p>
                              <h4 className="text-[#555D5C] text-xs md:text-sm desktop:text-base whitespace-nowrap">
                                {formatCurrency(
                                  formattedNumber +
                                    formattedNumberOfByggekostnader
                                )}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[#555D5C] text-xs md:text-sm">
                                <span className="font-bold">
                                  Din egenkapital
                                </span>{" "}
                                <i>
                                  Hvor mye egenkapital planlegger du å bruke?
                                </i>
                              </p>
                              <div className="flex items-center gap-2 md:gap-4">
                                <div>
                                  <Field
                                    id="equityAmount"
                                    name="equityAmount"
                                    className={`w-[160px] border border-darkGray focus:outline-none text-black rounded-[8px] py-2 px-4 text-sm ${
                                      errors.equityAmount &&
                                      touched.equityAmount
                                        ? "border-red"
                                        : "border-darkGray"
                                    }`}
                                    placeholder="Enter"
                                    type="text"
                                    inputMode="numeric"
                                    onChange={(e: any) => {
                                      let rawValue = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );

                                      if (rawValue) {
                                        const formattedValue =
                                          new Intl.NumberFormat("no-NO").format(
                                            Number(rawValue)
                                          );
                                        setFieldValue(
                                          "equityAmount",
                                          formattedValue
                                        );
                                      } else {
                                        setFieldValue("equityAmount", "");
                                      }
                                    }}
                                  />
                                  {touched.equityAmount &&
                                    errors.equityAmount && (
                                      <p className="text-red text-xs mt-1">
                                        {errors.equityAmount}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[#00231D] text-xs md:text-sm font-semibold">
                                Estimert byggelån:
                              </p>
                              <h4 className="text-[#00231D] text-xs md:text-sm desktop:text-base font-semibold whitespace-nowrap">
                                {(() => {
                                  const data: any =
                                    formattedNumber +
                                    formattedNumberOfByggekostnader;

                                  if (values.equityAmount) {
                                    const equityAmount: any =
                                      typeof values.equityAmount === "number"
                                        ? values.equityAmount
                                        : values.equityAmount.replace(
                                            /\s/g,
                                            ""
                                          );
                                    const totalData: any =
                                      Number(data) - Number(equityAmount);
                                    const finalData = new Intl.NumberFormat(
                                      "nb-NO"
                                    ).format(totalData);

                                    return formatCurrency(finalData);
                                  } else {
                                    return formatCurrency(
                                      formattedNumber +
                                        formattedNumberOfByggekostnader
                                    );
                                  }
                                })()}
                              </h4>
                            </div>
                          </div>
                          <div className="p-3 md:p-5 border-t border-[#DCDFEA]">
                            <div className="flex items-start gap-2 md:gap-3">
                              <Image
                                fetchPriority="auto"
                                src={Ic_Info_gray}
                                alt="icon"
                              />
                              <p className="text-[#667085] text-xs md:text-sm">
                                Dette er et lån til bygging av bolig eller
                                fritidsbolig. <br /> Når boligen står ferdig,
                                blir lånet automatisk omgjort til et
                                nedbetalingslån. <br /> Renten fastsettes etter
                                en totalvurdering av økonomi og sikkerhet.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end text-xs md:text-sm">
                          🔒 Dine tall deles kun med banken etter ditt samtykke
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="mb-4 md:mb-8">
            <Prisliste
              husmodellData={HouseModelData?.Prisliste}
              loading={loadingLamdaData}
            />
          </div>
          <span className="mb-4 md:mb-8 text-xs md:text-sm text-center">
            📄 Dette er et estimat basert på dagens priser og forutsetter
            standard leveranse fra {supplierData?.company_name}. Eventuelle
            avvik, tillegg eller fratrekk kan påvirke totalsummen.
          </span>
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
              onClick={() => {
                handlePrevious();
              }}
            />
            <Button
              text={
                value === false
                  ? "Send til SpareBank1"
                  : "Neste: Verdivurdering"
              }
              className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                setTimeout(() => {
                  document.querySelector("form")?.requestSubmit();
                }, 0);
                // handlePopup();
                // handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>

      {/* {isOpen && (
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
                className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>
          </div>
        </Modal>
      )} */}
    </div>
  );
};

export default Finansiering;

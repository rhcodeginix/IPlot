import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Loader from "@/components/Loader";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
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
import Modal from "@/components/common/modal";
import Ic_close from "@/public/images/Ic_close.svg";

const Finansiering: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  supplierData: any;
}> = ({
  // handleNext,
  // lamdaDataFromApi,
  // askData,
  loadingLamdaData,
  // CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  supplierData,
}) => {
  const router = useRouter();
  const { homePage } = router.query;
  const { query } = router;
  const updatedQuery = { ...query };
  const Husdetaljer = HouseModelData?.Husdetaljer;

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
  const [skipSharingDataValidation, setSkipSharingDataValidation] =
    useState(false);

  const validationSchema = Yup.object().shape({
    equityAmount: Yup.number()
      .typeError("Must be a number")
      .min(1, "Amount must be greater than 0")
      .optional(),
    helpWithFinancing: Yup.boolean().optional(),
    sharingData: Yup.boolean().when(
      "helpWithFinancing",
      ([helpWithFinancing], schema) => {
        return helpWithFinancing || skipSharingDataValidation
          ? schema.notRequired()
          : schema
              .oneOf([true], "You must accept the sharing data")
              .required("Påkrevd");
      }
    ),
  });

  const leadId = router.query["leadId"];

  const handleSubmit = async (values: any) => {
    const bankValue = values;

    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          IsoptForBank: values.sharingData,
          updatedAt: new Date(),
          bankValue,
        });
        toast.success("Update Lead successfully.", { position: "top-right" });
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
  const [isOpen, setIsOpen] = useState(false);

  const handlePopup = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  if (loadingLamdaData) {
    <Loader />;
  }
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
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            {!homePage && (
              <>
                <div
                  className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
                  onClick={() => {
                    delete updatedQuery.propertyId;
                    delete updatedQuery.husmodellId;
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
                    handlePrevious();
                  }}
                >
                  Hva kan du bygge?
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              </>
            )}
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 2;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Detaljer
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 3;
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
                const currIndex = 4;
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
          {/* <div className="mt-4 md:mt-6">
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              supplierData={supplierData}
              CadastreDataFromApi={CadastreDataFromApi}
            />
          </div> */}
        </SideSpaceContainer>
      </div>
      {/* <PropertyDetails
        askData={askData}
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        HouseModelData={HouseModelData}
      /> */}

      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <h5 className="text-darkBlack text-base md:text-lg lg:text-xl font-semibold mb-2 md:mb-4">
            Finansieringstilbud
          </h5>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 md:mb-4">
            <h5 className="text-darkBlack text-base md:text-lg lg:text-xl font-semibold">
              {Husdetaljer?.husmodell_name}{" "}
              <span className="font-normal">fra</span>{" "}
              {supplierData?.company_name}
            </h5>
            <p className="text-secondary text-sm md:text-base lg:text-lg">
              Pris fra:{" "}
              <span className="text-black font-semibold">
                ({formatCurrency(Husdetaljer?.pris)})
              </span>
            </p>
          </div>
          <div className="mb-4 md:mb-8">
            <Prisliste husmodellData={HouseModelData?.Prisliste} />
          </div>
          <div className="my-5 md:my-8">
            <Formik
              initialValues={{
                equityAmount: "",
                sharingData: false,
                helpWithFinancing: false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
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
                        if (data && data?.IsoptForBank) {
                          setFieldValue(
                            "sharingData",
                            data?.IsoptForBank || false
                          );
                        }
                        if (value) {
                          setFieldValue("equityAmount", value?.equityAmount);
                          setFieldValue(
                            "helpWithFinancing",
                            value?.helpWithFinancing || false
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
                      <div className="w-full lg:w-[50%]">
                        <div className="flex flex-col gap-2 md:gap-4">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-black text-xs md:text-sm font-bold">
                              Totale bygge- og <br /> tomtekostnader (inkl. mva)
                            </p>
                            <h4 className="text-black text-sm md:text-base desktop:text-xl font-semibold whitespace-nowrap">
                              {formatCurrency(
                                formattedNumber +
                                  formattedNumberOfByggekostnader
                              )}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-black text-xs md:text-sm">
                              Egenkapital
                            </p>
                            <div className="flex items-center gap-2 md:gap-4">
                              <div>
                                <Field
                                  id="equityAmount"
                                  name="equityAmount"
                                  className={`w-[160px] border border-darkGray focus:outline-none text-black rounded-[8px] py-2 px-4 text-sm ${
                                    errors.equityAmount && touched.equityAmount
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
                              <p
                                className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] text-sm sm:text-base rounded-[40px] w-max h-[40px] font-medium flex items-center justify-center px-3 md:px-5 cursor-pointer"
                                onClick={() => {
                                  setSkipSharingDataValidation(true);
                                  setTimeout(() => {
                                    document
                                      .querySelector("form")
                                      ?.requestSubmit();
                                  }, 0);
                                }}
                              >
                                Legg til
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-black text-xs md:text-sm font-bold">
                              Lånebeløp
                            </p>
                            <h4 className="text-black text-sm md:text-base desktop:text-xl font-semibold whitespace-nowrap">
                              {(() => {
                                const data: any =
                                  formattedNumber +
                                  formattedNumberOfByggekostnader;

                                if (values.equityAmount) {
                                  const equityAmount: any =
                                    typeof values.equityAmount === "number"
                                      ? values.equityAmount
                                      : values.equityAmount.replace(/\s/g, "");
                                  const totalData: any =
                                    Number(data) - Number(equityAmount);

                                  return formatCurrency(totalData);
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
                        <div className="hidden lg:block">
                          <LeadsBox isShow={true} col={true} />
                        </div>
                      </div>
                      <div className="w-full lg:w-[50%]">
                        <div
                          className="rounded-[8px] border border-[#DCDFEA]"
                          style={{
                            boxShadow:
                              "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                          }}
                        >
                          <div className="flex items-center justify-between border-b border-[#DCDFEA] p-3 md:p-5 gap-1">
                            <h3 className="text-black text-sm md:text-base desktop:text-xl font-semibold">
                              Søk byggelån{" "}
                              {(() => {
                                const data: any =
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""));

                                if (values.equityAmount) {
                                  const equityAmount: any =
                                    typeof values.equityAmount === "number"
                                      ? values.equityAmount
                                      : values.equityAmount.replace(/\s/g, "");
                                  const totalData: any =
                                    Number(data) - Number(equityAmount);

                                  return formatCurrency(totalData);
                                } else {
                                  return formatCurrency(
                                    totalCustPris +
                                      Number(
                                        Husdetaljer?.pris?.replace(/\s/g, "")
                                      )
                                  );
                                }
                              })()}{" "}
                              hos:
                            </h3>
                            <Image
                              fetchPriority="auto"
                              src={Ic_spareBank}
                              alt="icon"
                              className="w-[90px] sm:w-[119px] h-[30px]"
                            />
                          </div>
                          {!values.helpWithFinancing && (
                            <div className="p-3 md:p-5 border-b border-[#DCDFEA]">
                              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                                <div>
                                  <label className="flex items-center container">
                                    <Field type="checkbox" name="sharingData" />

                                    <span
                                      className="checkmark checkmark_primary"
                                      style={{ margin: "2px" }}
                                    ></span>

                                    <div className="text-secondary2 text-xs md:text-sm">
                                      Jeg samtykker til{" "}
                                      <span className="text-[#7839EE] font-bold">
                                        deling av data
                                      </span>{" "}
                                      med{" "}
                                      <span className="text-secondary2 font-bold">
                                        SpareBank1 Hallingdal Valdres.
                                      </span>
                                    </div>
                                  </label>
                                  {touched.sharingData &&
                                    errors.sharingData && (
                                      <p className="text-red text-xs mt-1">
                                        {errors.sharingData}
                                      </p>
                                    )}
                                </div>
                                <Button
                                  text="Send inn lånesøknad"
                                  className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-medium desktop:px-[20px] relative desktop:py-[16px]"
                                  type="submit"
                                />
                              </div>
                              <div className="flex items-start gap-2 md:gap-3 mt-3 md:mt-5">
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_Info_gray}
                                  alt="icon"
                                />
                                <p className="text-[#667085] text-xs md:text-sm">
                                  Lån for bygging av bolig/fritidsbolig. Lånet
                                  vil bli konvertert til et nedbetalingslån ved
                                  ferdigstillelse av bolig/fritidsbolig.
                                  Rentesatsen vil variere basert på en samlet
                                  vurdering av betalingsevne og sikkerhet.
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="w-full"></div>
                          <div className="p-3 md:p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="flex items-center container">
                                  <Field
                                    type="checkbox"
                                    name="helpWithFinancing"
                                  />

                                  <span
                                    className="checkmark checkmark_primary"
                                    style={{ margin: "2px" }}
                                  ></span>

                                  <div className="text-darkBlack text-xs md:text-sm">
                                    Jeg ønsker ikke hjelp med finansiering
                                  </div>
                                </label>
                                {touched.helpWithFinancing &&
                                  errors.helpWithFinancing && (
                                    <p className="text-red text-xs mt-1">
                                      {errors.helpWithFinancing}
                                    </p>
                                  )}
                              </div>
                              {values.helpWithFinancing && (
                                <Button
                                  text="Send inn lånesøknad"
                                  className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-medium desktop:px-[20px] relative desktop:py-[16px]"
                                  type="submit"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block lg:hidden">
                      <LeadsBox isShow={true} col={true} />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
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
              text="Neste: Oppsummering"
              className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                // handleNext();
                handlePopup();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>

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
                className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
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

export default Finansiering;

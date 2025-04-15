import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Loader from "@/components/Loader";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
import Tilbudsdetaljer from "@/components/Ui/husmodellPlot/Tilbudsdetaljer";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import Ic_Info_gray from "@/public/images/Ic_Info_gray.svg";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";

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

  const router = useRouter();

  const validationSchema = Yup.object().shape({
    existingLoan: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    previousExperience: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    collateral: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    permissions: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    buffer: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    equityAmount: Yup.number()
      .typeError("Must be a number")
      .min(1, "Amount must be greater than 0")
      .optional(),
    helpWithFinancing: Yup.boolean().optional(),
    sharingData: Yup.boolean().when(
      "helpWithFinancing",
      ([helpWithFinancing], schema) => {
        return helpWithFinancing
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

      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <h5 className="text-darkBlack text-base md:text-lg lg:text-xl font-semibold mb-2 md:mb-4">
            Tilbudsdetaljer
          </h5>
          <Tilbudsdetaljer isRemove={true} />
          <div className="my-5 md:my-8">
            <Formik
              initialValues={{
                existingLoan: "",
                previousExperience: "",
                collateral: "",
                permissions: "",
                buffer: "",
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
                          setFieldValue(
                            "existingLoan",
                            value?.existingLoan || ""
                          );
                          setFieldValue(
                            "previousExperience",
                            value?.previousExperience || ""
                          );
                          setFieldValue("collateral", value?.collateral || "");
                          setFieldValue(
                            "permissions",
                            value?.permissions || ""
                          );
                          setFieldValue("buffer", value?.buffer || "");
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
                      <div className="w-full lg:w-[34%] rounded-[8px] border border-[#DCDFEA]">
                        <h3 className="text-darkBlack text-sm md:text-base desktop:text-xl font-semibold p-3 md:p-5 border-b border-[#DCDFEA]">
                          Spørsmål til lånesøknad
                        </h3>
                        <div className="p-3 md:p-5 flex-col gap-5 flex">
                          <div>
                            <h5 className="font-medium text-black mb-1 text-sm md:text-base">
                              Eksisterende lån
                            </h5>
                            <p className="text-xs md:text-sm text-secondary2 mb-2">
                              Har du eksisterende lån, gjeld eller andre
                              økonomiske forpliktelser?
                            </p>
                            <div className="w-full flex items-center gap-4">
                              <Button
                                text="Nei"
                                className={`w-1/2 border text-black ${
                                  values.existingLoan === "Nei"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("existingLoan", "Nei")
                                }
                              />
                              <Button
                                text="Ja"
                                className={`w-1/2 border text-black ${
                                  values.existingLoan === "Ja"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("existingLoan", "Ja")
                                }
                              />
                            </div>
                            {touched.existingLoan && errors.existingLoan && (
                              <p className="text-red text-xs">
                                {errors.existingLoan}
                              </p>
                            )}
                          </div>
                          <div className="border-t border-[#DCDFEA] w-full"></div>
                          <div>
                            <h5 className="font-medium text-black mb-1 text-sm md:text-base">
                              Tidligere erfaringer
                            </h5>
                            <p className="text-xs md:text-sm text-secondary2 mb-2">
                              Har du tidligere erfaring med byggelån eller
                              større byggeprosjekter?
                            </p>
                            <div className="w-full flex items-center gap-4">
                              <Button
                                text="Nei"
                                className={`w-1/2 border text-black ${
                                  values.previousExperience === "Nei"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("previousExperience", "Nei")
                                }
                              />
                              <Button
                                text="Ja"
                                className={`w-1/2 border text-black ${
                                  values.previousExperience === "Ja"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("previousExperience", "Ja")
                                }
                              />
                            </div>
                            {touched.previousExperience &&
                              errors.previousExperience && (
                                <p className="text-red text-xs">
                                  {errors.previousExperience}
                                </p>
                              )}
                          </div>
                          <div className="border-t border-[#DCDFEA] w-full"></div>
                          <div>
                            <h5 className="font-medium text-black mb-1 text-sm md:text-base">
                              Pant
                            </h5>
                            <p className="text-xs md:text-sm text-secondary2 mb-2">
                              Er det noe pant på eiendommer du eier, og kan
                              disse brukes som sikkerhet?
                            </p>
                            <div className="w-full flex items-center gap-4">
                              <Button
                                text="Nei"
                                className={`w-1/2 border text-black ${
                                  values.collateral === "Nei"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("collateral", "Nei")
                                }
                              />
                              <Button
                                text="Ja"
                                className={`w-1/2 border text-black ${
                                  values.collateral === "Ja"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("collateral", "Ja")
                                }
                              />
                            </div>
                            {touched.collateral && errors.collateral && (
                              <p className="text-red text-xs">
                                {errors.collateral}
                              </p>
                            )}
                          </div>
                          <div className="border-t border-[#DCDFEA] w-full"></div>
                          <div>
                            <h5 className="font-medium text-black mb-1 text-sm md:text-base">
                              Tillatelser
                            </h5>
                            <p className="text-xs md:text-sm text-secondary2 mb-2">
                              Er det andre relevante tillatelser som må på plass
                              før byggingen kan starte?
                            </p>
                            <div className="w-full flex items-center gap-4">
                              <Button
                                text="Nei"
                                className={`w-1/2 border text-black ${
                                  values.permissions === "Nei"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("permissions", "Nei")
                                }
                              />
                              <Button
                                text="Ja"
                                className={`w-1/2 border text-black ${
                                  values.permissions === "Ja"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() =>
                                  setFieldValue("permissions", "Ja")
                                }
                              />
                            </div>
                            {touched.permissions && errors.permissions && (
                              <p className="text-red text-xs">
                                {errors.permissions}
                              </p>
                            )}
                          </div>
                          <div className="border-t border-[#DCDFEA] w-full"></div>
                          <div>
                            <h5 className="font-medium text-black mb-1 text-sm md:text-base">
                              Buffer
                            </h5>
                            <p className="text-xs md:text-sm text-secondary2 mb-2">
                              Er det satt av en buffer for uforutsette utgifter?
                              I så fall, hvor mye?
                            </p>
                            <div className="w-full flex items-center gap-4">
                              <Button
                                text="Nei"
                                className={`w-1/2 border text-black ${
                                  values.buffer === "Nei"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() => setFieldValue("buffer", "Nei")}
                              />
                              <Button
                                text="Ja"
                                className={`w-1/2 border text-black ${
                                  values.buffer === "Ja"
                                    ? "border-[#6927DA] bg-[#ECE9FE]"
                                    : "border-[#F9F9FB] bg-[#F9F9FB]"
                                } sm:text-base rounded-[8px] h-[36px] md:h-[36px] lg:h-[36px]`}
                                onClick={() => setFieldValue("buffer", "Ja")}
                              />
                            </div>
                            {touched.buffer && errors.buffer && (
                              <p className="text-red text-xs">
                                {errors.buffer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[66%]">
                        <div className="flex flex-col gap-2 md:gap-4 mb-6 md:mb-[40px]">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-secondary2 text-xs md:text-sm font-bold">
                              Totale bygge- og tomtekostnader (inkl. mva)
                            </p>
                            <h4 className="text-black text-sm md:text-base desktop:text-xl font-semibold">
                              {formatCurrency(
                                (
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""))
                                ).toLocaleString("nb-NO")
                              )}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-secondary2 text-xs md:text-sm">
                              Egenkapital
                            </p>
                            <div className="flex items-center gap-2 md:gap-4">
                              <div>
                                <Field
                                  id="equityAmount"
                                  name="equityAmount"
                                  type="number"
                                  className={`w-[160px] border border-darkGray focus:outline-none text-black rounded-[8px] py-2 px-4 text-sm ${
                                    errors.equityAmount && touched.equityAmount
                                      ? "border-red"
                                      : "border-darkGray"
                                  }`}
                                  placeholder="Enter"
                                />
                                {touched.equityAmount &&
                                  errors.equityAmount && (
                                    <p className="text-red text-xs mt-1">
                                      {errors.equityAmount}
                                    </p>
                                  )}
                              </div>
                              <p className="border-2 border-[#6927DA] text-[#6927DA] text-sm sm:text-base rounded-[40px] w-max h-[40px] font-medium flex items-center justify-center px-3 md:px-5 cursor-pointer">
                                Legg til
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-secondary text-xs md:text-sm font-bold">
                              Lånebeløp
                            </p>
                            <h4 className="text-black text-sm md:text-base desktop:text-xl font-semibold">
                              {(() => {
                                const data: any =
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""));

                                if (values.equityAmount) {
                                  const totalData: any =
                                    Number(data) - Number(values.equityAmount);
                                  const finalData = new Intl.NumberFormat(
                                    "nb-NO"
                                  ).format(totalData);

                                  return formatCurrency(finalData);
                                } else {
                                  return formatCurrency(
                                    (
                                      totalCustPris +
                                      Number(
                                        Husdetaljer?.pris?.replace(/\s/g, "")
                                      )
                                    ).toLocaleString("nb-NO")
                                  );
                                }
                              })()}
                            </h4>
                          </div>
                        </div>
                        <div className="rounded-[8px] border border-[#DCDFEA]">
                          <div className="flex items-center justify-between border-b border-[#DCDFEA] p-3 md:p-5 gap-1">
                            <h3 className="text-black text-sm md:text-base desktop:text-xl font-semibold">
                              Søk byggelån{" "}
                              {(() => {
                                const data: any =
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""));

                                if (values.equityAmount) {
                                  const totalData: any =
                                    Number(data) - Number(values.equityAmount);
                                  const finalData = new Intl.NumberFormat(
                                    "nb-NO"
                                  ).format(totalData);

                                  return formatCurrency(finalData);
                                } else {
                                  return formatCurrency(
                                    (
                                      totalCustPris +
                                      Number(
                                        Husdetaljer?.pris?.replace(/\s/g, "")
                                      )
                                    ).toLocaleString("nb-NO")
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
                          <div className="flex flex-col gap-2 md:gap-4 p-3 md:p-5 border-b border-[#DCDFEA]">
                            <div className="flex items-center justify-between gap-1">
                              <div className="text-secondary2 text-xs md:text-sm">
                                Nominell rente fra
                              </div>
                              <h6 className="text-black font-medium text-sm md:text-base">
                                8,75%
                              </h6>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <div className="text-secondary2 text-xs md:text-sm">
                                Effektiv rente ved byggelån ved 2 MNOK ved 100%
                                utnyttelse
                              </div>
                              <h6 className="text-black font-medium text-sm md:text-base">
                                11,01%
                              </h6>
                            </div>
                            <div className="border-t w-full border-[#DCDFEA]"></div>
                            <div className="flex items-center justify-between">
                              <div className="text-secondary2 text-sm md:text-base font-bold">
                                Estimert kostnad per måned
                              </div>
                              <h6 className="text-black font-medium text-sm md:text-base desktop:text-xl">
                                48.667 NOK
                              </h6>
                            </div>
                          </div>
                          {!values.helpWithFinancing && (
                            <div className="p-3 md:p-5">
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
                                  className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-medium desktop:px-[20px] relative desktop:py-[16px]"
                                  type="submit"
                                />
                              </div>
                              <div className="flex items-start gap-2 md:gap-3 mt-3 md:mt-5">
                                <Image
                                  fetchPriority="auto"
                                  src={Ic_Info_gray}
                                  alt="icon"
                                />
                                <p className="text-secondary2 text-xs md:text-sm">
                                  Loan facility for construction of a
                                  home/holiday home. Will be converted into a
                                  repayment loan upon completion of the
                                  home/holiday home. Interest rate will vary
                                  based on an overall assessment of payment
                                  ability and security.
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="border-t w-full border-[#DCDFEA]"></div>
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

                                  <div className="text-secondary2 text-xs md:text-sm">
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
                                  className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-medium desktop:px-[20px] relative desktop:py-[16px]"
                                  type="submit"
                                />
                              )}
                            </div>
                            <div className="flex items-start gap-3 mt-3 md:mt-5">
                              <p className="text-secondary2 text-xs md:text-sm">
                                Du kan fortsatt hente ut priskalkyler og gjøre
                                tomteanalyse – uten å søke finansiering
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
          <LeadsBox />
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
              }}
            />
            <Button
              text="Next: Summary"
              className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Finansiering;
